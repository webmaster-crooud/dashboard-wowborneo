export type AGENT_TYPE = "LOCAL" | "INTER" | "DMC";
export interface IAgentResponse {
    id?: string;
    accountId: string;
    name: string;
    type: AGENT_TYPE;
    commission: number;
    commissionLocal: number;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface IAgentRequest {
    accountId: string;
    type: AGENT_TYPE;
    commission: number;
    commissionLocal: number;
}
