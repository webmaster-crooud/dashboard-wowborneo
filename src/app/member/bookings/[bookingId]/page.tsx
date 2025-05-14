"use client";
import {
    IconArrowBack,
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
import { useAtom, useSetAtom } from "jotai";
import { useParams, useRouter } from "next/navigation";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { errorAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IMemberBookingDetailResponse, IRepaymentRequest } from "~/types/booking";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { formatCurrency, formatCurrencyIDR } from "~/utils/main";
import { motion as m } from "framer-motion";
import { Card } from "~/components/ui/Card";
import { useAuth } from "~/hooks/useAuth";
import { ICalculateRefundAmountResponse } from "~/types/refund";
import { refundBodyAtom } from "~/stores/refund.store";

export default function DetailBooking() {
    const { bookingId } = useParams();
    const router = useRouter();
    const [booking, setBooking] = useState<IMemberBookingDetailResponse | null>(null);
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ stack: "", field: "" });
    const [modal, setModal] = useState<string>("");
    const setError = useSetAtom(errorAtom);
    const [currency, setCurrency] = useState<"USD" | "IDR">("USD");
    const dataBreadcrumb: Breadcrumb[] = [
        {
            title: "Dashboard",
            url: "/member",
        },
        {
            title: "Bookings",
            url: "/member/bookings",
        },
        {
            title: booking?.cruiseTitle || "",
            url: `/member/bookings/${booking?.id}`,
        },
    ];
    const fetchBookingDetail = useCallback(async () => {
        setLoading({ stack: "fetch", field: "Booking Detail" });
        try {
            const { data } = await api.get<ApiSuccessResponse<IMemberBookingDetailResponse>>(`/member/booking/${bookingId}`, {
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
    }, [fetchBookingDetail]);

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
                                router.push("/member/bookings");
                            }}
                        />

                        <div className="flex items-center justify-end gap-3">
                            {booking?.bookingStatus !== "CHECKIN" &&
                                booking?.bookingStatus !== "COMPLETED" &&
                                booking?.bookingStatus !== "CANCELLED" && (
                                    <SubmitButton
                                        title="Refund"
                                        className="py-2 bg-red-300 border-red-300 text-red-800"
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
                                        onClick={() => setModal("refund")}
                                    />
                                )}

                            {String(booking?.balancePayment) != "0" && (
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
                        {/* Refund */}
                        {booking?.refund && (
                            <div className="rounded-lg bg-gray-50 p-5 border border-gray-200 shadow-sm">
                                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                                    <IconReceipt className="h-6 w-6 text-gray-600" />
                                    Refund History
                                </h2>

                                <div className="mb-3 rounded border p-3 last:mb-0">
                                    <div className="flex justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-brown font-semibold text-sm uppercase">{booking?.refund.id}</span>
                                            <span className="font-medium">
                                                {new Date(
                                                    booking?.refund.createdAt === booking?.refund.updatedAt
                                                        ? booking?.refund.createdAt
                                                        : booking?.refund.updatedAt
                                                ).toLocaleDateString()}
                                                {booking?.refund.createdAt !== booking?.refund.updatedAt && "Updated"}
                                            </span>
                                        </div>
                                        <span
                                            className={`font-semibold ${booking?.refund.status === "SUCCESS" ? "text-green-600" : "text-yellow-600"}`}
                                        >
                                            {booking?.refund.status}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm">Percent: {booking?.refund.percent}%</p>
                                    <p className="text-right font-medium">
                                        {formatCurrency(String(booking?.refund.amount))} /{formatCurrencyIDR(String(booking?.refund.amountIDR))}
                                    </p>
                                </div>
                            </div>
                        )}
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
            {modal === "refund" && <ModalRefund setModal={setModal} price={booking?.finalPrice} />}
            {modal === "submitRefund" && <ModalSubmitRefund setModal={setModal} />}
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
            const { data } = await api.post(`/transaction/${bookingId}`, repayment, {
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

function ModalRefund({ setModal, price }: { setModal: React.Dispatch<SetStateAction<string>>; price?: number | string }) {
    const { bookingId } = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [refundDetails, setRefundDetails] = useState<ICalculateRefundAmountResponse | null>(null);
    const setError = useSetAtom(errorAtom);
    const setRefundBody = useSetAtom(refundBodyAtom);

    const handleCalculate = async () => {
        try {
            setLoading(true);
            // Panggil service calculateRefundAmount

            const { data } = await api.get<ApiSuccessResponse<ICalculateRefundAmountResponse>>(`/member/refund/${bookingId}`, {
                withCredentials: true,
            });

            setRefundDetails(data.data);
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading(false);
        }
    };

    const handleProcessRefund = async () => {
        setLoading(true);
        try {
            setRefundBody({
                amount: refundDetails?.amount || "",
                amountIDR: refundDetails?.amountIDR || "",
                percent: refundDetails?.percent || 0,
                price: price || "",
                reason: "",
                refundMethod: "",
                bankName: "",
                bankNumber: "",
                bankOwner: "",
            });

            setModal("submitRefund");
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed top-0 z-[50] left-0 right-0 w-full h-screen bg-gray-50/30 backdrop-blur flex pt-20 overflow-y-auto justify-center">
            <Card
                className="w-5/12 max-h-[calc(100vh-8rem)] flex flex-col"
                classBody="bg-gray-50 flex-1 flex flex-col gap-y-3 overflow-hidden"
                classHeading="flex items-center justify-between gap-5"
                title={
                    <>
                        <span>Refund Booking</span>
                        <button onClick={() => setModal("")}>
                            <IconX size={20} stroke={2} />
                        </button>
                    </>
                }
            >
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-2">
                    {/* Refund Policy Section */}
                    <div className="mb-4 p-4 bg-pink-50 border border-pink-200 rounded">
                        <h3 className="font-semibold text-pink-800 mb-2">Refund Policy</h3>
                        <ul className="list-disc pl-5 text-sm text-pink-700 space-y-2">
                            <li>Cancellation 15-30 days before departure: 30% refund</li>
                            <li>Cancellation 14 days or less before departure: No refund</li>
                            <li>Refunds processed within 7-14 business days</li>
                        </ul>
                    </div>

                    <div className="flex items-center text-sm justify-between gap-5">
                        <h5 className="font-semibold">Booking Identity:</h5>
                        <span className="text-gray-600">{bookingId}</span>
                    </div>

                    {/* Calculation Results */}
                    {refundDetails && (
                        <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                                <div>Days before departure:</div>
                                <div className="font-semibold">{refundDetails.days} Day</div>

                                <div>Refund Percentage:</div>
                                <div className="font-semibold">{refundDetails.percent}%</div>

                                <div>Refundable Amount:</div>
                                <div className="font-semibold">
                                    {formatCurrency(refundDetails.amount.toString())} /{formatCurrencyIDR(refundDetails.amountIDR.toString())}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Button Section */}
                <div className="flex gap-3 mt-4 w-full justify-end border-t pt-4">
                    {refundDetails ? (
                        <SubmitButton
                            onClick={handleProcessRefund}
                            title={loading ? "Loading" : "Process Refund"}
                            icon={loading && <IconLoader3 size={16} stroke={2} className="animate-spin" />}
                            type="button"
                            className="bg-sky-500 flex-row-reverse border-sky-600 text-white hover:bg-sky-600"
                            disabled={loading}
                        />
                    ) : (
                        <SubmitButton
                            onClick={handleCalculate}
                            title={loading ? "Calculating..." : "Calculate Refund"}
                            icon={loading && <IconLoader3 size={16} stroke={2} className="animate-spin" />}
                            type="button"
                            className="bg-blue-500 flex-row-reverse text-white border-blue-600 hover:bg-blue-600"
                            disabled={loading}
                        />
                    )}
                </div>
            </Card>
        </div>
    );
}

function ModalSubmitRefund({ setModal }: { setModal: React.Dispatch<SetStateAction<string>> }) {
    const { bookingId } = useParams();
    const [loading, setLoading] = useState<boolean>(false);
    const [agreed, setAgreed] = useState(false);
    const [refundBody, setRefundBody] = useAtom(refundBodyAtom);
    const setError = useSetAtom(errorAtom);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setRefundBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMethodChange = (method: string) => {
        setRefundBody((prev) => ({
            ...prev,
            refundMethod: method,
            ...(method !== "BANK_TRANSFER" && {
                bankName: "",
                bankNumber: "",
                bankOwner: "",
            }),
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            await api.post(`/member/refund/${bookingId}`, refundBody, { withCredentials: true });
            setModal("");
            setRefundBody({
                amount: "",
                amountIDR: "",
                percent: 0,
                price: "",
                reason: "",
                refundMethod: "",
                bankName: "",
                bankNumber: "",
                bankOwner: "",
            });
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        const basicFields = refundBody.reason && refundBody.refundMethod;
        const bankFields = refundBody.refundMethod === "BANK_TRANSFER" ? refundBody.bankName && refundBody.bankNumber && refundBody.bankOwner : true;

        return agreed && basicFields && bankFields;
    };

    return (
        <div className="fixed top-0 z-[50] left-0 right-0 w-full h-screen bg-gray-50/30 backdrop-blur flex pt-20 overflow-y-auto justify-center">
            <Card
                className="w-5/12 max-h-[calc(100vh-8rem)] flex flex-col"
                classBody="bg-gray-50 flex-1 flex flex-col gap-y-3 overflow-hidden"
                classHeading="flex items-center justify-between gap-5"
                title={
                    <>
                        <span>Refund Booking</span>
                        <button onClick={() => setModal("")}>
                            <IconX size={20} stroke={2} />
                        </button>
                    </>
                }
            >
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-2">
                    {/* Refund Policy Section */}
                    <div className="mb-4 p-4 bg-pink-50 border border-pink-200 rounded">
                        <h3 className="font-semibold text-pink-800 mb-2">Refund Policy</h3>
                        <ul className="list-disc pl-5 text-sm text-pink-700 space-y-2">
                            <li>Cancellation 15-30 days before departure: 30% refund</li>
                            <li>Cancellation 14 days or less before departure: No refund</li>
                            <li>Refunds processed within 7-14 business days</li>
                        </ul>
                    </div>

                    {/* Reason Input */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Reason for Refund *</label>
                        <textarea
                            name="reason"
                            value={refundBody.reason}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded-md text-sm h-24"
                            placeholder="Please explain your reason for refund..."
                        />
                    </div>

                    {/* Refund Method */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Refund Method *</label>
                        <div className="flex gap-4 pb-3">
                            {["BANK_TRANSFER", "CREDIT_CARD"].map((method) => (
                                <label key={method} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="refundMethod"
                                        checked={refundBody.refundMethod === method}
                                        onChange={() => handleMethodChange(method)}
                                        className="form-radio text-blue-500"
                                    />
                                    <span className="text-sm capitalize">{method.replace("_", " ").toLowerCase()}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Bank Details - Conditional */}
                    {refundBody.refundMethod === "BANK_TRANSFER" && (
                        <div className="space-y-3 border-t pt-3">
                            <div className="space-y-1">
                                <label className="text-sm font-medium">Bank Name *</label>
                                <input
                                    name="bankName"
                                    value={refundBody.bankName}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded-md text-sm"
                                    placeholder="Bank Name"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Account Number *</label>
                                    <input
                                        name="bankNumber"
                                        value={refundBody.bankNumber}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-sm"
                                        placeholder="1234567890"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-sm font-medium">Account Holder Name *</label>
                                    <input
                                        name="bankOwner"
                                        value={refundBody.bankOwner}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-md text-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Fixed Footer */}
                <div className="border-t pt-4">
                    {/* Agreement Checkbox */}
                    <label className="flex items-start gap-2 mb-4">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="form-checkbox mt-1 text-blue-500"
                        />
                        <span className="text-sm text-gray-600">I agree to the refund policy and understand that this action cannot be undone</span>
                    </label>

                    {/* Submit Button */}
                    <div className="flex gap-3 w-full justify-end">
                        <SubmitButton
                            onClick={handleSubmit}
                            title={loading ? "Processing..." : "Submit Refund Request"}
                            type="button"
                            className="bg-blue-500 text-white hover:bg-blue-600"
                            disabled={!isFormValid() || loading}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
