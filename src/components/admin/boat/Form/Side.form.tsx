import { IconArrowBack, IconArrowRightBar, IconCloudUpload, IconLoader3 } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import React from "react";
import { FORMSTEPBOAT } from "~/app/admin/boats/create/page";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";

import { SelectForm } from "~/components/ui/Form/Select.form";
import { selectStatus } from "~/constants/Status";
import { Account } from "~/types/auth";
import { IBoatRequestBody } from "~/types/boat";

type propsSideForm = {
    account: Account;
    body: IBoatRequestBody;
    setBody: React.Dispatch<SetStateAction<IBoatRequestBody>>;
    setStep: React.Dispatch<SetStateAction<FORMSTEPBOAT>>;
    step: FORMSTEPBOAT;
    loading: { stack: string; field?: string };
};

export const SideForm: React.FC<propsSideForm> = ({ account, setStep, step, loading, body, setBody }) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <Card title="SEO + Meta Data" className="sticky top-5 h-fit z-[2] bg-gray-100">
            <div className="flex flex-col gap-y-5 min-h-full items-center justify-between">
                <InputForm title="slug" type="text" value={body.slug || ""} handleInputChange={handleInputChange} placeholder="slug-of-boat" />

                {account.role.name === "admin" ? (
                    <SelectForm data={selectStatus} label="status" value={body.status} onChange={handleInputChange} disabled />
                ) : (
                    <SelectForm data={selectStatus} label="status" value={body.status} onChange={handleInputChange} />
                )}

                {step === "MAIN" && (
                    <SubmitButton
                        disabled={loading.stack === "submit"}
                        type="button"
                        title="Next"
                        icon={<IconArrowRightBar size={20} stroke={2} />}
                        className="w-full"
                        onClick={() => setStep("CABIN")}
                    />
                )}
                {step === "CABIN" && (
                    <div className="flex w-full items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("MAIN")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("ABOUT")}
                            title="NEXT"
                            icon={<IconArrowRightBar size={20} stroke={2} />}
                            className="w-full"
                        />
                    </div>
                )}
                {step === "ABOUT" && (
                    <div className="flex w-full items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("CABIN")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("EXPERIENCE")}
                            title="NEXT"
                            icon={<IconArrowRightBar size={20} stroke={2} />}
                            className="w-full"
                        />
                    </div>
                )}
                {step === "EXPERIENCE" && (
                    <div className="flex w-full items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("ABOUT")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("FACILITY")}
                            title="NEXT"
                            icon={<IconArrowRightBar size={20} stroke={2} />}
                            className="w-full"
                        />
                    </div>
                )}
                {step === "FACILITY" && (
                    <div className="flex w-full items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("EXPERIENCE")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("DECK")}
                            title="NEXT"
                            icon={<IconArrowRightBar size={20} stroke={2} />}
                            className="w-full"
                        />
                    </div>
                )}
                {step === "DECK" && (
                    <div className="flex w-full items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("FACILITY")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("REVIEW")}
                            title="NEXT"
                            icon={<IconArrowRightBar size={20} stroke={2} />}
                            className="w-full"
                        />
                    </div>
                )}
                {step === "REVIEW" && (
                    <div className="flex w-full items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="button"
                            onClick={() => setStep("DECK")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "submit"}
                            type="submit"
                            title="Save"
                            icon={
                                loading.stack === "submit" ? (
                                    <IconLoader3 className="animate-spin" size={20} stroke={2} />
                                ) : (
                                    <IconCloudUpload size={20} stroke={2} />
                                )
                            }
                            className="w-full"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};
