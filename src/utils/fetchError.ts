import React from "react";
import { ApiError } from "./ApiError";
import { SetStateAction } from "jotai";
import { ErrorState } from "~/stores";

export function fetchError(error: unknown, setError: React.Dispatch<SetStateAction<ErrorState>>) {
    if (error instanceof ApiError) {
        // Set error ke state global
        if (error.statusCode === 429) {
            // Tampilkan alert / toast
            setError({
                message: "Anda terlalu sering melakukan permintaan. Coba lagi setelah 15 menit.",
            });
            return;
        }
        setError({
            message: error.message,
            errors: error.errors.map((err) => ({
                field: err.field,
                message: err.message,
            })),
        });
    } else {
        // Handle unexpected errors
        setError({
            message: "An unexpected error occurred. Please try again.",
        });
    }
}
