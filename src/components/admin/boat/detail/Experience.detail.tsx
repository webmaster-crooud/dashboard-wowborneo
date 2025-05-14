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
import { RichTextPreview } from "~/components/ui/RichTextPreview";
import { errorAtom, notificationAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IExperienceRequestBody, IExperienceResponse } from "~/types/boat";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { cleanupStorage, uploadCover } from "~/utils/upload";
type propsExperienceDetail = {
    experiences: IExperienceResponse[];
    openSection: OPENSECTION | null;
    setOpenSection: React.Dispatch<SetStateAction<OPENSECTION | null>>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchBoat: () => Promise<void>;
    loading: { stack: string; field: string };
};
export function ExperienceBoatDetail({ experiences, openSection, setOpenSection, setLoading, fetchBoat, loading }: propsExperienceDetail) {
    const [modal, setModal] = useState<{ field: string; idx?: number }>({ field: "" });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);

    const handleDeleted = async (aboutId: number, coverId: string, idx: number) => {
        console.log(coverId);
        setLoading({ stack: "deletedExp", field: idx.toString() });
        try {
            await api.delete(`${process.env.NEXT_PUBLIC_API}/admin/boat/experience/${aboutId}`);
            setLoading({ stack: "submit", field: "Delete Cover Experience" });
            await api.delete(`${process.env.NEXT_PUBLIC_API}/upload/${coverId}`, {
                withCredentials: true,
            });
            setNotification({
                title: "Delete Experience",
                message: "Succesfully deleted Experience",
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
                    <span>Experience</span>
                    <div className="flex items-center justify-end gap-5">
                        <button
                            onClick={() => setModal({ field: "createExp" })}
                            type="button"
                            className="px-3 py-1 font-medium bg-brown rounded-lg text-white text-sm flex items-center justify-center gap-1"
                        >
                            <IconPlus size={18} stroke={2} /> <span>Create</span>
                        </button>
                        <button
                            className={`px-3 py-1 ${
                                openSection === "EXPERIENCE" ? "bg-red-500" : "bg-sky-500"
                            } flex items-center justify-center gap-1 text-white rounded-lg text-sm font-medium`}
                            onClick={() => setOpenSection(openSection === "EXPERIENCE" ? null : "EXPERIENCE")}
                            type="button"
                        >
                            {openSection === "EXPERIENCE" ? "Close" : "Open"}
                        </button>
                    </div>
                </>
            }
            classHeading={`flex items-center justify-between gap-5 ${openSection !== "EXPERIENCE" && "border-0"}`}
            classBody={`${openSection !== "EXPERIENCE" && "p-0"} grid grid-cols-2 gap-3`}
        >
            {openSection === "EXPERIENCE" &&
                experiences.map((exp, i) => (
                    <React.Fragment key={i}>
                        <Card
                            title={
                                <>
                                    <span>Experince: {exp.title}</span>{" "}
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setModal({ field: "updateExp", idx: i })}
                                            className="px-3 py-1 bg-sky-500 text-white font-semibold text-xs rounded-lg"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleted(Number(exp.id), String(exp.cover?.id), i)}
                                            className="px-3 py-1 bg-red-500 text-white font-semibold text-xs rounded-lg"
                                        >
                                            {loading.stack === "deletedExp" && Number(loading.field) === i ? (
                                                <IconLoader3 size={16} stroke={2} />
                                            ) : (
                                                <IconTrash size={16} stroke={2} />
                                            )}
                                        </button>
                                    </div>
                                </>
                            }
                            key={i}
                            classHeading="flex items-center justify-between gap-5"
                            classBody="flex flex-col gap-y-3"
                        >
                            <CanvasImage src={exp.cover?.source || "/assets/Image-not-found.png"} className="h-40" />
                            <RichTextPreview value={exp.description || ""} />
                        </Card>
                        {modal.field === `updateExp` && modal.idx === i && (
                            <ExperienceModal
                                fetchBoat={fetchBoat}
                                setLoading={setLoading}
                                setModal={setModal}
                                experience={exp} // Make sure this is the correct about item
                                modal={modal}
                            />
                        )}
                    </React.Fragment>
                ))}
            {modal.field === `createExp` && <ExperienceModal modal={modal} fetchBoat={fetchBoat} setLoading={setLoading} setModal={setModal} />}
        </Card>
    );
}

