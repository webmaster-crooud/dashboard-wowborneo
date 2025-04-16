import * as React from "react";
import { STATUS } from "~/types";
import { IconChevronDown } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";

export interface SelectDataInterface {
    value: string | STATUS;
    name: string | STATUS;
}

type propsSelectForm = {
    label: string;
    value: string;
    placeholder?: string;
    data: SelectDataInterface[];
    disabled?: boolean;
    title?: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className?: string;
    classIcon?: string;
};

export function SelectForm({ label, title = "Status", value, onChange, disabled, data = [], className, classIcon }: propsSelectForm) {
    return (
        <div className="w-full flex flex-col gap-y-2">
            <label htmlFor={label} className={`uppercase font-bold text-xs ${disabled ? "text-black/70" : "text-black"}`}>
                {title}
            </label>
            <div className="relative">
                <select
                    disabled={disabled}
                    name={label}
                    value={value}
                    defaultValue={value}
                    className={twMerge(
                        "border appearance-none outline-brown/60 border-black rounded-lg w-full text-black py-3 px-4 text-sm bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 disabled:border-black/70",
                        className
                    )}
                    onChange={onChange}
                >
                    <option value="">-- Choose one --</option>
                    {data.map((data, i) => (
                        <option value={data.value} key={i}>
                            {data.name}
                        </option>
                    ))}
                </select>
                <IconChevronDown className={twMerge("absolute top-4 right-3", classIcon)} size={18} stroke={2} />
            </div>
        </div>
    );
}
