// ~/lib/indexedDB.ts
import { openDB, DBSchema, IDBPDatabase } from "idb";

interface ImageDB extends DBSchema {
    covers: {
        key: number;
        value: {
            id: number;
            alt: string;
            file: Blob; // Simpan file image sebagai Blob
        };
    };
}

let dbPromise: Promise<IDBPDatabase<ImageDB>>;

export function getDB() {
    if (!dbPromise) {
        dbPromise = openDB<ImageDB>("my-image-db", 1, {
            upgrade(db) {
                db.createObjectStore("covers", { keyPath: "id" });
            },
        });
    }
    return dbPromise;
}

export async function saveCoverImage(id: number, alt: string, file: Blob) {
    const db = await getDB();
    await db.put("covers", { id, alt, file });
}

export async function getCoverImage(id: number): Promise<Blob | undefined> {
    const db = await getDB();
    const data = await db.get("covers", id);
    return data?.file;
}

export async function deleteCoverImage(id: number) {
    const db = await getDB();
    await db.delete("covers", id);
}
