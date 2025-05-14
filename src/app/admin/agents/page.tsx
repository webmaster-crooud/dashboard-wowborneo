"use client";

import { useMemo, useState } from "react";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { useAgents } from "~/hooks/useAgent";
import { AgentTable } from "~/components/admin/agent/table.agent";
import { AgentModal } from "~/components/admin/agent/modal.agent";

const dataBreadcrumb: Breadcrumb[] = [
    { title: "Dashboard", url: "/admin" },
    { title: "Agents", url: "/admin/agent" },
];

export default function AgentListPage() {
    const { agents, loading, createAgent, setLoading, fetchAgents } = useAgents();
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState<{ stack: string; id?: string }>({ stack: "" });

    const filteredAgents = useMemo(
        () => agents.filter((a) => [a.accountId, a.name, a.type].some((field) => field.toString().toLowerCase().includes(search.toLowerCase()))),
        [agents, search]
    );

    if (loading.fetch) {
        return <LoaderForm key="loaderFetchAgents" loading={{ stack: "fetch", field: "agents" }} />;
    }

    return (
        <>
            <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
            <section className="min-h-screen p-5 flex flex-col gap-y-5">
                <div className="flex justify-end">
                    <button
                        onClick={() => setIsModalOpen({ stack: "add" })}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Add Agent
                    </button>
                </div>

                <AgentTable
                    agents={filteredAgents}
                    search={search}
                    setSearch={setSearch}
                    loading={loading}
                    setLoading={setLoading}
                    fetchAgents={fetchAgents}
                    key={"agentTable"}
                />

                {isModalOpen.stack === "add" && (
                    <AgentModal
                        loading={loading.create}
                        onCreate={async (agent) => {
                            await createAgent(agent);
                            setIsModalOpen({ stack: "", id: "" });
                        }}
                        onClose={() => setIsModalOpen({ stack: "", id: "" })}
                    />
                )}
            </section>
        </>
    );
}
