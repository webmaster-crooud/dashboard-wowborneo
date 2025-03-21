"use client";
import React, { useCallback, useEffect, useState } from "react";
import cruiseService from "~/services/cruise.service";
import { SearchTable } from "../../../ui/Sarch.table";
import { IconLoader3, IconStar, IconStarFilled } from "@tabler/icons-react";
import { formatDate } from "~/lib/moment";
import Link from "next/link";
import { ICruiseResponseList } from "~/types/cruise";
import { fetchError } from "~/utils/fetchError";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "~/stores";
import { api } from "~/utils/api";
import { ApiSuccessResponse, STATUS } from "~/types";

export function CruiseTable() {
    const [cruise, setCruise] = useState<ICruiseResponseList[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<{ stack: string; idx: string }>({ stack: "", idx: "" });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const fetchCruise = useCallback(async (search?: string) => {
        const cruise = await cruiseService.list(search);
        setCruise(cruise);
    }, []);

    useEffect(() => {
        fetchCruise();
    }, [fetchCruise]);

    const handleSearchCruise = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchCruise(search);
    };

    const handleFavorited = async (cruiseId: string, status: STATUS) => {
        setLoading({ stack: "favourited", idx: cruiseId });
        try {
            const { data } = await api.patch<ApiSuccessResponse<{ message: string }>>(
                `${process.env.NEXT_PUBLIC_API}/admin/cruise/${cruiseId}?action=${status}`
            );

            setNotification({ title: "Successfully", message: data.data.message });
            fetchCruise();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", idx: "" });
        }
    };

    const handleDeleted = async (cruiseId: string, status: STATUS) => {
        setLoading({ stack: "deleted", idx: cruiseId });
        try {
            const { data } = await api.patch<ApiSuccessResponse<{ message: string }>>(
                `${process.env.NEXT_PUBLIC_API}/admin/cruise/${cruiseId}?action=${status}`
            );

            setNotification({ title: "Successfully", message: data.data.message });
            fetchCruise();
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
                        <th className="px-4 py-2 font-bold">Departure</th>
                        <th className="px-4 py-2 font-bold">Duration</th>
                        <th className="px-4 py-2 font-bold">Status</th>
                        <th className="px-4 py-2 font-bold">Created</th>
                        <th className="px-4 py-2 font-bold">Setting</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {cruise.length === 0 ? (
                        <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-nowrap text-center font-bold text-gray-600" colSpan={6}>
                                Cruise is empty
                            </td>
                        </tr>
                    ) : (
                        cruise.map((cruise, i) => (
                            <tr className="border-b border-gray-200" key={i}>
                                <td className="px-4 py-3 text-nowrap flex items-center justify-start gap-2">
                                    {cruise.status === "PENDING" ? (
                                        <button disabled className="cursor-not-allowed">
                                            <IconStar size={18} stroke={1.5} />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleFavorited(cruise.id, cruise.status === "FAVOURITED" ? "ACTIVED" : "FAVOURITED")}>
                                            {loading.stack === "favourited" && loading.idx === cruise.id ? (
                                                <IconLoader3 className="animate-spin" size={18} stroke={1.5} />
                                            ) : cruise.status === "FAVOURITED" ? (
                                                <IconStarFilled className="text-orange-600" size={18} stroke={1.5} />
                                            ) : (
                                                <IconStar size={18} stroke={1.5} />
                                            )}
                                        </button>
                                    )}
                                    <span>{cruise.title}</span>
                                </td>
                                <td className="px-4 py-3 text-nowrap">{cruise.departure}</td>
                                <td className="px-4 py-3 text-nowrap">{`${cruise.duration} days ${Number(cruise.duration) - 1} night`}</td>
                                <td className="px-4 py-3 text-nowrap">
                                    <span
                                        className={`${
                                            cruise.status === "ACTIVED"
                                                ? "bg-cyan-700"
                                                : cruise.status === "FAVOURITED"
                                                ? "bg-orange-700"
                                                : cruise.status === "DELETED"
                                                ? "bg-red-700"
                                                : "bg-gray-700"
                                        } text-white px-5 py-1 rounded-full text-[11px] uppercase font-bold`}
                                    >
                                        {cruise.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-nowrap">{formatDate(cruise.updatedAt)}</td>
                                <td className="px-4 py-3 text-nowrap">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/cruises/${cruise.id}`}
                                            className="px-3 py-1 text-xs bg-cyan-600 text-white rounded-md font-medium"
                                        >
                                            Info
                                        </Link>
                                        <button
                                            onClick={() => handleDeleted(cruise.id, "DELETED")}
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded-md font-medium"
                                            disabled={loading.stack === "DELETED" && loading.idx === cruise.id}
                                        >
                                            {loading.stack === "DELETED" && loading.idx === cruise.id ? "Loading..." : "Delete"}
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
