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
import { ICruiseResponseDetail, IIncludeBody } from "~/types/cruise";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";

type PropsIncludeDetailCruise = {
    cruise: ICruiseResponseDetail;
    setOpenSection: React.Dispatch<SetStateAction<OPENSECTION | null>>;
    openSection: OPENSECTION | null;
    modal: string;
    setModal: React.Dispatch<SetStateAction<string>>;
    fetchCruise: () => Promise<void>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    loading: { stack: string; field: string };
};

export function IncludeDetailCruise({
    loading,
    setLoading,
    cruise,
    openSection,
    setOpenSection,
    modal,
    setModal,
    fetchCruise,
}: PropsIncludeDetailCruise) {
    const setError = useSetAtom(errorAtom);

    const handleDelete = async (id: string | number) => {
        setLoading({ stack: "delete", field: `include-${id}` });
        try {
            await api.delete(`${process.env.NEXT_PUBLIC_API}/admin/include/${id}`, { withCredentials: true });
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
                        <span>Includes of {cruise.title}</span>
                        <div className="flex items-center justify-end gap-5">
                            <SubmitButton
                                title="Include"
                                className="py-1 text-sm font-medium"
                                icon={<IconPlus stroke={2} size={20} />}
                                type="button"
                                onClick={() => setModal("addInclude")}
                            />
                            {openSection === "INCLUDE" ? (
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
                                    onClick={() => setOpenSection("INCLUDE")}
                                >
                                    Open
                                </button>
                            )}
                        </div>
                    </>
                }
                classHeading={`flex items-center justify-between gap-5 ${openSection !== "INCLUDE" && "border-0"}`}
                classBody={`${openSection !== "INCLUDE" && "p-0"} flex flex-col gap-y-3`}
            >
                {openSection === "INCLUDE" &&
                    cruise.include.map((include, i) => (
                        <React.Fragment key={i}>
                            <div className="flex flex-col gap-5 items-start justify-start bg-gray-200 p-3 border border-gray-600 rounded-lg">
                                <div className="flex flex-col w-full gap-y-2">
                                    <header className="flex items-center justify-between gap-5 w-full">
                                        <p className="text-sm font-bold uppercase">{include.title}</p>
                                        <div className="flex items-center justify-end gap-5">
                                            <SubmitButton
                                                title="Edit"
                                                icon={<IconEdit size={16} stroke={2} />}
                                                className="text-xs py-1.5 px-3 bg-sky-500 text-gray-50 hover:bg-sky-600 border-sky-500"
                                                type="button"
                                                onClick={() => setModal(`editInclude-${include.id}`)}
                                            />
                                            <SubmitButton
                                                title="Delete"
                                                disabled={loading.stack === "delete" && loading.field === `include-${include.id}`}
                                                onClick={() => handleDelete(String(include.id))}
                                                icon={
                                                    loading.stack === "delete" && loading.field === `include-${include.id}` ? (
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
                                        <RichTextPreview value={String(include.description)} />
                                    </Card>
                                </div>
                            </div>
                            {modal === `editInclude-${include.id}` && (
                                <ModalEditInclude fetchCruise={fetchCruise} setLoading={setLoading} data={include} setModal={setModal} />
                            )}
                        </React.Fragment>
                    ))}
            </Card>

            {modal === "addInclude" && <ModalAddNewInclude fetchCruise={fetchCruise} setLoading={setLoading} cruise={cruise} setModal={setModal} />}
        </>
    );
}

function ModalAddNewInclude({
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
    const [include, setInclude] = useState<IIncludeBody>({ description: "", title: "" });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInclude((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Add New Include" });

        try {
            await api.post(
                `${process.env.NEXT_PUBLIC_API}/admin/include/${cruise.id}`,
                { title: include.title, description: include.description },
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
                        <p>Include: {include.title}</p>
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
                        value={include.title}
                        handleInputChange={handleInputChange}
                        label="Title"
                        isRequired
                        placeholder="Meals Included..."
                    />

                    <div className="col-span-2">
                        <label className="font-bold mb-2 flex text-xs items-center justify-start gap-1 uppercase">Description</label>
                        <RichTextEditor
                            setContent={(content) =>
                                setInclude((prev) => ({
                                    ...prev,
                                    description: content,
                                }))
                            }
                            content={String(include.description)}
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

function ModalEditInclude({
    setModal,
    data,
    setLoading,
    fetchCruise,
}: {
    setModal: React.Dispatch<SetStateAction<string>>;
    data: IIncludeBody;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchCruise: () => Promise<void>;
}) {
    const [include, setInclude] = useState<IIncludeBody>({
        title: "",
        description: "",
    });
    const setError = useSetAtom(errorAtom);

    console.log(include.id);
    useEffect(() => {
        setInclude(data);
    }, [data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setInclude((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Update include" });

        try {
            await api.put(`${process.env.NEXT_PUBLIC_API}/admin/include/${include.id}`, { ...include }, { withCredentials: true });
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
                        <p>Include: {include.title}</p>
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
                        value={include.title}
                        handleInputChange={handleInputChange}
                        label="Title"
                        isRequired
                        placeholder="Meals Included..."
                    />

                    <div className="col-span-2">
                        <label className="font-bold mb-2 flex items-center justify-start gap-1 text-xs uppercase">Description</label>
                        <RichTextEditor
                            setContent={(content) => setInclude((prev) => ({ ...prev, description: content }))}
                            content={String(include.description)}
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
