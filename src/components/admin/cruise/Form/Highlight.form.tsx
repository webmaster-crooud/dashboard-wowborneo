"use client";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";

import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";

import { highlightBodyAtom } from "~/stores/cruise.store";
import { deleteCoverImage } from "~/lib/idb";
import { CoverUploader } from "~/components/ui/Form/File.form";
import React from "react";

export const HighlightCruiseForm = () => {
    const [highlights, setHighlights] = useAtom(highlightBodyAtom);

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setHighlights((prev) => (Array.isArray(prev) ? prev.map((hl, i) => (i === index ? { ...hl, [name]: value } : hl)) : []));
    };

    const addHighlight = () => {
        setHighlights((prev) => [...prev, { title: "", description: "" }]);
    };

    const removeHighlight = async (index: number) => {
        // Hapus data cover terkait
        const storageKey = `coverImageId_HIGHLIGHT_${index}`;
        const coverId = localStorage.getItem(storageKey);
        if (coverId) {
            await deleteCoverImage(Number(coverId));
            localStorage.removeItem(storageKey);
        }

        // Hapus highlight dari state
        setHighlights((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-y-5">
            {highlights.length === 0 && <p className="text-gray-500">Belum ada highlight ditambahkan</p>}

            {highlights.map((hl, i) => (
                <Card
                    key={i}
                    title={
                        <div className="flex items-center justify-between gap-5">
                            <p>Highlight: {hl.title}</p>
                            {highlights.length > 1 && (
                                <button type="button" onClick={() => removeHighlight(i)} className="text-red-500 hover:text-red-700">
                                    <IconX size={20} />
                                </button>
                            )}
                        </div>
                    }
                >
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {/* Komponen Uploader */}
                        <div className="col-span-2">
                            <CoverUploader entityType="HIGHLIGHT" entityId={i.toString()} storageKeyPrefix="coverImageId" />
                        </div>

                        <InputForm
                            title={`title`}
                            type="text"
                            value={hl.title}
                            handleInputChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(i, e)}
                            label="Judul"
                            isRequired
                            placeholder="Judul highlight..."
                        />

                        <div className="col-span-2">
                            <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase">Deskripsi</label>
                            <textarea
                                name="description"
                                value={hl.description || ""}
                                onChange={(e) => handleInputChange(i, e)}
                                className="border outline-brown/60 border-black rounded-lg w-full text-black py-3 px-4 text-sm"
                                rows={5}
                                placeholder="Deskripsi lengkap..."
                            />
                        </div>
                    </div>
                    <SubmitButton title="" type="button" onClick={addHighlight} icon={<IconPlus />} className="text-sm w-fit ms-auto" />
                </Card>
            ))}
        </div>
    );
};

export default HighlightCruiseForm;
