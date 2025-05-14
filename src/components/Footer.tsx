import { IconCopyright } from "@tabler/icons-react";

export const Footer = () => (
	<footer className="flex items-center justify-between gap-8 px-8 bg-gray-50 py-5 text-sm font-semibold text-gray-700">
		<span className="flex items-center justify-start gap-1">
			<IconCopyright size={20} stroke={2} className="text-gray-700" />
			Copyright {new Date().getFullYear() === 2025 ? new Date().getFullYear() : `2025 - ${new Date().getFullYear()}`}
		</span>
		<a href="https://crooud.com">
			Development by <span className="font-bold underline decoration-wavy decoration-red-600 text-red-600">Crooud</span>
		</a>
	</footer>
);
