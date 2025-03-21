"use client";
import { IconEdit, IconLoader3, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { SetStateAction, useAtom, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { OPENSECTION } from "~/app/admin/cruises/[cruiseId]/page";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { CanvasImage } from "~/components/ui/CanvasImage";
import { Card } from "~/components/ui/Card";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { RichTextPreview } from "~/components/ui/RichTextPreview";
import { errorAtom } from "~/stores";
import { highlightBodyAtom } from "~/stores/cruise.store";
import { ApiSuccessResponse } from "~/types";
import { ICruiseResponseDetail, IHighlightBody } from "~/types/cruise";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { cleanupStorage, uploadCover } from "~/utils/upload";

type PropsHighlightDetailCruise = {
    cruise: ICruiseResponseDetail;
    setOpenSection: React.Dispatch<SetStateAction<OPENSECTION | null>>;
    openSection: OPENSECTION | null;
    modal: string;
    setModal: React.Dispatch<SetStateAction<string>>;
    fetchCruise: () => Promise<void>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    loading: { stack: string; field: string };
};

export function HighlightDetailCruise({
    loading,
    setLoading,
    cruise,
    openSection,
    setOpenSection,
    modal,
    setModal,
    fetchCruise,
}: PropsHighlightDetailCruise) {
    const setError = useSetAtom(errorAtom);

    const handleDelete = async (id: string | number) => {
        setLoading({ stack: "delete", field: `highlight-${id}` });
        try {
            await api.delete(`${process.env.NEXT_PUBLIC_API}/admin/highlight/${id}`, { withCredentials: true });
            await fetchCruise();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };

    return (
        <>
            <Card
                title={
                    <>
                        <span>Highlights of {cruise.title}</span>
                        <div className="flex items-center justify-end gap-5">
                            <SubmitButton
                                title="Highlight"
                                className="py-1 text-sm font-medium"
                                icon={<IconPlus stroke={2} size={20} />}
                                type="button"
                                onClick={() => setModal("addHighlight")}
                            />
                            {openSection === "HIGHLIGHT" ? (
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
                                    onClick={() => setOpenSection("HIGHLIGHT")}
                                >
                                    Open
                                </button>
                            )}
                        </div>
                    </>
                }
                classHeading={`flex items-center justify-between gap-5 ${openSection !== "HIGHLIGHT" && "border-0"}`}
                classBody={`${openSection !== "HIGHLIGHT" && "p-0"} flex flex-col gap-y-3`}
            >
                {openSection === "HIGHLIGHT" &&
                    cruise.highlights.map((highlight, i) => (
                        <React.Fragment key={i}>
                            <div className="flex flex-col md:flex-row gap-5 items-start justify-start bg-gray-200 p-3 border border-gray-600 rounded-lg">
                                <CanvasImage className="h-40 w-full md:w-4/12" src={highlight.cover?.source || "/assets/Image-not-found.png"} />

                                <div className="flex flex-col w-full gap-y-2">
                                    <header className="flex items-center justify-between gap-5 w-full">
                                        <p className="text-sm font-bold uppercase">{highlight.title}</p>
                                        <div className="flex items-center justify-end gap-5">
                                            <SubmitButton
                                                title="Edit"
                                                icon={<IconEdit size={16} stroke={2} />}
                                                className="text-xs py-1.5 px-3 bg-sky-500 text-gray-50 hover:bg-sky-600 border-sky-500"
                                                type="button"
                                                onClick={() => setModal(`editHighlight-${highlight.id}`)}
                                            />
                                            <SubmitButton
                                                title="Delete"
                                                disabled={loading.stack === "delete" && loading.field === `highlight-${highlight.id}`}
                                                onClick={() => handleDelete(String(highlight.id))}
                                                icon={
                                                    loading.stack === "delete" && loading.field === `highlight-${highlight.id}` ? (
                                                        <IconLoader3 className="animate-spin" size={16} stroke={2} />
                                                    ) : (
                                                        <IconTrash size={16} stroke={2} />
                                                    )
                                                }
                                                className="text-xs py-1.5 px-3 bg-red-500 text-gray-50 hover:bg-red-600 border-red-500"
                                                type="button"
                                            />
                                        </div>
                                    </header>
                                    <Card title="Description" classHeading="text-xs uppercase font-bold bg-gray-50">
                                        <RichTextPreview value={String(highlight.description)} />
                                    </Card>
                                </div>
                            </div>
                            {modal === `editHighlight-${highlight.id}` && (
                                <ModalEditHighlight fetchCruise={fetchCruise} setLoading={setLoading} data={highlight} setModal={setModal} />
                            )}
                        </React.Fragment>
                    ))}
            </Card>

            {modal === "addHighlight" && (
                <ModalAddNewHighlight fetchCruise={fetchCruise} setLoading={setLoading} cruise={cruise} setModal={setModal} />
            )}
        </>
    );
}

function ModalAddNewHighlight({
    setModal,
    cruise,
    setLoading,
    fetchCruise,
}: {
    setModal: React.Dispatch<SetStateAction<string>>;
    cruise: ICruiseResponseDetail;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchCruise: () => Promise<void>;
}) {
    const setError = useSetAtom(errorAtom);
    const [highlights, setHighlights] = useAtom(highlightBodyAtom);

    useEffect(() => {
        setHighlights((prev) => prev.map((hl) => ({ ...hl, status: cruise.status })));
    }, [setHighlights, cruise.status]);

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHighlights((prev) => prev.map((hl, i) => (i === index ? { ...hl, [name]: value } : hl)));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Add New Highlight" });

        try {
            const { data } = await api.post<ApiSuccessResponse<{ result: number }>>(
                `${process.env.NEXT_PUBLIC_API}/admin/highlight/${cruise.id}`,
                { highlights },
                { withCredentials: true }
            );

            const id = data.data.result;
            setLoading({ stack: "upload", field: "highlight" });
            await uploadCover(`coverImageId_HIGHLIGHT_0`, String(id), "HIGHLIGHT", "COVER");
            await cleanupStorage();
            await fetchCruise();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
            setModal("");
        }
    };

    return (
        <div className="fixed overflow-y-scroll py-10 pt-20 z-50 top-0 left-0 right-0 w-full h-screen bg-white/20 backdrop-blur-md flex items-start justify-center">
            {highlights.map((highlight, i) => (
                <Card
                    classBody="bg-gray-50"
                    className="w-8/12"
                    title={
                        <div className="flex items-center justify-between gap-5">
                            <p>Highlight: {highlight.title}</p>
                            <button onClick={() => setModal("")} type="button">
                                <IconX size={18} stroke={2} />
                            </button>
                        </div>
                    }
                    key={i}
                >
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-5 gap-y-3">
                        <div className="col-span-2">
                            <CoverUploader entityType="HIGHLIGHT" entityId={i.toString()} storageKeyPrefix="coverImageId" />
                        </div>

                        <InputForm
                            title="title"
                            type="text"
                            value={highlight.title}
                            handleInputChange={(e) => handleInputChange(i, e)}
                            label="Title"
                            isRequired
                            placeholder="Exclusive Experience..."
                            className="col-span-2"
                        />

                        <div className="col-span-2">
                            <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase">Description</label>
                            <RichTextEditor
                                setContent={(content) =>
                                    setHighlights((prev) => prev.map((hl, idx) => (idx === i ? { ...hl, description: content } : hl)))
                                }
                                content={String(highlight.description)}
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
            ))}
        </div>
    );
}

function ModalEditHighlight({
    setModal,
    data,
    setLoading,
    fetchCruise,
}: {
    setModal: React.Dispatch<SetStateAction<string>>;
    data: IHighlightBody;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchCruise: () => Promise<void>;
}) {
    const [highlight, setHighlight] = useState<IHighlightBody>({
        title: "",
        description: "",
    });
    const setError = useSetAtom(errorAtom);

    useEffect(() => {
        setHighlight(data);
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setHighlight((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Update highlight" });

        try {
            const checkUploader = localStorage.getItem(`coverImageId_HIGHLIGHT_${highlight.id}`);

            await api.put(
                `${process.env.NEXT_PUBLIC_API}/admin/highlight/${Number(highlight.id)}`,
                { title: highlight.title, description: highlight.description },
                { withCredentials: true }
            );

            if (checkUploader) {
                setLoading({ stack: "upload", field: "Delete Cover Highlight" });
                await api.delete(`${process.env.NEXT_PUBLIC_API}/upload/${Number(highlight.cover?.id)}`, {
                    withCredentials: true,
                });

                setLoading({ stack: "upload", field: "Update Cover Highlight" });
                await uploadCover(`coverImageId_HIGHLIGHT_${highlight.id}`, String(highlight.id), "HIGHLIGHT", "COVER");
            }

            await cleanupStorage();
            await fetchCruise();
            setModal("");
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
                        <p>Highlight: {highlight.title}</p>
                        <button onClick={() => setModal("")} type="button">
                            <IconX size={18} stroke={2} />
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-x-5 gap-y-3">
                    <div className="col-span-2">
                        <CoverUploader entityType="HIGHLIGHT" entityId={String(highlight.id)} storageKeyPrefix="coverImageId" />
                    </div>

                    <InputForm
                        title="title"
                        type="text"
                        value={highlight.title}
                        handleInputChange={handleInputChange}
                        label="Title"
                        isRequired
                        placeholder="Exclusive Experience..."
                        className="col-span-2"
                    />

                    <div className="col-span-2">
                        <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase">Description</label>
                        <RichTextEditor
                            setContent={(content) => setHighlight((prev) => ({ ...prev, description: content }))}
                            content={String(highlight.description)}
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
