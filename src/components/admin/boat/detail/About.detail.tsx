"use client";

import { IconCloudUpload, IconLoader3, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { SetStateAction, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";
import { OPENSECTION } from "~/app/admin/boats/[boatId]/page";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";

import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";
import { RichTextPreview } from "~/components/ui/RichTextPreview";
import { errorAtom, notificationAtom } from "~/stores";
import { IAboutResponse } from "~/types/boat";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";

type propsAboutDetail = {
    abouts: IAboutResponse[];
    openSection: OPENSECTION | null;
    setOpenSection: React.Dispatch<SetStateAction<OPENSECTION | null>>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchBoat: () => Promise<void>;
    loading: { stack: string; field: string };
};

export function AboutBoatDetail({ abouts, openSection, setOpenSection, fetchBoat, setLoading, loading }: propsAboutDetail) {
    const [modal, setModal] = useState<{ field: string; idx?: number }>({ field: "" });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const handleDeleted = async (aboutId: number) => {
        setLoading({ stack: "deletedAbout", field: "" });
        try {
            await api.delete(`${process.env.NEXT_PUBLIC_API}/admin/boat/about/${aboutId}`);
            setNotification({
                title: "Delete About",
                message: "Succesfully deleted About",
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
                    <span>About</span>
                    <div className="flex items-center justify-end gap-5">
                        <button
                            onClick={() => setModal({ field: "createAbout" })}
                            type="button"
                            className="px-3 py-1 font-medium bg-brown rounded-lg text-white text-sm flex items-center justify-center gap-1"
                        >
                            <IconPlus size={18} stroke={2} /> <span>Create</span>
                        </button>
                        <button
                            className={`px-3 py-1 ${
                                openSection === "ABOUT" ? "bg-red-500" : "bg-sky-500"
                            } flex items-center justify-center gap-1 text-white rounded-lg text-sm font-medium`}
                            onClick={() => setOpenSection(openSection === "ABOUT" ? null : "ABOUT")}
                            type="button"
                        >
                            {openSection === "ABOUT" ? "Close" : "Open"}
                        </button>
                    </div>
                </>
            }
            classHeading={`flex items-center justify-between gap-5 ${openSection !== "ABOUT" && "border-0"}`}
            classBody={`${openSection !== "ABOUT" && "p-0"} grid grid-cols-2 gap-3`}
        >
            {openSection === "ABOUT" &&
                abouts.map((about, i) => (
                    <React.Fragment key={i}>
                        <Card
                            title={
                                <>
                                    <span>About: {about.title}</span>{" "}
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setModal({ field: "updateAbout", idx: i })}
                                            className="px-3 py-1 bg-sky-500 text-white font-semibold text-xs rounded-lg"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleted(Number(about.id))}
                                            className="px-3 py-1 bg-red-500 text-white font-semibold text-xs rounded-lg"
                                        >
                                            {loading.stack === "deletedAbout" ? (
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
                        >
                            <RichTextPreview value={about.description || ""} />
                        </Card>
                        {modal.field === `updateAbout` && modal.idx === i && (
                            <AboutModal
                                fetchBoat={fetchBoat}
                                setLoading={setLoading}
                                setModal={setModal}
                                about={about} // Make sure this is the correct about item
                                modal={modal}
                            />
                        )}
                    </React.Fragment>
                ))}
            {modal.field === `createAbout` && <AboutModal modal={modal} fetchBoat={fetchBoat} setLoading={setLoading} setModal={setModal} />}
        </Card>
    );
}

type propsAboutModal = {
    className?: string;
    about?: IAboutResponse;
    setModal: React.Dispatch<SetStateAction<{ field: string; idx?: number }>>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchBoat: () => Promise<void>;
    modal: { field: string; idx?: number };
};
function AboutModal({ className, setModal, setLoading, fetchBoat, about, modal }: propsAboutModal) {
    const [body, setBody] = useState<{ id: number | number; title: string; description: string | null }>({ id: 0, title: "", description: "" });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const { boatId } = useParams();
    useEffect(() => {
        if (about) {
            setBody({ description: about.description || "", title: about.title || "", id: Number(about.id) });
        }
    }, [about]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Upload New About" });
        try {
            await api.post(
                `${process.env.NEXT_PUBLIC_API}/admin/boat/about/${boatId}`,
                {
                    title: body.title,
                    description: body.description,
                },
                {
                    withCredentials: true,
                }
            );
            await fetchBoat();
            setNotification({
                title: "Add About",
                message: "Successfully to add new about",
            });
            setModal({ field: "", idx: 0 });
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ field: "", stack: "" });
        }
    };

    const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: `Updating ${body.title} About` });
        try {
            await api.put(
                `${process.env.NEXT_PUBLIC_API}/admin/boat/about/${about?.id}`,
                {
                    title: body.title,
                    description: body.description,
                },
                {
                    withCredentials: true,
                }
            );
            await fetchBoat();
            setNotification({
                title: "Update About " + body.title,
                message: "Successfully to update about",
            });
            setModal({ field: "", idx: 0 });
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ field: "", stack: "" });
        }
    };
    return (
        <div
            className={twMerge(
                "fixed z-[60] bg-gray-50/20 backdrop-blur-sm top-0 left-0 right-0 w-full h-screen flex items-start justify-center pt-20",
                className
            )}
        >
            <Card
                title={
                    <>
                        <span>Add New About</span>
                        <button type="button" onClick={() => setModal({ field: "", idx: 0 })}>
                            <IconX />
                        </button>
                    </>
                }
                className="w-6/12"
                classBody="bg-gray-50"
                classHeading="flex items-center justify-between gap-5"
            >
                <form
                    onSubmit={
                        modal.field === "createAbout"
                            ? handleAddSubmit
                            : modal.field === "updateAbout"
                            ? handleUpdateSubmit
                            : (e) => e.preventDefault()
                    }
                    className="grid grid-cols-2 gap-5"
                >
                    <InputForm
                        title="title"
                        placeholder="About...."
                        value={body.title}
                        label="Title"
                        type="text"
                        handleInputChange={handleInputChange}
                        isRequired
                    />
                    <div className="col-span-2">
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
                    <SubmitButton type="submit" title="Save" icon={<IconCloudUpload size={20} stroke={2} />} />
                </form>
            </Card>
        </div>
    );
}
