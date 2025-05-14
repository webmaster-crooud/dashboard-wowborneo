"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IconChevronDown, IconKey, IconLoader2, IconLoader3, IconNotification, IconPower, IconUserCog } from "@tabler/icons-react";

import { useRouter } from "next/navigation";
import { useAuth } from "~/hooks/useAuth";
import { useSetAtom } from "jotai";
import { errorAtom } from "~/stores";
import { fetchError } from "~/utils/fetchError";
import authService from "~/services/auth.service";
import { IAccount } from "~/types/account";
import { api } from "~/utils/api";
import { ApiSuccessResponse } from "~/types";

export function AccountButton() {
    const { account, isLoading } = useAuth();
    const [menuAccount, setMenuAccount] = useState<boolean>(false);
    const [loading, setLoading] = useState<string>("");
    const [me, setMe] = useState<IAccount>({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        cover: "",
        id: "",
        ip: "",
        role: "",
        userAgent: "",
        roleId: 0,
    });
    const setError = useSetAtom(errorAtom);

    const router = useRouter();
    const handleLogout = async () => {
        setLoading("logout");
        try {
            await authService.logout();
            window.location.href = `${process.env.NEXT_PUBLIC_AUTH}/login`;
            localStorage.clear();
            sessionStorage.clear();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading("");
        }
    };
    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const { data } = await api.get<ApiSuccessResponse<IAccount>>(`${process.env.NEXT_PUBLIC_API}/account`, {
                    withCredentials: true,
                });
                setMe(data.data);
            } catch (error) {
                fetchError(error, setError);
            }
        };
        fetchAccount();
    }, [setError]);
    return (
        <div className="relative">
            {isLoading ? (
                <div className="flex items-center justify-end gap-3">
                    <div className="w-28 h-4 rounded-full bg-gray-100 animate-pulse"></div>
                    <IconLoader2 stroke={2} size={30} className="animate-spin" />
                </div>
            ) : (
                <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    type="button"
                    onMouseEnter={() => setMenuAccount(true)}
                    onMouseLeave={() => setMenuAccount(false)}
                    className="flex items-center justify-end text-start gap-3 group"
                >
                    <div className="rounded-full relative overflow-hidden group-hover:rotate-[360deg] bg-black flex items-center justify-center w-12 h-12 group-hover:p-1 object-cover object-center transition-all ease-in-out duration-300">
                        <Image
                            src={me.cover || "/assets/Image-not-found.png"}
                            alt={`Photo Profile - ${account.user.firstName}`}
                            width={200}
                            height={200}
                            style={{ width: "100%", height: "auto" }}
                            loading="lazy"
                            className="max-w-12 mx-auto rounded-full"
                        />
                    </div>
                    <div className="flex flex-col">
                        <motion.h1 initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-sm font-bold">
                            {account?.user.firstName} {account.user.lastName}
                        </motion.h1>
                        <small className="capitalize">{account.role.name}</small>
                    </div>
                    <IconChevronDown stroke={1.5} size={20} className={menuAccount ? "-rotate-180" : "rotate-0"} />
                </motion.button>
            )}
            <AnimatePresence>
                {menuAccount && (
                    <motion.div
                        initial={{ opacity: 0, height: "0" }}
                        animate={{ height: "auto", opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        exit={{ height: 0, opacity: 0 }}
                        onMouseEnter={() => setMenuAccount(true)}
                        onMouseLeave={() => setMenuAccount(false)}
                        className="absolute z-[55] top-0 mt-12 right-0 w-52 bg-gray-50 rounded-3xl shadow-xl overflow-hidden"
                    >
                        <div className="relative flex flex-col">
                            <button
                                type="button"
                                onClick={() => {
                                    router.push(`/profile`);
                                    setMenuAccount(false);
                                }}
                                className="text-sm px-5 py-3 cursor-alias hover:bg-gray-200 transition-all ease-in-out duration-300 font-bold flex items-center justify-start gap-2 text-gray-700"
                            >
                                <IconUserCog size={18} stroke={3} /> My Account
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    router.push("/change-password");
                                    setMenuAccount(false);
                                }}
                                className="text-sm px-5 py-3 cursor-alias hover:bg-gray-200 transition-all ease-in-out duration-300 font-bold flex items-center justify-start gap-2 text-gray-700"
                            >
                                <IconKey size={18} stroke={3} /> Change Password
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    router.push("/notification");
                                    setMenuAccount(false);
                                }}
                                className="text-sm px-5 py-3 cursor-alias hover:bg-gray-200 transition-all ease-in-out duration-300 font-bold flex items-center justify-start gap-2 text-gray-700"
                            >
                                <IconNotification size={18} stroke={3} /> Notification
                            </button>

                            <hr />
                            <button
                                type="button"
                                onClick={handleLogout}
                                className="text-sm px-5 py-3 cursor-alias hover:bg-gray-200 transition-all ease-in-out duration-300 font-medium flex items-center justify-start gap-2 text-gray-700"
                            >
                                {loading === "logout" ? (
                                    <>
                                        <IconLoader3 className="animate-spin" size={18} stroke={2} /> Keluar
                                    </>
                                ) : (
                                    <>
                                        <IconPower size={18} stroke={2} /> Keluar
                                    </>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
