"use client";
import { formattedDate, greeting } from "~/utils/main";
import { Breadcrumb } from "../ui/Breadcrumb";
import { useAuth } from "~/hooks/useAuth";
import React from "react";

export function HeaderAdmin({ dataBreadcrumb = [] }: { dataBreadcrumb?: Breadcrumb[] }) {
	const { account } = useAuth();
	return (
		<header className="bg-gray-50 pt-10 pb-5 px-8 shadow">
			<Breadcrumb data={dataBreadcrumb} />
			<div className="flex items-start justify-between gap-10 flex-wrap">
				<h5 className="text-xl font-semibold leading-10">
					{greeting}! <br />
					{account.user.firstName + " " + account.user.lastName}
				</h5>
				<p className="text-sm text-gray-600 font-medium">{formattedDate}</p>
			</div>
		</header>
	);
}
