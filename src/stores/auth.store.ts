// src/stores/auth.store.ts
import { atom } from "jotai";
import { Account } from "~/types/auth";

export const accountAtom = atom<Account>({
    email: "",
    user: {
        firstName: "",
        lastName: "",
    },
    role: {
        name: "member",
    },
});
export const isLoadingAtom = atom<boolean>(true);
