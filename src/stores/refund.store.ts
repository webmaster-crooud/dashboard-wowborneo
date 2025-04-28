import { atomWithStorage } from "jotai/utils";
import { IRefundRequest } from "~/types/refund";

export const refundBodyAtom = atomWithStorage<IRefundRequest>("refundBody", {
    amount: "",
    amountIDR: "",
    percent: 0,
    price: "",
    reason: "",
    refundMethod: "",
    bankName: "",
    bankNumber: "",
    bankOwner: "",
});
