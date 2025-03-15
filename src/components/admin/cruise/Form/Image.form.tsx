"use client";
import React, { DragEvent, useState } from "react";
import { useSetAtom } from "jotai";
import { Card } from "~/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { IconTrash } from "@tabler/icons-react";
import { IImage } from "~/types/cruise";
import { errorAtom } from "~/stores";
import Image from "next/image";

export function ImagesCruiseForm() {
    const [coverPreview, setCoverPreview] = useState<IImage | null>(null);
    const [galleryPreview, setGalleryPreview] = useState<IImage[]>([]);
    const setError = useSetAtom(errorAtom);

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const MAX_GALLERY = 10;

    const validateFileSize = (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            setError({ message: `File ${file.name} exceeds 5MB limit` });
            return false;
        }
        return true;
    };

    const readFileAsDataURL = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // ===== COVER HANDLERS =====
    const handleCoverDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (!file) return;

        if (!validateFileSize(file)) return;

        const dataUrl = await readFileAsDataURL(file);
        const newCover: IImage = {
            imageType: "COVER",
            entityType: "CRUISE",
            source: dataUrl,
            alt: file.name,
            entityId: "", // Akan diisi setelah cruise dibuat
        };
        setCoverPreview(newCover);
    };

    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!validateFileSize(file)) return;

        const dataUrl = await readFileAsDataURL(file);

        // Membuat objek IImage untuk cover
        const newCover: IImage = {
            imageType: "COVER",
            entityType: "CRUISE",
            source: dataUrl,
            alt: file.name,
            entityId: "", // Akan diisi setelah cruise dibuat
            id: Date.now(), // ID sementara untuk key React
        };

        setCoverPreview(newCover);
    };

    // ===== GALLERY HANDLERS =====
    const handleGalleryDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (galleryPreview.length >= MAX_GALLERY) return;

        const files = Array.from(e.dataTransfer.files);
        const validFiles = files.filter(validateFileSize);

        const remainingSlots = MAX_GALLERY - galleryPreview.length;
        const filesToProcess = validFiles.slice(0, remainingSlots);

        if (files.length !== filesToProcess.length) {
            setError({ message: `Only ${remainingSlots} slots available` });
        }

        const dataUrls = await Promise.all(filesToProcess.map(readFileAsDataURL));
        const newGalleryImages: IImage[] = filesToProcess.map((file, index) => ({
            imageType: "PHOTO",
            entityType: "CRUISE",
            source: dataUrls[index],
            alt: file.name,
            entityId: "",
        }));
        const newGallery = [...galleryPreview, ...newGalleryImages];
        setGalleryPreview(newGallery);
    };
    const handleGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || galleryPreview.length >= MAX_GALLERY) return;

        const files = Array.from(e.target.files);
        const validFiles = files.filter(validateFileSize);

        const remainingSlots = MAX_GALLERY - galleryPreview.length;
        const filesToProcess = validFiles.slice(0, remainingSlots);

        if (files.length !== filesToProcess.length) {
            setError({ message: `Only ${remainingSlots} slots available` });
        }

        // Membuat array IImage untuk gallery
        const newGalleryImages: IImage[] = await Promise.all(
            filesToProcess.map(async (file) => {
                const dataUrl = await readFileAsDataURL(file);
                return {
                    imageType: "PHOTO",
                    entityType: "CRUISE",
                    source: dataUrl,
                    alt: file.name,
                    entityId: "", // Akan diisi setelah cruise dibuat
                    id: Date.now() + Math.random(), // ID sementara untuk key React
                };
            })
        );

        const newGallery = [...galleryPreview, ...newGalleryImages];
        setGalleryPreview(newGallery);
    };

    const removeGalleryItem = (index: number) => {
        const updatedGallery = galleryPreview.filter((_, i) => i !== index);
        setGalleryPreview(updatedGallery);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <Card title="Cover & Gallery">
            <div className="grid grid-cols-1 gap-6">
                {/* COVER SECTION */}
                <div>
                    <h4 className="font-semibold mb-2">Cover (Single)</h4>
                    <div
                        onDrop={handleCoverDrop}
                        onDragOver={handleDragOver}
                        className="border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer hover:border-blue-500 transition-colors"
                    >
                        <p className="text-sm text-gray-500 mb-2">Drag & drop cover here, or click to select file</p>
                        <input type="file" className="hidden" id="coverInput" onChange={handleCoverChange} accept="image/*" />
                        <label
                            htmlFor="coverInput"
                            className="inline-block px-4 py-2 bg-blue-500 text-white rounded text-sm cursor-pointer hover:bg-blue-600 transition-colors"
                        >
                            Choose Cover
                        </label>
                    </div>
                    {coverPreview && (
                        <div className="mt-4 w-full relative group">
                            <Image
                                src={coverPreview.source}
                                alt={coverPreview.alt || "Cover Cruise"}
                                className="w-full object-cover rounded border h-60"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setCoverPreview({
                                        entityId: "",
                                        entityType: "",
                                        source: "",
                                        imageType: "COVER",
                                    });
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <IconTrash size={16} stroke={1.3} />
                            </button>
                        </div>
                    )}
                </div>

                {/* GALLERY SECTION */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold">Gallery (Multiple)</h4>
                        <span className={`text-sm ${galleryPreview.length >= MAX_GALLERY ? "text-red-500" : "text-gray-500"}`}>
                            {galleryPreview.length}/{MAX_GALLERY}
                        </span>
                    </div>

                    <div
                        onDrop={handleGalleryDrop}
                        onDragOver={handleDragOver}
                        className={`border-2 border-dashed rounded p-4 text-center cursor-pointer transition-colors ${
                            galleryPreview.length >= MAX_GALLERY ? "border-red-300 bg-red-50" : "border-gray-300 hover:border-green-500"
                        }`}
                    >
                        <input
                            type="file"
                            className="hidden"
                            id="galleryInput"
                            multiple
                            onChange={handleGalleryChange}
                            accept="image/*"
                            disabled={galleryPreview.length >= MAX_GALLERY}
                        />
                        <label
                            htmlFor="galleryInput"
                            className={`inline-block px-4 py-2 rounded text-sm cursor-pointer transition-colors ${
                                galleryPreview.length >= MAX_GALLERY
                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:bg-green-600"
                            }`}
                        >
                            Choose Gallery
                        </label>

                        <p className="text-sm mt-2">
                            {galleryPreview.length >= MAX_GALLERY ? (
                                <span className="text-red-500">Max. Gallery Reached</span>
                            ) : (
                                <span className="text-gray-500">Drag & drop images here, or click to select files</span>
                            )}
                        </p>
                    </div>

                    {galleryPreview.length > 0 && (
                        <div className="mt-4 grid grid-cols-3 gap-3">
                            <AnimatePresence>
                                {galleryPreview.map((imgSrc, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative group border rounded overflow-hidden h-28"
                                    >
                                        <Image src={imgSrc.source} alt={`Gallery of ${imgSrc.alt}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => removeGalleryItem(index)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <IconTrash size={16} stroke={1.3} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}
