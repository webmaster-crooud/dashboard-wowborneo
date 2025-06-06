import { useAtom } from "jotai";
import { Card } from "~/components/ui/Card";
import { InputForm } from "~/components/ui/Form/Input.form";
import { cruiseBodyAtom } from "~/stores/cruise.store";

import { CoverUploader } from "~/components/ui/Form/File.form";
import { MultipleUploader } from "~/components/ui/Form/MultipleFile.form";

export function ContentFormCruise() {
    const [cruiseBody, setCruiseBody] = useAtom(cruiseBodyAtom);
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCruiseBody((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="flex flex-col gap-y-5">
            <Card title="SEO Content for River Cruise">
                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                    <InputForm
                        title="introductionTitle"
                        type="text"
                        value={cruiseBody.introductionTitle || ""}
                        handleInputChange={handleInputChange}
                        label="Introduction Title"
                        isRequired
                        placeholder="Title of introduction..."
                    />
                    <InputForm
                        title="introductionText"
                        type="text"
                        value={cruiseBody.introductionText || ""}
                        handleInputChange={handleInputChange}
                        label="Introduction Text"
                        placeholder="Text or description of Introduction"
                    />
                    <InputForm
                        title="cta"
                        type="text"
                        value={cruiseBody.cta || ""}
                        handleInputChange={handleInputChange}
                        label="Call To Action"
                        placeholder="CTA Text..."
                    />
                </div>
            </Card>

            <Card title="Cover">
                <CoverUploader entityId="cruiseCover" entityType="CRUISE" imageType="COVER" storageKeyPrefix="coverCruiseId" />
            </Card>
            <Card title="Gallery">
                <MultipleUploader entityId="cruisePhoto" entityType="CRUISE" imageType="PHOTO" storageKeyPrefix="photoCruiseId" maxFiles={8} />
            </Card>
        </div>
    );
}
