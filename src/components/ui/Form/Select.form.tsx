import * as React from "react";
import { STATUS } from "~/types";
import { IconChevronDown } from "@tabler/icons-react";

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
};

export function SelectForm({ label, title = "Status", value, onChange, disabled, data = [] }: propsSelectForm) {
    return (
        // <div className="w-full">
        //     <label className="text-start text-xs font-bold uppercase" htmlFor={label}>
        //         {title}
        //     </label>
        //     <Select value={value} onValueChange={onChange} disabled={disabled}>
        //         <SelectTrigger className="w-full border-black h-12 rounded-lg focus:outline-none  focus:ring-0 disabled:opacity-60 disabled:bg-gray-200">
        //             <SelectValue placeholder={placeholder} />
        //         </SelectTrigger>
        //         <SelectContent>
        //             <SelectGroup>
        //                 <SelectLabel className="capitalize">{label}</SelectLabel>
        //                 {data.map((data, i) => (
        //                     <SelectItem value={data.value} defaultValue={data.value} key={i}>
        //                         {data.name}
        //                     </SelectItem>
        //                 ))}
        //             </SelectGroup>
        //         </SelectContent>
        //     </Select>
        // </div>
        <div className="w-full">
            <label htmlFor={label} className={`uppercase font-bold text-xs ${disabled ? "text-black/70" : "text-black"}`}>
                {title}
            </label>
            <div className="relative">
                <select
                    disabled={disabled}
                    name={label}
                    value={value}
                    defaultValue={value}
                    className="border appearance-none outline-brown/60 border-black rounded-lg w-full text-black py-3 px-4 text-sm bg-gray-100 disabled:cursor-not-allowed disabled:opacity-70 disabled:border-black/70"
                    onChange={onChange}
                >
                    <option value="">-- Choose one --</option>
                    {data.map((data, i) => (
                        <option value={data.value} key={i}>
                            {data.name}
                        </option>
                    ))}
                </select>
                <IconChevronDown className="absolute top-4 right-3" size={18} stroke={2} />
            </div>
        </div>
    );
}
