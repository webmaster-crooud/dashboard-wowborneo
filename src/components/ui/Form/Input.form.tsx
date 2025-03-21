"use client";
import { IconEye, IconEyeClosed, IconStarFilled } from "@tabler/icons-react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

type propsInputForm = {
    className?: string;
    value: string | number;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label?: string;
    title: string;
    type: "text" | "email" | "password" | "number";
    isRequired?: boolean;
    placeholder?: string;
};

export function InputForm({ className, value, label, handleInputChange, title, type, isRequired = false, placeholder }: propsInputForm) {
    const [openEye, setOpenEye] = useState<boolean>(false);

    return (
        <div className="w-full">
            <label className="font-bold mb-2 flex items-center justify-start gap-1 text-xs uppercase" htmlFor={`label${title}`}>
                {!label ? title : label} {isRequired && <IconStarFilled size={7} stroke={2} className="text-red-500" />}
            </label>
            <div className="relative">
                <input
                    type={type === "password" ? (openEye ? "text" : "password") : type}
                    value={String(value)}
                    name={title}
                    required={isRequired}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    className={twMerge("border outline-brown/60 border-black rounded-lg w-full text-black py-3 px-4 text-sm", className)}
                />
                {type === "password" && (
                    <button className="absolute top-3.5 right-5 text-gray-500" onClick={() => setOpenEye(!openEye)} type="button">
                        {!openEye ? <IconEye stroke={2} size={20} /> : <IconEyeClosed stroke={2} size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
}
