"use client";
import { useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AboutBoatDetail } from "~/components/admin/boat/detail/About.detail";
import { CabinBoatDetail } from "~/components/admin/boat/detail/Cabin.detail";
import { DeckBoatDetail } from "~/components/admin/boat/detail/Deck.detail";
import { ExperienceBoatDetail } from "~/components/admin/boat/detail/Experience.detail";
import { FacilityDetailBoat } from "~/components/admin/boat/detail/Facility.detail";
import { HeaderDetailBoat } from "~/components/admin/boat/detail/Header.detail";
import { Breadcrumb } from "~/components/ui/Breadcrumb";
import { LoaderForm } from "~/components/ui/Form/Loader.form";
import { errorAtom } from "~/stores";
import { ApiSuccessResponse } from "~/types";
import { IBoatResponse } from "~/types/boat";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";

export type OPENSECTION = "ABOUT" | "EXPERIENCE" | "FACILITY" | "CABIN" | "DECK";
export default function BoatDetailPage() {
    const { boatId } = useParams();
    const dataBreadcrumb: Breadcrumb[] = [
        {
            title: "Dashboard",
            url: "/admin",
        },
        {
            title: "Boats",
            url: "/admin/boats",
        },
        {
            title: "Detail",
            url: `/admin/boats/${boatId}`,
        },
    ];
    const setError = useSetAtom(errorAtom);
    const [loading, setLoading] = useState<{ stack: string; field: string }>({ stack: "", field: "" });
    const [openSection, setOpenSection] = useState<OPENSECTION | null>(null);

    const [boat, setBoat] = useState<IBoatResponse | null>(null);

    const fetchBoatDetail = useCallback(async () => {
        setLoading({ stack: "fetch", field: "Boat Detail" });
        try {
            const { data } = await api.get<ApiSuccessResponse<IBoatResponse>>(`${process.env.NEXT_PUBLIC_API}/admin/boat/${boatId}`);
            setBoat(data.data);
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
        }
    }, [boatId, setError]);

    useEffect(() => {
        fetchBoatDetail();
    }, [fetchBoatDetail]);

    if (loading.stack === "fetch") {
        return <LoaderForm key={"loaderFetchBoat"} loading={{ stack: "fetch", field: loading.field }} />;
    }
    if (loading.stack === "submit" || loading.stack === "upload") {
        return <LoaderForm key={"loaderSubmitBoat"} loading={{ stack: "submit", field: loading.field }} />;
    } else
        return (
            boat && (
                <>
                    <HeaderDetailBoat
                        loading={loading}
                        boat={boat}
                        cover={boat.cover || { alt: "", entityId: "", entityType: "", imageType: "COVER", source: "", id: 0 }}
                        dataBreadcrumb={dataBreadcrumb}
                        fetchBoat={fetchBoatDetail}
                        setLoading={setLoading}
                    />
                    <div className="p-5 flex flex-col gap-y-5">
                        <AboutBoatDetail
                            loading={loading}
                            fetchBoat={fetchBoatDetail}
                            setLoading={setLoading}
                            abouts={boat.abouts}
                            openSection={openSection}
                            setOpenSection={setOpenSection}
                        />
                        <ExperienceBoatDetail
                            loading={loading}
                            fetchBoat={fetchBoatDetail}
                            setLoading={setLoading}
                            experiences={boat.experiences}
                            openSection={openSection}
                            setOpenSection={setOpenSection}
                        />
                        <FacilityDetailBoat
                            loading={loading}
                            fetchBoat={fetchBoatDetail}
                            setLoading={setLoading}
                            facilities={boat.facilities}
                            openSection={openSection}
                            setOpenSection={setOpenSection}
                        />
                        <CabinBoatDetail
                            loading={loading}
                            fetchBoat={fetchBoatDetail}
                            setLoading={setLoading}
                            cabins={boat.cabins}
                            openSection={openSection}
                            setOpenSection={setOpenSection}
                        />
                        <DeckBoatDetail
                            fetchBoat={fetchBoatDetail}
                            setLoading={setLoading}
                            deck={boat.deck}
                            openSection={openSection}
                            setOpenSection={setOpenSection}
                        />
                    </div>
                </>
            )
        );
}
