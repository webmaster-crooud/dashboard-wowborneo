"use client";

import { IconArrowBack, IconCalendarEvent, IconEye, IconLoader3, IconShip } from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { LoaderForm } from "~/components/ui/Form/Loader.form";

import { errorAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
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
    {
        title: "Deleted",
        url: "/admin/schedules/deleted",
    },
];

export default function DeletedSchedulePage() {
    const router = useRouter();
    const [schedules, setSchedules] = useState<IScheduleResponse[]>([]);
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ field: "", stack: "" });
    const setError = useSetAtom(errorAtom);

    const fetchSchedule = useCallback(async () => {
        setLoading({ stack: "fetch", field: "Fetching Schedule" });
        try {
            const { data } = await api.get<ApiSuccessResponse<IScheduleResponse[]>>(`${process.env.NEXT_PUBLIC_API}/admin/schedule/deleted`, {
                withCredentials: true,
            });
            setSchedules(data.data);
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    }, [setError]);
    useEffect(() => {
        fetchSchedule();
    }, [setError, fetchSchedule]);

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
                        <IconCalendarEvent stroke={2.3} size={24} /> Deleted Event Schedule
                    </h2>
                    <SubmitButton
                        type="button"
                        title="Back"
                        onClick={() => {
                            setLoading({ field: "routeSchedule", stack: "route" });
                            router.push("/admin/schedules");
                        }}
                        icon={
                            loading.stack === "route" && loading.field === "routeSchedule" ? (
                                <IconLoader3 className="animate-spin" stroke={2} size={18} />
                            ) : (
                                <IconArrowBack stroke={2} size={18} />
                            )
                        }
                    />
                </div>
                <div className="mx-auto p-5 flex flex-col gap-y-5">
                    <ContentScheduleList schedules={schedules} />
                </div>
            </section>
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
                        className="bg-gray-200 shadow-md flex items-center justify-start rounded-2xl overflow-hidden w-full border border-gray-300 relative"
                        key={i}
                    >
                        <div className="relative w-2/12">
                            <Image
                                src={schedule.cover || "/assets/Image-not-found.png"}
                                alt={schedule.cruiseTitle + " " + schedule.boatTitle}
                                width={1000}
                                height={1000}
                                className="w-full h-44 object-cover object-center"
                            />
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent to-gray-200" />
                        </div>
                        <div className="w-10/12 pe-5 py-8 h-44 flex justify-between">
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
                                        {String(schedule.departureAt)} - {String(schedule.arrivalAt)}
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
