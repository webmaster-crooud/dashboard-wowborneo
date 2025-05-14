"use client";

import { IconCheck, IconCloudUpload, IconDatabase, IconLoader3, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { useAtom, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useCallback, useEffect, useState } from "react";
import { HeaderAdmin } from "~/components/Header";
import RichTextEditor from "~/components/RichText";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { CanvasImage } from "~/components/ui/CanvasImage";
import { Card } from "~/components/ui/Card";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { SelectForm } from "~/components/ui/Form/Select.form";
import { RichTextPreview } from "~/components/ui/RichTextPreview";
import { selectStatus } from "~/constants/Status";
import { errorAtom, notificationAtom, sidebarAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IAddonsRequest, IAddonsResponse } from "~/types/schedule";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { formatCurrency } from "~/utils/main";
import { cleanupStorage, uploadCover } from "~/utils/upload";

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

type propsModalCreateAddon = {
    setModal: React.Dispatch<SetStateAction<"add" | "update" | null>>;
    setLoading: React.Dispatch<SetStateAction<{ field?: string; stack: string }>>;
    fetchAddons: () => Promise<void>;
};
export function ModalCreateAddon({ setModal, setLoading, fetchAddons }: propsModalCreateAddon) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const [addon, setAddon] = useState<IAddonsRequest>({ title: "", description: "", price: "", cover: "", status: "PENDING" });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setAddon((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ field: "Create new Addons", stack: "submit" });
        try {
            const { data } = await api.post<ApiSuccessResponse<{ id: number }>>(
                `${process.env.NEXT_PUBLIC_API}/admin/addon`,
                { title: addon.title, description: addon.description, price: Number(addon.price), status: addon.status },
                {
                    withCredentials: true,
                }
            );
            console.log(data.data);
            setLoading({ stack: "upload", field: "Addon" });
            await uploadCover(`cover_ADDON_1`, String(data.data.id), "ADDON", "COVER");
            await cleanupStorage("cover_ADDON_1", "");
            localStorage.clear();
            setModal(null);
            await fetchAddons();
            setNotification({
                title: "Create New Addons",
                message: (
                    <div className="flex items-center justify-start gap-2">
                        <IconCheck size={16} stroke={2} className="text-green-500" /> <span>Successfully to create new Addon</span>
                    </div>
                ),
            });
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ field: "", stack: "" });
        }
    };
    return (
        <div className="w-full py-20 h-screen fixed z-[50] top-0 left-0 right-0 bg-black/10 backdrop-blur-sm flex items-start justify-center overflow-y-scroll">
            <Card
                classHeading="flex items-center justify-between gap-5"
                classBody="bg-gray-50"
                className="w-6/12 mx-auto"
                title={
                    <>
                        <span>Create Addons</span>
                        <button type="button" onClick={() => setModal(null)}>
                            <IconX size={20} stroke={2} />
                        </button>
                    </>
                }
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                    <div className="col-span-2">
                        <CoverUploader entityId="1" entityType="ADDON" imageType="COVER" />
                    </div>
                    <InputForm
                        type="text"
                        title="title"
                        isRequired
                        handleInputChange={handleInputChange}
                        value={addon.title}
                        placeholder="Title of Addons"
                    />
                    <InputForm type="currency" title="price" isRequired handleInputChange={handleInputChange} value={addon.price} />
                    <SelectForm data={selectStatus} label="status" onChange={handleInputChange} value={addon.status} />
                    <div className="col-span-2">
                        <RichTextEditor
                            content={addon.description}
                            setContent={(content) =>
                                setAddon((prev) => ({
                                    ...prev,
                                    description: content,
                                }))
                            }
                        />
                    </div>

                    <div></div>
                    <SubmitButton type="submit" title="Save" icon={<IconCloudUpload size={20} stroke={2} />} />
                </form>
            </Card>
        </div>
    );
}
