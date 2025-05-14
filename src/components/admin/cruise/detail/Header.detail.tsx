"use client";
import React, { useState } from "react";
import { motion as m } from "framer-motion";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { ICruiseBody, ICruiseResponseDetail, IImage } from "~/types/cruise";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { CanvasImage } from "~/components/ui/CanvasImage";
import { SetStateAction, useSetAtom } from "jotai";
import { api } from "~/utils/api";
import { getCoverImage } from "~/lib/idb";
import { errorAtom, notificationAtom } from "~/stores";
import { useParams } from "next/navigation";
import {
    IconArrowBack,
    IconCheck,
    IconClock,
    IconCloudCheck,
    IconCloudUpload,
    IconEyeEdit,
    IconLoader3,
    IconMap,
    IconStarFilled,
    IconTextCaption,
    IconTimezone,
    IconX,
} from "@tabler/icons-react";
import { fetchError } from "~/utils/fetchError";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { MainButton } from "~/components/ui/Button/Main.button";
import { RichTextPreview } from "~/components/ui/RichTextPreview";
import { formatDate } from "~/lib/moment";
import { Card } from "~/components/ui/Card";
import { cleanupStorage } from "~/utils/upload";
import { InputForm } from "~/components/ui/Form/Input.form";
import RichTextEditor from "~/components/RichText";
import { useAuth } from "~/hooks/useAuth";
import { STATUS } from "~/types";

type propsHeaderDetailCruise = {
    dataBreadcrumb: Breadcrumb[];
    cruise: ICruiseResponseDetail;
    cover: IImage;
    fetchCruise: () => Promise<void>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    loading: { stack: string; field: string };
};

