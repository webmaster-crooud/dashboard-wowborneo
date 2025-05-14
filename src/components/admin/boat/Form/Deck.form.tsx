"use client";

import { useAtom } from "jotai";
import React from "react";
import RichTextEditor from "~/components/RichText";
import { Card } from "~/components/ui/Card";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { deckBodyAtom } from "~/stores/boat.store";

export function DeckBoatForm() {
    const [deck, setDeck] = useAtom(deckBodyAtom);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setDeck((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col gap-y-5">
            <Card
                title={
                    <div className="flex items-center justify-between gap-5">
                        <span>Deck: {deck.title}</span>
                    </div>
                }
                classBody="flex flex-col gap-y-5 items-end"
            >
                <div className="grid grid-cols-2 gap-5 w-full">
                    <div className="col-span-2">
                        <CoverUploader entityId={"1"} entityType="DECK" imageType="COVER" storageKeyPrefix="deck" />
                    </div>
                    <InputForm
                        title="title"
                        type="text"
                        value={deck.title}
                        placeholder="Deck Title..."
                        isRequired
                        handleInputChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e)}
                    />
                    <div className="col-span-2">
                        <RichTextEditor
                            setContent={(content) => setDeck((prev) => ({ ...prev, description: content }))}
                            content={String(deck.description)}
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
