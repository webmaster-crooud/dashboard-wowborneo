// import { dataCompany } from "@/constants/companies";
import { atom } from "jotai";
import React from "react";

export interface ErrorState {
    message: string;
    errors?: {
        field: string | undefined;
        message: string;
    }[];
}

export const errorAtom = atom<ErrorState>({
    message: "",
    errors: [],
});
export const setErrorAtom = atom(null, (get, set, error: ErrorState) => {
    set(errorAtom, error);
});

export const notificationAtom = atom<{ title: string; message: string | React.ReactNode }>({
    title: "",
    message: "",
});
export const setNotificationAtom = atom(null, (get, set, notification: { title: string; message: string | React.ReactNode }) => {
    set(notificationAtom, notification);
});

export const sidebarAtom = atom<boolean>(true);
