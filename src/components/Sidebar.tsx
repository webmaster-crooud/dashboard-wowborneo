import { MainMenu } from "./ui/Menu/Main.menu";
import { AdminMenuData, mainMenuData } from "~/constants/Menu";

export function Sidebar() {
	return (
		<>
			<aside className="h-screen overflow-y-scroll sticky top-0 border-r border-slate-500/30 w-full py-12 flex flex-col gap-8 px-8">
				<MainMenu menu={mainMenuData} />
				<MainMenu heading="Admin Menu" menu={AdminMenuData} />
				<MainMenu heading="Admin Menu" menu={AdminMenuData} />
				<MainMenu heading="Admin Menu" menu={AdminMenuData} />
				<MainMenu heading="Admin Menu" menu={AdminMenuData} />
				<MainMenu heading="Admin Menu" menu={AdminMenuData} />
			</aside>
		</>
	);
}
