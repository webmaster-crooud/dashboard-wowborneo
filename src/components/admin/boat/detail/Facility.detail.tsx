"use client";
import { IconCloudUpload, IconIcons, IconLoader3, IconPlus, IconTrash, IconX } from "@tabler/icons-react";
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
import { IFacilityResponse } from "~/types/boat";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";

type propsFacilityDetail = {
    facilities: IFacilityResponse[];
    openSection: OPENSECTION | null;
    setOpenSection: React.Dispatch<SetStateAction<OPENSECTION | null>>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchBoat: () => Promise<void>;
    loading: { stack: string; field: string };
};
export function FacilityDetailBoat({ facilities, openSection, setOpenSection, fetchBoat, setLoading, loading }: propsFacilityDetail) {
    const [modal, setModal] = useState<{ field: string; idx?: number }>({ field: "" });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const handleDeleted = async (FACILITYId: number) => {
        setLoading({ stack: "deleteFacility", field: "" });
        try {
            await api.delete(`${process.env.NEXT_PUBLIC_API}/admin/boat/facility/${FACILITYId}`);
            await fetchBoat();
            setNotification({
                title: "Delete Facility",
                message: "Succesfully deleted facility",
            });
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
                    <span>Facility</span>
                    <div className="flex items-center justify-end gap-5">
                        <button
                            onClick={() => setModal({ field: "createFacility" })}
                            type="button"
                            className="px-3 py-1 font-medium bg-brown rounded-lg text-white text-sm flex items-center justify-center gap-1"
                        >
                            <IconPlus size={18} stroke={2} /> <span>Create</span>
                        </button>
                        <button
                            className={`px-3 py-1 ${
                                openSection === "FACILITY" ? "bg-red-500" : "bg-sky-500"
                            } flex items-center justify-center gap-1 text-white rounded-lg text-sm font-medium`}
                            onClick={() => setOpenSection(openSection === "FACILITY" ? null : "FACILITY")}
                            type="button"
                        >
                            {openSection === "FACILITY" ? "Close" : "Open"}
                        </button>
                    </div>
                </>
            }
            classHeading={`flex items-center justify-between gap-5 ${openSection !== "FACILITY" && "border-0"}`}
            classBody={`${openSection !== "FACILITY" && "p-0"} grid grid-cols-2 gap-3`}
        >
            {openSection === "FACILITY" &&
                facilities.map((facility, i) => (
                    <React.Fragment key={i}>
                        <Card
                            title={
                                <>
                                    <span>Facility: {facility.name}</span>{" "}
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setModal({ field: "updateFacility", idx: i })}
                                            className="px-3 py-1 bg-sky-500 text-white font-semibold text-xs rounded-lg"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleDeleted(Number(facility.id))}
                                            className="px-3 py-1 bg-red-500 text-white font-semibold text-xs rounded-lg"
                                        >
                                            {loading.stack === "deleteFacility" ? (
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
                            <div className="flex items-center justify-start gap-2">
                                <label htmlFor="icon" className="text-xs">
                                    <IconIcons size={16} stroke={2} />
                                </label>
                                <p className="text-sm font-medium text-black">{facility.icon}</p>
                            </div>
                            <Card title="Description">
                                <RichTextPreview value={facility.description || ""} />
                            </Card>
                        </Card>
                        {modal.field === `updateFacility` && modal.idx === i && (
                            <FacilityModal
                                fetchBoat={fetchBoat}
                                setLoading={setLoading}
                                setModal={setModal}
                                facility={facility} // Make sure this is the correct FACILITY item
                                modal={modal}
                            />
                        )}
                    </React.Fragment>
                ))}
            {modal.field === `createFacility` && <FacilityModal modal={modal} fetchBoat={fetchBoat} setLoading={setLoading} setModal={setModal} />}
        </Card>
    );
}

type propsFacilityModal = {
    className?: string;
    facility?: IFacilityResponse;
    setModal: React.Dispatch<SetStateAction<{ field: string; idx?: number }>>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchBoat: () => Promise<void>;
    modal: { field: string; idx?: number };
};

function FacilityModal({ className, setModal, setLoading, fetchBoat, facility, modal }: propsFacilityModal) {
    const [body, setBody] = useState<{ id: number | number; name: string; description: string | null; icon: string }>({
        id: 0,
        name: "",
        description: "",
        icon: "",
    });
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const { boatId } = useParams();
    useEffect(() => {
        if (facility) {
            setBody({ description: facility.description || "", name: facility.name || "", id: Number(facility.id), icon: facility.icon || "" });
        }
    }, [facility]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Upload New Facility" });
        try {
            await api.post(
                `${process.env.NEXT_PUBLIC_API}/admin/boat/facility/${boatId}`,
                {
                    name: body.name,
                    icon: body.icon,
                    description: body.description,
                },
                {
                    withCredentials: true,
                }
            );
            await fetchBoat();
            setNotification({
                title: "Add Facility",
                message: "Successfully to add new facility",
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
        setLoading({ stack: "submit", field: `Updating ${body.name} Facility` });
        try {
            await api.put(
                `${process.env.NEXT_PUBLIC_API}/admin/boat/facility/${facility?.id}`,
                {
                    name: body.name,
                    icon: body.icon,
                    description: body.description,
                },
                {
                    withCredentials: true,
                }
            );
            await fetchBoat();
            setNotification({
                title: "Update Facility " + body.name,
                message: "Successfully to update facility",
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
                        <span>Add New Facility</span>
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
                        modal.field === "createFacility"
                            ? handleAddSubmit
                            : modal.field === "updateFacility"
                            ? handleUpdateSubmit
                            : (e) => e.preventDefault()
                    }
                    className="grid grid-cols-2 gap-5"
                >
                    <InputForm
                        title="name"
                        placeholder="Facility...."
                        value={body.name}
                        label="Name"
                        type="text"
                        handleInputChange={handleInputChange}
                        isRequired
                    />
                    <InputForm
                        title="icon"
                        placeholder="Facility...."
                        value={body.icon}
                        label="Icon"
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
