"use client";
import { motion as m } from "framer-motion";
import { Card } from "../ui/Card";
import { InputForm } from "../ui/Form/Input.form";
import { SubmitButton } from "../ui/Button/Submit.button";
import { IconCheck, IconCloudUpload } from "@tabler/icons-react";
import React from "react";
import { SetStateAction, useSetAtom } from "jotai";
import { IAccount, IAccountRequestBody } from "~/types/account";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { ApiSuccessResponse } from "~/types";
import { errorAtom, notificationAtom } from "~/stores";

type propsUpdateProfile = {
    setEditing: React.Dispatch<SetStateAction<string>>;
    handleChangeInput: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    account: IAccount;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchAccount: () => Promise<void>;
};

export function UpdateProfile({ setEditing, handleChangeInput, account, setLoading, fetchAccount }: propsUpdateProfile) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const dataAccount: IAccountRequestBody = {
        firstName: account.firstName,
        lastName: account.lastName,
        phone: account.phone,
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Update Account" });

        try {
            await api.put<ApiSuccessResponse<IAccount>>(`${process.env.NEXT_PUBLIC_API}/account`, dataAccount, {
                withCredentials: true,
            });
            await fetchAccount();
            setNotification({
                title: "Successfully",
                message: (
                    <div className="flex items-center justify-start gap-5">
                        <IconCheck stroke={2} size={18} className="text-green-500" />
                        Update your profile is completed.
                    </div>
                ),
            });
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };
    return (
        <m.section
            key={"formUpdate"}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="min-h-screen p-5 w-8/12"
        >
            <Card
                title={
                    <>
                        Update Account
                        <button
                            className="px-5 py-2 text-sm font-semibold rounded-lg bg-red-500 text-white"
                            type="button"
                            onClick={() => setEditing("")}
                        >
                            Cancel
                        </button>
                    </>
                }
                classHeading="flex items-center justify-between gap-5"
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5 items-end">
                    <InputForm title="firstName" label="First Name" value={account.firstName} handleInputChange={handleChangeInput} type="text" />
                    <InputForm title="lastName" label="Last Name" value={account.lastName} handleInputChange={handleChangeInput} type="text" />
                    <InputForm title="phone" label="First Name" value={account.phone} handleInputChange={handleChangeInput} type="text" />
                    <SubmitButton title="Save" icon={<IconCloudUpload stroke={2} size={18} />} type="submit" />
                </form>
            </Card>
        </m.section>
    );
}
