// app/admin/cruises/create/review/page.tsx
"use client";

import React from "react";
import { useAtom } from "jotai";
import { cruiseBodyAtom, highlightBodyAtom, informationBodyAtom, includeBodyAtom, destinationBodyAtom } from "~/stores/cruise.store";
import { Card } from "~/components/ui/Card";

import { FORMSTEP } from "~/app/admin/cruises/create/page";
import { getCoverImage } from "~/lib/idb";
import Image from "next/image";

interface ReviewCruisePageProps {
    setStep: React.Dispatch<React.SetStateAction<FORMSTEP>>;
}

export function ReviewCruisePage({ setStep }: ReviewCruisePageProps) {
    const [cruise] = useAtom(cruiseBodyAtom);
    const [highlights] = useAtom(highlightBodyAtom);
    const [destinations] = useAtom(destinationBodyAtom);
    const [informations] = useAtom(informationBodyAtom);
    const [includes] = useAtom(includeBodyAtom);
    const [covers, setCovers] = React.useState<{ [key: string]: string }>({});

    // Ambil cover images dari IndexedDB
    React.useEffect(() => {
        const loadCovers = async () => {
            const newCovers: { [key: string]: string } = {};

            // Load highlight covers
            await Promise.all(
                highlights.map(async (_, i) => {
                    const key = `coverImageId_HIGHLIGHT_${i}`;
                    const coverId = localStorage.getItem(key);
                    if (coverId) {
                        const blob = await getCoverImage(Number(coverId));
                        if (blob) {
                            newCovers[key] = URL.createObjectURL(blob);
                        }
                    }
                })
            );

            // Load destination covers
            await Promise.all(
                destinations.map(async (_, i) => {
                    const key = `coverImageId_DESTINATION_${i}`;
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

        loadCovers();
    }, [highlights, destinations]);

    return (
        <div className="space-y-8">
            {/* Cruise Card - tetap sama */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Cruise</h5>
                        <button type="button" onClick={() => setStep("MAIN")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                <div className="grid grid-cols-2 gap-4">
                    {/* Title */}
                    <div>
                        <p className="font-semibold">Title:</p>
                        <p>{cruise.title || "-"}</p>
                    </div>
                    {/* Slug */}
                    <div>
                        <p className="font-semibold">Slug:</p>
                        <p>{cruise.slug || "-"}</p>
                    </div>
                    {/* SubTitle */}
                    <div>
                        <p className="font-semibold">Sub Title:</p>
                        <p>{cruise.subTitle || "-"}</p>
                    </div>
                    {/* Status */}
                    <div>
                        <p className="font-semibold">Status:</p>
                        <p>{cruise.status || "-"}</p>
                    </div>
                    {/* Description (RichText Preview) */}
                    <div className="col-span-2">
                        <p className="font-semibold mb-1">Description:</p>
                        <div className="rich-text-preview" dangerouslySetInnerHTML={{ __html: cruise.description || "" }} />
                    </div>
                    {/* Departure */}
                    <div>
                        <p className="font-semibold">Departure:</p>
                        <p>{cruise.departure || "-"}</p>
                    </div>
                    {/* Duration */}
                    <div>
                        <p className="font-semibold">Duration:</p>
                        <p>{cruise.duration || "-"}</p>
                    </div>
                    {/* Introduction Title */}
                    <div>
                        <p className="font-semibold">Introduction Title:</p>
                        <p>{cruise.introductionTitle || "-"}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Introduction Text:</p>
                        <p>{cruise.introductionText || "-"}</p>
                    </div>
                    {/* CTA */}
                    <div>
                        <p className="font-semibold">CTA:</p>
                        <p>{cruise.cta || "-"}</p>
                    </div>
                </div>
            </Card>

            {/* Card Informations */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Informations</h5>
                        <button type="button" onClick={() => setStep("INFORMATION")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                {informations.length === 0 ? (
                    <p className="text-sm">No information added.</p>
                ) : (
                    <div className="space-y-3">
                        {informations.map((info, i) => (
                            <div key={i} className="border p-3 rounded">
                                <p className="font-semibold">Information {info.title}</p>
                                <p>Text: {info.text}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Card Includes */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Includes</h5>
                        <button type="button" onClick={() => setStep("INCLUDE")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                {includes.length === 0 ? (
                    <p className="text-sm">No include items added.</p>
                ) : (
                    <div className="space-y-3">
                        {includes.map((inc, i) => (
                            <div key={i} className="border p-3 rounded">
                                <p className="font-semibold">Include {inc.title}</p>
                                <p>Description: {inc.description}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
            {/* Destinations Card */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Destinations</h5>
                        <button type="button" onClick={() => setStep("DESTINATION")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                {destinations.length === 0 ? (
                    <p className="text-sm">No destinations added.</p>
                ) : (
                    <div className="space-y-3">
                        {destinations.map((dest, i) => (
                            <div key={i} className="border p-3 rounded">
                                <div className="flex gap-4">
                                    {covers[`coverImageId_DESTINATION_${i}`] && (
                                        <Image
                                            width={1000}
                                            height={100}
                                            src={covers[`coverImageId_DESTINATION_${i}`]}
                                            alt="Destination cover"
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <p className="font-semibold">Destination {dest.title}</p>
                                        <p>Days: {dest.days}</p>

                                        <p className="font-semibold mb-1">Description:</p>
                                        <div className="rich-text-preview" dangerouslySetInnerHTML={{ __html: dest.description || "" }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Highlights Card */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Highlights</h5>
                        <button type="button" onClick={() => setStep("HIGHLIGHT")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                {highlights.length === 0 ? (
                    <p className="text-sm">No highlights added.</p>
                ) : (
                    <div className="space-y-3">
                        {highlights.map((hl, i) => (
                            <div key={i} className="border p-3 rounded">
                                <div className="flex gap-4">
                                    {covers[`coverImageId_HIGHLIGHT_${i}`] && (
                                        <Image
                                            height={1000}
                                            width={1000}
                                            src={covers[`coverImageId_HIGHLIGHT_${i}`]}
                                            alt="Highlight cover"
                                            className="w-32 h-32 object-cover rounded"
                                        />
                                    )}
                                    <div>
                                        <p className="font-semibold">Highlight {hl.title}</p>
                                        <p className="text-sm py-2">{hl.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}
