"use client";

import { AnimatePresence } from "framer-motion";
import { useAtom } from "jotai";
import React from "react";
import { Footer } from "~/components/Footer";
import { Sidebar } from "~/components/Sidebar";
import { sidebarAtom } from "~/stores";
import { motion as m } from "framer-motion";

export default function RootTemplate({ children }: { children: React.ReactNode }) {
	const [sidebar] = useAtom(sidebarAtom);
	return (
		<div className="grid grid-cols-5 relative min-h-screen">
			<AnimatePresence>
				{sidebar && <Sidebar key="sidebar" />}
				<m.main
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					key={`main-${sidebar}`} // Key berubah saat sidebar toggle
					className={`${sidebar ? "col-span-4" : "col-span-5"}`}
				>
					{children}
					<Footer />
				</m.main>
			</AnimatePresence>
		</div>
	);
}
