"use client";

import {
    IconCalendarEvent,
    IconCloudUpload,
    IconDatabase,
    IconEye,
    IconFilter,
    IconLoader3,
    IconPlus,
    IconSearch,
    IconShip,
    IconUsers,
    IconX,
} from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { SelectDataInterface } from "~/components/ui/Form/Select.form";
import cruiseService from "~/services/cruise.service";
import { errorAtom, notificationAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IBoatResponse } from "~/types/boat";
import { ICruiseResponseList } from "~/types/cruise";
import { IScheduleResponse } from "~/types/schedule";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { formatCurrency } from "~/utils/main";

const dataBreadcrumb: Breadcrumb[] = [
    {
        title: "Dashboard",
        url: "/admin",
    },
    {
        title: "Schedules",
        url: "/admin/schedules",
    },
];

export default function SchedulePage() {
    const router = useRouter();
    const [modal, setModal] = useState<"add" | null>(null);
    const [cruise, setCruise] = useState<ICruiseResponseList[]>([]);
    const [boat, setBoat] = useState<IBoatResponse[]>([]);
    const [schedules, setSchedules] = useState<IScheduleResponse[]>([]);
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ field: "", stack: "" });
    const setError = useSetAtom(errorAtom);

    console.log(schedules);
    const fetchSchedule = useCallback(
        async (filters: { search?: string; date?: string; cruiseId?: string; pax?: string }) => {
            try {
                const params = new URLSearchParams();
                if (filters.search) params.append("search", filters.search);
                if (filters.date) params.append("date", filters.date);
                if (filters.cruiseId) params.append("cruiseId", filters.cruiseId);
                if (filters.pax) params.append("pax", filters.pax);

                const { data } = await api.get<ApiSuccessResponse<IScheduleResponse[]>>(
                    `${process.env.NEXT_PUBLIC_API}/admin/schedule?${params.toString()}`,
                    { withCredentials: true }
                );
                setSchedules(data.data);
            } catch (error) {
                fetchError(error, setError);
            }
        },
        [setError]
    );
    useEffect(() => {
        const fetchCruise = async () => {
            setLoading({ stack: "fetch" });
            try {
                const result = await cruiseService.list();
                setCruise(result);
            } catch (error) {
                fetchError(error, setError);
            } finally {
                setLoading({ field: "", stack: "" });
            }
        };
        const fetchBoat = async () => {
            setLoading({ stack: "fetch" });
            try {
                const { data } = await api.get<ApiSuccessResponse<IBoatResponse[]>>(`${process.env.NEXT_PUBLIC_API}/admin/boat`, {
                    withCredentials: true,
                });
                setBoat(data.data);
            } catch (error) {
                fetchError(error, setError);
            } finally {
                setLoading({ field: "", stack: "" });
            }
        };
        fetchCruise();
        fetchBoat();
        fetchSchedule({ cruiseId: "", date: "", pax: "", search: "" });
    }, [setError, fetchSchedule]);

    const dataCruise: SelectDataInterface[] = cruise.map((data) => ({
        value: data.id,
        name: data.title,
    }));
    const dataBoat: SelectDataInterface[] = boat.map((data) => ({
        value: data.id,
        name: data.name,
    }));

    if (loading.stack === "fetch") {
        return <LoaderForm key={"loaderFetchSchedule"} loading={{ stack: "fetch", field: loading.field }} />;
    }
    if (loading.stack === "submit" || loading.stack === "upload") {
        return <LoaderForm key={"loaderSubmitSchedule"} loading={{ stack: "submit", field: loading.field }} />;
    } else
        return (
            <section className="min-h-screen">
                <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
                <div className="flex items-center justify-between gap-5 p-5 pb-0">
                    <h2 className="flex items-center text-nowrap justify-start gap-2 font-bold text-xl">
                        <IconCalendarEvent stroke={2.3} size={24} /> Event Schedule
                    </h2>
                    <div className="flex items-center justify-end gap-5">
                        <SubmitButton
                            type="button"
                            title="Deleted"
                            onClick={() => {
                                setLoading({ stack: "route", field: "scheduleDeleted" });
                                router.push("/admin/schedules/deleted");
                            }}
                            icon={
                                loading.stack === "route" && loading.field === "scheduleDeleted" ? (
                                    <IconLoader3 className="animate-spin" stroke={2} size={18} />
                                ) : (
                                    <IconDatabase stroke={2} size={18} />
                                )
                            }
                        />
                        <SubmitButton type="button" title="Create" onClick={() => setModal("add")} icon={<IconPlus stroke={2} size={18} />} />
                    </div>
                </div>
                <div className="mx-auto p-5 flex flex-col gap-y-5">
                    {/* Header Content */}
                    <HeaderContent dataCruise={dataCruise} fetchSchedule={fetchSchedule} />
                    <ContentScheduleList schedules={schedules} />
                </div>

                {modal === "add" && (
                    <ModalAddSchedule
                        dataBoat={dataBoat}
                        fetchSchedule={fetchSchedule}
                        setLoading={setLoading}
                        dataCruise={dataCruise}
                        setModal={setModal}
                        loading={loading}
                    />
                )}
            </section>
        );
}

