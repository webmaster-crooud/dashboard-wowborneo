"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";
import { MenuInterface } from "~/types";

export const MainMenu = ({ heading = "Main Menu", menu }: { heading?: string; menu: MenuInterface[] }) => (
	<div>
		<h5 className="uppercase font-bold text-lg text-7e">{heading}</h5>

		<div className="flex flex-col gap-y-3 mt-5">
			{menu.map((menu, index) => (
				<LinkMenu key={index} title={menu.title} icon={menu.icon} url={menu.url} />
			))}
		</div>
	</div>
);

const LinkMenu: React.FC<MenuInterface> = ({ title, icon, url }) => {
	const pathName = usePathname();
	return (
		<Link href={url} className={twMerge(`flex items-center border border-transparent rounded-xl py-2 px-3 text-[17px] text-black justify-start gap-3 ${pathName.startsWith(String(url)) && "bg-brown/10 border-brown"}`, "hover:border-brown hover:bg-brown/10 duration-300 transition-all ease-in-out")}>
			{icon} {title}
		</Link>
	);
};
