"use client";

import { IconX } from "@tabler/icons-react";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { notificationAtom, setNotificationAtom } from "~/stores";

export function NotificationAlert() {
    const notification = useAtomValue(notificationAtom); // Ambil state error
    const setNotification = useSetAtom(setNotificationAtom); // Fungsi untuk mengatur error

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification({ title: "", message: "" });
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [notification, setNotification]);
    if (notification.message === "") return null;
    return (
        <motion.div
            initial={{ x: "10rem", opacity: 0 }}
            animate={{ x: "0rem", opacity: 1 }}
            className={`fixed top-4 min-w-[30%] right-4 z-50 max-w-[40%]`}
        >
            <div className="bg-gray-100 border-2 border-sky-600 rounded-lg shadow-lg">
                <div className="flex items-center justify-between gap-5 w-full px-8 py-2 border-b-2 border-sky-600 bg-sky-600 text-white">
                    <h3 className="font-semibold">{notification.title}</h3>
                    <button onClick={() => setNotification({ title: "", message: "" })} className="hover:text-red-200">
                        <IconX stroke={2.5} size={20} />
                    </button>
                </div>
                <p className="text-[15px] text-gray-700 px-8 py-4">{notification.message}</p>
            </div>
        </motion.div>
    );
}
