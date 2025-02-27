"use client";
import { MainMenu } from "./ui/Menu/Main.menu";
import { AdminMenuData, mainMenuData } from "~/constants/Menu";
import { motion as m } from "framer-motion";
export function Sidebar() {
	return (
		<>
			<m.aside initial={{ x: "-50rem" }} animate={{ x: "0" }} exit={{ x: "-50rem" }} className="h-screen overflow-y-scroll sticky top-0 border-r border-slate-500/30 w-full py-12 flex flex-col gap-8 px-8">
				<MainMenu menu={mainMenuData} />
				<MainMenu heading="Admin Menu" menu={AdminMenuData} />
				<MainMenu heading="Admin Menu" menu={AdminMenuData} />
				<MainMenu heading="Admin Menu" menu={AdminMenuData} />
				<MainMenu heading="Admin Menu" menu={AdminMenuData} />
				<MainMenu heading="Admin Menu" menu={AdminMenuData} />
			</m.aside>
		</>
	);
}
