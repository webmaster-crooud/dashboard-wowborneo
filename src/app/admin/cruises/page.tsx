import { IconDatabasePlus } from "@tabler/icons-react";
import { HeaderAdmin } from "~/components/admin/header.admin";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { MainButton } from "~/components/ui/Button/Main.button";
import { CruiseTable } from "~/components/ui/Table/Cruise.table";
const dataBreadcrumb: Breadcrumb[] = [
	{
		title: "Dashboard",
		url: "/admin",
	},
	{
		title: "Cruise",
		url: "/admin/cruise",
	},
];
export default function CruisePage() {
	return (
		<div className="min-h-screen">
			<HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
			<div className="flex items-center justify-start gap-6 flex-wrap mt-5 px-8">
				<MainButton url="create" title="Create" icon={<IconDatabasePlus stroke={2} size={20} />} />
			</div>
			<div className="my-5 px-8">
				<CruiseTable />
			</div>
		</div>
	);
}
