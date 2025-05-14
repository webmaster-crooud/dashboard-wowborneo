"use client";
import { MainMenu } from "./ui/Menu/Main.menu";
import { adminMenuData, agentMenuData, mainMenuData } from "~/constants/Menu";
import { motion as m } from "framer-motion";
import { useAuth } from "~/hooks/useAuth";
export function Sidebar() {
    const { account } = useAuth();
    const allowedRolesAdmin = ["admin", "owner", "developer"];
    return (
        <>
            <m.aside
                initial={{ x: "-50rem" }}
                animate={{ x: "0" }}
                exit={{ x: "-50rem" }}
                className="h-screen overflow-y-scroll sticky top-0 border-r border-slate-500/30 w-full py-12 flex flex-col gap-8 px-8 bg-gray-100 z-50"
            >
                {account.role.name === "member" ? (
                    <MainMenu menu={mainMenuData} />
                ) : allowedRolesAdmin.includes(account.role.name) ? (
                    <MainMenu heading="Admin Menu" menu={adminMenuData} />
                ) : (
                    <MainMenu menu={agentMenuData} />
                )}
            </m.aside>
        </>
    );
}
