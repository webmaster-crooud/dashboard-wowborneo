import { ApiSuccessResponse } from "~/types";
import { CruiseListInterface } from "~/types/cruise";
import { api } from "~/utils/api";

const backend = process.env.NEXT_PUBLIC_API;

const cruiseService = {
	async list(search: string = "", filter: boolean = false, fav: boolean = false, deleted: boolean = false): Promise<CruiseListInterface[]> {
		const { data } = await api.get<ApiSuccessResponse<CruiseListInterface[]>>(`${backend}/admin/cruise?search=${search}&filter=${filter}&favourite=${fav}&deleted=${deleted}`, {
			withCredentials: true,
		});

		return data.data;
	},
};

export default cruiseService;
