import { ApiSuccessResponse } from "~/types";
import { ICruiseBody, ICruiseResponseDetail, ICruiseResponseList } from "~/types/cruise";
import { api } from "~/utils/api";

const backend = process.env.NEXT_PUBLIC_API;

const cruiseService = {
    async list(search: string = "", filter: boolean = false, fav: boolean = false, deleted: boolean = false): Promise<ICruiseResponseList[]> {
        const { data } = await api.get<ApiSuccessResponse<ICruiseResponseList[]>>(
            `${backend}/admin/cruise?search=${search}&filter=${filter}&favourite=${fav}&deleted=${deleted}`,
            {
                withCredentials: true,
            }
        );

        return data.data;
    },

    async create(body: ICruiseBody): Promise<{ id: ICruiseResponseDetail["id"]; destinationIds: number[]; highlightIds: number[] }> {
        try {
            const { data } = await api.post<
                ApiSuccessResponse<{ id: ICruiseResponseDetail["id"]; destinationIds: number[]; highlightIds: number[] }>
            >(`${backend}/admin/cruise`, body, {
                withCredentials: true,
            });
            return data.data;
        } catch (error) {
            throw error;
        }
    },
};

export default cruiseService;
