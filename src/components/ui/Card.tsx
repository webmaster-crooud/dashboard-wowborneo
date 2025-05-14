import React from "react";
import { twMerge } from "tailwind-merge";

type propsCard = {
    title: string | React.ReactNode;
    children: React.ReactNode;
    className?: string;
    classHeading?: string;
    classBody?: string;
};
export const Card: React.FC<propsCard> = ({ title, className, children, classHeading, classBody }) => (
    <div className={twMerge("border flex flex-col overflow-hidden border-gray-500 rounded-lg bg-transparent", className)}>
        {/* Header Card */}
        <h2 className={twMerge("px-5 py-3 font-bold border-b bg-gray-200 border-gray-500", classHeading)}>{title}</h2>
        <div className={twMerge("p-5", classBody)}>{children}</div>
    </div>
);
