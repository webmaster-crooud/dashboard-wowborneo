"use client";
import { IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import { useCallback, useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useSetAtom } from "jotai";
import { errorAtom } from "~/stores";
import { IImage } from "~/types/cruise";
import { getCoverImage, saveCoverImage, deleteCoverImage } from "~/lib/idb";

interface MultipleImageUploaderProps {
    entityType: string;
    entityId: string;
    storageKeyPrefix?: string;
    className?: string;
    imageType?: "PHOTO" | "COVER";
    maxFiles?: number;
}

export const MultipleUploader = ({
    entityType,
    entityId,
    storageKeyPrefix = "photo",
    className,
    imageType = "PHOTO",
    maxFiles = 10,
}: MultipleImageUploaderProps) => {
    const [images, setImages] = useState<IImage[]>([]);
    const setError = useSetAtom(errorAtom);
    const keyPrefix = `${storageKeyPrefix}_${entityType}_${entityId}`;

    useEffect(() => {
        const loadImages = async () => {
            try {
                // Get all keys from localStorage that match the prefix
                const keys = Object.keys(localStorage).filter((key) => key.startsWith(keyPrefix));

                // Sort keys to ensure images are displayed in the correct order
                keys.sort();

                const loadedImages: IImage[] = [];

                // Load each image from IndexedDB
                for (const key of keys) {
                    const imageId = localStorage.getItem(key);
                    if (imageId) {
                        const blob = await getCoverImage(Number(imageId));
                        if (blob) {
                            loadedImages.push({
                                id: Number(imageId),
                                imageType,
                                entityType,
                                source: URL.createObjectURL(blob),
                                alt: "Gallery image",
                                entityId,
                            });
                        }
                    }
                }

                setImages(loadedImages);
            } catch (error) {
                setError({ message: error instanceof Error ? error.message : "Gagal memuat gallery" });
            }
        };

        loadImages();
    }, [keyPrefix, entityType, entityId, imageType, setError]);

    // Find the next available index for a new image
    const getNextAvailableIndex = useCallback(() => {
        const keys = Object.keys(localStorage)
            .filter((key) => key.startsWith(keyPrefix))
            .map((key) => {
                const match = key.match(new RegExp(`${keyPrefix}_(\\d+)$`));
                return match ? parseInt(match[1], 10) : -1;
            })
            .filter((index) => index !== -1);

        if (keys.length === 0) return 0;
        return Math.max(...keys) + 1;
    }, [keyPrefix]);

    const uploadImage = useCallback(
        async (file: File) => {
            try {
                const MAX_SIZE = 5 * 1024 * 1024;
                if (file.size > MAX_SIZE) {
                    throw new Error("Ukuran file melebihi 5MB");
                }

                if (images.length >= maxFiles) {
                    throw new Error(`Maksimal ${maxFiles} gambar dapat diupload`);
                }

                const imageId = Date.now();
                const nextIndex = getNextAvailableIndex();
                const storageKey = `${keyPrefix}_${nextIndex}`;

                await saveCoverImage(imageId, file.name, file);
                localStorage.setItem(storageKey, imageId.toString());

                const newImage: IImage = {
                    id: imageId,
                    imageType,
                    entityType,
                    source: URL.createObjectURL(file),
                    alt: file.name,
                    entityId,
                };

                setImages((prev) => [...prev, newImage]);
                return newImage;
            } catch (error) {
                setError({ message: error instanceof Error ? error.message : "Gagal upload gambar" });
                return null;
            }
        },
        [entityType, entityId, keyPrefix, images.length, maxFiles, imageType, setError, getNextAvailableIndex]
    );

    const removeImage = useCallback(
        async (index: number) => {
            try {
                const image = images[index];
                if (image && image.id) {
                    await deleteCoverImage(image.id);

                    // Find the correct localStorage key for this image
                    const keyToRemove = Object.keys(localStorage).find(
                        (key) => key.startsWith(keyPrefix) && localStorage.getItem(key) === String(image.id)
                    );

                    if (keyToRemove) {
                        localStorage.removeItem(keyToRemove);
                    }

                    // Update state
                    setImages((prev) => prev.filter((_, i) => i !== index));
                }
            } catch (error) {
                setError({ message: error instanceof Error ? error.message : "Gagal menghapus gambar" });
            }
        },
        [images, keyPrefix, setError]
    );

    const handleFileChange = useCallback(
        async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files.length > 0) {
                // Check if adding these files would exceed the maximum
                if (images.length + files.length > maxFiles) {
                    setError({ message: `Maksimal ${maxFiles} gambar dapat diupload. Hanya ${maxFiles - images.length} yang akan ditambahkan.` });
                }

                // Process each file individually
                for (let i = 0; i < files.length; i++) {
                    if (images.length + i >= maxFiles) break;
                    await uploadImage(files[i]);
                }

                // Reset input value so the user can upload the same file again if needed
                e.target.value = "";
            }
        },
        [uploadImage, images.length, maxFiles, setError]
    );

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition-colors h-full">
                <input type="file" id={`gallery-${entityId}`} className="hidden" onChange={handleFileChange} accept="image/*" multiple />
                <label htmlFor={`gallery-${entityId}`} className="flex justify-center flex-col items-center gap-2 text-gray-500">
                    <span className="text-sm">Click or Drag and Drop Here!</span>
                    <span className="text-sm text-gray-400">Max. 5MB (JPEG/PNG)</span>
                    <span className="text-sm text-gray-400">
                        ({images.length}/{maxFiles} Image)
                    </span>
                </label>
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-3 gap-4">
                    {images.map((image, index) => (
                        <div key={image.id} className="relative group">
                            <Image
                                src={image.source}
                                alt={image.alt || "Gallery image"}
                                width={300}
                                height={200}
                                className={twMerge("rounded-lg object-cover w-full h-48", className)}
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <IconTrash size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
