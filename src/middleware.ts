// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
	// Ambil token dari cookie (misal: refreshToken)
	const token = request.cookies.get("refreshToken")?.value;

	// Jika token tidak ada, redirect ke halaman login
	if (!token) {
		return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_AUTH}`, request.url));
	}

	let payload;
	try {
		// Verifikasi dan dekode token menggunakan secret dari environment variable
		const { payload: verifiedPayload } = await jwtVerify(token, new TextEncoder().encode(process.env.NEXT_PUBLIC_JWT_TOKEN));
		payload = verifiedPayload;
	} catch {
		// Jika token tidak valid, redirect ke halaman login
		return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_AUTH}`, request.url));
	}

	// Pastikan payload memiliki property "role"
	const userRole = payload.roleName as string;
	if (!userRole) {
		return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_AUTH}`, request.url));
	}

	// Dapatkan pathname dari URL yang diakses
	const { pathname } = request.nextUrl;

	// Contoh pengecekan akses untuk route /admin
	if (pathname.startsWith("/admin")) {
		const allowedRoles = ["admin", "owner", "developer"];
		if (!allowedRoles.includes(userRole)) {
			// Jika role tidak diizinkan, redirect ke halaman member
			return NextResponse.redirect(new URL("/member", request.url));
		}
	}

	// Contoh pengecekan akses untuk route /owner
	if (pathname.startsWith("/owner")) {
		const allowedRoles = ["owner", "developer"];
		if (!allowedRoles.includes(userRole)) {
			return NextResponse.redirect(new URL("/member", request.url));
		}
	}

	// Untuk route lainnya, jika tidak ada aturan khusus, lanjutkan request
	return NextResponse.next();
}
