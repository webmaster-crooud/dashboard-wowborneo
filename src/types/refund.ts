export type REFUND_STATUS = "PENDING" | "APPROVED" | "REJECTED" | "PROCESSED" | "SUCCESS";
export interface ICalculateRefundAmountResponse {
    amount: string | number;
    amountIDR: string | number;
    percent: number;
    days: number;
}
export interface IRefundRequest {
    amount: string | number;
    amountIDR: string | number;
    percent: number;
    price: string | number;
    reason: string;
    refundMethod: string;
    bankName: string;
    bankNumber: string;
    bankOwner: string;
}

export interface IRefundBookingResponse {
    id: string;
    amount: string | number;
    amountIDR: string | number;
    percent: number;
    refundMethod: string;
    status: REFUND_STATUS;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export interface IAdminRefundDetailResponse {
    id: string;
    bookingId: string;
    amount: string | string;
    amountIDR: string | string;
    percent: number;
    refundMethod: string;
    status: REFUND_STATUS;
    price: string | string;
    reason: string | null;
    bankName: string;
    bankNumber: string;
    bankOwner: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    processedAt: string | Date | null;
    processedBy: string | null;
}
