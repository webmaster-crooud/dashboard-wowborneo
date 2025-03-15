"use client";
import { useAtom } from "jotai";
import { useEffect } from "react";
import RichTextEditor from "~/components/RichText";
import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";

import { cruiseBodyAtom } from "~/stores/cruise.store";
import { Account } from "~/types/auth";

export const MainCruiseForm = ({ account }: { account: Account }) => {
    const [cruiseBody, setCruiseBody] = useAtom(cruiseBodyAtom);

    useEffect(() => {
        setCruiseBody((props) => ({
            ...props,
            status: account.role.name === "admin" ? "PENDING" : "ACTIVED",
        }));
    }, [account, setCruiseBody]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCruiseBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };
    return (
        <Card title="Core Data Cruise">
            <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                <InputForm
                    title="title"
                    type="text"
                    value={cruiseBody.title}
                    handleInputChange={handleInputChange}
                    label="Title of Cruise"
                    isRequired
                    placeholder="Dayak Festival..."
                />
                <InputForm
                    title="subTitle"
                    type="text"
                    value={cruiseBody.subTitle || ""}
                    handleInputChange={handleInputChange}
                    label="Subtitle of Cruise"
                    placeholder="Wonderful Cruise..."
                />

                <InputForm
                    title="departure"
                    type="text"
                    value={cruiseBody.departure || ""}
                    handleInputChange={handleInputChange}
                    placeholder="Bali"
                />
                <div className="flex flex-col items-end justify-start gap-2">
                    <InputForm
                        title="duration"
                        type="number"
                        value={cruiseBody.duration || ""}
                        handleInputChange={handleInputChange}
                        placeholder="1"
                    />

                    <p className="w-full text-xs">
                        <b>Data: </b>
                        {cruiseBody.duration} Days {Number(cruiseBody.duration) > 1 && `${Number(cruiseBody.duration) - 1} Night`}
                    </p>
                </div>
                <div className="col-span-2">
                    <label className="font-bold mb-2 flex items-center justify-start gap-1 text-sm uppercase" htmlFor={`description`}>
                        Description
                    </label>
                    <RichTextEditor
                        setContent={(content) =>
                            setCruiseBody((prev) => ({
                                ...prev,
                                description: content,
                            }))
                        }
                        content={String(cruiseBody.description)}
                    />
                </div>
            </div>
        </Card>
    );
};
