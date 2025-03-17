"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { IDestinationBody } from "~/types/cruise";
import { fetchError } from "~/utils/fetchError";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "~/stores";
import { api } from "~/utils/api";
import { ApiSuccessResponse, STATUS } from "~/types";
import { SearchTable } from "~/components/ui/Sarch.table";

export function DestinationTable() {
    const [destination, setDestination] = useState<IDestinationBody[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<{ stack: string; idx: string }>({ stack: "", idx: "" });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const fetchDestination = useCallback(async (search?: string) => {
        const { data } = await api.get<ApiSuccessResponse<IDestinationBody[]>>(`${process.env.NEXT_PUBLIC_API}/admin/destination?search=${search}`, {
            withCredentials: true,
        });
        setDestination(data.data);
    }, []);

    useEffect(() => {
        fetchDestination();
    }, [fetchDestination]);

    const handleSearchCruise = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchDestination(search);
    };

    const handleDeleted = async (destinationId: string, status: STATUS) => {
        setLoading({ stack: "deleted", idx: destinationId });
        try {
            const { data } = await api.patch<ApiSuccessResponse<{ message: string }>>(
                `${process.env.NEXT_PUBLIC_API}/admin/cruise/${destinationId}?action=${status}`
            );

            console.log(data);
            setNotification({ title: "Successfully", message: data.data.message });
            fetchDestination();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", idx: "" });
        }
    };

    return (
        <div className="rounded-md border border-gray-300 shadow-sm md:overflow-hidden overflow-x-scroll">
            {/* Header / Title dan Search */}
            <div className="flex flex-col md:flex-row items-center p-4 justify-between bg-gray-50">
                <h2 className="text-lg font-bold w-full">Cruises Data</h2>
                <SearchTable handleSearch={handleSearchCruise} search={search} setSearch={setSearch} />
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse">
                {/* Table Head */}
                <thead>
                    <tr className="border-b border-gray-300 bg-gray-50 uppercase text-sm">
                        <th className="px-4 py-2 font-bold">Title</th>
                        <th className="px-4 py-2 font-bold">Cruise</th>
                        <th className="px-4 py-2 font-bold">Days</th>
                        <th className="px-4 py-2 font-bold">Status</th>
                        <th className="px-4 py-2 font-bold">Setting</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {destination.length === 0 ? (
                        <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-nowrap text-center font-bold text-gray-600" colSpan={6}>
                                Destination is empty
                            </td>
                        </tr>
                    ) : (
                        destination.map((dest, i) => (
                            <tr className="border-b border-gray-200" key={i}>
                                <td className="px-4 py-3 text-nowrap flex items-center justify-start gap-2">
                                    <span>
                                        {i + 1}. {dest.title}
                                    </span>
                                </td>

                                <td className="px-4 py-3 text-nowrap">
                                    <Link className="text-brown underline underline-offset-1" href={`/admin/cruises/${dest.cruise?.id}`}>
                                        {dest.cruise?.title}
                                    </Link>
                                </td>
                                <td className="px-4 py-3 text-nowrap">{`${dest.days} days`}</td>
                                <td className="px-4 py-3 text-nowrap">
                                    <span
                                        className={`${
                                            dest.status === "ACTIVED"
                                                ? "bg-cyan-700"
                                                : dest.status === "FAVOURITED"
                                                ? "bg-orange-700"
                                                : dest.status === "DELETED"
                                                ? "bg-red-700"
                                                : "bg-gray-700"
                                        } text-white px-5 py-1 rounded-full text-[11px] uppercase font-bold`}
                                    >
                                        {dest.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-nowrap">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/cruises/${String(dest.id)}`}
                                            className="px-3 py-1 text-xs bg-cyan-600 text-white rounded-md font-medium"
                                        >
                                            Info
                                        </Link>
                                        <button
                                            onClick={() => handleDeleted(String(dest.id), "DELETED")}
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded-md font-medium"
                                            disabled={loading.stack === "DELETED" && loading.idx === String(dest.id)}
                                        >
                                            {loading.stack === "DELETED" && loading.idx === String(dest.id) ? "Loading..." : "Delete"}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

                {/* Table Footer (untuk pagination/numbering) */}
                <tfoot className="bg-gray-200">
                    <tr>
                        <td colSpan={6} className="px-4 py-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Showing 1-2 of 2</span>
                                <div className="flex gap-2">
                                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md">
                                        <span className="text-lg">&laquo;</span> Previous
                                    </button>
                                    <button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md">
                                        Next <span className="text-lg">&raquo;</span>
                                    </button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
}
