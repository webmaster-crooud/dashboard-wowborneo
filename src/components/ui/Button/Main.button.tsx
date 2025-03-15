"use client";

import Link from "next/link";
import React, { useState, useTransition } from "react";
import { twMerge } from "tailwind-merge";
import { IconLoader3 } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

type propsMainButton = {
    title: string;
    url: string;
    icon?: React.ReactNode;
    className?: string;
};

export const MainButton: React.FC<propsMainButton> = ({ title, url, icon, className }) => {
    const [isPending, startTransition] = useTransition();
    const [loadingUrl, setLoadingUrl] = useState("");
    const router = useRouter();

    return (
        <Link
            href={url}
            onClick={(e) => {
                e.preventDefault();
                setLoadingUrl(url);
                startTransition(() => {
                    router.push(url);
                });
            }}
            className={twMerge(
                "flex items-center justify-center gap-2 font-semibold bg-brown/10 border-brown px-5 py-2 border text-gray-600 hover:bg-brown duration-300 ease-in-out transition-all hover:text-white rounded-lg",
                className
            )}
        >
            {title} {isPending && loadingUrl === url ? <IconLoader3 size={20} stroke={2} className="animate-spin" /> : icon}
        </Link>
    );
};
