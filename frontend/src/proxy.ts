import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;
    const refreshToken = req.cookies.get("refreshToken")?.value;

    console.log(
        "[MIDDLEWARE] URL:",
        req.url,
        "accessToken:",
        !!accessToken,
        "refreshToken:",
        !!refreshToken
    );

    if (!accessToken && !refreshToken) {
        console.log("[MIDDLEWARE] no tokens, redirect to login & clear localStorage");
        return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/manage/:path*"],
};
