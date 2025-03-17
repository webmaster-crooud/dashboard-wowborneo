"use client";

import { AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { MainCruiseForm } from "~/components/admin/cruise/Form/Main.form";
import { SideForm } from "~/components/admin/cruise/Form/Side.form";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";

import { useAuth } from "~/hooks/useAuth";
import { motion as m } from "framer-motion";
import { DestinationCruiseForm } from "~/components/admin/cruise/Form/Destination.form";
import HighlightCruiseForm from "~/components/admin/cruise/Form/Highlight.form";
import IncludeCruiseForm from "~/components/admin/cruise/Form/Include.form";
import InformationCruiseForm from "~/components/admin/cruise/Form/Information.form";
import { ReviewCruisePage } from "~/components/admin/cruise/Form/Review.form";
import { ContentFormCruise } from "~/components/admin/cruise/Form/Content.form";
import { ButtonNavigation } from "~/components/admin/cruise/Navigation/Button.navigation";
import { useAtom, useSetAtom } from "jotai";
import { cruiseBodyAtom, destinationBodyAtom, highlightBodyAtom, includeBodyAtom, informationBodyAtom } from "~/stores/cruise.store";
import { deleteCoverImage, getCoverImage } from "~/lib/idb";
import { ICruiseBody } from "~/types/cruise";
import cruiseService from "~/services/cruise.service";
import { errorAtom } from "~/stores";
import { fetchError } from "~/utils/fetchError";
import { api } from "~/utils/api";
import { LoaderForm } from "~/components/ui/Form/Loader.form";

const dataBreadcrumb: Breadcrumb[] = [
    {
        title: "Dashboard",
        url: "/admin",
    },
    {
        title: "Cruise",
        url: "/admin/cruise",
    },
    {
        title: "Create",
        url: "/admin/cruise/create",
    },
];

export type FORMSTEP = "MAIN" | "DESTINATION" | "INFORMATION" | "INCLUDE" | "CONTENT" | "HIGHLIGHT" | "REVIEW";

export default function CreateCruisePage() {
    const { account } = useAuth();
    const [stepForm, setStepForm] = useState<FORMSTEP>("MAIN");
    const setError = useSetAtom(errorAtom);
    const [cruise, setCruise] = useAtom(cruiseBodyAtom);
    const [highlights] = useAtom(highlightBodyAtom);
    const [destinations] = useAtom(destinationBodyAtom);
    const [informations] = useAtom(informationBodyAtom);
    const [includes] = useAtom(includeBodyAtom);
    const [loading, setLoading] = useState<{ stack: string; field?: string; value?: string }>({ stack: "", field: "" });

    const requestBody: ICruiseBody = {
        ...cruise,
        highlights: highlights || [],
        informations: informations || [],
        include: includes || [],
        destinations: destinations || [],
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "cruise" });
        try {
            // 1. Submit cruise data
            const result = await cruiseService.create(requestBody);
            const { id: cruiseId, destinationIds, highlightIds } = result;

            if (!cruiseId) {
                setError({ message: "Failed to uploaded data cruise, please check your input." });
            }

            setLoading({ stack: "upload", field: "highlight" });
            // 3. Upload highlight covers
            await Promise.all(
                highlights.map(async (_, i) => {
                    const key = `coverImageId_HIGHLIGHT_${i}`;
                    const coverId = localStorage.getItem(key);
                    if (coverId) {
                        const blob = await getCoverImage(Number(coverId));
                        if (blob) {
                            const file = new File([blob], `highlight-${i}.jpg`, { type: "image/jpeg" });
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("entityId", String(highlightIds[i]) || "");
                            formData.append("entityType", "HIGHLIGHT");
                            formData.append("imageType", "COVER");

                            await api.post(`${process.env.NEXT_PUBLIC_API}/upload`, formData, {
                                headers: { "Content-Type": "multipart/form-data" },
                                withCredentials: true,
                            });
                        }
                    }
                })
            );

            setLoading({ stack: "upload", field: "destination" });
            // 4. Upload destination covers
            await Promise.all(
                destinations.map(async (_, i) => {
                    const key = `coverImageId_DESTINATION_${i}`;
                    const coverId = localStorage.getItem(key);
                    if (coverId) {
                        const blob = await getCoverImage(Number(coverId));
                        if (blob) {
                            const file = new File([blob], `destination-${i}.jpg`, { type: "image/jpeg" });
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("entityId", String(destinationIds[i]) || "");
                            formData.append("entityType", "DESTINATION");
                            formData.append("imageType", "COVER");

                            await api.post(`${process.env.NEXT_PUBLIC_API}/upload`, formData, {
                                headers: { "Content-Type": "multipart/form-data" },
                                withCredentials: true,
                            });
                        }
                    }
                })
            );

            // 5. Bersihkan storage
            await cleanupStorage();

            // Redirect atau tampilkan success message
            window.location.href = "/admin/cruises?notification=Successfully to create data cruise";
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };

    const cleanupStorage = async () => {
        // Hapus semua data di localStorage
        const keysToRemove = [...Object.keys(localStorage).filter((key) => key.startsWith("coverImageId"))];

        await Promise.all(
            keysToRemove.map(async (key) => {
                const coverId = localStorage.getItem(key);
                if (coverId) {
                    await deleteCoverImage(Number(coverId));
                }
                localStorage.removeItem(key);
            })
        );

        localStorage.clear();
        localStorage.removeItem("cruiseBody");
        setCruise({
            cta: "",
            departure: "",
            description: "",
            destinations: [],
            duration: "",
            highlights: [],
            include: [],
            informations: [],
            introductionText: "",
            introductionTitle: "",
            slug: "",
            status: "PENDING",
            subTitle: "",
            title: "",
        });
    };

    if (loading.stack === "submit") {
        return <LoaderForm loading={loading} />;
    }
    return (
        <section className="min-h-screen">
            <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
            <ButtonNavigation />
            <form onSubmit={handleSubmit} className="my-5 px-8 grid grid-cols-3 gap-6 relative">
                <div className="col-span-2 flex flex-col gap-y-5 min-h-96">
                    <AnimatePresence mode="wait">
                        {stepForm === "MAIN" && (
                            <m.div
                                key={"main"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <MainCruiseForm account={account} />
                            </m.div>
                        )}
                        {stepForm === "HIGHLIGHT" && (
                            <m.div
                                key={"highlight"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <HighlightCruiseForm />
                            </m.div>
                        )}
                        {stepForm === "INCLUDE" && (
                            <m.div
                                key={"include"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <IncludeCruiseForm />
                            </m.div>
                        )}
                        {stepForm === "INFORMATION" && (
                            <m.div
                                key={"information"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <InformationCruiseForm />
                            </m.div>
                        )}

                        {stepForm === "REVIEW" && (
                            <m.div
                                key={"review"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <ReviewCruisePage setStep={setStepForm} />
                            </m.div>
                        )}

                        {stepForm === "CONTENT" && (
                            <m.div
                                key={"content"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <ContentFormCruise />
                            </m.div>
                        )}
                        {stepForm === "DESTINATION" && (
                            <m.div
                                key={"destination"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <DestinationCruiseForm />
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
                <SideForm loading={loading} step={stepForm} setStep={setStepForm} account={account} />
            </form>
        </section>
    );
}
