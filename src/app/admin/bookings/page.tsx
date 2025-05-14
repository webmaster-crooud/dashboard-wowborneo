"use client";
import {
    IconCalendarEvent,
    IconCalendarUser,
    IconCash,
    IconCheckbox,
    IconCircleCheck,
    IconClockHour4,
    IconFilter,
    IconFlagCheck,
    IconLogin,
    IconMapShare,
    IconShip,
    IconUsers,
    IconX,
} from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { InputForm } from "~/components/ui/Form/Input.form";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { SelectDataInterface, SelectForm } from "~/components/ui/Form/Select.form";
import { useAuth } from "~/hooks/useAuth";
import { formatDateOnly } from "~/lib/moment";
import { errorAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IAdminBookingListResponse } from "~/types/booking";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { formatCurrency, formattedDate, greeting } from "~/utils/main";
const dataBreadcrumb: Breadcrumb[] = [
    {
        title: "Dashboard",
        url: "/admin",
    },
    {
        title: "Bookings",
        url: "/admin/bookings",
    },
];
const dataStatusPayment: SelectDataInterface[] = [
    {
        name: "Pending",
        value: "PENDING",
    },
    {
        name: "Confirmed",
        value: "CONFIRMED",
    },
    {
        name: "Down Payment",
        value: "DOWNPAYMENT",
    },
    {
        name: "Completed",
        value: "COMPLETED",
    },
    {
        name: "Check In",
        value: "CHECKIN",
    },
    {
        name: "Payment",
        value: "DONE",
    },
];
export default function AdminBookingList() {
    const { account } = useAuth();
    const router = useRouter();
    const [bookings, setBookings] = useState<IAdminBookingListResponse[]>([]);
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ stack: "", field: "" });
    const setError = useSetAtom(errorAtom);
    const [bookingId, setBookingId] = useState<string>("");
    const fetchBookingList = useCallback(async () => {
        setLoading({ stack: "fetch", field: "Booking List" });
        try {
            const { data } = await api.get<ApiSuccessResponse<IAdminBookingListResponse[]>>("/admin/booking", {
                withCredentials: true,
            });

            setBookings(data.data);
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    }, [setError]);

    const handleCheckin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: bookingId.toString() });
        try {
            await api.patch(`/admin/booking/checkin/${bookingId}`);
            router.push(`/admin/bookings?notification=Successfully checkin this booking`);
            fetchBookingList();
            setBookingId("");
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };

    useEffect(() => {
        fetchBookingList();
    }, [fetchBookingList]);
    if (loading.stack === "fetch") {
        return <LoaderForm key={"loaderFetchAdminBooking"} loading={{ stack: "fetch", field: loading.field }} />;
    }
    if (loading.stack === "submit" || loading.stack === "upload") {
        return <LoaderForm key={"loaderSubmitAdminBooking"} loading={{ stack: "submit", field: loading.field }} />;
    }
    return (
        <>
            <Suspense>
                <header className="bg-gray-50 pt-10 pb-5 px-8 shadow relative z-10">
                    <Breadcrumb data={dataBreadcrumb} />
                    <div className="flex items-start justify-between gap-10 flex-wrap">
                        <h5 className="text-xl font-semibold leading-10">
                            {greeting}! <br />
                            {account.user.firstName + " " + account.user.lastName}
                        </h5>
                        <p className="text-sm text-gray-600 font-medium">{formattedDate}</p>
                    </div>
                </header>
                <section className="min-h-screen p-5 flex flex-col gap-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between gap-5">
                        <h1 className="font-bold text-3xl">Booking History</h1>

                        <SubmitButton
                            title="Booking Cruise"
                            icon={<IconShip stroke={2} size={18} />}
                            type="button"
                            onClick={() => router.push(`${process.env.NEXT_PUBLIC_TRANSACTION}`)}
                        />
                    </div>

                    <form
                        onSubmit={handleCheckin}
                        className="grid grid-cols-3 w-8/12 bg-gray-50 p-5 rounded-lg items-center border-gray-400 border shadow gap-5"
                    >
                        <input
                            type="text"
                            className="rounded-lg border border-gray-600 px-3 py-2 text-sm col-span-2 outline-none"
                            placeholder="Booking Code..."
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBookingId(e.target.value)}
                            value={bookingId}
                        />
                        <SubmitButton
                            title="Checkin"
                            icon={<IconLogin stroke={2} size={20} />}
                            type="submit"
                            className="text-sm bg-blue-300 border-blue-300 text-blue-800 hover:bg-blue-800"
                        />
                    </form>
                    <div className="grid grid-cols-3 bg-gray-50 p-5 rounded-lg border-gray-400 border shadow gap-5">
                        <InputForm
                            title="Search"
                            type="text"
                            value={""}
                            handleInputChange={() => {}}
                            className="w-full py-2"
                            placeholder="search..."
                        />
                        <SelectForm
                            title="Status"
                            value={""}
                            data={dataStatusPayment}
                            label="Status"
                            onChange={() => {}}
                            placeholder="search..."
                            className="py-2 text-sm"
                            classIcon="top-2.5"
                        />
                        <SubmitButton title="Filter" icon={<IconFilter stroke={2} size={20} />} type="button" />
                    </div>
                    <article className="flex flex-col gap-y-4">
                        {bookings.map((booking) => (
                            <div
                                key={booking.id}
                                className="px-5 py-3 rounded-lg border bg-gray-50 border-gray-400 shadow flex justify-between h-auto gap-3 items-start"
                            >
                                <div className="w-8/12 h-full">
                                    <button type="button" onClick={() => router.push(`/admin/bookings/${booking.id}`)}>
                                        <h2 className="uppercase font-bold text-sm text-brown tracking-wider">{booking.id}</h2>
                                    </button>
                                    <div className="flex items-center justify-start gap-3 mt-2 mb-5">
                                        <span className="flex font-medium items-center justify-start gap-1 text-xs text-gray-600">
                                            <IconMapShare stroke={2} size={16} />
                                            {booking.cruise.departure}, Indonesia
                                        </span>

                                        <p className="flex font-medium items-center justify-start gap-1 text-xs text-gray-600">
                                            <IconCalendarEvent stroke={2} size={16} />
                                            <span>{formatDateOnly(booking.schedule.departureAt)}</span>
                                            <span>-</span>

                                            <span>{formatDateOnly(booking.schedule.arrivalAt)}</span>
                                        </p>
                                    </div>

                                    <div className="flex flex-col gap-y-2">
                                        <Link href={`/admin/cruises/${booking.cruise.id}`}>
                                            <h3 className="font-semibold text-gray-800">{booking.cruise.title}</h3>
                                        </Link>
                                        <Link href={`/admin/boats/${booking.boat.id}`} className="capitalize text-sm">
                                            {booking.boat.name.toLowerCase()}{" "}
                                            <span className="text-[11px] text-gray-100 rounded-full px-5 py-0.5 bg-gray-500 font-bold capitalize">
                                                {booking.cabin.type.toLocaleLowerCase()} Bed
                                            </span>{" "}
                                            <span className="text-[11px] text-gray-100 rounded-full px-5 py-0.5 bg-gray-500 font-bold capitalize">
                                                {booking.cabin.name.toLocaleLowerCase()} Bed
                                            </span>
                                        </Link>
                                        <p className="text-sm text-gray-500 font-medium flex items-center justify-start gap-1">
                                            <IconUsers stroke={2} size={14} />{" "}
                                            <span>
                                                {booking.adults} Adult {booking.children} Children
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-500 font-medium flex items-center justify-start gap-1">
                                            <IconCalendarUser stroke={2} size={14} /> <span>{booking.email}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="text-end text-xs flex flex-col items-end gap-5 h-full w-4/12">
                                    <div className="flex items-center justify-end gap-3">
                                        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium capitalize">
                                            {(() => {
                                                const status = booking.bookingStatus;

                                                const statusConfig = {
                                                    PENDING: {
                                                        color: "text-amber-600 bg-amber-100",
                                                        icon: <IconClockHour4 className="w-4 h-4" />,
                                                    },
                                                    CONFIRMED: {
                                                        color: "text-emerald-600 bg-emerald-100",
                                                        icon: <IconCircleCheck className="w-4 h-4" />,
                                                    },
                                                    DOWNPAYMENT: {
                                                        color: "text-sky-600 bg-sky-100",
                                                        icon: <IconCash className="w-4 h-4" />,
                                                    },
                                                    CANCELLED: {
                                                        color: "text-red-600 bg-red-100",
                                                        icon: <IconX className="w-4 h-4" />,
                                                    },
                                                    COMPLETED: {
                                                        color: "text-purple-600 bg-purple-100",
                                                        icon: <IconFlagCheck className="w-4 h-4" />,
                                                    },
                                                    CHECKIN: {
                                                        color: "text-indigo-600 bg-indigo-100",
                                                        icon: <IconLogin className="w-4 h-4" />,
                                                    },
                                                    DONE: {
                                                        color: "text-green-600 bg-green-100",
                                                        icon: <IconCheckbox className="w-4 h-4" />,
                                                    },
                                                };

                                                const currentConfig = statusConfig[status];

                                                return (
                                                    <span
                                                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 ${currentConfig.color}`}
                                                    >
                                                        {currentConfig.icon}
                                                        {status.toLowerCase()}
                                                    </span>
                                                );
                                            })()}
                                        </span>
                                        <p className="px-5 py-1 bg-gray-200 rounded-lg">{booking.paymentType}</p>
                                    </div>
                                    <h5 className="font-bold text-brown text-3xl">{formatCurrency(booking.finalPrice.toString())}</h5>
                                </div>
                            </div>
                        ))}
                    </article>
                </section>
            </Suspense>
        </>
    );
}
