"use client";
import { useSetAtom } from "jotai";
import { useCallback, useEffect, useState } from "react";
import { InputForm } from "~/components/ui/Form/Input.form";
import { SelectDataInterface, SelectForm } from "~/components/ui/Form/Select.form";
import { errorAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IAccount } from "~/types/account";
import { AGENT_TYPE, IAgentRequest } from "~/types/agent";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";

// Modal component
interface AgentModalProps {
    loading: boolean;
    onCreate: (agent: IAgentRequest) => Promise<void>;
    onClose: () => void;
}

const selectType: SelectDataInterface[] = [
    {
        name: "Local (Indonesia)",
        value: "LOCAL",
    },
    {
        name: "International",
        value: "INTER",
    },
    {
        name: "DMC",
        value: "DMC",
    },
];
export function AgentModal({ loading, onCreate, onClose }: AgentModalProps) {
    const [form, setForm] = useState<IAgentRequest>({
        accountId: "",
        type: "LOCAL",
        commission: 0,
        commissionLocal: 0,
    });

    const [members, setMembers] = useState<IAccount[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const setError = useSetAtom(errorAtom);

    // Fetch members on search term change
    const fetchMembers = useCallback(
        async (search?: string) => {
            try {
                const { data } = await api.get<ApiSuccessResponse<IAccount[]>>(`/admin/member?search=${search || ""}`, { withCredentials: true });
                setMembers(data.data);
            } catch (err) {
                fetchError(err, setError);
            }
        },
        [setError]
    );
    useEffect(() => {
        const timeout = setTimeout(() => fetchMembers(searchTerm), 300);
        return () => clearTimeout(timeout);
    }, [searchTerm, fetchMembers]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onCreate(form);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start pt-20 justify-center">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h3 className="text-xl font-semibold mb-4">Add Agent</h3>
                <form onSubmit={submit} className="space-y-4">
                    {/* <InputForm
                        type="text"
                        value={form.accountId}
                        handleInputChange={(e) => setForm({ ...form, accountId: e.target.value })}
                        isRequired
                        title="AccountId"
                        className="mt-1 block w-full border-gray-300 rounded-md"
                    /> */}
                    <div>
                        <label htmlFor="account-search" className="block text-sm font-medium">
                            Search Account by Email
                        </label>
                        <input
                            id="account-search"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="mt-1 block w-full border-gray-300 text-sm px-3 py-2 rounded-md"
                            placeholder="Type email to search..."
                        />
                        {members.length > 0 && (
                            <ul className="border bg-gray-50 rounded-md mt-1 max-h-40 overflow-auto">
                                {members.map((m) => (
                                    <li
                                        key={m.email}
                                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setForm({
                                                ...form,
                                                accountId: m.id || m.email,
                                            });
                                            setSearchTerm(m.email);
                                            setMembers([]);
                                        }}
                                    >
                                        {m.email} - {m.firstName} {m.lastName}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Display selected accountId */}
                    {form.accountId && <p className="text-sm">Selected: ({form.accountId})</p>}

                    <SelectForm
                        onChange={(e) => setForm({ ...form, type: e.target.value as AGENT_TYPE })}
                        title="Type"
                        value={form.type}
                        data={selectType}
                        label="Type"
                        className="mt-1 block w-full border-gray-300 rounded-md"
                    />

                    <InputForm
                        type="number"
                        value={form.commission}
                        handleInputChange={(e) => setForm({ ...form, commission: parseInt(e.target.value) })}
                        isRequired
                        title="commision"
                        label="Commision (%)"
                        className="mt-1 block w-full border-gray-300 rounded-md"
                    />
                    <InputForm
                        type="number"
                        value={form.commissionLocal}
                        handleInputChange={(e) => setForm({ ...form, commissionLocal: parseInt(e.target.value) })}
                        isRequired
                        title="commisionLocal"
                        label="Commision Local (Indonesia) (%)"
                        className="mt-1 block w-full border-gray-300 rounded-md"
                    />
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