export function HeaderDetailCruise({ dataBreadcrumb, cruise, cover, fetchCruise, setLoading, loading }: propsHeaderDetailCruise) {
    const { account } = useAuth();
    const [modal, setModal] = useState<string>("");
    const [isHovered, setIsHovered] = useState(false);
    const childVariants = {
        hidden: { scale: 0, opacity: 0 },
        visible: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    };
    const setError = useSetAtom(errorAtom);

    const handleActived = async (action: STATUS) => {
        setLoading({ stack: "actived", field: "" });
        try {
            await api.patch(`${process.env.NEXT_PUBLIC_API}/admin/cruise/${cruise.id}?action=${action}`);
            await fetchCruise();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };
    return (
        <header className="bg-gray-50 pt-10 pb-5 px-8 shadow relative z-10">
            <Breadcrumb data={dataBreadcrumb} />

            {/* Button Navigation */}
            <div className="flex items-center justify-between gap-x-5 my-5">
                <MainButton title="Back" icon={<IconArrowBack size={18} stroke={2} />} url="/admin/cruises" />

                <div className="flex items-center justify-end gap-5">
                    <SubmitButton
                        type="button"
                        title="Edit"
                        className="bg-sky-600 text-white hover:bg-sky-800"
                        icon={<IconEyeEdit size={18} stroke={2} />}
                        onClick={() => setModal("cruise")}
                    />
                    <SubmitButton
                        type="button"
                        disabled={account.role.name === "admin" || account.role.name === "member"}
                        title="ACTIVED"
                        className="bg-cyan-600 text-white hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-cyan-800"
                        icon={
                            loading.stack === "actived" ? (
                                <IconLoader3 className="animate-spin" size={18} stroke={2} />
                            ) : (
                                <IconCheck size={18} stroke={2} />
                            )
                        }
                        onClick={() => handleActived("ACTIVED")}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-y-5">
                <div className="flex items-center justify-between gap-5">
                    <h1 className="text-2xl font-bold">{cruise.title}</h1>
                    <div className="flex items-center justify-end gap-2">
                        {cruise.createdAt === cruise.updatedAt ? (
                            <>
                                <h2 className="uppercase text-gray-700 text-xs font-bold">Created:</h2>
                                <span className="text-xs text-black font-medium">{formatDate(cruise.createdAt)}</span>
                            </>
                        ) : (
                            <>
                                <h2 className="uppercase text-gray-700 text-xs font-bold">Updated:</h2>
                                <span className="text-xs text-black font-medium">{formatDate(cruise.updatedAt)}</span>
                            </>
                        )}
                        <div className="w-[1px] h-5 bg-gray-500" />
                        <h2 className="uppercase text-gray-700 text-xs font-bold">Status:</h2>
                        <span className="text-xs text-black font-medium">
                            {cruise.status === "PENDING" && (
                                <div className="flex items-center justify-end gap-0.5 px-3 py-1 rounded-full bg-gray-400 text-gray-50">
                                    <IconClock size={14} stroke={2} /> Pending
                                </div>
                            )}
                            {cruise.status === "ACTIVED" && (
                                <div className="flex items-center justify-end gap-0.5 px-3 py-1 rounded-full bg-cyan-700 text-gray-50">
                                    <IconCloudCheck size={16} stroke={2} /> Active
                                </div>
                            )}
                            {cruise.status === "FAVOURITED" && (
                                <div className="flex items-center justify-end gap-0.5 px-3 py-1 rounded-full bg-brown text-gray-50">
                                    <IconStarFilled size={16} stroke={2} /> Favourite
                                </div>
                            )}
                        </span>
                    </div>
                </div>
                <m.div className="w-full relative z-0" onHoverStart={() => setIsHovered(true)} onHoverEnd={() => setIsHovered(false)}>
                    <CanvasImage src={cover?.source || "/assets/Image-not-found.png"} alt={`${cover?.alt || ""}`} className="h-80" />
                    {/* Animated Button */}
                    <m.div
                        variants={childVariants}
                        animate={isHovered ? "visible" : "hidden"} // Child mengikuti parent
                        className="absolute top-1/2 z-10 left-0 right-0 w-full"
                    >
                        <SubmitButton title="Change" type="button" className="mx-auto bg-brown text-white" onClick={() => setModal("updateCover")} />
                    </m.div>
                </m.div>
                <div className="grid grid-cols-3 gap-5">
                    <div className="flex flex-col gap-y-5">
                        <div className="flex items-center justify-start gap-2">
                            <h2 className="uppercase text-gray-700 text-xs font-bold flex items-center justify-start gap-1">
                                <IconTextCaption size={16} stroke={2} /> Sub Title:
                            </h2>
                            <span className="text-xs text-black font-medium">{cruise.subTitle}</span>
                        </div>
                        <div className="flex items-center justify-start gap-2">
                            <h2 className="uppercase text-gray-700 text-xs font-bold flex items-center justify-start gap-1">
                                <IconMap size={16} stroke={2} /> Departure:
                            </h2>
                            <span className="text-xs text-black font-medium">{cruise.departure}</span>
                        </div>
                        <div className="flex items-center justify-start gap-2">
                            <h2 className="uppercase text-gray-700 text-xs font-bold flex items-center justify-start gap-1">
                                <IconTimezone size={16} stroke={2} /> Duration:
                            </h2>
                            <span className="text-xs text-black font-medium">{`${cruise.duration} days ${parseInt(cruise.duration) - 1} night`}</span>
                        </div>
                    </div>
                    <div className="col-span-2">
                        <Card title="Description" classHeading="text-xs uppercase font-bold">
                            <RichTextPreview value={String(cruise.description)} />
                        </Card>
                    </div>
                </div>
            </div>
            {modal === "updateCover" && <ModalCruiseCover fetchCruise={fetchCruise} setLoading={setLoading} cover={cover} setModal={setModal} />}
            {modal === "cruise" && <ModalCruiseDetail fetchCruise={fetchCruise} setLoading={setLoading} cruise={cruise} setModal={setModal} />}
        </header>
    );
}

type propsModalCruiseCover = {
    setModal: React.Dispatch<SetStateAction<string>>;
    cover: IImage;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchCruise: () => Promise<void>;
};

function ModalCruiseCover({ setModal, cover, setLoading, fetchCruise }: propsModalCruiseCover) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const { cruiseId } = useParams();
    const handleUpdateCover = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "Cover River Cruise" });
        try {
            if (cover) {
                setLoading({ stack: "upload", field: "Delete Cover River Cruise" });
                await api.delete(`${process.env.NEXT_PUBLIC_API}/upload/${cover.id}`, {
                    headers: { "Content-Type": "multipart/form-data" },
                    withCredentials: true,
                });
            }

            setLoading({ stack: "upload", field: "Update Cover River Cruise" });
            const key = `coverCruiseId_CRUISE_${cruiseId}`;
            const coverId = localStorage.getItem(key);
            if (coverId) {
                const blob = await getCoverImage(Number(coverId));
                if (blob) {
                    const file = new File([blob], `cruise-${cruiseId}.jpg`, { type: "image/jpeg" });
                    const formData = new FormData();
                    formData.append("file", file);
                    formData.append("entityId", String(cruiseId) || "");
                    formData.append("entityType", "CRUISE");
                    formData.append("imageType", "COVER");

                    await api.post(`${process.env.NEXT_PUBLIC_API}/upload`, formData, {
                        headers: { "Content-Type": "multipart/form-data" },
                        withCredentials: true,
                    });
                }
            }

            await fetchCruise();
            setNotification({
                title: "Successfully",
                message: (
                    <div className="flex items-center justify-start gap-5">
                        <IconCheck stroke={2} size={18} className="text-green-500" />
                        Change Cover River Cruise is completed.
                    </div>
                ),
            });
            cleanupStorage("coverCruiseId_CRUISE_", "cruiseBody");
            fetchCruise();
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };

    return (
        <div className="fixed top-0 z-50 pt-20 left-0 right-0 w-full h-screen bg-white/20 backdrop-blur-sm flex items-start justify-center">
            <m.form
                onSubmit={handleUpdateCover}
                exit={{ scale: 0 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg bg-gray-100 w-5/12 border border-black overflow-hidden"
            >
                {/* Header Modal */}
                <div className="flex items-center justify-between gap-x-5 p-3 border-b border-black">
                    <h2>Change the River Cruise Cover</h2>
                    <button type="button" onClick={() => setModal("")}>
                        <IconX stroke={2} size={18} className="text-brown" />
                    </button>
                </div>

                <div className="bg-white p-5 flex flex-col gap-y-3 text-orange-500 gap-5">
                    <CoverUploader
                        entityId={String(cruiseId) || ""}
                        entityType="CRUISE"
                        className="w-full object-cover h-full"
                        storageKeyPrefix="coverCruiseId"
                        imageType="COVER"
                    />

                    <SubmitButton title="Update" icon={<IconCloudUpload size={18} stroke={2} />} type="submit" className="col-start-2" />
                </div>
            </m.form>
        </div>
    );
}

type propsModalCruiseDetail = {
    setModal: React.Dispatch<SetStateAction<string>>;
    cruise: ICruiseResponseDetail;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchCruise: () => Promise<void>;
};
function ModalCruiseDetail({ setModal, cruise, setLoading, fetchCruise }: propsModalCruiseDetail) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const { cruiseId } = useParams();

    const [body, setBody] = useState<ICruiseBody>(cruise);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "Submit", field: "Update River Cruise" });
        try {
            await api.put(`${process.env.NEXT_PUBLIC_API}/admin/cruise/${cruiseId}`, {
                title: body.title,
                subTitle: body.subTitle,
                duration: body.duration,
                departure: body.departure,
                description: body.description,
                cta: body.cta,
                introductionText: body.introductionText,
                introductionTitle: body.introductionTitle,
            });

            await fetchCruise();
            setNotification({
                title: "Update Cruise",
                message: "Successfully to update data cruise",
            });
            setModal("");
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };

    return (
        <div className="fixed top-0 z-[60] pt-24 left-0 right-0 w-full h-screen bg-white/20 backdrop-blur-sm flex items-start justify-center">
            <m.form
                onSubmit={handleUpdate}
                exit={{ scale: 0 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg bg-gray-100 w-6/12 border border-black overflow-hidden"
            >
                {/* Header Modal */}
                <div className="flex items-center justify-between gap-x-5 p-3 border-b border-black">
                    <h2>Edit: {cruise.title}</h2>
                    <button type="button" onClick={() => setModal("")}>
                        <IconX stroke={2} size={18} className="text-brown" />
                    </button>
                </div>

                <div className="bg-white p-5 flex flex-col gap-y-3 gap-5">
                    <div className="grid grid-cols-2 gap-5">
                        <InputForm
                            title="title"
                            value={body.title}
                            type="text"
                            label="Title of Cruise"
                            isRequired
                            handleInputChange={handleInputChange}
                        />
                        <InputForm
                            title="subTitle"
                            value={body.subTitle || ""}
                            type="text"
                            label="Subtitle"
                            isRequired
                            handleInputChange={handleInputChange}
                        />
                        <InputForm
                            title="departure"
                            value={body.departure || ""}
                            type="text"
                            label="Departure"
                            isRequired
                            handleInputChange={handleInputChange}
                        />
                        <InputForm
                            title="duration"
                            value={body.duration}
                            type="number"
                            label="Duration"
                            isRequired
                            handleInputChange={handleInputChange}
                        />
                        <InputForm
                            title="introductionTitle"
                            value={body.introductionTitle || ""}
                            type="text"
                            label="Title of Introduction Content Cruise"
                            isRequired
                            handleInputChange={handleInputChange}
                        />

                        <InputForm
                            title="cta"
                            value={body.cta || ""}
                            type="text"
                            label="Call To Action"
                            isRequired
                            handleInputChange={handleInputChange}
                        />
                        <InputForm
                            title="introductionText"
                            value={body.introductionText || ""}
                            type="text"
                            label="Text of Introduction Content Cruise"
                            isRequired
                            handleInputChange={handleInputChange}
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
                    </div>
                    <SubmitButton title="Update" icon={<IconCloudUpload size={18} stroke={2} />} type="submit" className="col-start-2" />
                </div>
            </m.form>
        </div>
    );
}
