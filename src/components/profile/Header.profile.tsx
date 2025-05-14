"use client";
import Image from "next/image";
import { Breadcrumb } from "../ui/Breadcrumb";
import { SubmitButton } from "../ui/Button/Submit.button";
import { IconCheck, IconCloudUpload, IconPasswordUser, IconUserEdit, IconX } from "@tabler/icons-react";
import { IAccount } from "~/types/account";
import React, { useState } from "react";
import { SetStateAction, useSetAtom } from "jotai";
import { CoverUploader } from "../ui/Form/File.form";
import { motion as m } from "framer-motion";
import { fetchError } from "~/utils/fetchError";
import { errorAtom, notificationAtom } from "~/stores";
import { api } from "~/utils/api";
import { ApiSuccessResponse } from "~/types";
import { deleteCoverImage, getCoverImage } from "~/lib/idb";

type propsHeaderProfile = {
    dataBreadcrumb: Array<Breadcrumb>;
    account: IAccount;
    setEditing: React.Dispatch<SetStateAction<string>>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchAccount: () => Promise<void>;
};

export function HeaderProfile({ dataBreadcrumb, account, setLoading, setEditing, fetchAccount }: propsHeaderProfile) {
    const [modal, setModal] = useState<string>("");
    const [isHovered, setIsHovered] = useState(false);
    const childVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    };

    return (
        <>
            <header className="bg-gray-50 pt-10 pb-5 px-8 shadow relative z-10">
                <Breadcrumb data={dataBreadcrumb} />
                <div className="flex justify-between gap-10">
                    <div className="flex flex-col w-full gap-y-2">
                        <div className="w-full grid grid-cols-1 gap-5">
                            <h5 className="text-xl font-semibold leading-10">{account.firstName + " " + account.lastName}</h5>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-5">
                            <h5>Unique Code:</h5>
                            <p className="font-semibold">{account.id}</p>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-5">
                            <h5>Email:</h5>
                            <p className="font-semibold">{account.email}</p>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-5">
                            <h5>Phone:</h5>
                            <p className="font-semibold">{account.phone}</p>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-5">
                            <h5>Role:</h5>
                            <p className="font-semibold capitalize">{account.role}</p>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-5">
                            <h5>Access:</h5>
                            <div className="text-xs">
                                <p className="font-medium capitalize">IP [{account.ip}]</p>
                                <p className="font-medium capitalize">Agent [{account.userAgent}]</p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full flex flex-col gap-y-5 justify-between">
                        <m.div className="w-full relative z-0" onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
                            <Image
                                src={account.cover === "" ? "/assets/Image-not-found.png" : String(account.cover)}
                                priority
                                width={1000}
                                height={1000}
                                alt={`Photos of ${account.firstName}`}
                                className="w-fit mx-auto h-40 object-contain rounded-xl overflow-hidden object-center"
                            />
                            {/* Animated Button */}
                            <m.div
                                variants={childVariants}
                                animate={isHovered ? "visible" : "hidden"} // Child mengikuti parent
                                className="absolute top-1/2 z-10 left-0 right-0 w-full"
                            >
                                <SubmitButton
                                    title="Change"
                                    type="button"
                                    className="mx-auto bg-brown text-white"
                                    onClick={() => setModal("updateCover")}
                                />
                            </m.div>
                        </m.div>

                        <div className="flex items-center gap-5 justify-center">
                            <SubmitButton
                                onClick={() => setEditing("update")}
                                title="Update"
                                type="button"
                                icon={<IconUserEdit size={18} stroke={2} />}
                            />
                            <SubmitButton
                                title="Password"
                                onClick={() => setEditing("changePassword")}
                                type="button"
                                icon={<IconPasswordUser size={18} stroke={2} />}
                            />
                            <SubmitButton
                                title="Email"
                                type="button"
                                disabled={true}
                                className="disabled:cursor-not-allowed disabled:bg-brown disabled:text-white disabled:opacity-80"
                                icon={<IconUserEdit size={18} stroke={2} />}
                            />
                        </div>
                    </div>
                </div>
            </header>
            {modal === "updateCover" && (
                <ModalFormProfile fetchAccount={fetchAccount} setLoading={setLoading} account={account} setModal={setModal} />
            )}
        </>
    );
}

