import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const accessToken = req.cookies.get("accessToken")?.value;

    if (!accessToken) return NextResponse.redirect(new URL("/admin/login", req.url));

    try {
        const payload = JSON.parse(Buffer.from(accessToken.split(".")[1], "base64").toString());
        const exp = payload.exp * 1000;
        if (exp < Date.now()) {
            const res = NextResponse.redirect(new URL("/admin/login", req.url));
            res.cookies.delete("accessToken");
            res.cookies.delete("refreshToken");
            return res;
        }
    } catch (error) {
        const res = NextResponse.redirect(new URL("/admin/login", req.url));
        res.cookies.delete("accessToken");
        res.cookies.delete("refreshToken");
        return res;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/manage/:path*"],
};
