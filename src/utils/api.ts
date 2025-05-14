/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from "axios";
import authService from "~/services/auth.service";
import { ApiErrorResponse } from "~/types";
import { ApiError } from "./ApiError";

const BASE_URL = process.env.NEXT_PUBLIC_API; // Sesuaikan dengan base URL backend Anda

// Extend Axios request config untuk menambahkan properti _retry
declare module "axios" {
    export interface InternalAxiosRequestConfig {
        _retry?: boolean;
    }
}

// Buat instance axios
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Sertakan cookie untuk session management
});

// Interceptor untuk menambahkan CSRF token ke setiap request
let csrfToken: string | null = null;

api.interceptors.request.use(async (config) => {
    if (!csrfToken) {
        const csrfResponse = await axios.get<{ csrfToken: string }>(`${BASE_URL}/csrf-token`, {
            withCredentials: true,
        });
        csrfToken = csrfResponse.data.csrfToken;
    }
    config.headers["X-CSRF-Token"] = csrfToken;
    return config;
});

// Queue untuk request yang gagal karena token expired
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error?: Error, accessToken?: string) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(accessToken);
        }
    });
    failedQueue = [];
};

// Interceptor response untuk menangani error dan refresh token
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorResponse>) => {
        const originalRequest = error.config;

        // Pastikan originalRequest tidak undefined
        if (!originalRequest) {
            console.error("Original request is undefined");
            return Promise.reject(new Error("Original request is undefined"));
        }

        // Handle CSRF token errors
        if (error.response?.status === 403 && error.response.data.message === "invalid csrf token") {
            try {
                // Refresh CSRF token
                const csrfResponse = await axios.get<{ csrfToken: string }>(`${BASE_URL}/csrf-token`, {
                    withCredentials: true,
                });
                csrfToken = csrfResponse.data.csrfToken;

                // Retry the original request with the new CSRF token
                originalRequest.headers["X-CSRF-Token"] = csrfToken;
                return api(originalRequest);
            } catch (csrfError) {
                console.error("Failed to refresh CSRF token:", csrfError);
                return Promise.reject(csrfError);
            }
        }

        // Handle 401 Unauthorized errors
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((accessToken) => {
                        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
                        return api(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await authService.refreshToken();
                api.defaults.headers.common["Authorization"] = `Bearer ${data.accessToken}`;
                originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
                processQueue(undefined, data.accessToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as Error);
                // window.location.href = `${process.env.NEXT_PUBLIC_AUTH}`;
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response) {
            const { data, status } = error.response;
            if (data.errors && data.errors.length > 0) {
                return Promise.reject(new ApiError(data.message, status, data.errors));
            } else {
                return Promise.reject(new ApiError(data.message, status));
            }
        } else {
            return Promise.reject(new ApiError("Network Error", 500));
        }
    }
);

export { api };
