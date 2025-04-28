"use client";
import Link from "next/link";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { errorAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IRefundBookingResponse } from "~/types/refund";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { formatCurrency, formatCurrencyIDR } from "~/utils/main";
import { formatDate } from "~/lib/moment";
import { SearchTable } from "~/components/ui/Sarch.table";
import { IconFolder } from "@tabler/icons-react";

const dataBreadcrumb: Breadcrumb[] = [
    { title: "Dashboard", url: "/admin" },
    { title: "Refund", url: "/admin/refunds" },
];

export default function RefundListPage() {
    const [refunds, setRefunds] = useState<IRefundBookingResponse[]>([]);
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ stack: "", field: "" });
    const [search, setSearch] = useState<string>("");
    const setError = useSetAtom(errorAtom);

    const fetchRefunds = useCallback(async () => {
        setLoading({ stack: "fetch", field: "refunds" });
        try {
            const { data } = await api.get<ApiSuccessResponse<IRefundBookingResponse[]>>("/admin/refund", { withCredentials: true });
            setRefunds(data.data);
        } catch (err) {
            fetchError(err, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    }, [setError]);

    useEffect(() => {
        fetchRefunds();
    }, [fetchRefunds]);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const target = e.target as HTMLFormElement;
        const value = (target.elements.namedItem("search") as HTMLInputElement).value;
        setSearch(value);
    };

    // Client-side filtering by ID, method, or status
    const filtered = refunds.filter((r) =>
        [r.id, r.refundMethod, r.status].some((field) => field.toString().toLowerCase().includes(search.toLowerCase()))
    );

    if (loading.stack === "fetch") {
        return <LoaderForm key="loaderFetchRefund" loading={{ stack: "fetch", field: loading.field }} />;
    }

    return (
        <>
            <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
            <section className="min-h-screen p-5 flex flex-col gap-y-5">
                <div className="rounded-md border border-gray-300 shadow-sm md:overflow-hidden">
                    {/* Header / Title and Search */}
                    <div className="flex flex-col md:flex-row items-center p-4 justify-between bg-gray-50">
                        <h2 className="text-lg font-bold w-full">Refunds Data</h2>
                        <SearchTable handleSearch={handleSearch} search={search} setSearch={setSearch} />
                    </div>

                    {/* Scrollable Table Container */}
                    <div className="overflow-x-auto">
                        <table className="min-w-max w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-300 bg-gray-50 uppercase text-sm">
                                    <th className="px-4 py-2 font-bold">ID</th>
                                    <th className="px-4 py-2 font-bold">Amount (USD)</th>
                                    <th className="px-4 py-2 font-bold">Amount (IDR)</th>
                                    <th className="px-4 py-2 font-bold">Percent</th>
                                    <th className="px-4 py-2 font-bold">Method</th>
                                    <th className="px-4 py-2 font-bold">Status</th>
                                    <th className="px-4 py-2 font-bold">Created</th>
                                    <th className="px-4 py-2 font-bold">Updated</th>
                                    <th className="px-4 py-2 font-bold">Setting</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr className="border-b border-gray-200">
                                        <td className="px-4 py-3 text-center font-bold text-gray-600" colSpan={9}>
                                            No refunds found
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map((r) => {
                                        let badgeColor = "bg-gray-700";
                                        switch (r.status) {
                                            case "PENDING":
                                                badgeColor = "bg-gray-700";
                                                break;
                                            case "APPROVED":
                                                badgeColor = "bg-cyan-700";
                                                break;
                                            case "REJECTED":
                                                badgeColor = "bg-red-700";
                                                break;
                                            case "PROCESSED":
                                                badgeColor = "bg-blue-700";
                                                break;
                                            case "SUCCESS":
                                                badgeColor = "bg-green-700";
                                                break;
                                        }

                                        return (
                                            <tr className="border-b border-gray-200" key={r.id}>
                                                <td className="px-4 py-3 uppercase">{r.id}</td>
                                                <td className="px-4 py-3">{formatCurrency(r.amount.toString())}</td>
                                                <td className="px-4 py-3">{formatCurrencyIDR(r.amountIDR.toString())}</td>
                                                <td className="px-4 py-3">{`${r.percent}%`}</td>
                                                <td className="px-4 py-3">{r.refundMethod}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`${badgeColor} text-white px-3 py-1 rounded-full text-xs uppercase font-bold`}>
                                                        {r.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">{formatDate(r.createdAt)}</td>
                                                <td className="px-4 py-3">{formatDate(r.updatedAt)}</td>
                                                <td className="px-4 py-3">
                                                    <Link
                                                        href={`/admin/refunds/${r.id}`}
                                                        className="px-3 py-1 text-xs bg-cyan-600 text-white rounded-md font-medium flex items-center justify-center"
                                                    >
                                                        <IconFolder stroke={2} size={20} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                            <tfoot className="bg-gray-200">
                                <tr>
                                    <td colSpan={9} className="px-4 py-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                Showing 1-{filtered.length} of {filtered.length}
                                            </span>
                                            <div className="flex gap-2">
                                                <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md" disabled>
                                                    <span className="text-lg">&laquo;</span> Previous
                                                </button>
                                                <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md" disabled>
                                                    Next <span className="text-lg">&raquo;</span>
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </section>
        </>
    );
}
