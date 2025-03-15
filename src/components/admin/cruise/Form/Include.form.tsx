"use client";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";
import { includeBodyAtom } from "~/stores/cruise.store";

export const IncludeCruiseForm = () => {
    const [includes, setIncludes] = useAtom(includeBodyAtom);

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setIncludes((prev) => (Array.isArray(prev) ? prev.map((inc, i) => (i === index ? { ...inc, [name]: value } : inc)) : []));
    };

    const addInclude = () => {
        setIncludes((prev) => {
            const current = Array.isArray(prev) ? prev : [];
            return [...current, { title: "", description: "" }];
        });
    };

    const removeInclude = (index: number) => {
        setIncludes((prev) => (Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []));
    };

    return (
        <div className="flex flex-col gap-y-5">
            {includes.length === 0 && <p>No include items added yet.</p>}
            {includes.map((inc, i) => (
                <Card
                    key={i}
                    title={
                        <div className="flex items-center justify-between gap-5">
                            <p>Include {inc.title}</p>
                            {includes.length > 1 && (
                                <button type="button" onClick={() => removeInclude(i)}>
                                    <IconX />
                                </button>
                            )}
                        </div>
                    }
                >
                    <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                        <InputForm
                            title="title"
                            type="text"
                            value={inc.title}
                            handleInputChange={(e) => handleInputChange(i, e)}
                            label="Title"
                            isRequired
                            placeholder="Include title..."
                        />
                        <div className="col-span-2">
                            <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase" htmlFor={`description-${i}`}>
                                Description
                            </label>
                            <textarea
                                name="description"
                                id="description"
                                value={inc.description || ""}
                                onChange={(e) => handleInputChange(i, e)}
                                className="border outline-brown/60 border-black rounded-lg w-full text-black py-3 px-4 text-sm"
                                rows={5}
                            />
                        </div>
                        <div className="col-span-2">
                            <SubmitButton title="" icon={<IconPlus />} type="button" onClick={addInclude} className="text-sm w-fit ms-auto" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default IncludeCruiseForm;
