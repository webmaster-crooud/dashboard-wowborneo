export interface ApiErrorResponse {
	success: false;
	message: string;
	errors: Array<{ field?: string; message: string }>;
	stack?: string; // Hanya ada di development
}

export interface ApiSuccessResponse<T = unknown> {
	success: true;
	data: T;
}

export interface MenuInterface {
	title: string;
	icon: React.ReactNode;
	url: string | URL;
}
