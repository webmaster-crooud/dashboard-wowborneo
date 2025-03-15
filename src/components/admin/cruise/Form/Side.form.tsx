import { IconArrowBack, IconArrowRightBar, IconCloudUpload, IconLoader3 } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { FORMSTEP } from "~/app/admin/cruises/create/page";
import { SubmitButton } from "~/components/ui/Button/Submit.button";
import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";

import { SelectForm } from "~/components/ui/Form/Select.form";
import { selectStatus } from "~/constants/Status";
import { cruiseBodyAtom } from "~/stores/cruise.store";
import { STATUS } from "~/types";
import { Account } from "~/types/auth";

type propsSideForm = {
    account: Account;
    setStep: React.Dispatch<SetStateAction<FORMSTEP>>;
    step: FORMSTEP;
    loading: { stack: string; field?: string };
};

export const SideForm: React.FC<propsSideForm> = ({ account, setStep, step, loading }) => {
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

    const handleSelectChange = (val: string) => {
        setCruiseBody((prev) => ({
            ...prev,
            status: val as STATUS, // Update status dengan nilai yang dipilih
        }));
    };

    return (
        <Card title="SEO + Meta Data" className="sticky top-5 h-96 z-[2] bg-gray-100">
            <div className="flex flex-col gap-y-5 min-h-full items-center justify-between">
                <InputForm title="slug" type="text" value={cruiseBody.slug} handleInputChange={handleInputChange} placeholder="dayak-festival" />

                {account.role.name === "admin" ? (
                    <SelectForm data={selectStatus} label="Status" value={cruiseBody.status} onChange={handleSelectChange} disabled />
                ) : (
                    <SelectForm data={selectStatus} label="Status" value={cruiseBody.status} onChange={handleSelectChange} />
                )}

                {step === "MAIN" && (
                    <SubmitButton
                        disabled={loading.stack === "cruise"}
                        type="button"
                        title="Next"
                        icon={<IconArrowRightBar size={20} stroke={2} />}
                        className="w-10/12 absolute bottom-5"
                        onClick={() => setStep("HIGHLIGHT")}
                    />
                )}
                {step === "HIGHLIGHT" && (
                    <div className="flex w-10/12 absolute bottom-5 items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("MAIN")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("INCLUDE")}
                            title="NEXT"
                            icon={<IconArrowRightBar size={20} stroke={2} />}
                            className="w-full"
                        />
                    </div>
                )}
                {step === "INCLUDE" && (
                    <div className="flex w-10/12 absolute bottom-5 items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("HIGHLIGHT")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("INFORMATION")}
                            title="NEXT"
                            icon={<IconArrowRightBar size={20} stroke={2} />}
                            className="w-full"
                        />
                    </div>
                )}
                {step === "INFORMATION" && (
                    <div className="flex w-10/12 absolute bottom-5 items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("INCLUDE")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("DESTINATION")}
                            title="NEXT"
                            icon={<IconArrowRightBar size={20} stroke={2} />}
                            className="w-full"
                        />
                    </div>
                )}
                {step === "DESTINATION" && (
                    <div className="flex w-10/12 absolute bottom-5 items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("INFORMATION")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("REVIEW")}
                            title="NEXT"
                            icon={<IconArrowRightBar size={20} stroke={2} />}
                            className="w-full"
                        />
                    </div>
                )}

                {step === "REVIEW" && (
                    <div className="flex w-10/12 absolute bottom-5 items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("DESTINATION")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="submit"
                            title="Save"
                            icon={
                                loading.stack === "cruise" ? (
                                    <IconLoader3 className="animate-spin" size={20} stroke={2} />
                                ) : (
                                    <IconCloudUpload size={20} stroke={2} />
                                )
                            }
                            className="w-full"
                        />
                    </div>
                )}

                {step === "CONTENT" && (
                    <div className="flex w-10/12 absolute bottom-5 items-center justify-center gap-5">
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("INFORMATION")}
                            title="BACK"
                            icon={<IconArrowBack size={20} stroke={2} />}
                            className="w-full"
                        />
                        <SubmitButton
                            disabled={loading.stack === "cruise"}
                            type="button"
                            onClick={() => setStep("REVIEW")}
                            title="NEXT"
                            icon={<IconArrowRightBar size={20} stroke={2} />}
                            className="w-full"
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};
