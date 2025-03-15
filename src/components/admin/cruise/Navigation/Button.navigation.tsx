"use client";
import { IconDatabasePlus, IconDatabaseSearch } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { MainButton } from "~/components/ui/Button/Main.button";

export function ButtonNavigation() {
    const pathName = usePathname();
    return (
        <div className="flex items-center justify-start gap-6 flex-wrap mt-5 relative z-10 px-8">
            <MainButton url="/admin/cruises" title="List" icon={<IconDatabaseSearch stroke={2} size={20} />} />
            <MainButton
                url="create"
                title="Create"
                className={pathName === "/admin/cruises/create" ? "bg-brown text-white" : ""}
                icon={<IconDatabasePlus stroke={2} size={20} />}
            />
        </div>
    );
}
