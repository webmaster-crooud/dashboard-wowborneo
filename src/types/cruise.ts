import { STATUS } from ".";

export interface CruiseListInterface {
	title: string;
	status: STATUS;
	id: string;
	departure: string | null;
	duration: string | null;
	updatedAt: Date | string;
}
