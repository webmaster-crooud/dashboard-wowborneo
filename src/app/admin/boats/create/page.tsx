"use client";
import { IconDatabasePlus, IconDatabaseSearch } from "@tabler/icons-react";
import { AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { MainButton } from "~/components/ui/Button/Main.button";
import { motion as m } from "framer-motion";
import { MainBoatForm } from "~/components/admin/boat/Form/Main.form";
import { useAtom, useSetAtom } from "jotai";
import { aboutBodyAtom, boatBodyAtom, cabinBodyAtom, deckBodyAtom, experienceBodyAtom, facilityBodyAtom } from "~/stores/boat.store";
import { SideForm } from "~/components/admin/boat/Form/Side.form";
import { useAuth } from "~/hooks/useAuth";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { CabinBoatForm } from "~/components/admin/boat/Form/Cabin.form";
import { useState } from "react";
import { AboutBoatForm } from "~/components/admin/boat/Form/About.form";
import { ExperienceBoatForm } from "~/components/admin/boat/Form/Experience.form";
import { FacilityBoatForm } from "~/components/admin/boat/Form/Facility.form";
import { DeckBoatForm } from "~/components/admin/boat/Form/Deck.form";
import { ReviewBoatPage } from "~/components/admin/boat/Form/Review.form";
import { IBoatRequestBody } from "~/types/boat";
import { errorAtom } from "~/stores";
import { cleanupStorage, uploadCover } from "~/utils/upload";
import { fetchError } from "~/utils/fetchError";
import { api } from "~/utils/api";
import { ApiSuccessResponse } from "~/types";
const dataBreadcrumb: Breadcrumb[] = [
    {
        title: "Dashboard",
        url: "/admin",
    },
    {
        title: "Boat",
        url: "/admin/boats",
    },
    {
        title: "Create",
        url: "/admin/boats/create",
    },
];
export type FORMSTEPBOAT = "MAIN" | "ABOUT" | "CABIN" | "FACILITY" | "EXPERIENCE" | "DECK" | "REVIEW";
export default function ListBoatPage() {
    const { account } = useAuth();
    const pathName = usePathname();
    const setError = useSetAtom(errorAtom);
    const [boat, setBoat] = useAtom(boatBodyAtom);
    const [abouts] = useAtom(aboutBodyAtom);
    const [experiences] = useAtom(experienceBodyAtom);
    const [facilities] = useAtom(facilityBodyAtom);
    const [cabins] = useAtom(cabinBodyAtom);
    const [deck] = useAtom(deckBodyAtom);
    const [loading, setLoading] = useState<{ stack: string; field: string }>({ field: "", stack: "" });
    const [step, setStep] = useState<FORMSTEPBOAT>("MAIN");

    const requestBody: IBoatRequestBody = {
        ...boat,
        abouts: abouts || [],
        experiences: experiences || [],
        facilities: facilities || [],
        cabins:
            cabins.map((cabin) => ({
                ...cabin,
                maxCapacity: parseInt(cabin.maxCapacity.toString()),
                price: Number(cabin.price),
            })) || [],
        deck: {
            title: deck.title || "Title Deck of Boats",
            description: deck.description || "",
        },
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: "cruise" });
        try {
            const { data } = await api.post<ApiSuccessResponse<{ boatId: string; cabinsId: number[]; experiencesId: string[]; deckId: string }>>(
                `${process.env.NEXT_PUBLIC_API}/admin/boat`,
                requestBody,
                {
                    withCredentials: true,
                }
            );
            const { boatId, cabinsId, experiencesId, deckId } = data.data;

            if (!boatId || !cabinsId || !experiencesId || !deckId) {
                setError({ message: "Failed to uploaded data boats, please check your input." });
                return;
            }
            console.log(data.data);

            // 2. Upload cover cruise
            setLoading({ stack: "upload", field: "Boats" });
            await uploadCover(`boat_BOAT_1`, String(boatId), "BOAT", "COVER");
            // 4. Upload highlight covers
            setLoading({ stack: "upload", field: "Cabin" });
            await Promise.all(
                cabins.map(async (_, i) => {
                    await uploadCover(`cabin_CABIN_${i}`, String(cabinsId[i]), "CABIN", "COVER");
                })
            );

            // 5. Upload destination covers
            setLoading({ stack: "upload", field: "Experience" });
            await Promise.all(
                experiences.map(async (_, i) => {
                    await uploadCover(`experience_EXPERIENCE_${i}`, String(experiencesId[i]), "EXPERIENCE", "COVER");
                })
            );

            setLoading({ stack: "upload", field: "Deck" });
            await uploadCover(`deck_DECK_1`, String(deckId), "DECK", "COVER");
            // 6. Bersihkan storage
            await cleanupStorage("deck_DECK", "deckBody");
            await cleanupStorage("boat_BOAT", "boatBody");
            await cleanupStorage("experience_EXPERIENCE", "experienceBody");
            await cleanupStorage("cabin_CABIN", "cabinBody");
            localStorage.clear();

            // Redirect atau tampilkan success message
            window.location.href = "/admin/boats?notification=Successfully to create data cruise";
            setBoat({
                name: "",
                description: "",
                slug: "",
                optionText: "",
                abouts: [],
                cabins: [], //
                experiences: [],
                facilities: [],
                cruiseId: "",
                status: "PENDING",
                deck: {
                    title: "",
                    description: "",
                },
            });
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    };

    if (loading.stack === "submit" || loading.stack === "upload") {
        return <LoaderForm loading={loading} />;
    }
    return (
        <section className="min-h-screen">
            <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
            <div className="flex items-center justify-start gap-6 flex-wrap mt-5 relative z-10 px-8">
                <MainButton url="/admin/boats" title="List" icon={<IconDatabaseSearch stroke={2} size={20} />} />
                <MainButton
                    url="create"
                    title="Create"
                    className={pathName === "/admin/boats/create" ? "bg-brown text-white" : ""}
                    icon={<IconDatabasePlus stroke={2} size={20} />}
                />
            </div>
            <form onSubmit={handleSubmit} className="my-5 px-8 grid grid-cols-3 gap-6 relative">
                <div className="col-span-2 flex flex-col gap-y-5 min-h-96">
                    <AnimatePresence mode="wait">
                        {step === "MAIN" && (
                            <m.div
                                key={"main"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <MainBoatForm body={boat} setBody={setBoat} />
                            </m.div>
                        )}
                        {step === "CABIN" && (
                            <m.div
                                key={"cabin"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <CabinBoatForm />
                            </m.div>
                        )}
                        {step === "ABOUT" && (
                            <m.div
                                key={"about"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <AboutBoatForm />
                            </m.div>
                        )}
                        {step === "EXPERIENCE" && (
                            <m.div
                                key={"experience"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <ExperienceBoatForm />
                            </m.div>
                        )}
                        {step === "FACILITY" && (
                            <m.div
                                key={"facility"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <FacilityBoatForm />
                            </m.div>
                        )}
                        {step === "DECK" && (
                            <m.div
                                key={"deck"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <DeckBoatForm />
                            </m.div>
                        )}
                        {step === "REVIEW" && (
                            <m.div
                                key={"review"}
                                className="relative z-[1]"
                                initial={{ scale: 0, y: "-100%" }}
                                animate={{ scale: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                exit={{ scale: 1, y: "100%" }}
                            >
                                <ReviewBoatPage setStep={setStep} />
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
                <SideForm account={account} body={boat} setBody={setBoat} loading={loading} setStep={setStep} step={step} />
            </form>
        </section>
    );
}
