"use client";
import { IconCalendar, IconEdit, IconLoader3, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
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
import { destinationBodyAtom } from "~/stores/cruise.store";
import { ApiSuccessResponse, STATUS } from "~/types";
import { ICruiseResponseDetail, IDestinationBody } from "~/types/cruise";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { cleanupStorage, uploadCover } from "~/utils/upload";

type propsDestinationDetailCruise = {
    cruise: ICruiseResponseDetail;
    setOpenSection: React.Dispatch<SetStateAction<OPENSECTION | null>>;
    openSection: OPENSECTION | null;
    modal: string;
    setModal: React.Dispatch<SetStateAction<string>>;
    fetchCruise: () => Promise<void>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    loading: { stack: string; field: string };
};
export function DestinationDetailCruise({
    loading,
    setLoading,
    cruise,
    openSection,
    setOpenSection,
    modal,
    setModal,
    fetchCruise,
}: propsDestinationDetailCruise) {
    const setError = useSetAtom(errorAtom);
    const handleDelete = async (id: string | number, action: STATUS) => {
        setLoading({ stack: "delete", field: `destination-${id}` });
        try {
            await api.patch(
                `${process.env.NEXT_PUBLIC_API}/admin/destination/${id}?action=${action}`,
                {},
                {
                    withCredentials: true,
                }
            );

            setLoading({ stack: "submit", field: `Deleted cover destination-${id}` });
            fetchCruise();
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
                        <span>Destination of {cruise.title}</span>
                        <div className="flex items-center justify-end gap-5">
                            <SubmitButton
                                title="Destination"
                                className="py-1 text-sm font-medium"
                                icon={<IconPlus stroke={2} size={20} />}
                                type="button"
                                onClick={() => setModal("addDestination")}
                            />
                            {openSection === "DESTINATION" ? (
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
                                    onClick={() => setOpenSection("DESTINATION")}
                                >
                                    Open
                                </button>
                            )}
                        </div>
                    </>
                }
                classHeading={`flex items-center justify-between gap-5 ${openSection !== "DESTINATION" && "border-0"}`}
                classBody={`${openSection !== "DESTINATION" && "p-0"} flex flex-col gap-y-3`}
            >
                {openSection === "DESTINATION" &&
                    cruise.destinations
                        .map((destination) => ({ ...destination, days: Number(destination.days) })) // Convert days to number
                        .sort((a, b) => a.days - b.days) // Sort by days
                        .map((destination, i) => (
                            <React.Fragment key={i}>
                                <div className="flex flex-col md:flex-row gap-5 items-start justify-start bg-gray-200 p-3 border border-gray-600 rounded-lg">
                                    <CanvasImage
                                        className="h-40 w-full md:w-4/12"
                                        src={`${!destination.cover ? "/assets/Image-not-found.png" : destination.cover.source}`}
                                    />

                                    <div className="flex flex-col w-full gap-y-2">
                                        <header className="flex items-center justify-between gap-5 w-full">
                                            <p className="text-sm font-bold uppercase">{destination.title}</p>
                                            <div className="flex items-center justify-end gap-5">
                                                <SubmitButton
                                                    title="Edit"
                                                    icon={<IconEdit size={16} stroke={2} />}
                                                    className="text-xs py-1.5 px-3 bg-sky-500 text-gray-50 hover:bg-sky-600 border-sky-500"
                                                    type="button"
                                                    onClick={() => setModal(`editDestination-${destination.id}`)}
                                                />
                                                <SubmitButton
                                                    title="Delete"
                                                    disabled={loading.stack === "delete" && loading.field === `destination-${destination.id}`}
                                                    onClick={() => handleDelete(String(destination.id), "DELETED")}
                                                    icon={
                                                        loading.stack === "delete" && loading.field === `destination-${destination.id}` ? (
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
                                        <div className="flex items-center justify-start gap-2">
                                            <h2 className="uppercase text-gray-700 text-xs font-bold flex items-center justify-start gap-1">
                                                <IconCalendar size={16} stroke={2} /> Day:
                                            </h2>
                                            <span className="text-xs text-black font-medium">{destination.days}</span>
                                        </div>
                                        <Card title="Description" classHeading="text-xs uppercase font-bold bg-gray-50">
                                            <RichTextPreview value={String(destination.description)} />
                                        </Card>
                                    </div>
                                </div>
                                {modal === `editDestination-${destination.id}` && (
                                    <ModalEditDestination fetchCruise={fetchCruise} setLoading={setLoading} data={destination} setModal={setModal} />
                                )}
                            </React.Fragment>
                        ))}
            </Card>

            {modal === "addDestination" && (
                <ModalAddNewDestination fetchCruise={fetchCruise} setLoading={setLoading} cruise={cruise} setModal={setModal} />
            )}
        </>
    );
}

function ModalAddNewDestination({
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
    const [destination, setDestination] = useAtom(destinationBodyAtom);
    useEffect(() => {
        setDestination((prev) => (Array.isArray(prev) ? prev.map((dest) => ({ ...dest, status: cruise.status })) : []));
    }, [setDestination, cruise.status]);

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDestination((prev) =>
            Array.isArray(prev) ? prev.map((dest, i) => (i === index ? { ...dest, [name]: name === "days" ? String(value) : value } : dest)) : []
        );
    };
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Add New Destination" });

        try {
            const { data } = await api.post<ApiSuccessResponse<{ result: number }>>(
                `${process.env.NEXT_PUBLIC_API}/admin/destination/${cruise.id}`,
                { destination },
                {
                    withCredentials: true,
                }
            );

            const id = data.data.result;
            setLoading({ stack: "upload", field: "destination" });
            await uploadCover(`coverImageId_DESTINATION_0`, String(id), "DESTINATION", "COVER");
            await cleanupStorage("coverImageId_DESTINATION_0", "destinationBody");
            localStorage.clear();
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
            {destination.map((dest, i) => (
                <Card
                    classBody="bg-gray-50"
                    className="w-8/12"
                    title={
                        <div className="flex items-center justify-between gap-5">
                            <p>Destination: {dest.title}</p>
                            <button onClick={() => setModal("")} type="button">
                                <IconX size={18} stroke={2} />
                            </button>
                        </div>
                    }
                    key={i}
                >
                    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {/* COVER SECTION */}
                        <div className="col-span-2">
                            <CoverUploader entityType="DESTINATION" entityId={i.toString()} storageKeyPrefix="coverImageId" />
                        </div>

                        <InputForm
                            title="title"
                            type="text"
                            value={dest.title}
                            handleInputChange={(e) => handleInputChange(i, e)}
                            label="Title"
                            isRequired
                            placeholder="Dayak Festival..."
                        />

                        <InputForm title="days" type="number" value={dest.days} handleInputChange={(e) => handleInputChange(i, e)} placeholder="1" />

                        <div className="col-span-2">
                            <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase" htmlFor={`description-${i}`}>
                                Description
                            </label>
                            <RichTextEditor
                                setContent={(content) =>
                                    setDestination((prev) =>
                                        Array.isArray(prev) ? prev.map((d, idx) => (idx === i ? { ...d, description: content } : d)) : []
                                    )
                                }
                                content={String(dest.description)}
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

function ModalEditDestination({
    setModal,
    data,
    setLoading,
    fetchCruise,
}: {
    setModal: React.Dispatch<SetStateAction<string>>;
    data: IDestinationBody;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchCruise: () => Promise<void>;
}) {
    const [destination, setDestination] = useState<IDestinationBody>({
        days: "",
        description: "",
        status: "ACTIVED",
        title: "",
    });
    const setError = useSetAtom(errorAtom);
    useEffect(() => {
        setDestination(data);
    }, [data]);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDestination((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Update destination" });
        try {
            const checkUploader = localStorage.getItem(`coverImageId_DESTINATION_${destination.id}`);

            if (!checkUploader) {
                await api.put(
                    `${process.env.NEXT_PUBLIC_API}/admin/destination/${destination.id}`,
                    { title: destination.title, description: destination.description, days: String(destination.days), status: destination.status },
                    {
                        withCredentials: true,
                    }
                );
            } else {
                await api.put(
                    `${process.env.NEXT_PUBLIC_API}/admin/destination/${destination.id}`,
                    { title: destination.title, description: destination.description, days: String(destination.days), status: destination.status },
                    {
                        withCredentials: true,
                    }
                );
                setLoading({ stack: "upload", field: "Delete Cover Destination" });
                await api.delete(`${process.env.NEXT_PUBLIC_API}/upload/${destination.cover?.id}`, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });
                setLoading({ stack: "upload", field: "Update Cover Destination" });
                await uploadCover(`coverImageId_DESTINATION_${destination.id}`, String(destination.id), "DESTINATION", "COVER");
            }
            setModal("");
            await cleanupStorage("coverImageId_DESTINATION_0", "destinationBody");
            localStorage.clear();
            await fetchCruise();
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
                        <p>Destination: {destination.title}</p>
                        <button onClick={() => setModal("")} type="button">
                            <IconX size={18} stroke={2} />
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-x-5 gap-y-3">
                    {/* COVER SECTION */}
                    <div className="col-span-2">
                        <CoverUploader entityType="DESTINATION" entityId={String(destination.id)} storageKeyPrefix="coverImageId" />
                    </div>

                    <InputForm
                        title="title"
                        type="text"
                        value={destination.title}
                        handleInputChange={handleInputChange}
                        label="Title"
                        isRequired
                        placeholder="Dayak Festival..."
                    />

                    <InputForm title="days" type="number" value={destination.days} handleInputChange={handleInputChange} placeholder="1" />

                    <div className="col-span-2">
                        <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase" htmlFor={`description`}>
                            Description
                        </label>
                        <RichTextEditor
                            setContent={(content) =>
                                setDestination((prev) => ({
                                    ...prev,
                                    description: content,
                                }))
                            }
                            content={String(destination.description)}
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
