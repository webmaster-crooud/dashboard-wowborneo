// example component upload cover /destination

"use client";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { useEffect } from "react";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { deleteCoverImage } from "~/lib/idb";

import { cruiseBodyAtom, destinationBodyAtom } from "~/stores/cruise.store";

export const DestinationCruiseForm = () => {
    const [destination, setDestination] = useAtom(destinationBodyAtom);

    const [cruise] = useAtom(cruiseBodyAtom);

    useEffect(() => {
        setDestination((prev) => (Array.isArray(prev) ? prev.map((dest) => ({ ...dest, status: cruise.status })) : []));
    }, [setDestination, cruise.status]);

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDestination((prev) =>
            Array.isArray(prev) ? prev.map((dest, i) => (i === index ? { ...dest, [name]: name === "days" ? String(value) : value } : dest)) : []
        );
    };

    const addDestination = () => {
        setDestination((prev) => {
            const current = Array.isArray(prev) ? prev : [];
            // Dapatkan nilai days dari destinasi terakhir atau default ke 1 jika tidak ada
            const newDays = current.length > 0 ? Number(current[current.length - 1].days) + 1 : 1;
            return [...current, { title: "", description: "", days: String(newDays), status: cruise.status }];
        });
    };

    const removeDestination = async (index: number) => {
        const storageKey = `coverImageId_DESTINATION_${index}`;
        const coverId = localStorage.getItem(storageKey);
        if (coverId) {
            await deleteCoverImage(Number(coverId));
            localStorage.removeItem(storageKey);
        }
        setDestination((prev) => (Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []));
    };

    return (
        <div className="flex flex-col gap-y-5">
            {destination.length === 0 && <p>No destinations added yet.</p>}
            {destination.map((dest, i) => (
                <Card
                    title={
                        <div className="flex items-center justify-between gap-5">
                            <p>Destination: {dest.title}</p>
                            {destination.length > 1 && (
                                <button type="button" onClick={() => removeDestination(i)}>
                                    <IconX />
                                </button>
                            )}
                        </div>
                    }
                    key={i}
                >
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        {/* COVER SECTION */}
                        <div className="col-span-2">
                            <CoverUploader entityType="DESTINATION" entityId={i.toString()} storageKeyPrefix="coverImageId" />
                        </div>

                        <InputForm
                            title="title"
                            type="text"
                            value={dest.title}
                            handleInputChange={(e) => handleInputChange(i, e)}
                            label="Title"
                            isRequired
                            placeholder="Dayak Festival..."
                        />

                        <InputForm title="days" type="number" value={dest.days} handleInputChange={(e) => handleInputChange(i, e)} placeholder="1" />

                        <div className="col-span-2">
                            <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase" htmlFor={`description-${i}`}>
                                Description
                            </label>
                            <RichTextEditor
                                setContent={(content) =>
                                    setDestination((prev) =>
                                        Array.isArray(prev) ? prev.map((d, idx) => (idx === i ? { ...d, description: content } : d)) : []
                                    )
                                }
                                content={String(dest.description)}
                            />
                        </div>

                        <div className="col-span-2">
                            <SubmitButton title="" icon={<IconPlus />} type="button" onClick={addDestination} className="text-sm w-fit ms-auto" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};
