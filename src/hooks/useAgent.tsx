import { useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { errorAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IAgentRequest, IAgentResponse } from "~/types/agent";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";

export function useAgents() {
    const setError = useSetAtom(errorAtom);
    const [agents, setAgents] = useState<IAgentResponse[]>([]);
    const [loading, setLoading] = useState({ fetch: false, create: false });

    const fetchAgents = useCallback(async () => {
        setLoading((l) => ({ ...l, fetch: true }));
        try {
            const { data } = await api.get<ApiSuccessResponse<IAgentResponse[]>>("/admin/agent", { withCredentials: true });
            setAgents(data.data);
        } catch (err) {
            fetchError(err, setError);
        } finally {
            setLoading((l) => ({ ...l, fetch: false }));
        }
    }, [setError]);

    const createAgent = useCallback(
        async (agent: IAgentRequest) => {
            setLoading((l) => ({ ...l, create: true }));
            try {
                await api.post<ApiSuccessResponse<IAgentResponse>>("/admin/agent", agent, { withCredentials: true });
                await fetchAgents();
            } catch (err) {
                fetchError(err, setError);
            } finally {
                setLoading((l) => ({ ...l, create: false }));
            }
        },
        [fetchAgents, setError]
    );

    useEffect(() => {
        fetchAgents();
    }, [fetchAgents]);

    return { agents, loading, fetchAgents, createAgent, setLoading };
}
