"use client";
import React, { useCallback, useEffect, useState } from "react";
import cruiseService from "~/services/cruise.service";
import { CruiseListInterface } from "~/types/cruise";
import { SearchTable } from "./Sarch.table";
import { IconStar } from "@tabler/icons-react";

export function CruiseTable() {
	const [cruise, setCruise] = useState<CruiseListInterface[]>([]);
	const [search, setSearch] = useState<string>("");
	const fetchCruise = useCallback(async (search?: string) => {
		const cruise = await cruiseService.list(search);
		setCruise(cruise);
	}, []);

	useEffect(() => {
		fetchCruise();
	}, [fetchCruise]);

	const handleSearchCruise = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		fetchCruise(search);
	};
	return (
		<div className="rounded-md border border-gray-300 shadow-sm md:overflow-hidden overflow-x-scroll">
			{/* Header / Title dan Search */}
			<div className="flex flex-col md:flex-row items-center p-4 justify-between bg-gray-50">
				<h2 className="text-lg font-bold w-full">Cruises Data</h2>
				<SearchTable handleSearch={handleSearchCruise} search={search} setSearch={setSearch} />
			</div>

			{/* Table */}
			<table className="w-full text-left border-collapse">
				{/* Table Head */}
				<thead>
					<tr className="border-b border-gray-300 bg-gray-50 uppercase text-sm">
						<th className="px-4 py-2 font-bold">Title</th>
						<th className="px-4 py-2 font-bold">Departure</th>
						<th className="px-4 py-2 font-bold">Duration</th>
						<th className="px-4 py-2 font-bold">Status</th>
						<th className="px-4 py-2 font-bold">Created</th>
						<th className="px-4 py-2 font-bold">Setting</th>
					</tr>
				</thead>

				{/* Table Body */}
				<tbody>
					{/* Contoh row 1 */}
					{cruise.length === 0 ? (
						<tr className="border-b border-gray-200">
							<td className="px-4 py-3 text-nowrap text-center font-bold text-gray-600" colSpan={6}>
								Cruise is empty []
							</td>
						</tr>
					) : (
						cruise.map((cruise, i) => (
							<tr className="border-b border-gray-200" key={i}>
								<td className="px-4 py-3 text-nowrap flex items-center justify-start gap-2">
									<button>
										<IconStar size={20} stroke={1.5} />
									</button>
									<span>{cruise.title}</span>
								</td>
								<td className="px-4 py-3 text-nowrap">{cruise.departure}</td>
								<td className="px-4 py-3 text-nowrap">{cruise.duration}</td>
								<td className="px-4 py-3 text-nowrap">
									<span className={`bg-${cruise.status === "ACTIVED" ? "cyan" : cruise.status === "FAVOURITED" ? "orange" : "red"}-700 text-white px-5 py-1 rounded-full text-xs uppercase font-semibold`}>{cruise.status}</span>
								</td>
								<td className="px-4 py-3 text-nowrap">17 Agustus 2025</td>
								<td className="px-4 py-3 text-nowrap">
									<div className="flex gap-2">
										<button className="px-3 py-1 text-xs bg-cyan-600 text-white rounded-md font-medium">Info</button>
										<button className="px-3 py-1 text-xs bg-red-600 text-white rounded-md font-medium">Delete</button>
									</div>
								</td>
							</tr>
						))
					)}
				</tbody>

				{/* Table Footer (untuk pagination/numbering) */}
				<tfoot className="bg-gray-200">
					<tr>
						<td colSpan={6} className="px-4 py-2">
							<div className="flex items-center justify-between">
								<span className="text-sm text-gray-500">Showing 1-2 of 2</span>
								<div className="flex gap-2">
									<button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md">
										<span className="text-lg">&laquo;</span> Previous
									</button>
									<button className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded-md">
										Next <span className="text-lg">&raquo;</span>
									</button>
								</div>
							</div>
						</td>
					</tr>
				</tfoot>
			</table>
		</div>
	);
}
