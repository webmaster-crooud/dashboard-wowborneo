export interface Account {
	email: string;
	user: {
		firstName: string;
		lastName: string;
	};
	role: {
		name: "member" | "admin" | "owner" | "developer";
	};
}

export interface RefreshTokenResponse {
	accessToken: string;
}
