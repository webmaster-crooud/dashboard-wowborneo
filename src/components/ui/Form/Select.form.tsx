import * as React from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../select";
import { STATUS } from "~/types";

export interface SelectDataInterface {
    value: string | STATUS;
    name: string | STATUS;
}

type propsSelectForm = {
    label: string;
    value: STATUS;
    placeholder?: string;
    data: SelectDataInterface[];
    disabled?: boolean;
    onChange: (val: string) => void;
};

export function SelectForm({ label, value, onChange, disabled, placeholder = "Select data", data = [] }: propsSelectForm) {
    return (
        <Select value={value} onValueChange={onChange} disabled={disabled}>
            <SelectTrigger className="w-full border-black h-12 rounded-lg focus:outline-none  focus:ring-0 disabled:opacity-60 disabled:bg-gray-200">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel className="capitalize">{label}</SelectLabel>
                    {data.map((data, i) => (
                        <SelectItem value={data.value} key={i}>
                            {data.name}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
