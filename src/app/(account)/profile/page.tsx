"use client";

import { useSetAtom } from "jotai";
import React, { useCallback, useEffect, useState } from "react";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { errorAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IAccount, IChangePassword } from "~/types/account";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { AnimatePresence } from "framer-motion";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { HeaderProfile } from "~/components/profile/Header.profile";
import { ChangePasswordProfile } from "~/components/profile/ChangePassword.profile";
import { UpdateProfile } from "~/components/profile/update.profile";

export default function ProfilePage() {
    const [account, setAccount] = useState<IAccount>({
        id: "",
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        ip: "",
        role: "",
        userAgent: "",
        cover: "",
    });
    const [changePassword, setChangePassword] = useState<IChangePassword>({
        oldPassword: "",
        password: "",
        confirmPassword: "",
    });
    const setError = useSetAtom(errorAtom);
    const [editing, setEditing] = useState<string>("");
    const [loading, setLoading] = useState<{ stack: string; field: string }>({ stack: "", field: "" });

    const fetchAccount = useCallback(async () => {
        setLoading({ stack: "fetch", field: "Account" });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const { data } = await api.get<ApiSuccessResponse<IAccount>>(`${process.env.NEXT_PUBLIC_API}/account`, {
                withCredentials: true,
            });
            setAccount(data.data);
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    }, [setError]);

    useEffect(() => {
        fetchAccount();
    }, [fetchAccount]);

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
        setAccount((props) => ({
            ...props,
            [name]: value,
        }));
        setChangePassword((props) => ({
            ...props,
            [name]: value,
        }));
    };

    const dataBreadcrumb: Breadcrumb[] = [
        {
            title: "Dashboard",
            url: "/dashboard",
        },
        {
            title: "Profile",
            url: `/profile`,
        },
    ];

    if (loading.stack === "fetch") {
        return <LoaderForm key={"loaderFetchAccount"} loading={{ stack: "fetch", field: loading.field }} />;
    }
    if (loading.stack === "submit" || loading.stack === "upload") {
        return <LoaderForm key={"loaderSubmitAccount"} loading={{ stack: "submit", field: loading.field }} />;
    } else
        return (
            <>
                <HeaderProfile
                    fetchAccount={fetchAccount}
                    setLoading={setLoading}
                    account={account}
                    setEditing={setEditing}
                    dataBreadcrumb={dataBreadcrumb}
                    key={"header"}
                />
                <AnimatePresence mode="wait">
                    {editing === "update" && (
                        <UpdateProfile
                            key={"updateProfile"}
                            account={account}
                            handleChangeInput={handleChangeInput}
                            fetchAccount={fetchAccount}
                            setLoading={setLoading}
                            setEditing={setEditing}
                        />
                    )}
                    {editing === "changePassword" && (
                        <ChangePasswordProfile
                            key={"changePassword"}
                            changePassword={changePassword}
                            handleChangeInput={handleChangeInput}
                            fetchAccount={fetchAccount}
                            setLoading={setLoading}
                            setEditing={setEditing}
                            setChangePassword={setChangePassword}
                        />
                    )}
                </AnimatePresence>
            </>
        );
}
