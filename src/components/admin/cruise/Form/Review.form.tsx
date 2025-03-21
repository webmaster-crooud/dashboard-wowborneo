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
    const [cruiseCover, setCruiseCover] = React.useState<string | null>(null);
    const [galleryImages, setGalleryImages] = React.useState<Array<{ id: string; url: string }>>([]);

    // Ambil cover images dan gallery dari IndexedDB
    React.useEffect(() => {
        const loadAllImages = async () => {
            const newCovers: { [key: string]: string } = {};

            // Load cruise cover
            const cruiseCoverId = localStorage.getItem("coverCruiseId_CRUISE_cruiseCover");
            if (cruiseCoverId) {
                try {
                    const blob = await getCoverImage(Number(cruiseCoverId));
                    if (blob) {
                        setCruiseCover(URL.createObjectURL(blob));
                    }
                } catch (error) {
                    console.error("Error loading cruise cover:", error);
                }
            }

            // Load gallery images
            const galleryKeys = Object.keys(localStorage).filter((key) => key.startsWith("photoCruiseId_CRUISE_cruisePhoto_"));

            const galleryPromises = galleryKeys.map(async (key) => {
                const imageId = localStorage.getItem(key);
                if (imageId) {
                    try {
                        const blob = await getCoverImage(Number(imageId));
                        if (blob) {
                            return {
                                id: imageId,
                                url: URL.createObjectURL(blob),
                            };
                        }
                    } catch (error) {
                        console.error(`Error loading gallery image ${key}:`, error);
                    }
                }
                return null;
            });

            const galleryResults = await Promise.all(galleryPromises);
            setGalleryImages(galleryResults.filter(Boolean) as Array<{ id: string; url: string }>);

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

        loadAllImages();
    }, [highlights, destinations]);

    return (
        <div className="space-y-8">
            {/* Cruise Card */}
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
                    {/* Cover Image */}
                    {cruiseCover && (
                        <div className="col-span-2 mb-4">
                            <p className="font-semibold mb-2">Cover Image:</p>
                            <Image height={300} width={600} src={cruiseCover} alt="Cruise Cover" className="w-full h-60 object-cover rounded-lg" />
                        </div>
                    )}

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

            {/* Gallery Card */}
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <h5>Gallery</h5>
                        <button type="button" onClick={() => setStep("CONTENT")} className="text-sm font-semibold">
                            Edit
                        </button>
                    </div>
                }
            >
                {galleryImages.length === 0 ? (
                    <p className="text-sm">No gallery images added.</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {galleryImages.map((image, index) => (
                            <div key={image.id} className="relative">
                                <Image
                                    height={200}
                                    width={300}
                                    src={image.url}
                                    alt={`Gallery image ${index + 1}`}
                                    className="w-full h-48 object-cover rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                )}
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
