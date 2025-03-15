import React from "react";
import { twMerge } from "tailwind-merge";

type propsCard = {
	title: string | React.ReactNode;
	children: React.ReactNode;
	className?: string;
	classHeading?: string;
};
export const Card: React.FC<propsCard> = ({ title, className, children, classHeading }) => (
	<div className={twMerge("border flex flex-col overflow-hidden border-gray-500 rounded-lg bg-transparent", className)}>
		{/* Header Card */}
		<div className={twMerge("px-5 py-3 font-bold border-b bg-gray-200 border-gray-500", classHeading)}>{title}</div>
		<div className="p-5">{children}</div>
	</div>
);
