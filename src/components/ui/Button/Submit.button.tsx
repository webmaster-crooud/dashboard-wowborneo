import React from "react";
import { twMerge } from "tailwind-merge";

type propsMainButton = {
    title: string;
    icon?: React.ReactNode;
    className?: string;
    type: "submit" | "button";
    onClick?: () => void;
    disabled?: boolean;
};
export const SubmitButton: React.FC<propsMainButton> = ({ title, type, icon, className, onClick, disabled }) => (
    <button
        disabled={disabled}
        type={type}
        onClick={onClick}
        className={twMerge(
            "flex items-center justify-center gap-2 font-semibold bg-brown/10 border-brown px-5 py-2 border text-gray-600 hover:bg-brown duration-300 ease-in-out transition-all hover:text-white rounded-lg",
            className
        )}
    >
        {title} {icon}
    </button>
);
