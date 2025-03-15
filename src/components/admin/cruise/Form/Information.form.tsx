"use client";
import { IconPlus, IconX } from "@tabler/icons-react";
import { useAtom } from "jotai";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";
import { informationBodyAtom } from "~/stores/cruise.store";

export const InformationCruiseForm = () => {
    const [informations, setInformations] = useAtom(informationBodyAtom);

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setInformations((prev) => (Array.isArray(prev) ? prev.map((info, i) => (i === index ? { ...info, [name]: value } : info)) : []));
    };

    const addInformation = () => {
        setInformations((prev) => {
            const current = Array.isArray(prev) ? prev : [];
            return [...current, { title: "", text: "" }];
        });
    };

    const removeInformation = (index: number) => {
        setInformations((prev) => (Array.isArray(prev) ? prev.filter((_, i) => i !== index) : []));
    };

    return (
        <div className="flex flex-col gap-y-5">
            {informations.length === 0 && <p>No information added yet.</p>}
            {informations.map((info, i) => (
                <Card
                    key={i}
                    title={
                        <div className="flex items-center justify-between gap-5">
                            <p>Information {info.title}</p>
                            {informations.length > 1 && (
                                <button type="button" onClick={() => removeInformation(i)}>
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
                            value={info.title}
                            handleInputChange={(e) => handleInputChange(i, e)}
                            label="Title"
                            isRequired
                            placeholder="Information title..."
                        />
                        <InputForm
                            title="text"
                            type="text"
                            value={info.text || ""}
                            handleInputChange={(e) => handleInputChange(i, e)}
                            label="Text"
                            isRequired
                            placeholder="Detailed text..."
                        />
                        <div className="col-span-2">
                            <SubmitButton title="" icon={<IconPlus />} type="button" onClick={addInformation} className="text-sm w-fit ms-auto" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default InformationCruiseForm;
