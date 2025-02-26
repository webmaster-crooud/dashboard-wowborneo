"use client";

import Image from "next/image";
import { AccountButton } from "./ui/Button/Account.button";
import { IconMenu2, IconSearch } from "@tabler/icons-react";

export function Navbar() {
	return (
		<nav className="bg-brown w-full max-w-screen-2xl text-white py-3 flex items-center justify-between px-20 z-50">
			<div className="flex items-center justify-start gap-8">
				<Image src={"/icon.svg"} width={200} height={200} alt="Wow Borneo" className="w-28 object-center object-cover" priority />
				<button className="flex items-center justify-center h-10 w-10 border border-white rounded-lg">
					<IconMenu2 stroke={2} size={25} />
				</button>
			</div>

			<div className="flex items-center justify-end gap-10">
				<form className="relative">
					<input name="search" className="text-sm rounded-full border border-white ps-10 pe-5 py-2 bg-transparent outline-none placeholder:text-white" placeholder="Search order history" />
					<button type="submit" className="absolute top-2.5 left-3">
						<IconSearch stroke={2} size={20} />
					</button>
				</form>
				<AccountButton />
			</div>
		</nav>
	);
}