type propsHeaderContent = {
    dataCruise: SelectDataInterface[];
    fetchSchedule: (filters: { search: string; date: string; cruiseId: string; pax: string }) => Promise<void>;
};
function HeaderContent({ dataCruise, fetchSchedule }: propsHeaderContent) {
    const [filters, setFilters] = useState<{
        search: string;
        date: string;
        cruiseId: string;
        pax: string;
    }>({ search: "", date: "", cruiseId: "", pax: "" });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        fetchSchedule({
            ...filters,
            date: filters.date ? new Date(filters.date).toISOString() : "",
        });
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex items-center justify-between w-full py-3 px-5 gap-10 text-black rounded-lg bg-gray-200 border border-black">
            <form onSubmit={handleSubmit} className="flex items-center justify-end gap-5 w-full">
                {/* Search ID */}
                <div className="w-full flex items-center justify-start relative px-2 gap-2 py-2 rounded-lg text-sm bg-gray-50 border border-black shadow-md">
                    <IconSearch size={18} stroke={2} />
                    <input
                        className="outline-none bg-transparent w-full"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search Code..."
                        type="text"
                        name="search"
                    />
                </div>

                {/* Date Filter */}
                <div className="w-full flex items-center justify-start relative px-2 gap-2 py-2 rounded-lg text-sm bg-gray-50 border border-black shadow-md">
                    <IconCalendarEvent size={18} stroke={2} />
                    <input
                        type="date"
                        name="date"
                        value={filters.date}
                        onChange={handleFilterChange}
                        className="outline-none bg-transparent w-full"
                    />
                </div>

                {/* Cruise Filter */}
                <div className="w-full flex items-center justify-start relative px-2 gap-2 py-2 rounded-lg text-sm bg-gray-50 border border-black shadow-md">
                    <IconShip size={18} stroke={2} />
                    <select
                        name="cruiseId"
                        value={filters.cruiseId}
                        onChange={handleFilterChange}
                        className="outline-none appearance-none w-full bg-transparent"
                    >
                        <option value="">All Cruises</option>
                        {dataCruise.map((cruise, i) => (
                            <option value={cruise.value} key={i}>
                                {cruise.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* PAX Filter */}
                <div className="w-full flex items-center justify-start relative px-2 gap-2 py-2 rounded-lg text-sm bg-gray-50 border border-black shadow-md">
                    <IconUsers size={18} stroke={2} />
                    <select
                        name="pax"
                        value={filters.pax}
                        onChange={handleFilterChange}
                        className="outline-none appearance-none w-full bg-transparent"
                    >
                        <option value="">All Pax</option>
                        {Array.from({ length: 30 }, (_, i) => (
                            <option value={i + 1} key={i}>
                                {i + 1} Pax
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="flex text-sm font-semibold items-center py-2 text-gray-900 justify-center gap-2 bg-brown/30 border border-brown rounded-lg w-full"
                >
                    Filters
                </button>
            </form>
        </div>
    );
}

function ContentScheduleList({ schedules }: { schedules: IScheduleResponse[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ stack: "", field: "" });
    return (
        <>
            <div className="pb-5 grid grid-cols-2 gap-3">
                {/* Card Content */}
                {schedules.map((schedule, i) => (
                    <div
                        className="bg-gray-200 shadow-md flex justify-start rounded-2xl overflow-hidden w-full border border-gray-300 relative"
                        key={i}
                    >
                        <div className="relative w-2/12">
                            <Image
                                src={schedule.cover || "/assets/Image-not-found.png"}
                                alt={schedule.cruiseTitle + " " + schedule.boatTitle}
                                width={1000}
                                height={1000}
                                className="w-full object-cover h-full object-center"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-gray-200" />
                        </div>
                        <div className="w-10/12 pe-5 py-3 flex justify-between">
                            <div className="flex flex-col h-full w-full justify-between gap-y-5">
                                <h5 className="font-extrabold text-xs uppercase text-brown">{schedule.id}</h5>
                                <div className="flex flex-col gap-y-2">
                                    <h3 className="text-black font-semibold">{schedule.cruiseTitle}</h3>
                                    <div className="flex items-center justify-start gap-3 flex-wrap">
                                        <span className="text-[11px] px-5 py-1 w-fit rounded-full font-bold bg-gradient-to-tr from-gray-100 text-gray-900 via-gray-300 to-gray-400 border border-black flex items-center justify-center gap-1">
                                            {schedule.boatTitle} <IconShip stroke={2} size={13} />
                                        </span>
                                        <span className="text-[11px] px-5 py-1 w-fit rounded-full font-bold bg-gradient-to-tr from-gray-100 text-gray-900 via-gray-300 to-gray-400 border border-black">
                                            {schedule.departure}
                                        </span>
                                    </div>
                                    <span className="text-xs text-gray-600">
                                        <span className="text-xs text-gray-600">
                                            {new Date(schedule.departureAt).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}{" "}
                                            -{" "}
                                            {new Date(schedule.arrivalAt).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </span>
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col h-full w-full items-end justify-between gap-y-5">
                                <p className="font-extrabold text-xs uppercase bg-brown rounded-full px-3 py-1 text-gray-50 w-fit">
                                    {schedule.bookedCabin}/{schedule.availableCabin}
                                </p>
                                <div className="flex flex-col gap-y-2">
                                    <p className="text-gray-700 text-sm ">Start From: {formatCurrency(String(schedule.min_price))}</p>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setLoading({ stack: "route" });
                                            router.push(`/admin/schedules/${schedule.id}`);
                                        }}
                                        className="px-5 py-2 rounded-full bg-sky-600 text-white text-sm font-semibold flex items-center justify-center gap-2"
                                    >
                                        {loading.stack === "route" ? (
                                            <IconLoader3 className="animate-spin" size={18} stroke={2} />
                                        ) : (
                                            <IconEye size={18} stroke={2} />
                                        )}
                                        <span className="text-sm">Detail</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

type propsModalAddSchedule = {
    loading: { stack: string; field?: string };
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field?: string }>>;
    dataCruise: SelectDataInterface[];
    dataBoat: SelectDataInterface[];
    setModal: React.Dispatch<SetStateAction<"add" | null>>;
    fetchSchedule: (filters: { search: string; date: string; cruiseId: string; pax: string }) => Promise<void>;
};
function ModalAddSchedule({ loading, dataCruise, setModal, dataBoat, setLoading, fetchSchedule }: propsModalAddSchedule) {
    const [body, setBody] = useState<{ cruiseId: string; departureAt: Date | string; boatId: string }>({ cruiseId: "", departureAt: "", boatId: "" });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Add new Schedule" });
        try {
            await api.post(
                `${process.env.NEXT_PUBLIC_API}/admin/schedule`,
                { cruiseId: body.cruiseId, departureAt: body.departureAt, boatId: body.boatId },
                { withCredentials: true }
            );
            setNotification({
                title: "Add new Schedule",
                message: "Successfully to create new schedule",
            });
            fetchSchedule({ cruiseId: "", date: "", pax: "", search: "" });
            setModal(null);
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };
    return (
        <div className="fixed top-0 left-0 right-0 w-full py-24 bg-white/20 backdrop-blur-sm z-50 h-screen flex items-start justify-center">
            <Card
                classHeading="flex items-center justify-between gap-5"
                classBody="bg-gray-50"
                className="w-7/12"
                title={
                    <>
                        <span>Add New Schedule</span>
                        <button onClick={() => setModal(null)} type="button">
                            <IconX size={18} stroke={2} />
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-3 items-end w-full gap-5">
                    <div>
                        <label htmlFor="departureAt" className="text-xs font-bold uppercase">
                            Event Schedule
                        </label>
                        <input
                            className="px-5 py-2 text-sm rounded-lg bg-gray-50 border border-black shadow-md w-full"
                            type="date"
                            name="departureAt"
                            value={String(body.departureAt)}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Select Cruise */}
                    <div className="w-full flex items-center justify-start relative px-2 gap-2 py-2 rounded-lg text-sm bg-gray-50 border border-black shadow-md">
                        {loading.stack === "fetch" ? (
                            <IconLoader3 className="animate-spin" size={23} stroke={2} />
                        ) : (
                            <IconFilter size={23} stroke={2} />
                        )}

                        <select
                            name="cruiseId"
                            value={body.cruiseId}
                            onChange={handleInputChange}
                            className="outline-none appearance-none w-full bg-transparent"
                        >
                            <option value={""}>-- Choose Cruise --</option>
                            {dataCruise.map((cruise, i) => (
                                <option value={cruise.value} key={i}>
                                    {cruise.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Select Boat */}
                    <div className="w-full flex items-center justify-start relative px-2 gap-2 py-2 rounded-lg text-sm bg-gray-50 border border-black shadow-md">
                        {loading.stack === "fetch" ? (
                            <IconLoader3 className="animate-spin" size={23} stroke={2} />
                        ) : (
                            <IconShip size={23} stroke={2} />
                        )}

                        <select
                            name="boatId"
                            value={body.boatId}
                            onChange={handleInputChange}
                            className="outline-none appearance-none w-full bg-transparent"
                        >
                            <option value={""}>-- Choose Boat --</option>
                            {dataBoat.map((data, i) => (
                                <option value={data.value} key={i}>
                                    {data.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div />
                    <div />
                    <SubmitButton title="Save" icon={<IconCloudUpload stroke={2} size={18} />} type="submit" />
                </form>
            </Card>
        </div>
    );
}
