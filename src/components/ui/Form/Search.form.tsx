import { IconSearch } from "@tabler/icons-react";
import { twMerge } from "tailwind-merge";

export function SearchForm({ className, placeholder = "Search Transaction..." }: { className?: string; placeholder?: string }) {
	return (
		<form className="relative">
			<input name="search" className={twMerge("text-sm rounded-full border border-white ps-10 pe-5 py-2 bg-transparent outline-none placeholder:text-white", className)} placeholder={placeholder} />
			<button type="submit" className="absolute top-2.5 left-3">
				<IconSearch stroke={2} size={20} />
			</button>
		</form>
	);
}
