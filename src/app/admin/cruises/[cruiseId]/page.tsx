"use client";
import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { ContentDetailCruise } from "~/components/admin/cruise/detail/Content.detail";
import { DestinationDetailCruise } from "~/components/admin/cruise/detail/Destination.detail";
import { HeaderDetailCruise } from "~/components/admin/cruise/detail/Header.detail";
import { HighlightDetailCruise } from "~/components/admin/cruise/detail/Highlight.detail";
import { IncludeDetailCruise } from "~/components/admin/cruise/detail/Include.detail";
import { InformationDetailCruise } from "~/components/admin/cruise/detail/Information.detail";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { errorAtom } from "~/stores";
// import { defaultCruiseBody } from "~/stores/cruise.store";
import { ApiSuccessResponse } from "~/types";
import { ICruiseResponseDetail } from "~/types/cruise";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";

export type OPENSECTION = "CONTENT" | "HIGHLIGHT" | "DESTINATION" | "INCLUDE" | "INFORMATION";
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
    const [cruise, setCruise] = useState<ICruiseResponseDetail>({
        title: "",
        subTitle: "",
        departure: "",
        description: "",
        duration: "1",
        status: "PENDING",
        slug: "",
        cta: "",
        introductionText: "",
        introductionTitle: "",
        destinations: [],
        highlights: [],
        include: [],
        informations: [],
        cover: {
            alt: "",
            entityId: "",
            entityType: "",
            imageType: "COVER",
            source: "",
            id: 0,
        },
        gallery: [],
    });
    const { cruiseId } = useParams();
    const setError = useSetAtom(errorAtom);
    const [loading, setLoading] = useState<{ stack: string; field: string }>({ stack: "", field: "" });
    const [openSection, setOpenSection] = useState<OPENSECTION | null>(null);
    const [modal, setModal] = useState<string>("");

    const fetchCruiseDetail = useCallback(async () => {
        setLoading({ stack: "fetch", field: "Detail Cruise" });
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            const { data } = await api.get<ApiSuccessResponse<ICruiseResponseDetail>>(`${process.env.NEXT_PUBLIC_API}/admin/cruise/${cruiseId}`);
            setCruise(data.data);
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    }, [setError, cruiseId]);

    useEffect(() => {
        fetchCruiseDetail();
    }, [fetchCruiseDetail]);

    if (loading.stack === "fetch") {
        return <LoaderForm key={"loaderFetchCruise"} loading={{ stack: "fetch", field: loading.field }} />;
    }
    if (loading.stack === "submit" || loading.stack === "upload") {
        return <LoaderForm key={"loaderSubmitCruise"} loading={{ stack: "submit", field: loading.field }} />;
    } else
        return (
            <>
                <HeaderDetailCruise
                    loading={loading}
                    cruise={cruise}
                    cover={cruise.cover}
                    dataBreadcrumb={dataBreadcrumb}
                    fetchCruise={fetchCruiseDetail}
                    setLoading={setLoading}
                />

                <div className="p-5 flex flex-col gap-y-5">
                    <ContentDetailCruise
                        loading={loading}
                        setLoading={setLoading}
                        fetchCruise={fetchCruiseDetail}
                        setModal={setModal}
                        modal={modal}
                        setOpenSection={setOpenSection}
                        openSection={openSection}
                        cruise={cruise}
                    />
                    <DestinationDetailCruise
                        loading={loading}
                        setLoading={setLoading}
                        fetchCruise={fetchCruiseDetail}
                        setModal={setModal}
                        modal={modal}
                        setOpenSection={setOpenSection}
                        openSection={openSection}
                        cruise={cruise}
                    />
                    <HighlightDetailCruise
                        loading={loading}
                        setLoading={setLoading}
                        fetchCruise={fetchCruiseDetail}
                        setModal={setModal}
                        modal={modal}
                        setOpenSection={setOpenSection}
                        openSection={openSection}
                        cruise={cruise}
                    />
                    <InformationDetailCruise
                        loading={loading}
                        setLoading={setLoading}
                        fetchCruise={fetchCruiseDetail}
                        setModal={setModal}
                        modal={modal}
                        setOpenSection={setOpenSection}
                        openSection={openSection}
                        cruise={cruise}
                    />
                    <IncludeDetailCruise
                        loading={loading}
                        setLoading={setLoading}
                        fetchCruise={fetchCruiseDetail}
                        setModal={setModal}
                        modal={modal}
                        setOpenSection={setOpenSection}
                        openSection={openSection}
                        cruise={cruise}
                    />
                </div>
            </>
        );
};

export default CruiseDetail;
