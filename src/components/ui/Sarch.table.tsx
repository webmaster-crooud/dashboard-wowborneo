"use client";
import { IconSearch, IconX } from "@tabler/icons-react";
import { SetStateAction } from "jotai";
import React from "react";
import { twMerge } from "tailwind-merge";

type propsSearchTable = {
    search?: string;
    setSearch: React.Dispatch<SetStateAction<string | undefined>>;
    handleSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    className?: string;
};

export const SearchTable: React.FC<propsSearchTable> = ({ search, setSearch, handleSearch, className }) => (
    <form onSubmit={handleSearch} className="relative w-full md:w-4/12 overflow-hidden rounded-full border border-gray-300">
        <input
            type="text"
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setSearch(e.target.value)}
            value={search}
            placeholder="Search Data..."
            className={twMerge("w-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-600", className)}
        />
        {search ? (
            <button type="reset" onClick={() => setSearch("")} className="absolute right-0 top-0.5 py-2 px-4 outline-none text-gray-400">
                <IconX size={18} />
            </button>
        ) : (
            <button type="submit" className="absolute right-0 top-0.5 py-2 px-4 outline-none text-gray-400">
                <IconSearch size={18} />
            </button>
        )}
    </form>
);
