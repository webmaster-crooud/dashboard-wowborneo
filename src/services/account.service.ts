import { AccountFormInterface, AccountResponse, MessageResponse } from "~/types/account";
import { api } from "~/utils/api";
import { ApiError } from "~/utils/ApiError";

const accountService = {
	async getAccountUser(): Promise<AccountResponse | undefined> {
		try {
			const { data } = await api.get(`${process.env.NEXT_PUBLIC_API}/member/account`, {
				withCredentials: true,
			});
			return data.data;
		} catch (error) {
			throw error;
		}
	},

	async updateAccount(body: Partial<AccountFormInterface>): Promise<MessageResponse> {
		try {
			const { data } = await api.put(`${process.env.NEXT_PUBLIC_API}/member/account`, body, {
				withCredentials: true,
			});

			return data.data;
		} catch (error) {
			throw error as ApiError;
		}
	},
};

export default accountService;
