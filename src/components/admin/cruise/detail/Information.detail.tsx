"use client";
import { IconEdit, IconLoader3, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
import { SetStateAction, useSetAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { OPENSECTION } from "~/app/admin/cruises/[cruiseId]/page";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";
import { RichTextPreview } from "~/components/ui/RichTextPreview";
import { errorAtom } from "~/stores";
import { ICruiseResponseDetail, IInformationBody } from "~/types/cruise";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";

type PropsInformationDetailCruise = {
    cruise: ICruiseResponseDetail;
    setOpenSection: React.Dispatch<SetStateAction<OPENSECTION | null>>;
    openSection: OPENSECTION | null;
    modal: string;
    setModal: React.Dispatch<SetStateAction<string>>;
    fetchCruise: () => Promise<void>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    loading: { stack: string; field: string };
};

export function InformationDetailCruise({
    loading,
    setLoading,
    cruise,
    openSection,
    setOpenSection,
    modal,
    setModal,
    fetchCruise,
}: PropsInformationDetailCruise) {
    const setError = useSetAtom(errorAtom);

    const handleDelete = async (id: string | number) => {
        setLoading({ stack: "delete", field: `information-${id}` });
        try {
            await api.delete(`${process.env.NEXT_PUBLIC_API}/admin/information/${id}`, { withCredentials: true });
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
                        <span>Informations of {cruise.title}</span>
                        <div className="flex items-center justify-end gap-5">
                            <SubmitButton
                                title="Information"
                                className="py-1 text-sm font-medium"
                                icon={<IconPlus stroke={2} size={20} />}
                                type="button"
                                onClick={() => setModal("addInformation")}
                            />
                            {openSection === "INFORMATION" ? (
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
                                    onClick={() => setOpenSection("INFORMATION")}
                                >
                                    Open
                                </button>
                            )}
                        </div>
                    </>
                }
                classHeading={`flex items-center justify-between gap-5 ${openSection !== "INFORMATION" && "border-0"}`}
                classBody={`${openSection !== "INFORMATION" && "p-0"} flex flex-col gap-y-3`}
            >
                {openSection === "INFORMATION" &&
                    cruise.informations.map((information, i) => (
                        <React.Fragment key={i}>
                            <div className="flex flex-col gap-5 items-start justify-start bg-gray-200 p-3 border border-gray-600 rounded-lg">
                                <div className="flex flex-col w-full gap-y-2">
                                    <header className="flex items-center justify-between gap-5 w-full">
                                        <p className="text-sm font-bold uppercase">{information.title}</p>
                                        <div className="flex items-center justify-end gap-5">
                                            <SubmitButton
                                                title="Edit"
                                                icon={<IconEdit size={16} stroke={2} />}
                                                className="text-xs py-1.5 px-3 bg-sky-500 text-gray-50 hover:bg-sky-600 border-sky-500"
                                                type="button"
                                                onClick={() => setModal(`editInformation-${information.id}`)}
                                            />
                                            <SubmitButton
                                                title="Delete"
                                                disabled={loading.stack === "delete" && loading.field === `information-${information.id}`}
                                                onClick={() => handleDelete(String(information.id))}
                                                icon={
                                                    loading.stack === "delete" && loading.field === `information-${information.id}` ? (
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
                                    <Card title="Text" classHeading="text-xs uppercase font-bold bg-gray-50">
                                        <RichTextPreview value={String(information.text)} />
                                    </Card>
                                </div>
                            </div>
                            {modal === `editInformation-${information.id}` && (
                                <ModalEditInformation fetchCruise={fetchCruise} setLoading={setLoading} data={information} setModal={setModal} />
                            )}
                        </React.Fragment>
                    ))}
            </Card>

            {modal === "addInformation" && (
                <ModalAddNewInformation fetchCruise={fetchCruise} setLoading={setLoading} cruise={cruise} setModal={setModal} />
            )}
        </>
    );
}

function ModalAddNewInformation({
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
    const [informations, setInformations] = useState<IInformationBody>({ text: "", title: "" });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInformations((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Add New Information" });

        try {
            await api.post(
                `${process.env.NEXT_PUBLIC_API}/admin/information/${cruise.id}`,
                { title: informations.title, text: informations.text },
                { withCredentials: true }
            );
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
                        <p>Information: {informations.title}</p>
                        <button onClick={() => setModal("")} type="button">
                            <IconX size={18} stroke={2} />
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-3">
                    <InputForm
                        title="title"
                        type="text"
                        value={informations.title}
                        handleInputChange={handleInputChange}
                        label="Title"
                        isRequired
                        placeholder="Important Notice..."
                    />

                    <div className="col-span-2">
                        <label className="font-bold mb-2 flex text-xs items-center justify-start gap-1 uppercase">Text</label>
                        <RichTextEditor
                            setContent={(content) =>
                                setInformations((prev) => ({
                                    ...prev,
                                    text: content,
                                }))
                            }
                            content={String(informations.text)}
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

function ModalEditInformation({
    setModal,
    data,
    setLoading,
    fetchCruise,
}: {
    setModal: React.Dispatch<SetStateAction<string>>;
    data: IInformationBody;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchCruise: () => Promise<void>;
}) {
    const [information, setInformation] = useState<IInformationBody>({
        title: "",
        text: "",
    });
    const setError = useSetAtom(errorAtom);

    useEffect(() => {
        setInformation(data);
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInformation((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Update information" });

        try {
            await api.put(`${process.env.NEXT_PUBLIC_API}/admin/information/${information.id}`, { ...information }, { withCredentials: true });
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
                        <p>Information: {information.title}</p>
                        <button onClick={() => setModal("")} type="button">
                            <IconX size={18} stroke={2} />
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-y-3">
                    <InputForm
                        title="title"
                        type="text"
                        value={information.title}
                        handleInputChange={handleInputChange}
                        label="Title"
                        isRequired
                        placeholder="Important Notice..."
                    />

                    <div className="col-span-2">
                        <label className="font-bold mb-2 flex items-center justify-start gap-1 text-xs uppercase">Text</label>
                        <RichTextEditor
                            setContent={(content) => setInformation((prev) => ({ ...prev, text: content }))}
                            content={String(information.text)}
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
