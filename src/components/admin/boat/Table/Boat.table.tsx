"use client";
import React, { useCallback, useEffect, useState } from "react";
import { SearchTable } from "../../../ui/Sarch.table";
import { IconLoader3, IconStar, IconStarFilled } from "@tabler/icons-react";
import { formatDate } from "~/lib/moment";
import Link from "next/link";
import { fetchError } from "~/utils/fetchError";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "~/stores";
import { api } from "~/utils/api";
import { ApiSuccessResponse, STATUS } from "~/types";
import { IListBoatResponse } from "~/types/boat";

export function BoatTable() {
    const [boats, setBoats] = useState<IListBoatResponse[]>([]);
    const [search, setSearch] = useState<string>("");
    const [loading, setLoading] = useState<{ stack: string; idx: string }>({ stack: "", idx: "" });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const fetchBoats = useCallback(async (search: string = "", filter: boolean = false, fav: boolean = false, deleted: boolean = false) => {
        const { data } = await api.get<ApiSuccessResponse<IListBoatResponse[]>>(
            `${process.env.NEXT_PUBLIC_API}/admin/boat?search=${search}&filter=${filter}&favourite=${fav}&deleted=${deleted}`,
            {
                withCredentials: true,
            }
        );
        setBoats(data.data);
    }, []);

    useEffect(() => {
        fetchBoats();
    }, [fetchBoats]);

    const handleSearchBoats = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchBoats(search);
    };

    const handleAction = async (boatId: string, status: STATUS) => {
        setLoading({ stack: "action", idx: boatId });
        try {
            const { data } = await api.patch<ApiSuccessResponse<{ message: string }>>(
                `${process.env.NEXT_PUBLIC_API}/admin/boat/${boatId}?action=${status}`
            );

            setNotification({ title: "Successfully", message: data.data.message });
            fetchBoats();
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
                <h2 className="text-lg font-bold w-full">Boat Data</h2>
                <SearchTable handleSearch={handleSearchBoats} search={search} setSearch={setSearch} />
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse">
                {/* Table Head */}
                <thead>
                    <tr className="border-b border-gray-300 bg-gray-50 uppercase text-sm">
                        <th className="px-4 py-2 font-bold">Name</th>
                        <th className="px-4 py-2 font-bold">Slug</th>
                        <th className="px-4 py-2 font-bold">Status</th>
                        <th className="px-4 py-2 font-bold">Date</th>
                        <th className="px-4 py-2 font-bold">Setting</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                    {boats.length === 0 ? (
                        <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-nowrap text-center font-bold text-gray-600" colSpan={6}>
                                Boats is empty
                            </td>
                        </tr>
                    ) : (
                        boats.map((boat, i) => (
                            <tr className="border-b border-gray-200" key={i}>
                                <td className="px-4 py-3 text-nowrap flex items-center justify-start gap-2">
                                    {boat.status === "PENDING" ? (
                                        <button disabled className="cursor-not-allowed">
                                            <IconStar size={18} stroke={1.5} />
                                        </button>
                                    ) : (
                                        <button onClick={() => handleAction(boat.id, boat.status === "FAVOURITED" ? "ACTIVED" : "FAVOURITED")}>
                                            {loading.stack === "favourited" && loading.idx === boat.id ? (
                                                <IconLoader3 className="animate-spin" size={18} stroke={1.5} />
                                            ) : boat.status === "FAVOURITED" ? (
                                                <IconStarFilled className="text-orange-600" size={18} stroke={1.5} />
                                            ) : (
                                                <IconStar size={18} stroke={1.5} />
                                            )}
                                        </button>
                                    )}
                                    <span>{boat.name}</span>
                                </td>
                                <td className="px-4 py-3 text-nowrap">{boat.slug}</td>

                                <td className="px-4 py-3 text-nowrap">
                                    <span
                                        className={`${
                                            boat.status === "ACTIVED"
                                                ? "bg-cyan-700"
                                                : boat.status === "FAVOURITED"
                                                ? "bg-orange-700"
                                                : boat.status === "DELETED"
                                                ? "bg-red-700"
                                                : "bg-gray-700"
                                        } text-white px-5 py-1 rounded-full text-[11px] uppercase font-bold`}
                                    >
                                        {boat.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-nowrap">{formatDate(boat.updatedAt)}</td>
                                <td className="px-4 py-3 text-nowrap">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/boats/${boat.id}`}
                                            className="px-3 py-1 text-xs bg-cyan-600 text-white rounded-md font-medium"
                                        >
                                            Info
                                        </Link>
                                        <button
                                            onClick={() => handleAction(boat.id, "DELETED")}
                                            className="px-3 py-1 text-xs bg-red-600 text-white rounded-md font-medium"
                                            disabled={loading.stack === "DELETED" && loading.idx === boat.id}
                                        >
                                            {loading.stack === "DELETED" && loading.idx === boat.id ? "Loading..." : "Delete"}
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
