import { TYPECABIN } from ".";

export type BOOKING_STATUS = "PENDING" | "CONFIRMED" | "DOWNPAYMENT" | "CANCELLED" | "COMPLETED" | "CHECKIN" | "DONE";
export type PAYMENT_STATUS = "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";

export interface IMemberBookingListResponse {
    id: string;
    bookingStatus: BOOKING_STATUS;
    paymentStatus: PAYMENT_STATUS;
    paymentType: "Full Payment" | "Down Payment" | string;
    cruiseTitle: string; // title cruise
    boatName: string; // title boat
    cabinName: string;
    finalPrice: string | number;
    adults: number;
    children: number;
    schedule: {
        departureAt: string | Date;
        arrivalAt: string | Date;
        departure: string;
    };
    createdAt: string | Date;
}

export interface IMemberBookingDetailResponse {
    id: string;
    email: string;
    bookingStatus: BOOKING_STATUS;
    paymentStatus: PAYMENT_STATUS;
    paymentType: "Full Payment" | "Down Payment" | string | null;
    cruiseTitle: string; // title cruise
    boatName: string; // title boat
    cabinName: string;
    amountPayment: string | number;
    amountPaymentIDR: string | number;
    balancePayment: string | number;
    balancePaymentIDR: string | number;
    subTotalPrice: string | number;
    discount: string | number;
    finalPrice: string | number;
    createdAt: Date | string;
    updatedAt: Date | string;
    paidAt: Date | string | null;
    confirmedAt: Date | string | null;
    addons: Array<{
        title: string;
        qty: number;
        price: string | number;
        totalPrice: string | number;
    }>;
    guests: Array<{
        firstName: string;
        lastName: string | null;
        children: string;
        email: string;
        phone: string;
        identityNumber: string;
        country: string;
        document: string | null;
        price: string | number;
    }>;
    transactions: Array<{
        id: string;
        email: string;
        amount: string | number;
        amountIDR: string | number;
        status: PAYMENT_STATUS;
        notes: string | null;
        createdAt: string | Date;
        updatedAt: string | Date;
    }>;
}

export interface IRepaymentRequest {
    email: string;
    bookingId: string;
    amountPayment: string | number;
}

export interface IAdminBookingListResponse {
    id: string;
    email: string;
    bookingStatus: BOOKING_STATUS;
    paymentStatus: PAYMENT_STATUS;
    paymentType: "Full Payment" | "Down Payment" | string;
    finalPrice: string | number;
    adults: number;
    children: number;
    schedule: {
        departureAt: string | Date;
        arrivalAt: string | Date;
    };
    cruise: {
        id: string;
        title: string;
        departure: string;
    };
    boat: {
        id: string;
        name: string;
    };
    cabin: {
        name: string;
        type: TYPECABIN;
    };
}
export interface IAdminBookingListResponse {
    id: string;
    email: string;
    bookingStatus: BOOKING_STATUS;
    paymentStatus: PAYMENT_STATUS;
    paymentType: "Full Payment" | "Down Payment" | string;
    finalPrice: string | number;
    adults: number;
    children: number;
    schedule: {
        departureAt: string | Date;
        arrivalAt: string | Date;
    };
    cruise: {
        id: string;
        title: string;
        departure: string;
    };
    boat: {
        id: string;
        name: string;
    };
    cabin: {
        name: string;
        type: TYPECABIN;
    };
}
