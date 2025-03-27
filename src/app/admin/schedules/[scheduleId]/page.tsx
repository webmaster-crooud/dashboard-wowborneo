"use client";

import {
    IconClock,
    IconCloudCheck,
    IconCloudOff,
    IconCloudUpload,
    IconFilter,
    IconLoader3,
    IconShip,
    IconStarFilled,
    IconX,
} from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { CanvasImage } from "~/components/ui/CanvasImage";
import { Card } from "~/components/ui/Card";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { SelectDataInterface } from "~/components/ui/Form/Select.form";
import { RichTextPreview } from "~/components/ui/RichTextPreview";

import { formatDateOnly } from "~/lib/moment";
import cruiseService from "~/services/cruise.service";
import { errorAtom, notificationAtom } from "~/stores";
import { ApiSuccessResponse, STATUS } from "~/types";
import { IBoatResponse } from "~/types/boat";
import { ICruiseResponseList } from "~/types/cruise";
import { IDetailScheduleResponse } from "~/types/schedule";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { formatCurrency } from "~/utils/main";

export default function DetailSchedule() {
    const { scheduleId } = useParams();
    const dataBreadcrumb: Breadcrumb[] = [
        {
            title: "Dashboard",
            url: "/admin",
        },
        {
            title: "Schedules",
            url: "/admin/schedules",
        },
        {
            title: "Detail",
            url: `/admin/schedules/${scheduleId}`,
        },
    ];

    const [data, setData] = useState<IDetailScheduleResponse>({
        arrivalAt: "",
        boat: {
            cabins: [],
            deck: {
                cover: "",
            },
            id: "",
            name: "",
        },
        cruise: {
            id: "",
            cover: "",
            departure: "",
            description: "",
            title: "",
        },
        departureAt: "",
        id: "",
        status: "PENDING",
    });
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ field: "", stack: "" });
    const [modal, setModal] = useState<"update" | null>(null);
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const fetchDetailSchedule = useCallback(async () => {
        setLoading({ stack: "fetch", field: "Fetching schedule detail" });
        try {
            const { data } = await api.get<ApiSuccessResponse<IDetailScheduleResponse>>(
                `${process.env.NEXT_PUBLIC_API}/admin/schedule/${scheduleId}`,
                {
                    withCredentials: true,
                }
            );
            setData(data.data);
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    }, [scheduleId, setError]);

    useEffect(() => {
        fetchDetailSchedule();
    }, [fetchDetailSchedule]);

    const handleAction = async (scheduleId: string, action: STATUS) => {
        console.log(action);
        try {
            const { data } = await api.patch<ApiSuccessResponse<{ status: string }>>(
                `${process.env.NEXT_PUBLIC_API}/admin/schedule/${scheduleId}?action=${action}`,
                {},
                {
                    withCredentials: true,
                }
            );
            console.log(data);
            setNotification({
                title: `${data.data.status}`,
                message: `Successfully to ${data.data.status}`,
            });
            fetchDetailSchedule();
        } catch (error) {
            fetchError(error, setError);
        }
    };
    if (loading.stack === "fetch") {
        return <LoaderForm key={"loaderFetchSchedule"} loading={{ stack: "fetch", field: loading.field }} />;
    }
    if (loading.stack === "submit" || loading.stack === "upload") {
        return <LoaderForm key={"loaderSubmitSchedule"} loading={{ stack: "submit", field: loading.field }} />;
    } else
        return (
            <section className="min-h-screen">
                <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
                <div className="p-5">
                    <div className="bg-gray-50 rounded-2xl p-5 shadow-md w-full grid grid-cols-5 gap-5">
                        <CanvasImage src={data.cruise.cover || "/assets/Image-not-found.png"} alt={`Cover ${data.cruise.title}`} className="w-full" />
                        <div className="col-span-4 w-full">
                            <div className="flex flex-col gap-y-3">
                                <div className="flex items-center justify-between gap-5">
                                    <h3 className="text-xs font-extrabold uppercase text-brown">{data.id}</h3>
                                    <div className="flex flex-col gap-y-3 items-end">
                                        <div className="flex items-center justify-end gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setModal("update")}
                                                className="text-sm font-semibold bg-sky-600 text-white rounded-full px-5 py-1"
                                            >
                                                Setting
                                            </button>
                                            {data.status !== "ACTIVED" ? (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAction(data.id, "ACTIVED")}
                                                    className="text-sm font-semibold bg-cyan-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-full px-5 py-1"
                                                >
                                                    Activate
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    className="text-sm font-semibold bg-brown text-white rounded-full px-5 py-1"
                                                    onClick={() => handleAction(data.id, "FAVOURITED")}
                                                >
                                                    Favourite
                                                </button>
                                            )}
                                            {data.status !== "DELETED" && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleAction(data.id, "DELETED")}
                                                    className="text-sm font-semibold bg-red-600 text-white rounded-full px-5 py-1"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                        <span
                                            className={`px-5 py-1 font-bold text-[11px] rounded-full flex items-center justify-center gap-1 ${
                                                data.status === "ACTIVED"
                                                    ? "bg-cyan-500 text-gray-50"
                                                    : data.status === "FAVOURITED"
                                                    ? "bg-brown text-gray-50"
                                                    : data.status === "DELETED"
                                                    ? "bg-red-500 text-gray-50"
                                                    : "bg-gray-400 text-black"
                                            }`}
                                        >
                                            {data.status === "ACTIVED" ? (
                                                <IconCloudCheck size={16} stroke={2} />
                                            ) : data.status === "FAVOURITED" ? (
                                                <IconStarFilled size={16} stroke={2} />
                                            ) : data.status === "DELETED" ? (
                                                <IconCloudOff size={16} stroke={2} />
                                            ) : (
                                                <IconClock size={16} stroke={2} />
                                            )}
                                            {data.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-y-3">
                                    <h1 className="font-semibold text-xl">Title Of Cruise</h1>
                                    <span className="text-xs text-gray-600">
                                        {formatDateOnly(String(data.departureAt))} - {formatDateOnly(String(data.arrivalAt))}
                                    </span>
                                    <span className="text-[11px] px-5 py-1 w-fit rounded-full font-bold bg-gradient-to-tr from-gray-100 text-gray-900 via-gray-300 to-gray-400 border border-black">
                                        {data.cruise.departure}
                                    </span>
                                    <div className="text-sm p-3 bg-gray-100 rounded-xl shadow-inner">
                                        <RichTextPreview value={data.cruise.description} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Boat */}
                        <div></div>
                        <div className="col-span-4">
                            <div className="p-5 border border-black rounded-xl">
                                <CanvasImage
                                    src={data.boat.deck.cover || "/assets/Image-not-found.png"}
                                    alt={`Deck of ${data.boat.name}`}
                                    className="w-full h-40 object-cover"
                                />
                                <h2 className="font-bold flex items-center justify-between gap-5 mt-5 hover:text-brown mb-5">
                                    <Link href={`/admin/boats/${data.boat.id}`}>{data.boat.name}</Link>
                                    <IconShip size={20} stroke={2} />
                                </h2>
                                <div className="grid grid-cols-2 gap-5">
                                    {data.boat.cabins.map((cabin, i) => (
                                        <div
                                            key={i}
                                            className="p-5 rounded-lg border border-gray-300 bg-gray-100 shadow-inner text-start justify-between flex gap-3"
                                        >
                                            <div className="flex flex-col gap-2">
                                                <h5 className="text-sm font-bold text-brown uppercase">{cabin.name}</h5>
                                                <p className="text-gray-700 text-sm ">Price: {formatCurrency(cabin.price)}</p>
                                            </div>
                                            <div>
                                                <p className="font-extrabold text-xs uppercase bg-brown rounded-full px-3 py-1 text-gray-50 w-fit">
                                                    0/{cabin.maxCapacity}
                                                </p>
                                                <p className="font-extrabold mt-2 text-xs uppercase bg-brown rounded-full px-3 py-1 text-gray-50 w-fit">
                                                    {cabin.type}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {modal === "update" && (
                    <ModalUpdateSchedule
                        fetchSchedule={fetchDetailSchedule}
                        loading={loading}
                        schedule={data}
                        setLoading={setLoading}
                        setModal={setModal}
                    />
                )}
            </section>
        );
}

type propsModalUpdateSchedule = {
    loading: { stack: string; field?: string };
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field?: string }>>;
    schedule: IDetailScheduleResponse;
    setModal: React.Dispatch<SetStateAction<"update" | null>>;
    fetchSchedule: () => Promise<void>;
};
function ModalUpdateSchedule({ loading, setModal, setLoading, fetchSchedule, schedule }: propsModalUpdateSchedule) {
    const [body, setBody] = useState<{ cruiseId: string; departureAt: Date | string; boatId: string }>({ cruiseId: "", departureAt: "", boatId: "" });
    const [cruise, setCruise] = useState<ICruiseResponseList[]>([]);
    const [boat, setBoat] = useState<IBoatResponse[]>([]);
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const dataCruise: SelectDataInterface[] = cruise.map((data) => ({
        value: data.id,
        name: data.title,
    }));
    const dataBoat: SelectDataInterface[] = boat.map((data) => ({
        value: data.id,
        name: data.name,
    }));
    const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        const fetchCruise = async () => {
            setLoading({ stack: "fetchDetail", field: "Cruise" });
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
            setLoading({ stack: "fetchDetail", field: "Boats" });
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
    }, [setError, fetchSchedule, setLoading]);
    useEffect(() => {
        if (schedule) {
            setBody({ boatId: schedule.boat.id, cruiseId: schedule.cruise.id, departureAt: schedule.departureAt });
        }
    }, [schedule]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Update Schedule" });
        try {
            await api.put(
                `${process.env.NEXT_PUBLIC_API}/admin/schedule/${schedule.id}`,
                { cruiseId: body.cruiseId, departureAt: body.departureAt, boatId: body.boatId },
                { withCredentials: true }
            );
            setNotification({
                title: "Update Schedule",
                message: "Successfully to update schedule",
            });
            fetchSchedule();
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
                        <span>Update Schedule</span>
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
                            value={(() => {
                                const date = new Date(body.departureAt);
                                return isNaN(Number(date))
                                    ? ""
                                    : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(
                                          2,
                                          "0"
                                      )}`;
                            })()}
                            onChange={handleInputChange}
                        />
                    </div>

                    {/* Select Cruise */}
                    <div className="w-full flex items-center justify-start relative px-2 gap-2 py-2 rounded-lg text-sm bg-gray-50 border border-black shadow-md">
                        {loading.stack === "fetchDetail" ? (
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
                        {loading.stack === "fetchDetail" ? (
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
                    <SubmitButton title="Update" icon={<IconCloudUpload stroke={2} size={18} />} type="submit" />
                </form>
            </Card>
        </div>
    );
}
