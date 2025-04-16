"use client";
import React, { useCallback, useEffect, useState } from "react";
import { formatDate } from "~/lib/moment";

import { fetchError } from "~/utils/fetchError";
import { useSetAtom } from "jotai";
import { errorAtom, notificationAtom } from "~/stores";
import { api } from "~/utils/api";
import { ApiSuccessResponse, STATUS } from "~/types";
import { SearchTable } from "~/components/ui/Sarch.table";
import { IAccount } from "~/types/account";

import { selectRoleByAdmin, selectStatus } from "~/constants/Status";
import { IconLoader3 } from "@tabler/icons-react";
import { useAuth } from "~/hooks/useAuth";

export function MemberTable() {
    const { account } = useAuth();
    const [member, setMember] = useState<IAccount[]>([]);
    const [search, setSearch] = useState<string | undefined>(undefined);
    const [loading, setLoading] = useState<{ stack: string; idx: string }>({ stack: "", idx: "" });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const fetchAccount = useCallback(async (search?: string) => {
        const { data } = await api.get<ApiSuccessResponse<IAccount[]>>(`${process.env.NEXT_PUBLIC_API}/admin/member?search=${search || ""}`, {
            withCredentials: true,
        });
        setMember(data.data);
    }, []);

    useEffect(() => {
        fetchAccount();
    }, [fetchAccount]);

    const handleSearchAccount = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        fetchAccount(search);
    };

    const handleAction = async (accountId: string, status: STATUS) => {
        setLoading({ stack: "action", idx: accountId });
        try {
            const { data } = await api.patch<ApiSuccessResponse<{ message: string }>>(
                `${process.env.NEXT_PUBLIC_API}/admin/member/${accountId}?action=${status}`
            );

            setNotification({ title: "Successfully", message: data.data.message });
            fetchAccount();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", idx: "" });
        }
    };

    const handleRole = async (accountId: string, role: number) => {
        console.log(role);
        setLoading({ stack: "action", idx: accountId });
        try {
            await api.patch<ApiSuccessResponse<{ message: string }>>(`${process.env.NEXT_PUBLIC_API}/admin/member/role/${accountId}?roleId=${role}`);

            setNotification({ title: "Change Role", message: "Successfully to change role" });
            fetchAccount();
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
                <SearchTable handleSearch={handleSearchAccount} search={search} setSearch={setSearch} />
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse overflow-x-scroll">
                {/* Table Head */}
                <thead>
                    <tr className="border-b border-gray-300 bg-gray-50 uppercase text-sm">
                        <th className="px-4 py-2 font-bold">Name</th>
                        <th className="px-4 py-2 font-bold">EMail</th>
                        <th className="px-4 py-2 font-bold">Role</th>
                        <th className="px-4 py-2 font-bold">Status</th>
                        <th className="px-4 py-2 font-bold">Date</th>
                        <th className="px-4 py-2 font-bold">Setting</th>
                    </tr>
                </thead>

                {/* Table Body */}
                <tbody className="overflow-x-scroll">
                    {member.length === 0 ? (
                        <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-nowrap text-center font-bold text-gray-600" colSpan={6}>
                                Member is empty
                            </td>
                        </tr>
                    ) : (
                        member.map((acc, i) => (
                            <tr className="border-b border-gray-200" key={i}>
                                <td className="px-4 py-3 flex items-center justify-start gap-2">
                                    <span>{acc.firstName + " " + acc.lastName}</span>
                                </td>
                                <td className="px-4 py-3">{acc.email}</td>
                                <td className="px-4 py-3 text-nowrap">
                                    {loading.stack === "action" && loading.idx === acc.id ? (
                                        <IconLoader3 className="animate-spin" size={18} stroke={2} />
                                    ) : (
                                        <select
                                            name="role"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleRole(acc.id || "", Number(e.target.value))}
                                            className="px-3 py-1 text-xs bg-gray-50 rounded-lg border border-gray-400"
                                            value={acc.roleId}
                                        >
                                            <option value="">Choose One</option>
                                            {account.role.name === "admin"
                                                ? selectRoleByAdmin.map((data, i) => (
                                                      <option value={data.value} key={i}>
                                                          {data.name}
                                                      </option>
                                                  ))
                                                : selectRoleByAdmin.map((data, i) => (
                                                      <option value={data.value} key={i}>
                                                          {data.name}
                                                      </option>
                                                  ))}
                                        </select>
                                    )}
                                </td>

                                <td className="px-4 py-3 text-nowrap">
                                    {loading.stack === "action" && loading.idx === acc.id ? (
                                        <IconLoader3 className="animate-spin" size={18} stroke={2} />
                                    ) : (
                                        <span
                                            className={`${
                                                acc.status === "ACTIVED"
                                                    ? "bg-cyan-700"
                                                    : acc.status === "FAVOURITED"
                                                    ? "bg-orange-700"
                                                    : acc.status === "DELETED"
                                                    ? "bg-red-700"
                                                    : "bg-gray-700"
                                            } text-white px-5 py-1 rounded-full text-[11px] uppercase font-bold`}
                                        >
                                            {acc.status}
                                        </span>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-nowrap">{formatDate(acc.updatedAt)}</td>
                                <td className="px-4 py-3 text-nowrap">
                                    <select
                                        name="status"
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleAction(acc.id || "", e.target.value as STATUS)}
                                        className="px-3 py-1 text-xs bg-gray-50 rounded-lg border border-gray-400"
                                        value={acc.status}
                                    >
                                        <option value="PENDING">PENDING</option>
                                        {selectStatus.map((data, i) => (
                                            <option value={data.value} key={i}>
                                                {data.name}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

                {/* Table Footer (untuk pagination/numbering) */}
                <tfoot className="bg-gray-200 max-w-screen-sm">
                    <tr className="max-w-screen-sm">
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
