import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/verify-access-token";
import { ACCESS_TOKEN_COOKIE } from "@/lib/constants/auth";

const PROTECTED_SEGMENTS = ["/dashboard", "/complete-profile"];

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isProtected = PROTECTED_SEGMENTS.some((seg) => pathname.startsWith(seg));
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = await verifyAccessToken(token);

  if (!payload) {
    const refreshUrl = new URL("/api/auth/silent-refresh", request.url);
    refreshUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(refreshUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};