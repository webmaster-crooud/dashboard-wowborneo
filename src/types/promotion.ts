import { STATUS } from ".";

export type DISCOUNT_TYPE = "PERCENT" | "CURRENCY";
export interface IPromotionRequest {
    name: string;
    code: string;
    discountType: DISCOUNT_TYPE;
    discountValue: string | number;
    startDate: string | Date;
    endDate: string | Date;
}

export interface IPromotionResponse {
    id: string | number;
    name: string;
    code: string;
    discountType: DISCOUNT_TYPE;
    discountValue: string | number;
    startDate: string | Date;
    endDate: string | Date;
    status: STATUS;
    createdAt: string | Date;
    updatedAt: string | Date;
}
