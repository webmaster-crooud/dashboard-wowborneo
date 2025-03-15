import { IconLoader3 } from "@tabler/icons-react";
import React from "react";
import { twMerge } from "tailwind-merge";

export const LoaderButton = () => (
    <div
        className={twMerge(
            "flex items-center justify-center gap-2 font-semibold bg-brown/10 border-brown px-5 py-2 border text-gray-600 hover:bg-brown duration-300 ease-in-out transition-all hover:text-white rounded-lg"
        )}
    >
        <IconLoader3 className="animate-spin" size={20} stroke={2} />
        <span>Loading...</span>
    </div>
);
