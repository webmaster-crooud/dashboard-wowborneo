/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/auth.service.ts

import { ApiSuccessResponse } from "~/types";
import { Account, RefreshTokenResponse } from "~/types/auth";
import { api } from "~/utils/api";
import { ApiError } from "~/utils/ApiError";

const authService = {
    async logout(): Promise<void> {
        try {
            await api.delete("/auth");
        } catch (error) {
            throw error;
        }
    },

    async refreshToken(): Promise<ApiSuccessResponse<RefreshTokenResponse>> {
        try {
            const { data } = await api.patch<ApiSuccessResponse<RefreshTokenResponse>>(
                "/auth",
                {},
                {
                    withCredentials: true,
                }
            );
            return data;
        } catch (error) {
            throw error;
        }
    },

    async getAccount(): Promise<ApiSuccessResponse<Account> | null> {
        try {
            const response = await api.get<ApiSuccessResponse<Account>>("/auth");
            if (!response) return null;
            return response.data;
        } catch (error) {
            console.error("Error in getAccount:", error);

            if ((error as any).response?.status === 401) {
                throw new ApiError("Access token expired", 401);
            } else {
                throw new ApiError("Failed to fetch account", (error as any).response?.status || 500);
            }
        }
    },
};

export default authService;
