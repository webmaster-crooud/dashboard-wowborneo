"use client";

import { IconCloudUpload, IconLoader3, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { SetStateAction, useSetAtom } from "jotai";
import React from "react";
import { OPENSECTION } from "~/app/admin/cruises/[cruiseId]/page";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { CanvasImage } from "~/components/ui/CanvasImage";
import { Card } from "~/components/ui/Card";
import { MultipleUploader } from "~/components/ui/Form/MultipleFile.form";
import { errorAtom, notificationAtom } from "~/stores";
import { ICruiseResponseDetail } from "~/types/cruise";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { cleanupStorage, uploadMultipleImages } from "~/utils/upload";

type propsContentDetailCruise = {
    cruise: ICruiseResponseDetail;
    setOpenSection: React.Dispatch<SetStateAction<OPENSECTION | null>>;
    openSection: OPENSECTION | null;
    modal: string;
    setModal: React.Dispatch<SetStateAction<string>>;
    fetchCruise: () => Promise<void>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    loading: { stack: string; field: string };
};
export function ContentDetailCruise({
    loading,
    setLoading,
    cruise,
    openSection,
    setOpenSection,
    modal,
    setModal,
    fetchCruise,
}: propsContentDetailCruise) {
    const setError = useSetAtom(errorAtom);
    const handleDeleteGallery = async (imageId: number | undefined) => {
        setLoading({ stack: "delete", field: "" });
        try {
            if (!imageId) {
                setError({ message: "Delete gallery is failed" });
            }
            await api.delete(`${process.env.NEXT_PUBLIC_API}/upload/${imageId}`, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            fetchCruise();
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
                    <span>Content of {cruise.title}</span>
                    {openSection === "CONTENT" ? (
                        <button
                            className="text-sm font-semibold uppercase bg-red-600 text-white px-3 rounded-lg py-1"
                            type="button"
                            onClick={() => setOpenSection(null)}
                        >
                            Close
                        </button>
                    ) : (
                        <button
                            className="text-sm font-semibold uppercase bg-sky-600 text-white px-3 rounded-lg py-1"
                            type="button"
                            onClick={() => setOpenSection("CONTENT")}
                        >
                            Open
                        </button>
                    )}
                </>
            }
            classHeading={`flex items-center justify-between gap-5 ${openSection !== "CONTENT" && "border-0"}`}
            classBody={`${openSection !== "CONTENT" && "p-0"} flex flex-col gap-y-3`}
        >
            {openSection === "CONTENT" && (
                <>
                    <div className="flex items-center justify-start gap-2">
                        <h2 className="uppercase text-gray-700 text-xs font-bold flex items-center justify-start gap-1">Introduction Title:</h2>
                        <span className="text-xs text-black font-medium">{cruise.introductionTitle}</span>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                        <h2 className="uppercase text-gray-700 text-xs font-bold flex items-center justify-start gap-1">Introduction Text:</h2>
                        <span className="text-xs text-black font-medium">{cruise.introductionText}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="uppercase text-gray-700 text-xs font-bold flex items-center justify-start gap-1">Gallery:</h2>
                        <div className="grid grid-cols-4 gap-5">
                            {cruise.gallery.map((gal, i) => (
                                <div key={i} className="relative w-full h-full">
                                    <CanvasImage src={gal.source} alt={gal.alt || ""} className="h-40" />
                                    <div className="absolute top-2 right-2">
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteGallery(gal.id)}
                                            className="rounded-full flex items-center justify-center w-8 h-8 bg-red-600 text-gray-50"
                                            disabled={loading.stack === "delete"}
                                        >
                                            {loading.stack === "delete" ? (
                                                <IconLoader3 className="animate-spin" size={16} stroke={2} />
                                            ) : (
                                                <IconTrash size={16} stroke={2} />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {cruise.gallery.length < 8 && (
                                <SubmitButton title="" onClick={() => setModal("addGallery")} icon={<IconPlus />} type="button" />
                            )}
                        </div>
                    </div>
                    {modal === "addGallery" && (
                        <ModalAddGallery loading={loading} setLoading={setLoading} fetchCruise={fetchCruise} setModal={setModal} cruise={cruise} />
                    )}
                </>
            )}
        </Card>
    );
}

function ModalAddGallery({
    cruise,
    setModal,
    fetchCruise,
    setLoading,
    loading,
}: {
    cruise: ICruiseResponseDetail;
    setModal: React.Dispatch<SetStateAction<string>>;
    fetchCruise: () => Promise<void>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    loading: { stack: string; field: string };
}) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Add Galleries" });
        try {
            await uploadMultipleImages(`photoCruiseId_CRUISE_${cruise.id}`, String(cruise.id), "CRUISE", "PHOTO");

            // 6. Bersihkan storage
            await cleanupStorage("photoCruiseId_CRUISE_", "cruiseBody");
            localStorage.clear();
            fetchCruise();
            setNotification({
                title: "Add Galleries River Cruise",
                message: "Successfully to add new data galleries",
            });
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
            setModal("");
        }
    };
    return (
        <div className="fixed top-0 left-0 right-0 w-full h-screen z-50 flex items-center justify-center bg-white/20 backdrop-blur">
            <Card
                classHeading="flex items-center justify-between gap-5"
                title={
                    <>
                        <span>Add New Galleries</span>
                        <button
                            onClick={() => {
                                setModal("");
                                fetchCruise();
                            }}
                        >
                            <IconX size={20} stroke={2} />
                        </button>
                    </>
                }
                classBody="bg-gray-50"
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-y-5">
                    <MultipleUploader
                        entityId={cruise.id || ""}
                        entityType="CRUISE"
                        imageType="PHOTO"
                        storageKeyPrefix="photoCruiseId"
                        maxFiles={8 - cruise.gallery.length}
                    />

                    <SubmitButton type="submit" disabled={loading.stack === "submit"} title="Add" icon={<IconCloudUpload stroke={2} size={18} />} />
                </form>
            </Card>
        </div>
    );
}
