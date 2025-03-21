import Image from "next/image";
import { twMerge } from "tailwind-merge";

type propsCanvasImage = {
    className?: string;
    src: string;
    alt?: string;
};

export const CanvasImage = ({ className, src, alt = "Image by Wow Borneo" }: propsCanvasImage) => (
    <Image
        alt={alt}
        src={src !== "" ? src : "/assets/Image-not-found.png"}
        className={twMerge("w-full h-full object-cover object-center rounded-xl overflow-hidden border border-black", className)}
        width={1000}
        height={1000}
        priority
    />
);
