"use client";
import { IconArrowBack } from "@tabler/icons-react";
import { useSetAtom } from "jotai";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { HeaderAdmin } from "~/components/Header";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { MainButton } from "~/components/ui/Button/Main.button";
import { Card } from "~/components/ui/Card";
import { errorAtom } from "~/stores";
import { defaultCruiseBody } from "~/stores/cruise.store";
import { ApiSuccessResponse } from "~/types";
import { ICruiseResponseDetail } from "~/types/cruise";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";

const dataBreadcrumb: Breadcrumb[] = [
    {
        title: "Dashboard",
        url: "/admin",
    },
    {
        title: "Cruise",
        url: "/admin/cruises",
    },
    {
        title: "Detail",
        url: "/admin/cruises",
    },
];

const CruiseDetail = () => {
    const [cruise, setCruise] = useState<ICruiseResponseDetail>(defaultCruiseBody);
    const { cruiseId } = useParams();
    const setError = useSetAtom(errorAtom);

    const fetchCruiseDetail = useCallback(async () => {
        try {
            const { data } = await api.get<ApiSuccessResponse<ICruiseResponseDetail>>(`${process.env.NEXT_PUBLIC_API}/admin/cruise/${cruiseId}`);
            setCruise(data.data);
        } catch (error) {
            fetchError(error, setError);
        }
    }, [setError, cruiseId]);

    useEffect(() => {
        fetchCruiseDetail();
    }, [fetchCruiseDetail]);

    return (
        <>
            <HeaderAdmin dataBreadcrumb={dataBreadcrumb} />
            <div className="flex items-center justify-start gap-6 flex-wrap mt-5 px-8">
                <MainButton url="/admin/cruises" title="Back" className="flex-row   -reverse" icon={<IconArrowBack stroke={2} size={20} />} />
            </div>
            <div className="container mx-auto p-6 space-y-8">
                {/* Header & Intro */}
                <header>
                    <h1 className="text-4xl font-bold mb-2">{cruise.title}</h1>
                    {cruise.subTitle && <h2 className="text-2xl text-gray-700 mb-4">{cruise.subTitle}</h2>}
                    {cruise.description && <div className="rich-text-preview" dangerouslySetInnerHTML={{ __html: cruise.description || "" }} />}
                </header>

                {/* Informasi Utama */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="font-bold text-lg">Departure</h3>
                        <p className="text-gray-600">{cruise.departure || "-"}</p>
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Duration</h3>
                        <p className="text-gray-600">{cruise.duration}</p>
                    </div>
                </section>

                {/* Introduction Section */}
                {cruise.introductionTitle && (
                    <section>
                        <h2 className="text-2xl font-semibold mb-2">{cruise.introductionTitle}</h2>
                        {cruise.introductionText && <p className="text-gray-700">{cruise.introductionText}</p>}
                    </section>
                )}

                {/* Call To Action */}
                {cruise.cta && (
                    <section>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded">{cruise.cta}</button>
                    </section>
                )}

                {/* Destinations */}
                {cruise.destinations && cruise.destinations.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Destinations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cruise.destinations.map((destination, idx) => (
                                <Card key={idx} title={destination.title}>
                                    <Image
                                        src={destination.cover?.source || ""}
                                        alt={destination.cover?.alt || "Cover by Wow Borneo"}
                                        width={800}
                                        height={400}
                                        className="rounded-lg object-cover w-full h-48"
                                        loading="lazy"
                                    />
                                    <div className="rich-text-preview mt-5" dangerouslySetInnerHTML={{ __html: destination.description || "" }} />
                                    <p className="mt-2 text-sm">
                                        <span className="font-semibold">Days:</span> {destination.days}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Highlights */}
                {cruise.highlights && cruise.highlights.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Highlights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cruise.highlights.map((highlight, idx) => (
                                <Card key={idx} title={highlight.title}>
                                    <Image
                                        src={highlight.cover?.source || ""}
                                        alt={highlight.cover?.alt || "Cover by Wow Borneo"}
                                        width={800}
                                        height={400}
                                        className="rounded-lg object-cover w-full h-48"
                                        loading="lazy"
                                    />
                                    {highlight.description && (
                                        <div className="rich-text-preview mt-5" dangerouslySetInnerHTML={{ __html: highlight.description || "" }} />
                                    )}
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Includes */}
                {cruise.include && cruise.include.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Includes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cruise.include.map((item, idx) => (
                                <Card key={idx} title={item.title}>
                                    <p className="text-gray-600">{item.description}</p>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Informations */}
                {cruise.informations && cruise.informations.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Informations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {cruise.informations.map((info, idx) => (
                                <Card key={idx} title={info.title}>
                                    <p className="text-gray-600">{info.text}</p>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Timestamps */}
                <footer className="text-gray-500 text-sm">
                    <p>Created: {}</p>
                    <p>Updated: {}</p>
                </footer>
            </div>
        </>
    );
};

export default CruiseDetail;
