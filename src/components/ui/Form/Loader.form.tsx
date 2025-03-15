"use client";
import { IconLivePhoto } from "@tabler/icons-react";
import { AnimatePresence, motion as m } from "framer-motion";
export const LoaderForm = ({ loading }: { loading: { stack: string; field?: string } }) => (
    <div className="w-full h-screen z-[100] fixed top-0 left-0 bg-white/20 backdrop-blur-sm flex items-center justify-center">
        <div className="flex flex-col items-center w-4/12 mx-auto gap-y-5">
            <div className="relative">
                <IconLivePhoto stroke={2} size={45} className="animate-spin text-brown" />
                <IconLivePhoto stroke={2} size={45} className="animate-ping absolute top-0 text-brown" />
            </div>
            <AnimatePresence mode="wait">
                {loading.field === "cruise" && (
                    <m.div
                        key={"cruise"}
                        className="text-center font-semibold text-sm bg-white rounded-lg shadow-md px-5 py-3 w-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        exit={{ scale: 0 }}
                    >
                        Processing upload cruise data, please wait!
                    </m.div>
                )}
                {loading.field === "destination" && (
                    <m.div
                        className="text-center font-semibold text-sm bg-white rounded-lg shadow-md px-5 py-3 w-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        exit={{ scale: 0 }}
                    >
                        Processing upload file cover destination.
                    </m.div>
                )}
                {loading.field === "highlight" && (
                    <m.div
                        className="text-center font-semibold text-sm bg-white rounded-lg shadow-md px-5 py-3 w-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                        exit={{ scale: 0 }}
                    >
                        Processing upload file cover highlight.
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    </div>
);
