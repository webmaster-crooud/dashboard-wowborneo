"use client";

import { useEffect } from "react";
import { useAtom, useSetAtom } from "jotai";
import { accountAtom, isLoadingAtom } from "~/stores/auth.store";
import authService from "~/services/auth.service";
import { ApiError } from "~/utils/ApiError";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [account, setAccount] = useAtom(accountAtom);
    const setIsLoading = useSetAtom(isLoadingAtom);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const response = await authService.getAccount();

                if (!response || !response.data) return null;
                setAccount(response.data);
            } catch (error) {
                if ((error as ApiError).statusCode === 401) {
                    try {
                        const { data: refreshTokenData } = await authService.refreshToken();
                        console.log("Refresh token successful:", refreshTokenData);

                        // Retry fetching account data with the new token
                        const response = await authService.getAccount();
                        if (!response) return null;
                        setAccount(response.data);
                    } catch {
                        setAccount({
                            email: "",
                            user: {
                                firstName: "",
                                lastName: "",
                            },
                            role: {
                                name: "member",
                            },
                        });
                        window.location.href = `${process.env.NEXT_PUBLIC_AUTH}/login`;
                    }
                } else {
                    setAccount({
                        email: "",
                        user: {
                            firstName: "",
                            lastName: "",
                        },
                        role: {
                            name: "member",
                        },
                    });
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (!account.email) {
            setIsLoading(false);
            initializeAuth();
        }
    }, [setAccount, account, setIsLoading]);

    return children;
};
