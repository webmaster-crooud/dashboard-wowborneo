import { IconCheck, IconCloudUpload, IconX } from "@tabler/icons-react";
import { SetStateAction, useSetAtom } from "jotai";
import { useState } from "react";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { SelectForm } from "~/components/ui/Form/Select.form";
import { selectStatus } from "~/constants/Status";
import { errorAtom, notificationAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IAddonsRequest } from "~/types/schedule";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { cleanupStorage, uploadCover } from "~/utils/upload";

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
