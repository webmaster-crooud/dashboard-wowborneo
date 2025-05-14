"use client";

import Link from "next/link";
import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { errorAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IAdminRefundDetailResponse, REFUND_STATUS } from "~/types/refund";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { formatCurrency, formatCurrencyIDR } from "~/utils/main";
import { formatDate } from "~/lib/moment";
import { IconLoader3 } from "@tabler/icons-react";

export default function DetailRefundPage() {
    // Breadcrumb untuk navigasi
    const dataBreadcrumb: Breadcrumb[] = [
        { title: "Dashboard", url: "/admin" },
        { title: "Refund Detail", url: "/admin/refund" },
    ];

    // State
    const [refund, setRefund] = useState<IAdminRefundDetailResponse | null>(null);
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ stack: "", field: "" });
    const setError = useSetAtom(errorAtom);
    const { id } = useParams();

    // Fetch detail refund
    const fetchDetailRefund = useCallback(async () => {
        setLoading({ stack: "fetch", field: "detail" });
        try {
            const { data } = await api.get<ApiSuccessResponse<IAdminRefundDetailResponse>>(`/admin/refund/${id}`, { withCredentials: true });
            setRefund(data.data);
        } catch (err) {
            fetchError(err, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    }, [id, setError]);

    useEffect(() => {
        fetchDetailRefund();
    }, [fetchDetailRefund]);

    if (loading.stack === "fetch") {
        return <LoaderForm key="loaderFetchDetail" loading={{ stack: "fetch", field: loading.field }} />;
    }

    if (!refund) return null;

    // Handle status change
    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as REFUND_STATUS;
        setLoading({ stack: "submit", field: "Change Status Refund" });
        try {
            await api.patch<ApiSuccessResponse<null>>(`/admin/refund/${id}/${newStatus}`, {}, { withCredentials: true });
            // Refresh detail setelah perubahan
            await fetchDetailRefund();
        } catch (err) {
            fetchError(err, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };

    return (
        <>
            <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
            <section className="p-5">
                <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto space-y-6">
                    <div className="flex items-center justify-between gap-5">
                        <h1 className="text-2xl font-semibold">Detail Refund</h1>
                        {loading.stack === "submit" && <IconLoader3 className="animate-spin text-brown" size={30} stroke={2} />}
                    </div>

                    {/* Grid informasi refund */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex flex-col gap-y-2">
                            <div>
                                <p className="text-sm text-gray-500">Booking ID</p>
                                <Link href={`/admin/bookings/${refund.bookingId}`} className="mt-1 font-medium text-brown underline">
                                    {refund.bookingId}
                                </Link>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">ID</p>
                                <p className="mt-1 font-medium">{refund.id}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-y-2">
                            <div>
                                <p className="text-sm text-gray-500">Price (USD)</p>
                                <p className="mt-1 font-medium">{formatCurrency(refund.price.toString())}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Amount Refund (USD)</p>
                                <p className="mt-1 font-medium">
                                    {formatCurrency(refund.amount.toString())} ({refund.percent}%)
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Amount (IDR)</p>
                                <p className="mt-1 font-medium">{formatCurrencyIDR(refund.amountIDR.toString())}</p>
                            </div>
                        </div>

                        <div className="col-span-2">
                            <p className="text-sm text-gray-500">Reason</p>
                            <p className="mt-1 font-medium p-3 text-sm bg-gray-100 shadow-inner rounded-lg">{refund.reason || "-"}</p>
                        </div>

                        <div className="bg-gray-200 rounded-full w-full h-[1px] col-span-2" />
                        <div>
                            <p className="text-sm text-gray-500">Refund Method</p>
                            <p className="mt-1 font-medium">{refund.refundMethod}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Bank Name</p>
                            <p className="mt-1 font-medium">{refund.bankName}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bank Number</p>
                            <p className="mt-1 font-medium">{refund.bankNumber}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Bank Owner</p>
                            <p className="mt-1 font-medium">{refund.bankOwner}</p>
                        </div>

                        <div className="bg-gray-200 rounded-full w-full h-[1px] col-span-2" />
                        <div>
                            <p className="text-sm text-gray-500">Created At</p>
                            <p className="mt-1 font-medium">{formatDate(refund.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Updated At</p>
                            <p className="mt-1 font-medium">{formatDate(refund.updatedAt)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Processed At</p>
                            <p className="mt-1 font-medium">{refund.processedAt ? formatDate(refund.processedAt) : "-"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Processed By</p>
                            <p className="mt-1 font-medium">{refund.processedBy || "-"}</p>
                        </div>
                    </div>

                    {/* Status Select */}
                    <div className="mt-6">
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={refund.status}
                            onChange={handleStatusChange}
                            disabled={loading.stack === "submit"}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {(["PENDING", "APPROVED", "REJECTED", "PROCESSED", "SUCCESS"] as REFUND_STATUS[]).map((s) => (
                                <option key={s} value={s}>
                                    {s}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Back Link */}
                    <div className="mt-4">
                        <Link href="/admin/refunds" className="text-blue-600 hover:underline">
                            &larr; Back to Refund List
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
