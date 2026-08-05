import { NextRequest, NextResponse } from "next/server";
import { setAuthCookies, clearAuthCookies, getRefreshTokenCookie } from "@/lib/auth/cookies";

/**
 * وقتی middleware تشخیص می‌دهد accessToken نامعتبر/منقضی است، کاربر به اینجا
 * ریدایرکت می‌شود. این route با استفاده از refresh_token (که فقط برای مسیر
 * /api/auth ارسال می‌شود) سعی می‌کند توکن تازه بگیرد. در صورت موفقیت، کوکی‌های
 * جدید ست شده و کاربر به مسیر اصلی‌اش برمی‌گردد؛ در صورت شکست، به لاگین می‌رود.
 */
export async function GET(request: NextRequest) {
  const redirectTo = request.nextUrl.searchParams.get("redirect") || "/dashboard";
  const refreshToken = await getRefreshTokenCookie();

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/auth/refresh`, {
      method: "POST",
      headers: { Authorization: `Bearer ${refreshToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      await clearAuthCookies();
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const data = (await res.json()) as { accessToken: string; refreshToken: string };
    await setAuthCookies({ accessToken: data.accessToken, refreshToken: data.refreshToken });

    return NextResponse.redirect(new URL(redirectTo, request.url));
  } catch {
    await clearAuthCookies();
    return NextResponse.redirect(new URL("/login", request.url));
  }
}
