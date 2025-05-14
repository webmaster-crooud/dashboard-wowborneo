"use client";
import {
    IconArrowBack,
    IconCalendarCheck,
    IconCircleCheck,
    IconCoin,
    IconLoader3,
    IconPackage,
    IconReceipt,
    IconReceiptRefund,
    IconShip,
    IconTransactionDollar,
    IconUser,
    IconX,
} from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { errorAtom, notificationAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IMemberBookingDetailResponse, IRepaymentRequest } from "~/types/booking";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { formatCurrency, formatCurrencyIDR } from "~/utils/main";
import { motion as m } from "framer-motion";
import { Card } from "~/components/ui/Card";
import { useAuth } from "~/hooks/useAuth";

export default function AdminDetailBooking() {
    const { bookingId } = useParams();
    const router = useRouter();
    const notification = useSearchParams().get("notification");
    const [booking, setBooking] = useState<IMemberBookingDetailResponse | null>(null);
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ stack: "", field: "" });
    const [modal, setModal] = useState<string>("");
    const setError = useSetAtom(errorAtom);
    const [currency, setCurrency] = useState<"USD" | "IDR">("USD");
    const dataBreadcrumb: Breadcrumb[] = [
        {
            title: "Dashboard",
            url: "/admin",
        },
        {
            title: "Bookings",
            url: "/admin/bookings",
        },
        {
            title: booking?.cruiseTitle || "",
            url: `/admin/bookings/${booking?.id}`,
        },
    ];
    const setNotification = useSetAtom(notificationAtom);
    const fetchBookingDetail = useCallback(async () => {
        setLoading({ stack: "fetch", field: "Booking Detail" });
        try {
            const { data } = await api.get<ApiSuccessResponse<IMemberBookingDetailResponse>>(`/admin/booking/${bookingId}`, {
                withCredentials: true,
            });

            setBooking(data.data);
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "" });
        }
    }, [bookingId, setError]);

    useEffect(() => {
        fetchBookingDetail();
        if (notification) {
            setNotification({
                title: "Booking Updated",
                message: (
                    <div className="flex items-center justify-start gap-2">
                        <IconCircleCheck size={16} stroke={2} /> <span>{notification}</span>
                    </div>
                ),
            });
        }
    }, [fetchBookingDetail, notification, setNotification]);

    if (loading.stack === "fetch") {
        return <LoaderForm key={"loaderFetchBooking"} loading={{ stack: "fetch", field: loading.field }} />;
    }
    if (loading.stack === "submit" || loading.stack === "upload") {
        return <LoaderForm key={"loaderSubmitBooking"} loading={{ stack: "submit", field: loading.field }} />;
    }
    return (
        <>
            <header className="bg-gray-50 pt-10 pb-5 px-8 shadow relative z-10">
                <Breadcrumb data={dataBreadcrumb} />
                <div className="">
                    <h1 className="text-3xl font-bold text-gray-900">{booking?.cruiseTitle}</h1>
                    <div className="my-3 flex items-center gap-2 text-gray-600">
                        <IconShip className="h-5 w-5" />
                        <span>{booking?.boatName}</span>
                    </div>

                    <div className="flex items-center justify-between gap-5 mt-5">
                        <SubmitButton
                            title="Back"
                            className="flex-row-reverse py-2"
                            icon={
                                loading.stack === "route" && loading.field === "back" ? (
                                    <IconLoader3
                                        className="animate-spin
                                "
                                        stroke={2}
                                        size={20}
                                    />
                                ) : (
                                    <IconArrowBack stroke={2} size={20} />
                                )
                            }
                            type="button"
                            disabled={loading.field === "back" && loading.stack === "route"}
                            onClick={() => {
                                setLoading({ stack: "route", field: "back" });
                                router.push("/admin/bookings");
                            }}
                        />

                        <div className="flex items-center justify-end gap-3">
                            <SubmitButton
                                title="Refund"
                                className="py-2 hover:bg-red-800 bg-red-300 border-red-300 text-red-800"
                                icon={
                                    loading.stack === "route" && loading.field === "back" ? (
                                        <IconLoader3
                                            className="animate-spin
                                "
                                            stroke={2}
                                            size={20}
                                        />
                                    ) : (
                                        <IconReceiptRefund stroke={2} size={20} />
                                    )
                                }
                                type="button"
                                disabled={loading.field === "back" && loading.stack === "route"}
                                onClick={() => {
                                    setLoading({ stack: "route", field: "back" });
                                    router.push("/admin/bookings");
                                }}
                            />
                            {booking?.bookingStatus === "DONE" && (
                                <SubmitButton
                                    title="Confirmation"
                                    className="py-2 bg-blue-300 border-blue-300 hover:bg-blue-800 text-blue-800"
                                    icon={
                                        loading.stack === "route" && loading.field === "back" ? (
                                            <IconLoader3
                                                className="animate-spin
                                "
                                                stroke={2}
                                                size={20}
                                            />
                                        ) : (
                                            <IconCalendarCheck stroke={2} size={20} />
                                        )
                                    }
                                    type="button"
                                    disabled={loading.field === "back" && loading.stack === "route"}
                                    onClick={() => setModal("confirmed")}
                                />
                            )}
                            {booking?.bookingStatus === "CONFIRMED" && (
                                <SubmitButton
                                    title="Checkin"
                                    className="py-2 bg-cyan-300 border-cyan-300 hover:bg-cyan-800 text-cyan-800"
                                    icon={
                                        loading.stack === "route" && loading.field === "back" ? (
                                            <IconLoader3
                                                className="animate-spin
                                "
                                                stroke={2}
                                                size={20}
                                            />
                                        ) : (
                                            <IconCalendarCheck stroke={2} size={20} />
                                        )
                                    }
                                    type="button"
                                    disabled={loading.field === "back" && loading.stack === "route"}
                                    onClick={() => setModal("checkin")}
                                />
                            )}

                            {String(booking?.balancePayment) !== "0" && (
                                <SubmitButton
                                    title={`Paid: ${
                                        currency === "USD"
                                            ? formatCurrency(String(booking?.balancePayment))
                                            : formatCurrencyIDR(String(booking?.balancePaymentIDR))
                                    }`}
                                    className="bg-blue-300 border-blue-300 text-blue-800 py-2"
                                    icon={
                                        loading.stack === "route" && loading.field === "back" ? (
                                            <IconLoader3
                                                className="animate-spin
                                "
                                                stroke={2}
                                                size={20}
                                            />
                                        ) : (
                                            <IconTransactionDollar stroke={2} size={20} />
                                        )
                                    }
                                    type="button"
                                    disabled={loading.field === "back" && loading.stack === "route"}
                                    onClick={() => setModal("repayment")}
                                />
                            )}
                        </div>
                    </div>
                </div>
            </header>
            <section className="min-h-screen p-8">
                {/* Header Section */}
                <div className="flex mb-8 text-gray-500 font-semibold items-center justify-end w-full gap-3">
                    <span>USD</span>
                    <button type="button" onClick={() => setCurrency(currency === "IDR" ? "USD" : "IDR")} className="flex items-center">
                        <div className="h-5 w-10 border border-gray-300 rounded-full flex items-center relative overflow-hidden bg-white">
                            <m.div
                                initial={false}
                                animate={{
                                    x: currency === "USD" ? 0 : 18, // 24px = 1.5rem (w-10(2.5rem) - w-4(1rem))
                                    scale: 1,
                                }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute left-0.5 w-4 h-4 bg-brown rounded-full"
                            ></m.div>
                        </div>
                    </button>
                    <span>IDR</span>
                </div>
                {/* Main Content Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Cabin Details */}
                        <div className="rounded-lg bg-gray-50 p-5 border border-gray-200 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                <IconShip className="h-6 w-6 text-gray-600" />
                                Cabin Information
                            </h2>
                            <div className="space-y-2 text-gray-700">
                                <p>
                                    <span className="font-medium">Cabin Type:</span>{" "}
                                    <span className="capitalize">{booking?.cabinName.toLocaleLowerCase()} Bed</span>
                                </p>
                                <p>
                                    <span className="font-medium">Booking Status:</span>
                                    <span
                                        className={`ml-2 rounded-lg px-2 py-1 text-xs font-medium
                                    ${booking?.bookingStatus === "DOWNPAYMENT" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                                    >
                                        {booking?.bookingStatus}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Guest Details */}
                        <div className="rounded-lg bg-gray-50 p-5 border border-gray-200 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                <IconUser className="h-6 w-6 text-gray-600" />
                                Guest Details
                            </h2>
                            {booking?.guests.map((guest, index) => (
                                <div key={index} className="mb-4 rounded border-b pb-4 last:border-b-0">
                                    <div>
                                        <h3 className="font-semibold">
                                            {guest.firstName} {guest.lastName}
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="font-medium text-sm">email</p>
                                            <p className="text-sm text-gray-500">{guest.email}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Passenger Type</p>
                                            <p className="text-sm text-gray-500">{guest.children}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Contact</p>
                                            <p className="text-sm text-gray-500">{guest.phone}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Identity</p>
                                            <p className="text-sm text-gray-500">{guest.identityNumber}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Country</p>
                                            <p className="text-sm text-gray-500">{guest.country}</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Price</p>
                                            <p className="text-sm text-gray-500">{formatCurrency(String(guest.price))}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Payment Summary */}
                        <div className="rounded-lg bg-gray-50 p-5 border border-gray-200 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                <IconCoin className="h-6 w-6 text-gray-600" />
                                Payment Summary
                            </h2>
                            <div className="space-y-3 text-gray-700">
                                {booking?.guests.map((guest, i) => (
                                    <div className="flex justify-between" key={i}>
                                        <span>
                                            Guest <span className="capitalize">{guest.children.toLocaleLowerCase()}</span>:
                                        </span>
                                        <span>{formatCurrency(String(guest.price))}</span>
                                    </div>
                                ))}
                                {booking?.addons.map((addon, i) => (
                                    <div className="flex justify-between" key={i}>
                                        <span>{addon.title}:</span>
                                        <div className="flex flex-col text-end justify-end">
                                            <span>
                                                ({addon.qty}) x {formatCurrency(String(addon.price))}
                                            </span>
                                            <span>{formatCurrency(String(addon.totalPrice))}</span>
                                        </div>
                                    </div>
                                ))}
                                <div className="flex justify-between border-t pt-2">
                                    <span>Subtotal:</span>
                                    <span>{formatCurrency(String(booking?.subTotalPrice))}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount:</span>
                                    <span>{booking?.discount}</span>
                                </div>
                                <div className="flex justify-between font-semibold">
                                    <span>Total Price:</span>
                                    <span>{formatCurrency(String(booking?.finalPrice))}</span>
                                </div>
                                <div className="mt-4 pt-4 border-t">
                                    <div className="flex justify-between text-green-600">
                                        <span>Paid Amount:</span>
                                        <span>
                                            <span>
                                                {currency === "USD"
                                                    ? formatCurrency(String(booking?.amountPayment))
                                                    : formatCurrencyIDR(String(booking?.amountPaymentIDR))}
                                            </span>
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-red-600">
                                        <span>Remaining Balance:</span>
                                        <span>
                                            <span>
                                                -{" "}
                                                {currency === "USD"
                                                    ? formatCurrency(String(booking?.balancePayment))
                                                    : formatCurrencyIDR(String(booking?.balancePaymentIDR))}
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Addons */}
                        <div className="rounded-lg bg-gray-50 p-5 border border-gray-200 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                <IconPackage className="h-6 w-6 text-gray-600" />
                                Additional Packages
                            </h2>
                            {booking?.addons.map((addon, index) => (
                                <div key={index} className="flex justify-between py-2">
                                    <div>
                                        <p className="font-medium">{addon.title}</p>
                                        <p className="text-sm text-gray-500">
                                            {addon.qty} x {formatCurrency(String(addon.price))}
                                        </p>
                                    </div>
                                    <p className="font-medium"> {formatCurrency(String(addon.totalPrice))}</p>
                                </div>
                            ))}
                        </div>

                        {/* Transactions */}
                        <div className="rounded-lg bg-gray-50 p-5 border border-gray-200 shadow-sm">
                            <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                <IconReceipt className="h-6 w-6 text-gray-600" />
                                Transaction History
                            </h2>
                            {booking?.transactions.map((transaction, index) => (
                                <div key={index} className="mb-3 rounded border p-3 last:mb-0">
                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-brown font-semibold text-sm uppercase">{transaction.id}</span>
                                            <span className="font-medium">{new Date(transaction.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <span className={`font-semibold ${transaction.status === "SUCCESS" ? "text-green-600" : "text-yellow-600"}`}>
                                            {transaction.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{transaction.notes}</p>
                                    <p className="text-right font-medium">{formatCurrency(String(transaction.amount))}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
            {modal === "repayment" && (
                <ModalRepayment
                    setModal={setModal}
                    amountPayment={booking?.amountPayment || 0}
                    finalPrice={booking?.finalPrice || 0}
                    balancePayment={booking?.balancePayment || 0}
                />
            )}
            {modal === "confirmed" && (
                <ModalConfirmed
                    setModal={setModal}
                    finalPrice={booking?.finalPrice || 0}
                    bookingId={booking?.id.toString() || bookingId.toString()}
                    email={booking?.email || ""}
                    fetchBookingDetail={fetchBookingDetail}
                />
            )}
            {modal === "checkin" && (
                <ModalCheckin
                    setModal={setModal}
                    finalPrice={booking?.finalPrice || 0}
                    bookingId={booking?.id.toString() || bookingId.toString()}
                    fetchBookingDetail={fetchBookingDetail}
                />
            )}
        </>
    );
}

function ModalRepayment({
    setModal,
    balancePayment,
    amountPayment,
    finalPrice,
}: {
    setModal: React.Dispatch<SetStateAction<string>>;
    balancePayment: string | number;
    amountPayment: string | number;
    finalPrice: string | number;
}) {
    const { bookingId } = useParams();
    const { account } = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const setError = useSetAtom(errorAtom);

    const repayment: IRepaymentRequest = {
        amountPayment: balancePayment,
        bookingId: bookingId.toString(),
        email: account.email,
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            const { data } = await api.post(`/transaction/${bookingId}/repayment`, repayment, {
                withCredentials: true,
            });
            console.log(data);
            window.location.href = data.data;
        } catch (err) {
            fetchError(err, setError);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="fixed top-0 z-[50] left-0 right-0 w-full h-screen bg-gray-50/30 backdrop-blur flex items-start pt-20 justify-center">
            <Card
                className="w-5/12"
                classBody="bg-gray-50 flex flex-col gap-y-3"
                classHeading="flex items-center justify-between gap-5"
                title={
                    <>
                        <span>Full Payment</span>
                        <button onClick={() => setModal("")}>
                            <IconX size={20} stroke={2} />
                        </button>
                    </>
                }
            >
                <div className="flex items-center text-sm justify-between gap-5">
                    <h5 className="font-semibold">Booking Identity:</h5> <span className="text-gray-600">{bookingId}</span>
                </div>
                <div className="flex items-center text-sm justify-between gap-5 w-6/12 ms-auto border-t border-gray-400 pt-2">
                    <h5 className="font-semibold">Down Payment:</h5> <span className="text-gray-600">{formatCurrency(String(amountPayment))}</span>
                </div>
                <div className="flex items-center text-sm justify-between gap-5 w-6/12 ms-auto">
                    <h5 className="font-semibold">Total Price:</h5> <span className="text-gray-600">{formatCurrency(String(finalPrice))}</span>
                </div>
                <div className="grid grid-cols-12 gap-2 w-6/12 ms-auto">
                    <div className="border-gray-400 border-t col-span-11"></div>
                    <div className="border-gray-400 border-t"></div>
                </div>
                <div className="flex items-center text-xl justify-end gap-5 w-6/12 ms-auto">
                    <span className="text-brown font-bold">{formatCurrency(String(balancePayment))}</span>
                </div>

                <SubmitButton
                    onClick={handlePayment}
                    title={loading ? "Loading..." : "Doku Payment"}
                    type="button"
                    className="bg-sky-300 text-sky-700 hover:bg-sky-500 border-sky-300"
                />
            </Card>
        </div>
    );
}

function ModalConfirmed({
    setModal,
    email,
    bookingId,
    finalPrice,
    fetchBookingDetail,
}: {
    setModal: React.Dispatch<SetStateAction<string>>;
    email: string;
    bookingId: string;
    finalPrice: string | number;
    fetchBookingDetail: () => Promise<void>;
}) {
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ stack: "" });
    const setError = useSetAtom(errorAtom);
    const router = useRouter();

    const handleConfirmed = async () => {
        setLoading({ stack: "submit", field: bookingId.toString() });
        try {
            await api.patch(`/admin/booking/${bookingId}/${email}`);
            setModal("");
            router.push(`/admin/bookings/${bookingId}?notification=Successfully confirmed this booking`);
            fetchBookingDetail();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };
    return (
        <div className="fixed top-0 z-[50] left-0 right-0 w-full h-screen bg-gray-50/30 backdrop-blur flex items-start pt-20 justify-center">
            <Card
                className="w-5/12"
                classBody="bg-gray-50 flex flex-col gap-y-3"
                classHeading="flex items-center justify-between gap-5"
                title={
                    <>
                        <span>Confirmation Booking</span>
                        <button onClick={() => setModal("")}>
                            <IconX size={20} stroke={2} />
                        </button>
                    </>
                }
            >
                <div className="flex items-center text-sm justify-between gap-5">
                    <h5 className="font-semibold">Booking Identity:</h5> <span className="text-gray-600">{bookingId}</span>
                </div>
                <div className="flex items-center text-xl justify-end gap-5 w-6/12 ms-auto">
                    <span className="text-brown font-bold">{formatCurrency(String(finalPrice))}</span>
                </div>

                <SubmitButton
                    onClick={handleConfirmed}
                    title={loading.stack === "submit" && loading.field === bookingId.toString() ? "Loading..." : "Confirmation"}
                    type="button"
                    className="bg-sky-300 text-sky-700 hover:bg-sky-500 border-sky-300"
                />
            </Card>
        </div>
    );
}
function ModalCheckin({
    setModal,
    bookingId,
    finalPrice,
    fetchBookingDetail,
}: {
    setModal: React.Dispatch<SetStateAction<string>>;
    bookingId: string;
    finalPrice: string | number;
    fetchBookingDetail: () => Promise<void>;
}) {
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ stack: "" });
    const setError = useSetAtom(errorAtom);
    const router = useRouter();

    const handleCheckin = async () => {
        setLoading({ stack: "submit", field: bookingId.toString() });
        try {
            await api.patch(`/admin/booking/checkin/${bookingId}`);
            setModal("");
            router.push(`/admin/bookings/${bookingId}?notification=Successfully checkin this booking`);
            fetchBookingDetail();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };
    return (
        <div className="fixed top-0 z-[50] left-0 right-0 w-full h-screen bg-gray-50/30 backdrop-blur flex items-start pt-20 justify-center">
            <Card
                className="w-5/12"
                classBody="bg-gray-50 flex flex-col gap-y-3"
                classHeading="flex items-center justify-between gap-5"
                title={
                    <>
                        <span>Checkin Booking</span>
                        <button onClick={() => setModal("")}>
                            <IconX size={20} stroke={2} />
                        </button>
                    </>
                }
            >
                <div className="flex items-center text-sm justify-between gap-5">
                    <h5 className="font-semibold">Booking Identity:</h5> <span className="text-gray-600">{bookingId}</span>
                </div>

                <div className="flex items-center text-xl justify-end gap-5 w-6/12 ms-auto">
                    <span className="text-brown font-bold">{formatCurrency(String(finalPrice))}</span>
                </div>

                <SubmitButton
                    onClick={handleCheckin}
                    title={loading.stack === "submit" && loading.field === bookingId.toString() ? "Loading..." : "Checkin"}
                    type="button"
                    className="bg-sky-300 text-cyan-700 hover:bg-cyan-500 border-cyan-300"
                />
            </Card>
        </div>
    );
}
