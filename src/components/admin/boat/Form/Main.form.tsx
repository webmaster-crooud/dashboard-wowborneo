import { SetStateAction } from "jotai";
import React from "react";
import RichTextEditor from "~/components/RichText";
import { Card } from "~/components/ui/Card";
import { CoverUploader } from "~/components/ui/Form/File.form";
import { InputForm } from "~/components/ui/Form/Input.form";
import { IBoatRequestBody } from "~/types/boat";

type propsMainBoatForm = {
    body: IBoatRequestBody;
    setBody: React.Dispatch<SetStateAction<IBoatRequestBody>>;
};

export function MainBoatForm({ body, setBody }: propsMainBoatForm) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <Card title={`Boat: ${body.name}`}>
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <div className="col-span-2">
                    <CoverUploader entityId="1" entityType="BOAT" imageType="COVER" storageKeyPrefix="boat" />
                </div>
                <InputForm
                    title="name"
                    type="text"
                    value={body.name}
                    handleInputChange={handleInputChange}
                    label="Boat"
                    isRequired
                    placeholder="Boat Name ..."
                />

                <div className="col-span-2">
                    <label className="font-bold mb-2 flex items-center justify-start gap-1 text-xs uppercase" htmlFor={`description`}>
                        Description
                    </label>
                    <RichTextEditor
                        setContent={(content) =>
                            setBody((prev) => ({
                                ...prev,
                                description: content,
                            }))
                        }
                        content={String(body.description)}
                    />
                </div>

                <div className="col-span-2">
                    <InputForm
                        title="optionText"
                        type="textarea"
                        value={body.optionText || ""}
                        handleInputChange={handleInputChange}
                        label="Option Text"
                        placeholder="Option Text for Content"
                    />
                </div>
            </div>
        </Card>
    );
}
