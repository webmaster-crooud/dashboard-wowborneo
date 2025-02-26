export class ApiError extends Error {
	statusCode: number;
	errors: Array<{ field?: string; message: string }>;

	constructor(
		message: string,
		statusCode: number,
		errors: Array<{ field?: string; message: string }> = []
	) {
		super(message);
		this.name = "ApiError";
		this.statusCode = statusCode;
		this.errors = errors;
	}
}
