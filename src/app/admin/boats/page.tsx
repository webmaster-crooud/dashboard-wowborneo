import { IconDatabasePlus } from "@tabler/icons-react";
import { BoatTable } from "~/components/admin/boat/Table/Boat.table";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { MainButton } from "~/components/ui/Button/Main.button";

const dataBreadcrumb: Breadcrumb[] = [
    {
        title: "Dashboard",
        url: "/admin",
    },
    {
        title: "Boat",
        url: "/admin/boats",
    },
];
export default function ListBoatPage() {
    return (
        <section className="min-h-screen">
            <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
            <div className="flex items-center justify-start gap-6 flex-wrap mt-5 px-8">
                <MainButton url="/admin/boats/create" title="Create" icon={<IconDatabasePlus stroke={2} size={20} />} />
            </div>
            <div className="my-5 px-8">
                <BoatTable />
            </div>
        </section>
    );
}
