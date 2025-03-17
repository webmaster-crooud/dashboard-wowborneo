"use client";

import Image from "next/image";
import { AccountButton } from "./ui/Button/Account.button";
import { IconMenu2 } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { sidebarAtom } from "~/stores";
import { SearchForm } from "./ui/Form/Search.form";

export function Navbar() {
    const [sidebar, setSidebar] = useAtom(sidebarAtom);
    return (
        <nav className="bg-brown w-full max-w-screen-2xl text-white py-3 flex items-center justify-between px-20 z-50 relative">
            <div className="flex items-center justify-start gap-8">
                <Image src={"/icon.svg"} width={200} height={200} alt="Wow Borneo" className="w-28 object-center object-cover" priority />
                <button onClick={() => setSidebar(!sidebar)} className="flex items-center justify-center h-10 w-10 border border-white rounded-lg">
                    <IconMenu2 stroke={2} size={25} />
                </button>
            </div>

            <div className="flex items-center justify-end gap-10">
                <SearchForm />
                <AccountButton />
            </div>
        </nav>
    );
}
