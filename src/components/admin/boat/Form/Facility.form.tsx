"use client";

import { IconPlus, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import React from "react";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";
import { facilityBodyAtom } from "~/stores/boat.store";

export function FacilityBoatForm() {
    const [facilities, setFacilities] = useAtom(facilityBodyAtom);
    const addFacility = () => {
        setFacilities((prev) => [...prev, { description: "", name: "", icon: "" }]);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, idx: number) => {
        const { name, value } = e.target;
        setFacilities((prev) => prev.map((exp, index) => (index === idx ? { ...exp, [name]: value } : exp)));
    };
    const removeFacility = async (index: number) => {
        setFacilities((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-y-5">
            {facilities.map((fc, i) => (
                <Card
                    title={
                        <div className="flex items-center justify-between gap-5">
                            <span>Facility: {fc.name}</span>
                            {facilities.length > 1 && (
                                <button onClick={() => removeFacility(i)} type="button">
                                    <IconX size={18} stroke={2} />
                                </button>
                            )}
                        </div>
                    }
                    classBody="flex flex-col gap-y-5 items-end"
                    key={i}
                >
                    <div className="grid grid-cols-2 gap-5 w-full">
                        <InputForm
                            title="name"
                            type="text"
                            value={fc.name}
                            placeholder="Facility name..."
                            isRequired
                            handleInputChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e, i)}
                        />
                        <InputForm
                            title="icon"
                            type="icon"
                            value={fc.icon || ""}
                            placeholder="Icon"
                            handleInputChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e, i)}
                        />
                        <div className="col-span-2">
                            <RichTextEditor
                                setContent={(content) =>
                                    setFacilities((prev) =>
                                        Array.isArray(prev) ? prev.map((d, idx) => (idx === i ? { ...d, description: content } : d)) : []
                                    )
                                }
                                content={String(fc.description)}
                            />
                        </div>
                    </div>

                    <SubmitButton type="button" onClick={addFacility} className="w-2/12" title="Add" icon={<IconPlus stroke={2} size={18} />} />
                </Card>
            ))}
        </div>
    );
}