type propsModalFormProfile = {
    setModal: React.Dispatch<SetStateAction<string>>;
    account: IAccount;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchAccount: () => Promise<void>;
};

function ModalFormProfile({ setModal, account, setLoading, fetchAccount }: propsModalFormProfile) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const handleUpdateCover = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Photo Profile" });
        try {
            const { data } = await api.get<ApiSuccessResponse<{ id: number }>>(`${process.env.NEXT_PUBLIC_API}/account/check-photo`);
            const id = data.data; // id Cover
            if (!id) {
                setLoading({ stack: "upload", field: "Photo Profile" });
                const key = `coverAccountId_ACCOUNT_${account.id}`;
                const coverId = localStorage.getItem(key);
                if (coverId) {
                    const blob = await getCoverImage(Number(coverId));
                    if (blob) {
                        const file = new File([blob], `account-${account.id}.jpg`, { type: "image/jpeg" });
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("entityId", String(account.id) || "");
                        formData.append("entityType", "ACCOUNT");
                        formData.append("imageType", "PHOTO");

                        await api.post(`${process.env.NEXT_PUBLIC_API}/upload`, formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                            withCredentials: true,
                        });
                    }
                }
            } else {
                setLoading({ stack: "upload", field: "Delete Photo Profile" });
                await api.delete(`${process.env.NEXT_PUBLIC_API}/upload/${id}`, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });

                setLoading({ stack: "upload", field: "Update Photo Profile" });
                const key = `coverAccountId_ACCOUNT_${account.id}`;
                const coverId = localStorage.getItem(key);
                if (coverId) {
                    const blob = await getCoverImage(Number(coverId));
                    if (blob) {
                        const file = new File([blob], `account-${account.id}.jpg`, { type: "image/jpeg" });
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("entityId", String(account.id) || "");
                        formData.append("entityType", "ACCOUNT");
                        formData.append("imageType", "PHOTO");

                        await api.post(`${process.env.NEXT_PUBLIC_API}/upload`, formData, {
                            headers: { "Content-Type": "multipart/form-data" },
                            withCredentials: true,
                        });
                    }
                }
            }
            await fetchAccount();
            setNotification({
                title: "Successfully",
                message: (
                    <div className="flex items-center justify-start gap-5">
                        <IconCheck stroke={2} size={18} className="text-green-500" />
                        Change photo profile is completed.
                    </div>
                ),
            });
            cleanupStorage();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };

    const cleanupStorage = async () => {
        // Hapus semua data di localStorage
        const keysToRemove = [...Object.keys(localStorage).filter((key) => key.startsWith("coverAccountId"))];

        await Promise.all(
            keysToRemove.map(async (key) => {
                const coverId = localStorage.getItem(key);
                if (coverId) {
                    await deleteCoverImage(Number(coverId));
                }
                localStorage.removeItem(key);
            })
        );

        localStorage.clear();
    };
    return (
        <div className="fixed top-0 z-50 left-0 right-0 w-full h-screen bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <m.form
                onSubmit={handleUpdateCover}
                exit={{ scale: 0 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg bg-gray-100 w-5/12 border border-black overflow-hidden"
            >
                {/* Header Modal */}
                <div className="flex items-center justify-between gap-x-5 p-3 border-b border-black">
                    <h2>Change Your Photos</h2>
                    <button type="button" onClick={() => setModal("")}>
                        <IconX stroke={2} size={18} className="text-brown" />
                    </button>
                </div>

                <div className="bg-white p-5 grid grid-cols-2 gap-5">
                    <CoverUploader
                        entityId={account.id || ""}
                        entityType="ACCOUNT"
                        className="w-full object-cover h-full"
                        storageKeyPrefix="coverAccountId"
                        imageType="PHOTO"
                    />
                    <Image
                        src={account.cover === "" ? "/assets/Image-not-found.png" : String(account.cover)}
                        priority
                        width={1000}
                        height={1000}
                        alt={`Photos of ${account.firstName}`}
                        className="w-full mx-auto object-contain rounded-xl overflow-hidden object-center"
                    />

                    <SubmitButton title="Update" icon={<IconCloudUpload size={18} stroke={2} />} type="submit" className="col-start-2" />
                </div>
            </m.form>
        </div>
    );
}
