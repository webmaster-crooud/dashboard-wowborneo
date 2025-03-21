import { deleteCoverImage, getCoverImage } from "~/lib/idb";
import { api } from "./api";

// Helper function untuk upload gambar
export const uploadCover = async (key: string, entityId: string, entityType: string, imageType: string) => {
    const coverId = localStorage.getItem(key);
    if (coverId) {
        const blob = await getCoverImage(Number(coverId));
        if (blob) {
            const file = new File([blob], `${entityType.toLowerCase()}-${entityId}.jpg`, { type: "image/jpeg" });
            const formData = new FormData();
            formData.append("file", file);
            formData.append("entityId", entityId);
            formData.append("entityType", entityType);
            formData.append("imageType", imageType);

            await api.post(`${process.env.NEXT_PUBLIC_API}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
        }
    }
};

// Helper function untuk upload multiple gambar
export const uploadMultipleImages = async (keyPrefix: string, entityId: string, entityType: string, imageType: string) => {
    const keys = Object.keys(localStorage).filter((key) => key.startsWith(keyPrefix));
    if (keys.length > 0) {
        const formData = new FormData();

        for (const key of keys) {
            const imageId = localStorage.getItem(key);
            if (imageId) {
                const blob = await getCoverImage(Number(imageId));
                if (blob) {
                    const index = key.split("_").pop();
                    const file = new File([blob], `${entityType.toLowerCase()}-${entityId}-${index}.jpg`, { type: "image/jpeg" });
                    formData.append("files", file);
                }
            }
        }

        formData.append("entityId", entityId);
        formData.append("entityType", entityType);
        formData.append("imageType", imageType);

        if (formData.has("files")) {
            await api.post(`${process.env.NEXT_PUBLIC_API}/upload/multiple`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
        }
    }
};

export const cleanupStorage = async () => {
    // Hapus semua data di localStorage
    const keysToRemove = [...Object.keys(localStorage).filter((key) => key.startsWith("coverImageId"))];

    await Promise.all(
        keysToRemove.map(async (key) => {
            const coverId = localStorage.getItem(key);
            if (coverId) {
                await deleteCoverImage(Number(coverId));
            }
            localStorage.removeItem(key);
        })
    );

    localStorage.clear();
    localStorage.removeItem("cruiseBody");
};
