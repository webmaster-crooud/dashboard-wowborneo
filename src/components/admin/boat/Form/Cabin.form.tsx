"use client";

import { IconPlus, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import React from "react";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { SelectDataInterface, SelectForm } from "~/components/ui/Form/Select.form";
import { deleteCoverImage } from "~/lib/idb";
import { cabinBodyAtom } from "~/stores/boat.store";
const dataTypeCabin: SelectDataInterface[] = [
    {
        name: "Twin Bed",
        value: "TWIN",
    },
    {
        name: "Super Bed",
        value: "SUPER",
    },
    {
        name: "Double Bed",
        value: "DOUBLE",
    },
];

export function CabinBoatForm() {
    const [cabins, setCabins] = useAtom(cabinBodyAtom);
    const addCabin = () => {
        setCabins((prev) => [...prev, { description: "", maxCapacity: 1, name: "", price: "", type: "TWIN" }]);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, idx: number) => {
        const { name, value } = e.target;
        setCabins((prev) => prev.map((cabin, index) => (index === idx ? { ...cabin, [name]: value } : cabin)));
    };
    const removeCabin = async (index: number) => {
        const storageKey = `cabin_CABIN_${index}`;
        const coverId = localStorage.getItem(storageKey);
        console.log(coverId);
        if (coverId) {
            await deleteCoverImage(Number(coverId));
            localStorage.removeItem(storageKey);
        }

        setCabins((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-y-5">
            {cabins.map((cabin, i) => (
                <Card
                    title={
                        <div className="flex items-center justify-between gap-5">
                            <span>Cabin: {cabin.name}</span>
                            {cabins.length > 1 && (
                                <button onClick={() => removeCabin(i)} type="button">
                                    <IconX size={18} stroke={2} />
                                </button>
                            )}
                        </div>
                    }
                    classBody="flex flex-col gap-y-5 items-end"
                    key={i}
                >
                    <div className="grid grid-cols-2 gap-5 w-full">
                        <div className="col-span-2">
                            <CoverUploader entityId={i.toString()} entityType="CABIN" imageType="COVER" storageKeyPrefix="cabin" />
                        </div>
                        <InputForm
                            title="name"
                            type="text"
                            value={cabin.name}
                            placeholder="Name of Cabin..."
                            isRequired
                            handleInputChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e, i)}
                        />
                        <InputForm
                            title="price"
                            type="currency"
                            value={Number(cabin.price)}
                            placeholder="00.000.000"
                            isRequired
                            className="ps-7"
                            handleInputChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e, i)}
                        />
                        <SelectForm
                            data={dataTypeCabin}
                            label="type"
                            title="Type of Cabin"
                            value={cabin.type}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange(e, i)}
                        />
                        <InputForm
                            title="maxCapacity"
                            type="number"
                            label="Maximum Capacity"
                            value={parseInt(cabin.maxCapacity.toString())}
                            placeholder="Maximum Capacity"
                            isRequired
                            handleInputChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e, i)}
                        />
                        <div className="col-span-2">
                            <RichTextEditor
                                setContent={(content) =>
                                    setCabins((prev) =>
                                        Array.isArray(prev) ? prev.map((d, idx) => (idx === i ? { ...d, description: content } : d)) : []
                                    )
                                }
                                content={String(cabin.description)}
                            />
                        </div>
                    </div>

                    <SubmitButton type="button" onClick={addCabin} className="w-2/12" title="Add" icon={<IconPlus stroke={2} size={18} />} />
                </Card>
            ))}
        </div>
    );
}
