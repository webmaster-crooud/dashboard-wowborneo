import Link from "next/link";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { Card } from "~/components/ui/Card";
const dataBreadcrumb: Breadcrumb[] = [
	{
		title: "Dashboard",
		url: "/admin",
	},
];
export default function DashboardAdminPage() {
	return (
		<section className="min-h-screen">
			<HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
			<section className="grid grid-cols-3 my-10 px-8 gap-6">
				<Card title="Transactions">
					<div className="flex flex-col justify-center w-full items-center h-full gap-y-5">
						<div className="flex items-end justify-between gap-10">
							<span className="text-7xl font-bold">30</span>
							<span>/today&apos;s</span>
						</div>

						<Link href={"transactions"} className="w-full bg-brown py-2 text-center rounded-xl text-gray-50 font-semibold">
							See Transaction
						</Link>
					</div>
				</Card>
				<Card title="Logs">
					<div className="bg-transparent text-sm text-gray-600">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora, reprehenderit dignissimos quos similique omnis fugit eaque! Inventore possimus corporis aliquid rerum distinctio neque, assumenda minus dolor, rem doloremque asperiores unde</div>
				</Card>
			</section>
		</section>
	);
}
