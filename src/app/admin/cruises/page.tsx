"use client";
import { Suspense } from "react";
import { IconDatabasePlus } from "@tabler/icons-react";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { MainButton } from "~/components/ui/Button/Main.button";
import { CruiseTable } from "~/components/admin/cruise/Table/Cruise.table";
import { useSetAtom } from "jotai";
import { notificationAtom } from "~/stores";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { LoaderForm } from "~/components/ui/Form/Loader.form";

const dataBreadcrumb: Breadcrumb[] = [
    {
        title: "Dashboard",
        url: "/admin",
    },
    {
        title: "Cruise",
        url: "/admin/cruises",
    },
];

// Pisahkan komponen yang menggunakan useSearchParams
function CruiseContent() {
    const setNotification = useSetAtom(notificationAtom);
    const sParams = useSearchParams();

    useEffect(() => {
        const notificationParam = sParams;
        if (notificationParam.get("notification")) {
            setNotification({
                title: "Notification",
                message: notificationParam,
            });
        }
    }, [setNotification, sParams]);

    return (
        <div className="my-5 px-8">
            <CruiseTable />
        </div>
    );
}

export default function CruisePage() {
    return (
        <Suspense fallback={<LoaderForm key={"loaderSubmitAdminBooking"} loading={{ stack: "submit", field: "" }} />}>
            <section className="min-h-screen">
                <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
                <div className="flex items-center justify-start gap-6 flex-wrap mt-5 px-8">
                    <MainButton url="/admin/cruises/create" title="Create" icon={<IconDatabasePlus stroke={2} size={20} />} />
                </div>

                {/* Tambahkan Suspense Boundary */}
                <Suspense fallback={<div>Loading...</div>}>
                    <CruiseContent />
                </Suspense>
            </section>
        </Suspense>
    );
}
