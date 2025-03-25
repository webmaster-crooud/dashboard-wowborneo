"use client";

import { IconEdit, IconPlus, IconX } from "@tabler/icons-react";
import { SetStateAction, useSetAtom } from "jotai";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { OPENSECTION } from "~/app/admin/boats/[boatId]/page";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { CanvasImage } from "~/components/ui/CanvasImage";
import { Card } from "~/components/ui/Card";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { RichTextPreview } from "~/components/ui/RichTextPreview";
import { errorAtom, notificationAtom } from "~/stores";
import { IDeckRequestBody, IDeckResponse } from "~/types/boat";
import { api } from "~/utils/api";
import { fetchError } from "~/utils/fetchError";
import { cleanupStorage, uploadCover } from "~/utils/upload";

type propsDeckDetail = {
    deck: IDeckResponse | null;
    openSection: OPENSECTION | null;
    setOpenSection: React.Dispatch<SetStateAction<OPENSECTION | null>>;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchBoat: () => Promise<void>;
};

export function DeckBoatDetail({ deck, openSection, setOpenSection, setLoading, fetchBoat }: propsDeckDetail) {
    const [modal, setModal] = useState<boolean>(false);
    return (
        <Card
            title={
                <>
                    <span>Deck: {deck?.title || ""}</span>
                    <div className="flex items-center justify-end gap-5">
                        <button
                            type="button"
                            onClick={() => setModal(true)}
                            className="px-3 py-1 bg-sky-500 text-white font-semibold text-sm flex items-center justify-center gap-1 rounded-lg"
                        >
                            <IconEdit size={16} fontSize={2} />
                            Edit
                        </button>
                        <button
                            className={`px-3 py-1 ${
                                openSection === "DECK" ? "bg-red-500" : "bg-sky-500"
                            } flex items-center justify-center gap-1 text-white rounded-lg text-sm font-medium`}
                            onClick={() => setOpenSection(openSection === "DECK" ? null : "DECK")}
                            type="button"
                        >
                            {openSection === "DECK" ? "Close" : "Open"}
                        </button>
                    </div>
                </>
            }
            classHeading={`flex items-center justify-between gap-5 ${openSection !== "DECK" && "border-0"}`}
            classBody={`${openSection !== "DECK" && "p-0"} flex flex-col gap-y-3`}
        >
            {openSection === "DECK" && deck && (
                <>
                    <CanvasImage src={deck.cover?.source || "/assets/Image-not-found.png"} className="h-40" />
                    <RichTextPreview value={deck.description || ""} />
                </>
            )}

            {modal && <DeckModal fetchBoat={fetchBoat} setLoading={setLoading} setModal={setModal} deck={deck} />}
        </Card>
    );
}

function DeckModal({
    setModal,
    deck,
    setLoading,
    fetchBoat,
}: {
    setModal: React.Dispatch<SetStateAction<boolean>>;
    deck: IDeckResponse | null;
    setLoading: React.Dispatch<SetStateAction<{ stack: string; field: string }>>;
    fetchBoat: () => Promise<void>;
}) {
    const setError = useSetAtom(errorAtom);
    const setNotification = useSetAtom(notificationAtom);
    const [body, setBody] = useState<IDeckRequestBody>({ title: "", description: "" });
    const { boatId } = useParams();

    useEffect(() => {
        if (deck) {
            setBody({ description: deck.description || "", title: deck.title || "" });
        }
    }, [deck]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading({ stack: "submit", field: deck ? "Update Deck" : "Create Deck" });

        try {
            if (deck) {
                // Update existing deck
                await api.put(
                    `${process.env.NEXT_PUBLIC_API}/admin/boat/deck/${deck.id}`,
                    { title: body.title, description: body.description },
                    { withCredentials: true }
                );

                // Handle cover update
                const checkUploader = localStorage.getItem(`deck_DECK_0`);
                if (checkUploader && deck.cover?.id) {
                    await api.delete(`${process.env.NEXT_PUBLIC_API}/upload/${deck.cover.id}`);
                    await uploadCover(`deck_DECK_0`, String(boatId), "DECK", "COVER");
                }
            }

            await cleanupStorage("deck_DECK_0", "deckBody");
            localStorage.clear();
            await fetchBoat();
            setNotification({
                title: "Deck",
                message: `Successfully ${deck ? "updated" : "created"} deck`,
            });
        } catch (error) {
            fetchError(error, setError);
        } finally {
            setLoading({ stack: "", field: "" });
            setModal(false);
        }
    };

    return (
        <div className="fixed overflow-y-scroll py-10 pt-20 z-50 top-0 left-0 right-0 w-full h-screen bg-white/20 backdrop-blur-md flex items-start justify-center">
            <Card
                classBody="bg-gray-50"
                className="w-8/12"
                title={
                    <div className="flex items-center justify-between gap-5">
                        <p>Deck: {body.title}</p>
                        <button onClick={() => setModal(false)} type="button">
                            <IconX size={18} stroke={2} />
                        </button>
                    </div>
                }
            >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-y-3">
                    <div className="col-span-1">
                        <CoverUploader entityType="DECK" entityId={"0"} storageKeyPrefix="deck" />
                    </div>

                    <InputForm
                        title="title"
                        type="text"
                        value={body.title}
                        handleInputChange={handleInputChange}
                        label="Title"
                        isRequired
                        placeholder="Main Deck..."
                    />

                    <div className="col-span-1">
                        <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase">Description</label>
                        <RichTextEditor
                            setContent={(content) => setBody((prev) => ({ ...prev, description: content }))}
                            content={String(body.description)}
                        />
                    </div>

                    <div className="col-span-1">
                        <SubmitButton
                            title="Save"
                            icon={<IconPlus size={16} stroke={2} />}
                            type="submit"
                            className="text-sm w-fit flex-row-reverse ms-auto"
                        />
                    </div>
                </form>
            </Card>
        </div>
    );
}