function ExperienceModal({
    setModal,
    modal,
    experience,
    setLoading,
    fetchBoat,
}: {
    setModal: React.Dispatch<SetStateAction<{ field: string; idx?: number }>>;
    modal: { field: string; idx?: number };
    experience?: IExperienceResponse;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchBoat: () => Promise<void>;
}) {
    const { boatId } = useParams();
    const setError = useSetAtom(errorAtom);
    const [body, setBody] = useState<IExperienceRequestBody>({ title: "", description: "" });
    useEffect(() => {
        if (modal.field === "updateExp") {
            setBody({ description: experience?.description || "", title: experience?.title || "" });
        }
    }, [modal, experience]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Add New Experience" });

        try {
            const { data } = await api.post<ApiSuccessResponse>(
                `${process.env.NEXT_PUBLIC_API}/admin/boat/experience/${boatId}`,
                { title: body.title, description: body.description },
                {
                    withCredentials: true,
                }
            );

            const id = data.data;
            setLoading({ stack: "upload", field: "Experience" });
            await uploadCover(`experience_EXPERIENCE_1`, String(id), "EXPERIENCE", "COVER");
            await cleanupStorage("experience_EXPERIENCE_1", "experienceBody");
            localStorage.clear();
            await fetchBoat();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
            setModal({ field: "" });
        }
    };
    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Add New Experience" });

        try {
            await api.put(
                `${process.env.NEXT_PUBLIC_API}/admin/boat/experience/${experience?.id}`,
                { title: body.title, description: body.description },
                {
                    withCredentials: true,
                }
            );

            const checkUploader = localStorage.getItem(`experience_EXPERIENCE_1`);
            if (checkUploader) {
                setLoading({ stack: "submit", field: "Delete Cover Experience" });
                await api.delete(`${process.env.NEXT_PUBLIC_API}/upload/${experience?.cover?.id}`, {
                    withCredentials: true,
                });
                setLoading({ stack: "upload", field: "Experience" });
                await uploadCover(`experience_EXPERIENCE_1`, String(experience?.id), "EXPERIENCE", "COVER");
                await cleanupStorage("experience_EXPERIENCE_1", "experienceBody");
                localStorage.clear();
            }
            await fetchBoat();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
            setModal({ field: "" });
        }
    };
    return (
        <div className="fixed overflow-y-scroll py-10 pt-20 z-50 top-0 left-0 right-0 w-full h-screen bg-white/20 backdrop-blur-md flex items-start justify-center">
            <Card
                classBody="bg-gray-50"
                className="w-8/12"
                title={
                    <div className="flex items-center justify-between gap-5">
                        <p>Experience: {body.title}</p>
                        <button onClick={() => setModal({ field: "" })} type="button">
                            <IconX size={18} stroke={2} />
                        </button>
                    </div>
                }
            >
                <form
                    onSubmit={
                        modal.field === "createExp" ? handleAddSubmit : modal.field === "updateExp" ? handleUpdateSubmit : (e) => e.preventDefault()
                    }
                    className="grid grid-cols-2 gap-x-5 gap-y-3"
                >
                    {/* COVER SECTION */}
                    <div className="col-span-2">
                        <CoverUploader entityType="EXPERIENCE" entityId={"1"} storageKeyPrefix="experience" />
                    </div>

                    <InputForm
                        title="title"
                        type="text"
                        value={body.title}
                        handleInputChange={handleInputChange}
                        label="Title"
                        isRequired
                        placeholder="Dayak Festival..."
                    />

                    <div className="col-span-2">
                        <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase" htmlFor={`description`}>
                            Description
                        </label>
                        <RichTextEditor
                            setContent={(content) =>
                                setBody((prev) => ({
                                    ...prev,
                                    description: content,
                                }))
                            }
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
