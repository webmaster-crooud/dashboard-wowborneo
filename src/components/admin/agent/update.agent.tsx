"use client";

import { useState } from "react";
import { InputForm } from "~/components/ui/Form/Input.form";
import { SelectDataInterface, SelectForm } from "~/components/ui/Form/Select.form";

import { AGENT_TYPE, IAgentRequest, IAgentResponse } from "~/types/agent";

// Modal component
interface UpdateAgentModalProps {
    id: string;
    data: IAgentResponse;
    loading: boolean;
    onUpdate: (id: string, agent: IAgentRequest) => Promise<void>;
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
export function UpdateAgentModal({ loading, onUpdate, onClose, id, data }: UpdateAgentModalProps) {
    const [form, setForm] = useState<IAgentRequest>({
        accountId: data.accountId,
        type: data.type,
        commission: data.commission,
        commissionLocal: data.commissionLocal,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(id, form);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start pt-20 justify-center">
            <div className="bg-white rounded-lg w-full max-w-md p-6">
                <h3 className="text-xl font-semibold mb-4">Update Agent {data.name}</h3>
                <form onSubmit={submit} className="space-y-4">
                    {/* <InputForm
                        type="text"
                        value={form.accountId}
                        handleInputChange={(e) => setForm({ ...form, accountId: e.target.value })}
                        isRequired
                        title="AccountId"
                        className="mt-1 block w-full border-gray-300 rounded-md"
                    /> */}

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
