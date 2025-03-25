"use client";

import React from "react";
import { useAtom } from "jotai";
import { Card } from "~/components/ui/Card";
import { getCoverImage } from "~/lib/idb";
import Image from "next/image";
import { FORMSTEPBOAT } from "~/app/admin/boats/create/page";
import { aboutBodyAtom, boatBodyAtom, cabinBodyAtom, deckBodyAtom, experienceBodyAtom, facilityBodyAtom } from "~/stores/boat.store";
import { formatCurrency } from "~/utils/main";
import { CanvasImage } from "~/components/ui/CanvasImage";

type PropsReviewBoatPage = {
    setStep: React.Dispatch<React.SetStateAction<FORMSTEPBOAT>>;
};

export function ReviewBoatPage({ setStep }: PropsReviewBoatPage) {
    const [boat] = useAtom(boatBodyAtom);
    const [abouts] = useAtom(aboutBodyAtom);
    const [experiences] = useAtom(experienceBodyAtom);
    const [facilities] = useAtom(facilityBodyAtom);
    const [cabins] = useAtom(cabinBodyAtom);
    const [deck] = useAtom(deckBodyAtom);

    const [covers, setCovers] = React.useState<{ [key: string]: string }>({});
    const [boatCover, setBoatCover] = React.useState<string | null>(null);
    const [deckCover, setDeckCover] = React.useState<string | null>(null);

    React.useEffect(() => {
        const loadAllImages = async () => {
            const newCovers: { [key: string]: string } = {};

            // Load boat cover
            const boatCoverId = localStorage.getItem("boat_BOAT_1");
            if (boatCoverId) {
                try {
                    const blob = await getCoverImage(Number(boatCoverId));
                    if (blob) {
                        setBoatCover(URL.createObjectURL(blob));
                    }
                } catch (error) {
                    console.error("Error loading boat cover:", error);
                }
            }

            // Load deck cover
            const deckCoverId = localStorage.getItem("deck_DECK_1");
            if (deckCoverId) {
                try {
                    const blob = await getCoverImage(Number(deckCoverId));
                    if (blob) {
                        setDeckCover(URL.createObjectURL(blob));
                    }
                } catch (error) {
                    console.error("Error loading deck cover:", error);
                }
            }

            // Load cabin covers
            await Promise.all(
                cabins.map(async (_, i) => {
                    const key = `cabin_CABIN_${i}`;
                    const coverId = localStorage.getItem(key);
                    if (coverId) {
                        const blob = await getCoverImage(Number(coverId));
                        if (blob) {
                            newCovers[key] = URL.createObjectURL(blob);
                        }
                    }
                })
            );

            // Load experience covers
            await Promise.all(
                experiences.map(async (_, i) => {
                    const key = `experience_EXPERIENCE_${i}`;
                    const coverId = localStorage.getItem(key);
                    if (coverId) {
                        const blob = await getCoverImage(Number(coverId));
                        if (blob) {
                            newCovers[key] = URL.createObjectURL(blob);
                        }
                    }
                })
            );

            setCovers(newCovers);
        };

        loadAllImages();
    }, [cabins, experiences]);

    return (
        <div className="space-y-8">
            {/* Boat Card */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Boat</h5>
                        <button type="button" onClick={() => setStep("MAIN")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    {boatCover && (
                        <div className="col-span-2 mb-4">
                            <p className="font-semibold mb-2">Cover Image:</p>
                            <CanvasImage src={boatCover} alt={boat.name} className="h-80" />
                        </div>
                    )}

                    <div>
                        <p className="font-semibold">Name:</p>
                        <p>{boat.name || "-"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Slug:</p>
                        <p>{boat.slug || "-"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Option Text:</p>
                        <p>{boat.optionText || "-"}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="font-semibold mb-1">Description:</p>
                        <div className="rich-text-preview" dangerouslySetInnerHTML={{ __html: boat.description || "" }} />
                    </div>
                </div>
            </Card>

            {/* Cabins Card */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Cabins</h5>
                        <button type="button" onClick={() => setStep("CABIN")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                {cabins.length === 0 ? (
                    <p className="text-sm">No cabins added.</p>
                ) : (
                    <div className="space-y-3">
                        {cabins.map((cabin, i) => (
                            <div key={i} className="border p-3 rounded">
                                <div className="flex gap-4">
                                    {covers[`cabin_CABIN_${i}`] && (
                                        <Image
                                            width={200}
                                            height={200}
                                            src={covers[`cabin_CABIN_${i}`]}
                                            alt={`Cabin ${i + 1} cover`}
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <p className="font-semibold">{cabin.name || `Cabin ${i + 1}`}</p>
                                        <p>Type: {cabin.type || "-"}</p>
                                        <p>Capacity: {cabin.maxCapacity || "-"}</p>
                                        <p>Price: {formatCurrency(cabin.price.toString()) || "-"}</p>
                                        <div className="rich-text-preview" dangerouslySetInnerHTML={{ __html: cabin.description || "" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Experiences Card */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Experiences</h5>
                        <button type="button" onClick={() => setStep("EXPERIENCE")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                {experiences.length === 0 ? (
                    <p className="text-sm">No experiences added.</p>
                ) : (
                    <div className="space-y-3">
                        {experiences.map((experience, i) => (
                            <div key={i} className="border p-3 rounded">
                                <div className="flex gap-4">
                                    {covers[`experience_EXPERIENCE_${i}`] && (
                                        <Image
                                            width={200}
                                            height={200}
                                            src={covers[`experience_EXPERIENCE_${i}`]}
                                            alt={`Experience ${i + 1} cover`}
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <p className="font-semibold">{experience.title || `Experience ${i + 1}`}</p>
                                        <div className="rich-text-preview" dangerouslySetInnerHTML={{ __html: experience.description || "" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* About Card */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>About</h5>
                        <button type="button" onClick={() => setStep("ABOUT")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                {abouts.length === 0 ? (
                    <p className="text-sm">No about information added.</p>
                ) : (
                    <div className="space-y-3">
                        {abouts.map((about, i) => (
                            <div key={i} className="border p-3 rounded">
                                <p className="font-semibold">{about.title || `About ${i + 1}`}</p>
                                <div className="rich-text-preview" dangerouslySetInnerHTML={{ __html: about.description || "" }} />
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Facilities Card */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Facilities</h5>
                        <button type="button" onClick={() => setStep("FACILITY")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                {facilities.length === 0 ? (
                    <p className="text-sm">No facilities added.</p>
                ) : (
                    <div className="space-y-3">
                        {facilities.map((facility, i) => (
                            <div key={i} className="border p-3 rounded">
                                <p className="font-semibold">{facility.name || `Facility ${i + 1}`}</p>
                                <div className="rich-text-preview" dangerouslySetInnerHTML={{ __html: facility.description || "" }} />
                            </div>
                        ))}
                    </div>
                )}
            </Card>
            {/* Deck Card */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Deck {deck.title}</h5>
                        <button type="button" onClick={() => setStep("DECK")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                <div className="space-y-3">
                    <div className="border p-3 rounded">
                        {deckCover && (
                            <div className="mb-4">
                                <p className="font-semibold mb-2">Deck Image:</p>
                                <Image height={300} width={600} src={deckCover} alt="Deck Cover" className="w-full h-60 object-cover rounded-lg" />
                            </div>
                        )}
                        <p className="font-semibold">{deck?.title || "Deck Plan"}</p>
                        <div className="rich-text-preview" dangerouslySetInnerHTML={{ __html: deck?.description || "" }} />
                    </div>
                </div>
            </Card>
        </div>
    );
}
