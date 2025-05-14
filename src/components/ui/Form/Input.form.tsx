import { IconCurrencyDollar, IconEye, IconEyeClosed, IconStarFilled } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

type InputFormProps = {
    className?: string;
    value: string | number;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    label?: string;
    title: string;
    type: "text" | "email" | "password" | "number" | "textarea" | "currency" | "icon";
    isRequired?: boolean;
    placeholder?: string;
};

export function InputForm({ className, value, label, handleInputChange, title, type, isRequired = false, placeholder }: InputFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [rawCurrencyValue, setRawCurrencyValue] = useState("");
    const inputId = `input-${title.replace(/\s+/g, "-").toLowerCase()}`;

    // Currency formatting helpers
    const parseCurrencyValue = (val: string) => {
        const numericValue = parseFloat(val) || 0;
        return isNaN(numericValue) ? 0 : numericValue;
    };

    const formatCurrency = (val: string) => {
        const numericValue = parseCurrencyValue(val);
        return new Intl.NumberFormat("en-US", {
            currency: "USD",
            minimumFractionDigits: 0,
        }).format(numericValue);
    };

    // Sync raw currency value with parent value
    useEffect(() => {
        if (type === "currency") {
            const numericValue = typeof value === "number" ? value : parseCurrencyValue(value.toString());
            setRawCurrencyValue(numericValue.toFixed(2));
        }
    }, [value, type]);

    // Currency input handlers
    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputVal = e.target.value;
        const sanitizedValue = inputVal.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"); // Remove multiple dots
        setRawCurrencyValue(sanitizedValue);
    };

    const handleCurrencyBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const numericValue = parseCurrencyValue(rawCurrencyValue);
        const formattedValue = numericValue.toFixed(2);

        setRawCurrencyValue(formattedValue);

        handleInputChange({
            ...e,
            target: {
                ...e.target,
                value: numericValue.toString(),
                name: title,
            },
        } as React.ChangeEvent<HTMLInputElement>);
    };

    // Common input props
    const commonProps = {
        id: inputId,
        name: title,
        required: isRequired,
        placeholder,
        className: twMerge(
            "border bg-gray-100 outline-brown/60 border-black rounded-lg w-full text-black py-3 px-4 text-sm",
            type === "currency" && "pl-10",
            className
        ),
    };

    return (
        <div className="w-full">
            <label htmlFor={inputId} className="font-bold mb-2 flex items-center justify-start gap-1 text-xs uppercase">
                {label || title}
                {isRequired && <IconStarFilled size={7} stroke={2} className="text-red-500" />}
            </label>

            <div className="relative">
                {/* Currency Icon */}
                {type === "currency" && (
                    <div className="absolute top-3.5 left-3 text-gray-500">
                        <IconCurrencyDollar size={18} stroke={2} />
                    </div>
                )}

                {/* Textarea */}
                {type === "textarea" ? (
                    <textarea {...commonProps} value={value} onChange={handleInputChange} rows={5} />
                ) : (
                    /* Regular Input */
                    <input
                        {...commonProps}
                        type={type === "password" ? (showPassword ? "text" : "password") : type === "currency" ? "text" : type}
                        value={type === "currency" ? formatCurrency(rawCurrencyValue) : value}
                        onChange={type === "currency" ? handleCurrencyChange : handleInputChange}
                        onBlur={type === "currency" ? handleCurrencyBlur : undefined}
                    />
                )}

                {/* Password Toggle */}
                {type === "password" && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-3.5 right-3 text-gray-500"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <IconEyeClosed size={20} /> : <IconEye size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
}
