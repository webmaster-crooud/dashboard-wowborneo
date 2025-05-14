"use client";
import { IconSlash } from "@tabler/icons-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export interface Breadcrumb {
	title: string;
	url: string;
}

type typeBreadcrumb = {
	data: Breadcrumb[];
};

export function Breadcrumb({ data }: typeBreadcrumb) {
	const router = useRouter();
	return (
		<div className="flex items-center justify-start gap-3 text-xs mb-5 text-gray-500 font-bold uppercase">
			<Link href={"/"}>...</Link>

			{data.map((bread, i) => (
				<React.Fragment key={i}>
					<IconSlash stroke={1.5} size={20} />
					<motion.button initial="initial" whileHover="hover" onClick={() => router.push(bread.url)} className="hover:text-gray-400 transition-all ease-in-out duration-300 flex flex-col gap-1 relative">
						<span>{bread.title}</span>
						<motion.div
							className="w-full h-[1.5px] bg-gray-500 -bottom-1 rounded-full absolute"
							variants={{
								initial: { scaleX: 0 },
								hover: {
									scaleX: 1,
									transition: {
										duration: 0.3,
										delay: 0.1,
										ease: [0.4, 0.08, 0.23, 0.96],
									},
								},
							}}
						/>
					</motion.button>
				</React.Fragment>
			))}
		</div>
	);
}
