"use client";

import {
    IconAlignCenter,
    IconAlignLeft,
    IconAlignRight,
    IconBold,
    IconH1,
    IconH2,
    IconH3,
    IconItalic,
    IconListDetails,
    IconListNumbers,
} from "@tabler/icons-react";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

import React, { useEffect } from "react";

const RichTextEditor = ({ content, setContent }: { content: string; setContent: (content: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
                alignments: ["left", "center", "right"],
                defaultAlignment: "left",
            }),
        ],
        content, // Pakai `content` dari props
        onUpdate: ({ editor }) => {
            const updatedContent = editor.getHTML();
            setContent(updatedContent);
        },
    });

    // Perbarui konten editor jika `content` dari luar berubah
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    const setAlignment = (align: "left" | "center" | "right") => {
        editor?.chain().focus().setTextAlign(align).run();
    };
    return (
        <div className="w-full border-black rounded-lg border overflow-hidden">
            {/* Toolbar */}
            <div className="toolbar flex bg-white items-center justify-between gap-3 px-5 py-3">
                <div className="flex items-center justify-start gap-3">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`${
                            editor.isActive("bold") ? "border-black bg-gray-200 scale-105 text-black" : "border-gray-500 text-gray-500"
                        } border p-1 rounded`}
                    >
                        <IconBold size={18} stroke={3} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`${
                            editor.isActive("italic") ? "border-black bg-gray-200 scale-105 text-black" : "border-gray-500 text-gray-500"
                        } border p-1 rounded`}
                    >
                        <IconItalic size={18} stroke={3} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`${
                            editor.isActive("heading", {
                                level: 1,
                            })
                                ? "border-black bg-gray-200 scale-105 text-black"
                                : "border-gray-500 text-gray-500"
                        } border p-1 rounded`}
                    >
                        <IconH1 size={18} stroke={3} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`${
                            editor.isActive("heading", {
                                level: 2,
                            })
                                ? "border-black bg-gray-200 scale-105 text-black"
                                : "border-gray-500 text-gray-500"
                        } border p-1 rounded`}
                    >
                        <IconH2 size={18} stroke={3} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`${
                            editor.isActive("heading", {
                                level: 3,
                            })
                                ? "border-black bg-gray-200 scale-105 text-black"
                                : "border-gray-500 text-gray-500"
                        } border p-1 rounded`}
                    >
                        <IconH3 size={18} stroke={3} />
                    </button>

                    {/* List Buttons */}
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`${
                            editor.isActive("bulletList") ? "border-black bg-gray-200 scale-105 text-black" : "border-gray-500 text-gray-500"
                        } border p-1 rounded`}
                    >
                        <IconListDetails size={18} />
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`${
                            editor.isActive("orderedList") ? "border-black bg-gray-200 scale-105 text-black" : "border-gray-500 text-gray-500"
                        } border p-1 rounded`}
                    >
                        <IconListNumbers size={18} />
                    </button>
                </div>
                <div className="flex items-center justify-end gap-3">
                    <p className="text-sm font-semibold text-gray-500">Alignment:</p>
                    <button type="button" onClick={() => setAlignment("left")}>
                        <IconAlignLeft size={18} />
                    </button>
                    <button type="button" onClick={() => setAlignment("center")}>
                        <IconAlignCenter size={18} />
                    </button>
                    <button type="button" onClick={() => setAlignment("right")}>
                        <IconAlignRight size={18} />
                    </button>
                </div>
            </div>

            {/* Editor */}
            <EditorContent className="p-5" placeholder="The content here!" editor={editor} />
        </div>
    );
};

export default RichTextEditor;
