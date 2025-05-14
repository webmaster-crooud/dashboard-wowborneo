"use client";

import { IconPlus, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import React from "react";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { deleteCoverImage } from "~/lib/idb";
import { experienceBodyAtom } from "~/stores/boat.store";

export function ExperienceBoatForm() {
    const [experiences, setExperiences] = useAtom(experienceBodyAtom);
    const addExperience = () => {
        setExperiences((prev) => [...prev, { description: "", title: "" }]);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, idx: number) => {
        const { name, value } = e.target;
        setExperiences((prev) => prev.map((exp, index) => (index === idx ? { ...exp, [name]: value } : exp)));
    };
    const removeExp = async (index: number) => {
        const storageKey = `experience_EXPERIENCE_${index}`;
        const coverId = localStorage.getItem(storageKey);
        console.log(coverId);
        if (coverId) {
            await deleteCoverImage(Number(coverId));
            localStorage.removeItem(storageKey);
        }

        setExperiences((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-y-5">
            {experiences.map((exp, i) => (
                <Card
                    title={
                        <div className="flex items-center justify-between gap-5">
                            <span>Experience: {exp.title}</span>
                            {experiences.length > 1 && (
                                <button onClick={() => removeExp(i)} type="button">
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
                            <CoverUploader entityId={i.toString()} entityType="EXPERIENCE" imageType="COVER" storageKeyPrefix="experience" />
                        </div>
                        <InputForm
                            title="title"
                            type="text"
                            value={exp.title}
                            placeholder="Experience Title..."
                            isRequired
                            handleInputChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e, i)}
                        />
                        <div className="col-span-2">
                            <RichTextEditor
                                setContent={(content) =>
                                    setExperiences((prev) =>
                                        Array.isArray(prev) ? prev.map((d, idx) => (idx === i ? { ...d, description: content } : d)) : []
                                    )
                                }
                                content={String(exp.description)}
                            />
                        </div>
                    </div>

                    <SubmitButton type="button" onClick={addExperience} className="w-2/12" title="Add" icon={<IconPlus stroke={2} size={18} />} />
                </Card>
            ))}
        </div>
    );
}
