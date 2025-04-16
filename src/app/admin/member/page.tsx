import { MemberTable } from "~/components/admin/member/Table";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
const dataBreadcrumb: Breadcrumb[] = [
    {
        title: "Dashboard",
        url: "/admin",
    },
    {
        title: "Member List",
        url: "/admin/member",
    },
];
export default function ListMemberPage() {
    return (
        <section className="min-h-screen">
            <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />

            <div className="my-5 px-8">
                <MemberTable />
            </div>
        </section>
    );
}
