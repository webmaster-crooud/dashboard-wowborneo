// components/ui/Uploader/CoverUploader.tsx
"use client";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useCallback } from "react";
import { useCoverUpload } from "~/hooks/useCoverUpload";

interface CoverUploaderProps {
    entityType: string;
    entityId: string;
    storageKeyPrefix?: string;
}

export const CoverUploader = ({ entityType, entityId, storageKeyPrefix = "cover" }: CoverUploaderProps) => {
    const { cover, uploadCover, removeCover } = useCoverUpload(entityType, entityId, storageKeyPrefix);

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) await uploadCover(file);
        },
        [uploadCover]
    );

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors">
                <input type="file" id={`cover-${entityId}`} className="hidden" onChange={handleFileChange} accept="image/*" />
                <label htmlFor={`cover-${entityId}`} className="inline-flex flex-col items-center gap-2 text-gray-500">
                    <span>Seret atau klik untuk upload cover</span>
                    <span className="text-sm text-gray-400">Maksimal 5MB (JPEG/PNG)</span>
                </label>
            </div>

            {cover && (
                <div className="relative group">
                    <Image
                        src={cover.source}
                        alt={cover.alt || "Cover by Wow Borneo"}
                        width={800}
                        height={400}
                        className="rounded-lg object-cover w-full h-48"
                    />
                    <button
                        type="button"
                        onClick={removeCover}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <IconTrash size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};
