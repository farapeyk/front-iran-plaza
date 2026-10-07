import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/verify-access-token";
import { ACCESS_TOKEN_COOKIE } from "@/lib/constants/auth";
import { isAdminUser } from "@/lib/auth/roles";

const PROTECTED_SEGMENTS = ["/dashboard", "/complete-profile", "/admin"];
const LOGIN_PAGES = ["/login", "/admin/login"];

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isLoginPage = LOGIN_PAGES.includes(pathname);
  const isProtected = PROTECTED_SEGMENTS.some((seg) => pathname === seg || pathname.startsWith(seg + '/'));
  if (!isProtected && !isLoginPage) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const payload = await verifyAccessToken(token);

  if (!payload) {
    if (isLoginPage) return NextResponse.next();
    const refreshUrl = new URL("/api/auth/silent-refresh", request.url);
    refreshUrl.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(refreshUrl);
  }

  const isAdmin = isAdminUser(payload.userType);
  if (isAdmin && (isLoginPage || !pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isLoginPage) return NextResponse.next();

  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
