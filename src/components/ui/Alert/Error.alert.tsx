"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useEffect } from "react";
import { motion } from "framer-motion";

import { IconAlertTriangleFilled, IconX } from "@tabler/icons-react";
import { errorAtom, setErrorAtom } from "~/stores";

export function ErrorAlert() {
    const error = useAtomValue(errorAtom); // Ambil state error
    const setError = useSetAtom(setErrorAtom); // Fungsi untuk mengatur error

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError({ message: "", errors: [] });
            }, 6000);

            return () => clearTimeout(timer);
        }
    }, [error, setError]);

    if (error.errors?.length === 0 && error.message === "") return null;
    return (
        <motion.div
            initial={{ x: "10rem", opacity: 0 }}
            animate={{ x: "0rem", opacity: 1 }}
            className={`fixed top-4 min-w-[25%] right-4 z-[60] max-w-[40%]`}
        >
            <div className="bg-gray-100 border-2 border-red-600 rounded-lg shadow-lg">
                <div className="flex items-center justify-between gap-5 w-full px-8 py-2 border-b-2 border-red-600 bg-red-600 text-white">
                    <h3 className="font-semibold">{error.errors && error.errors?.length === 0 ? "Kesalahan!" : error.message}</h3>
                    <button onClick={() => setError({ message: "", errors: [] })} className="hover:text-red-200">
                        <IconX stroke={2.5} size={20} />
                    </button>
                </div>
                <div className="text-[15px] text-gray-700 px-8 py-4">
                    {error.errors && error.errors.length > 0 ? (
                        <div className="mt-2 flex flex-col gap-y-2">
                            {error.errors.map((err, index) => (
                                <p key={index} className="flex items-start justify-start gap-2">
                                    <IconAlertTriangleFilled size={20} className="text-red-500" />
                                    <span>{err.message}</span>
                                </p>
                            ))}
                        </div>
                    ) : (
                        error.message
                    )}
                </div>
            </div>
        </motion.div>
    );
}
