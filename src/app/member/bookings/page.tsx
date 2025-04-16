"use client";
import {
    IconCalendarEvent,
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
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { InputForm } from "~/components/ui/Form/Input.form";
import { SelectDataInterface, SelectForm } from "~/components/ui/Form/Select.form";
import { useAuth } from "~/hooks/useAuth";
import { formatDateOnly } from "~/lib/moment";
import { ApiSuccessResponse } from "~/types";
import { IMemberBookingListResponse } from "~/types/booking";
import { api } from "~/utils/api";
import { formatCurrency, formattedDate, greeting } from "~/utils/main";
const dataBreadcrumb: Breadcrumb[] = [
    {
        title: "Dashboard",
        url: "/member",
    },
    {
        title: "Bookings",
        url: "/member/bookings",
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
export default function MemberBookings() {
    const { account } = useAuth();
    const [bookings, setBookings] = useState<IMemberBookingListResponse[]>([]);
    const router = useRouter();
    const fetchBookings = useCallback(async () => {
        const { data } = await api.get<ApiSuccessResponse<IMemberBookingListResponse[]>>(`${process.env.NEXT_PUBLIC_API}/member/booking`, {
            withCredentials: true,
        });
        setBookings(data.data);
    }, []);

    useEffect(() => {
        fetchBookings();
    }, [fetchBookings]);

    return (
        <>
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

                <div className="grid grid-cols-3 bg-gray-50 p-5 rounded-lg border-gray-400 border shadow gap-5">
                    <InputForm title="Search" type="text" value={""} handleInputChange={() => {}} className="w-full py-2" placeholder="search..." />
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
                            <div className="w-full h-full">
                                <button type="button" onClick={() => router.push(`/member/bookings/${booking.id}`)}>
                                    <h2 className="uppercase font-bold text-sm text-brown tracking-wider">{booking.id}</h2>
                                </button>
                                <div className="flex items-center justify-start gap-3 mt-2 mb-5">
                                    <span className="flex font-medium items-center justify-start gap-1 text-xs text-gray-600">
                                        <IconMapShare stroke={2} size={16} />
                                        {booking.schedule.departure}, Indonesia
                                    </span>

                                    <p className="flex font-medium items-center justify-start gap-1 text-xs text-gray-600">
                                        <IconCalendarEvent stroke={2} size={16} />
                                        <span>{formatDateOnly(booking.schedule.departureAt)}</span>
                                        <span>-</span>

                                        <span>{formatDateOnly(booking.schedule.arrivalAt)}</span>
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {booking.cruiseTitle} [{booking.boatName}]{" "}
                                        <span className="text-[11px] text-gray-100 rounded-full px-5 py-0.5 bg-gray-500 font-bold capitalize">
                                            {booking.cabinName.toLocaleLowerCase()} Bed
                                        </span>
                                    </h3>
                                    <p className="text-sm text-gray-500 font-medium flex items-center justify-start gap-1">
                                        <IconUsers stroke={2} size={14} />{" "}
                                        <span>
                                            {booking.adults} Adult {booking.children} Children
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="text-end text-xs flex flex-col items-end gap-5 h-full w-full">
                                <div className="flex items-center justify-end gap-3">
                                    <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium capitalize">
                                        {(() => {
                                            const status =
                                                booking.bookingStatus === "PENDING"
                                                    ? new Date(booking.createdAt).getTime() < Date.now() - 3600000
                                                        ? "CANCELLED"
                                                        : "PENDING"
                                                    : booking.bookingStatus;

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
                                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 ${currentConfig.color}`}>
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
        </>
    );
}
