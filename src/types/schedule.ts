import { STATUS, TYPECABIN } from ".";

export interface IScheduleResponse {
    id: string;
    departureAt: string | Date;
    arrivalAt: string | Date;
    cruiseTitle: string;
    boatTitle: string;
    departure: string;
    status: STATUS; // Bisa diganti dengan enum jika sudah ada
    min_price: number;
    availableCabin: number;
    bookedCabin: number;
    cover: string | null;
}
export interface IDetailScheduleResponse {
    id: string;
    departureAt: string | Date;
    arrivalAt: string | Date;
    status: STATUS;
    cruise: {
        id: string;
        title: string;
        cover: string | null;
        departure: string;
        description: string;
    };
    boat: {
        name: string;
        id: string;
        deck: {
            cover: string | null;
        };
        cabins: Array<{ id: string | number; name: string; type: TYPECABIN; maxCapacity: number; description: string | null; price: string }>;
    };
}
