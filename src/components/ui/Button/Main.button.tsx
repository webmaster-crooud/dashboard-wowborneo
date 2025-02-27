import { IconDatabasePlus } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";

type propsMainButton = {
	title: string;
	url: string;
	icon?: React.ReactNode;
	className?: string;
};
export const MainButton: React.FC<propsMainButton> = ({ title, url, icon, className }) => (
	<Link href={url} className={twMerge("flex items-center justify-center gap-2 font-semibold bg-brown/10 border-brown px-5 py-2 border text-gray-600 hover:bg-brown duration-300 ease-in-out transition-all hover:text-white rounded-lg", className)}>
		{title} {icon}
	</Link>
);
