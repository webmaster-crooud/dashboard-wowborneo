// src/hooks/useAuth.ts

import { useAtom } from "jotai";
import { accountAtom, isLoadingAtom } from "~/stores/auth.store";

export const useAuth = () => {
	const [account] = useAtom(accountAtom);
	const [isLoading] = useAtom(isLoadingAtom);
	return {
		account,
		isLoading,
	};
};
