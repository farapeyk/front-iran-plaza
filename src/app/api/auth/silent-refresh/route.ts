import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies, clearAuthCookies, getRefreshTokenCookie } from "@/lib/auth/cookies";

export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";
  const loginPath = redirectTo.startsWith("/admin") ? "/admin/login" : "/login";
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      await clearAuthCookies();
      return NextResponse.redirect(new URL(loginPath, request.url));
    }

    const data = (await res.json()) as { accessToken: string; refreshToken: string };
    await setAuthCookies({ accessToken: data.accessToken, refreshToken: data.refreshToken });

    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch {
    await clearAuthCookies();
    return NextResponse.redirect(new URL(loginPath, request.url));
  }
}