"use client";

import { IconPlus, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import React from "react";
import RichTextEditor from "~/components/RichText";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";
import { aboutBodyAtom } from "~/stores/boat.store";
export function AboutBoatForm() {
    const [abouts, setAbout] = useAtom(aboutBodyAtom);
    const addAbout = () => {
        setAbout((prev) => [...prev, { description: "", title: "" }]);
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, idx: number) => {
        const { name, value } = e.target;
        setAbout((prev) => prev.map((about, index) => (index === idx ? { ...about, [name]: value } : about)));
    };
    const removeAbout = async (index: number) => {
        setAbout((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-col gap-y-5">
            {abouts.map((about, i) => (
                <Card
                    title={
                        <div className="flex items-center justify-between gap-5">
                            <span>About</span>
                            {abouts.length > 1 && (
                                <button onClick={() => removeAbout(i)} type="button">
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
                            title="title"
                            type="text"
                            value={about.title}
                            placeholder="Title of About..."
                            isRequired
                            handleInputChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleInputChange(e, i)}
                        />
                        <div className="col-span-2">
                            <RichTextEditor
                                setContent={(content) =>
                                    setAbout((prev) =>
                                        Array.isArray(prev) ? prev.map((d, idx) => (idx === i ? { ...d, description: content } : d)) : []
                                    )
                                }
                                content={String(about.description)}
                            />
                        </div>
                    </div>

                    <SubmitButton type="button" onClick={addAbout} className="w-2/12" title="Add" icon={<IconPlus stroke={2} size={18} />} />
                </Card>
            ))}
        </div>
    );
}
