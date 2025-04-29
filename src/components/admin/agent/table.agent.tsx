"use client";
import { SetStateAction, useSetAtom } from "jotai";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { SearchTable } from "~/components/ui/Sarch.table";
import { IAgentRequest, IAgentResponse } from "~/types/agent";
import { UpdateAgentModal } from "./update.agent";
import { useAgents } from "~/hooks/useAgent";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";
import { ApiSuccessResponse } from "~/types";
import { fetchError } from "~/utils/fetchError";
import { errorAtom } from "~/stores";

interface AgentTableProps {
    agents: IAgentResponse[];
    search: string;
    setSearch: React.Dispatch<SetStateAction<string>>;
    loading: { fetch: boolean; create: boolean };
    setLoading: React.Dispatch<SetStateAction<{ fetch: boolean; create: boolean }>>;
    fetchAgents: () => Promise<void>;
}
export function AgentTable({ agents, search, setSearch, loading, setLoading, fetchAgents }: AgentTableProps) {
    const [modalUpdate, setModalUpdate] = useState<string>("");
    const setError = useSetAtom(errorAtom);
    const updateAgent = useCallback(
        async (id: string, agent: IAgentRequest) => {
            setLoading((l) => ({ ...l, create: true }));
            try {
                await api.put<ApiSuccessResponse<IAgentResponse>>(`${process.env.NEXT_PUBLIC_API}/admin/agent/${id}`, agent, {
                    withCredentials: true,
                });
                await fetchAgents();
            } catch (err) {
                fetchError(err, setError);
            } finally {
                setLoading((l) => ({ ...l, create: false }));
            }
        },
        [fetchAgents, setError]
    );
    return (
        <div className="rounded-md border border-gray-300 shadow-sm">
            <div className="flex items-center p-4 justify-between bg-gray-50">
                <h2 className="text-lg font-bold">Agent List</h2>
                <SearchTable search={search} setSearch={setSearch} />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-max w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b bg-gray-50 uppercase text-sm" key={"2301231"}>
                            <th className="px-4 py-2">Account ID</th>
                            <th className="px-4 py-2">Name</th>
                            <th className="px-4 py-2">Type</th>
                            <th className="px-4 py-2">Commission (%)</th>
                            <th className="px-4 py-2">Local Commission (%)</th>
                            <th className="px-4 py-2">Setting</th>
                        </tr>
                    </thead>
                    <tbody key={"dasfopi"}>
                        {agents.length === 0 ? (
                            <tr key={2521}>
                                <td colSpan={6} className="px-4 py-3 text-center font-semibold text-gray-600">
                                    No agents found
                                </td>
                            </tr>
                        ) : (
                            agents.map((agent, idx) => (
                                <React.Fragment key={idx}>
                                    <tr className="border-b">
                                        <td className="px-4 py-3 uppercase">{agent.accountId}</td>
                                        <td className="px-4 py-3">{agent.name}</td>
                                        <td className="px-4 py-3 uppercase">{agent.type}</td>
                                        <td className="px-4 py-3">{agent.commission}%</td>
                                        <td className="px-4 py-3">{agent.commissionLocal}%</td>
                                        <td className="px-4 py-3">
                                            <button
                                                type="button"
                                                onClick={() => setModalUpdate(agent.id || "")}
                                                className="px-3 py-1 text-xs bg-cyan-600 text-white rounded-md"
                                            >
                                                Info
                                            </button>
                                            {modalUpdate === agent.id && (
                                                <UpdateAgentModal
                                                    key={idx}
                                                    id={agent.id || ""}
                                                    data={agent}
                                                    loading={loading.create}
                                                    onUpdate={async (id, agent) => {
                                                        await updateAgent(id, agent);
                                                        setModalUpdate("");
                                                    }}
                                                    onClose={() => setModalUpdate("")}
                                                />
                                            )}
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))
                        )}
                    </tbody>
                    <tfoot className="bg-gray-200">
                        <tr key={"asdfasdfj"}>
                            <td colSpan={6} className="px-4 py-2 text-sm text-gray-500">
                                Showing 1-{agents.length} of {agents.length}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
