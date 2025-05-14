"use client";

import { IconDatabase, IconLoader3, IconPlus, IconTrash } from "@tabler/icons-react";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ModalCreateAddon } from "~/components/admin/addons/ModalCreateAddon";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { CanvasImage } from "~/components/ui/CanvasImage";
import { RichTextPreview } from "~/components/ui/RichTextPreview";
import { errorAtom, notificationAtom, sidebarAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IAddonsResponse } from "~/types/schedule";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { formatCurrency } from "~/utils/main";

const dataBreadcrumb: Breadcrumb[] = [
    {
        title: "Dashboard",
        url: "/admin",
    },
    {
        title: "Schedules",
        url: "/admin/schedules",
    },
    {
        title: "Addons",
        url: "/admin/addons",
    },
];
export default function AddonsPage() {
    const router = useRouter();
    const [modal, setModal] = useState<"add" | "update" | null>(null);
    const [loading, setLoading] = useState<{ stack: string; field?: string }>({ field: "", stack: "" });
    const [addons, setAddons] = useState<IAddonsResponse[]>([]);
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const [sidebar] = useAtom(sidebarAtom);

    const fetchAddons = useCallback(async () => {
        setLoading({ stack: "fetch", field: "Fetching Addos" });
        try {
            const { data } = await api.get<ApiSuccessResponse<IAddonsResponse[]>>(`${process.env.NEXT_PUBLIC_API}/admin/addon`);
            setAddons(data.data);
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    }, [setError]);

    useEffect(() => {
        fetchAddons();
    }, [fetchAddons]);

    const handleDelete = async (id: number, idx: number) => {
        setLoading({ stack: "deleted", field: String(idx) });
        try {
            await api.patch(`${process.env.NEXT_PUBLIC_API}/admin/addon/${Number(id)}?action=DELETED`);
            setNotification({
                title: "Deleted Addon",
                message: "Successfully deleted addon",
            });
            fetchAddons();
        } catch (error) {
            fetchError(error, setError);
        } finally {
        }
    };
    return (
        <>
            <section className="min-h-screen w-full">
                <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
                <div className="flex items-center justify-between gap-5 p-5 pb-0">
                    <h2 className="flex items-center text-nowrap justify-start gap-2 font-bold text-xl">
                        <IconDatabase stroke={2.3} size={24} /> Addons
                    </h2>
                    <div className="flex items-center justify-end gap-5">
                        <SubmitButton
                            type="button"
                            title="Schedules"
                            onClick={() => {
                                setLoading({ stack: "route", field: "schedule" });
                                router.push("/admin/schedules");
                            }}
                            icon={
                                loading.stack === "route" && loading.field === "schedule" ? (
                                    <IconLoader3 className="animate-spin" stroke={2} size={18} />
                                ) : (
                                    <IconDatabase stroke={2} size={18} />
                                )
                            }
                        />
                        <SubmitButton type="button" title="Create" onClick={() => setModal("add")} icon={<IconPlus stroke={2} size={18} />} />
                    </div>
                </div>

                <article className={`grid  ${sidebar ? "grid-cols-2" : "grid-cols-3"} gap-5 items-start p-5`}>
                    {addons.map((addon, i) => (
                        <div className="w-full bg-gray-50 flex flex-col gap-y-2 relative rounded-lg border border-gray-300 p-5" key={i}>
                            <div className="absolute top-3 right-0 w-full flex pe-3 items-center justify-end gap-3">
                                <SubmitButton
                                    title="Delete"
                                    type="button"
                                    icon={
                                        loading.stack === "deleted" && loading.field === String(i) ? (
                                            <IconLoader3 stroke={2} size={16} className="animate-spin" />
                                        ) : (
                                            <IconTrash stroke={2} size={16} />
                                        )
                                    }
                                    onClick={() => handleDelete(Number(addon.id), i)}
                                    className="text-sm px-3 py-1 border-gray-50 bg-red-500 text-gray-50 hover:bg-red-600"
                                />
                            </div>
                            <CanvasImage src={addon.cover || "/assets/Image-not-found.jpg"} className="h-40" />
                            <h3 className="font-semibold text-lg"> {addon.title}</h3>
                            <p>{formatCurrency(String(addon.price))}</p>
                            <RichTextPreview value={addon.description} />
                        </div>
                    ))}
                </article>
            </section>
            {modal === "add" && <ModalCreateAddon fetchAddons={fetchAddons} setLoading={setLoading} setModal={setModal} />}
        </>
    );
}
