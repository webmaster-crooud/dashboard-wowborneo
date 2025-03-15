import moment from "moment-timezone";

export const formatDate = (date: Date | string): string => {
	return moment.tz(date, "Asia/Jakarta").locale("en-EN").format("DD, MMMM YYYY HH:mm:ss");
};
