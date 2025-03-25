"use client";

import { IconLoader3, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { SetStateAction, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { OPENSECTION } from "~/app/admin/boats/[boatId]/page";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { CanvasImage } from "~/components/ui/CanvasImage";
import { Card } from "~/components/ui/Card";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { SelectForm } from "~/components/ui/Form/Select.form";
import { RichTextPreview } from "~/components/ui/RichTextPreview";
import { errorAtom, notificationAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { ICabinRequestBody, ICabinResponse } from "~/types/boat";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { cleanupStorage, uploadCover } from "~/utils/upload";

type propsCabinDetail = {
    cabins: ICabinResponse[];
    openSection: OPENSECTION | null;
    setOpenSection: React.Dispatch<SetStateAction<OPENSECTION | null>>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchBoat: () => Promise<void>;
    loading: { stack: string; field: string };
};

const dataTypeCabin = [
    { value: "TWIN", label: "Twin", name: "Twin" },
    { value: "DOUBLE", label: "Double", name: "Double" },
    { value: "SUPER", label: "Super", name: "Super" },
];

export function CabinBoatDetail({ cabins, openSection, setOpenSection, setLoading, fetchBoat, loading }: propsCabinDetail) {
    const [modal, setModal] = useState<{ field: string; idx?: number }>({ field: "" });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const handleDeleted = async (cabinId: number, coverId: string, idx: number) => {
        setLoading({ stack: "deletedCabin", field: idx.toString() });
        try {
            await api.delete(`${process.env.NEXT_PUBLIC_API}/admin/boat/cabin/${cabinId}`);
            if (coverId) {
                setLoading({ stack: "submit", field: "Delete Cover Cabin" });
                await api.delete(`${process.env.NEXT_PUBLIC_API}/upload/${coverId}`, {
                    withCredentials: true,
                });
            }
            setNotification({
                title: "Delete Cabin",
                message: "Succesfully deleted Cabin",
            });
            await fetchBoat();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };

    return (
        <Card
            title={
                <>
                    <span>Cabin</span>
                    <div className="flex items-center justify-end gap-5">
                        <button
                            onClick={() => setModal({ field: "createCabin" })}
                            type="button"
                            className="px-3 py-1 font-medium bg-brown rounded-lg text-white text-sm flex items-center justify-center gap-1"
                        >
                            <IconPlus size={18} stroke={2} /> <span>Create</span>
                        </button>
                        <button
                            className={`px-3 py-1 ${
                                openSection === "CABIN" ? "bg-red-500" : "bg-sky-500"
                            } flex items-center justify-center gap-1 text-white rounded-lg text-sm font-medium`}
                            onClick={() => setOpenSection(openSection === "CABIN" ? null : "CABIN")}
                            type="button"
                        >
                            {openSection === "CABIN" ? "Close" : "Open"}
                        </button>
                    </div>
                </>
            }
            classHeading={`flex items-center justify-between gap-5 ${openSection !== "CABIN" && "border-0"}`}
            classBody={`${openSection !== "CABIN" && "p-0"} flex flex-col gap-5`}
        >
            {openSection === "CABIN" &&
                cabins.map((cabin, i) => (
                    <React.Fragment key={i}>
                        <Card
                            title={
                                <>
                                    <span>Cabin: {cabin.name}</span>
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setModal({ field: "updateCabin", idx: i })}
                                            className="px-3 py-1 bg-sky-500 text-white font-semibold text-xs rounded-lg"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleted(Number(cabin.id), String(cabin.cover?.id), i)}
                                            className="px-3 py-1 bg-red-500 text-white font-semibold text-xs rounded-lg"
                                        >
                                            {loading.stack === "deletedCabin" && Number(loading.field) === i ? (
                                                <IconLoader3 size={16} stroke={2} />
                                            ) : (
                                                <IconTrash size={16} stroke={2} />
                                            )}
                                        </button>
                                    </div>
                                </>
                            }
                            classHeading="flex items-center justify-between gap-5"
                            classBody="flex flex-col gap-y-3"
                        >
                            <CanvasImage src={cabin.cover?.source || "/assets/Image-not-found.png"} className="h-40" />
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <p className="font-bold">Type:</p>
                                    <p>{cabin.type}</p>
                                </div>
                                <div>
                                    <p className="font-bold">Capacity:</p>
                                    <p>{cabin.maxCapacity} people</p>
                                </div>
                                <div>
                                    <p className="font-bold">Price:</p>
                                    <p>IDR {cabin.price}</p>
                                </div>
                            </div>
                            <RichTextPreview value={cabin.description || ""} />
                        </Card>
                        {modal.field === `updateCabin` && modal.idx === i && (
                            <CabinModal fetchBoat={fetchBoat} setLoading={setLoading} setModal={setModal} cabin={cabin} modal={modal} />
                        )}
                    </React.Fragment>
                ))}
            {modal.field === `createCabin` && <CabinModal modal={modal} fetchBoat={fetchBoat} setLoading={setLoading} setModal={setModal} />}
        </Card>
    );
}

function CabinModal({
    setModal,
    modal,
    cabin,
    setLoading,
    fetchBoat,
}: {
    setModal: React.Dispatch<SetStateAction<{ field: string; idx?: number }>>;
    modal: { field: string; idx?: number };
    cabin?: ICabinResponse;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchBoat: () => Promise<void>;
}) {
    const { boatId } = useParams();
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const [body, setBody] = useState<ICabinRequestBody>({
        name: "",
        type: "TWIN",
        maxCapacity: 2,
        price: "0",
        description: "",
    });

    useEffect(() => {
        if (modal.field === "updateCabin" && cabin) {
            setBody({
                name: cabin.name,
                type: cabin.type,
                maxCapacity: Number(cabin.maxCapacity),
                price: String(cabin.price),
                description: cabin.description,
            });
        }
    }, [modal, cabin]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: modal.field === "createCabin" ? "Add New Cabin" : "Update Cabin" });

        try {
            const payload = {
                ...body,
                price: Number(body.price),
                maxCapacity: Number(body.maxCapacity),
            };

            if (modal.field === "createCabin") {
                const { data } = await api.post<ApiSuccessResponse>(`${process.env.NEXT_PUBLIC_API}/admin/boat/cabin/${boatId}`, payload, {
                    withCredentials: true,
                });

                const id = data.data;
                await uploadCover(`cabin_CABIN_0`, String(id), "CABIN", "COVER");
            } else if (cabin) {
                await api.put(`${process.env.NEXT_PUBLIC_API}/admin/boat/cabin/${cabin.id}`, payload, { withCredentials: true });

                const checkUploader = localStorage.getItem(`cabin_CABIN_0`);
                if (checkUploader && cabin.cover?.id) {
                    await api.delete(`${process.env.NEXT_PUBLIC_API}/upload/${cabin.cover.id}`);
                    await uploadCover(`cabin_CABIN_0`, String(cabin.id), "CABIN", "COVER");
                }
            }

            await cleanupStorage("cabin_CABIN_0", "cabinBody");
            localStorage.clear();
            await fetchBoat();
            setNotification({
                title: "Cabin",
                message: `Successfully ${modal.field === "createCabin" ? "created" : "updated"} cabin`,
            });
            setModal({ field: "" });
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };

    return (
        <div className="fixed overflow-y-scroll py-10 pt-20 z-50 top-0 left-0 right-0 w-full h-screen bg-white/20 backdrop-blur-md flex items-start justify-center">
            <Card
                classBody="bg-gray-50"
                className="w-8/12"
                title={
                    <div className="flex items-center justify-between gap-5">
                        <p>Cabin: {body.name}</p>
                        <button onClick={() => setModal({ field: "" })} type="button">
                            <IconX size={18} stroke={2} />
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-5 gap-y-3">
                    <div className="col-span-2">
                        <CoverUploader entityType="CABIN" entityId={"0"} storageKeyPrefix="cabin" />
                    </div>

                    <InputForm
                        title="name"
                        type="text"
                        value={body.name}
                        handleInputChange={handleInputChange}
                        label="Cabin Name"
                        isRequired
                        placeholder="Master Cabin..."
                    />

                    <SelectForm data={dataTypeCabin} label="type" title="Cabin Type" value={body.type} onChange={handleInputChange} />

                    <InputForm
                        title="maxCapacity"
                        type="number"
                        value={body.maxCapacity}
                        handleInputChange={handleInputChange}
                        label="Max Capacity"
                        isRequired
                    />

                    <InputForm
                        title="price"
                        type="currency"
                        value={Number(body.price)}
                        handleInputChange={handleInputChange}
                        label="Price"
                        isRequired
                        className="ps-7"
                    />

                    <div className="col-span-2">
                        <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase">Description</label>
                        <RichTextEditor
                            setContent={(content) => setBody((prev) => ({ ...prev, description: content }))}
                            content={String(body.description)}
                        />
                    </div>

                    <div className="col-span-2">
                        <SubmitButton
                            title="Save"
                            icon={<IconPlus size={16} stroke={2} />}
                            type="submit"
                            className="text-sm w-fit flex-row-reverse ms-auto"
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}
