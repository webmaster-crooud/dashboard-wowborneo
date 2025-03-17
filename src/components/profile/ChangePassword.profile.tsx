"use client";
import { motion as m } from "framer-motion";
import { Card } from "../ui/Card";
import { SetStateAction, useSetAtom } from "jotai";
import { InputForm } from "../ui/Form/Input.form";
import { IChangePassword } from "~/types/account";
import { SubmitButton } from "../ui/Button/Submit.button";
import { IconCheck, IconCloudUpload } from "@tabler/icons-react";
import { api } from "~/utils/api";
import { ApiSuccessResponse } from "~/types";
import { fetchError } from "~/utils/fetchError";
import { errorAtom, notificationAtom } from "~/stores";

type propsChangePassword = {
    setEditing: React.Dispatch<SetStateAction<string>>;
    handleChangeInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchAccount: () => Promise<void>;
    changePassword: IChangePassword;
    setChangePassword: React.Dispatch<SetStateAction<IChangePassword>>;
};
export function ChangePasswordProfile({
    setEditing,
    handleChangeInput,
    fetchAccount,
    setLoading,
    changePassword,
    setChangePassword,
}: propsChangePassword) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Update Account" });

        try {
            await api.patch<ApiSuccessResponse>(`${process.env.NEXT_PUBLIC_API}/account`, changePassword, {
                withCredentials: true,
            });
            await fetchAccount();
            setNotification({
                title: "Change Password",
                message: (
                    <div className="flex items-center justify-start gap-5">
                        <IconCheck stroke={2} size={18} className="text-green-500" />
                        Successfully to change your password
                    </div>
                ),
            });
            setChangePassword({
                confirmPassword: "",
                oldPassword: "",
                password: "",
            });
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };
    return (
        <m.section
            key={"changePassword"}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="min-h-screen p-5 w-8/12"
        >
            <Card
                title={
                    <>
                        Change Password
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
                    <InputForm
                        title="oldPassword"
                        label="Old Password"
                        value={changePassword.oldPassword}
                        handleInputChange={handleChangeInput}
                        type="password"
                    />
                    <InputForm
                        title="password"
                        label="New Password"
                        value={changePassword.password}
                        handleInputChange={handleChangeInput}
                        type="password"
                    />
                    <InputForm
                        title="confirmPassword"
                        label="Confirmation Password"
                        value={changePassword.confirmPassword}
                        handleInputChange={handleChangeInput}
                        type="password"
                    />
                    <SubmitButton title="Save" icon={<IconCloudUpload stroke={2} size={18} />} type="submit" />
                </form>
            </Card>
        </m.section>
    );
}
