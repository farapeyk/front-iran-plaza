import { NextRequest, NextResponse } from "next/server";
import {
  getAccessTokenCookie,
  getRefreshTokenCookie,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth/cookies";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL;

/**
 * تمام درخواست‌های کلاینت باید از اینجا عبور کنند (نه مستقیم به بک‌اند)،
 * چون این‌جا accessToken از کوکی httpOnly خوانده و در هدر Authorization
 * گذاشته می‌شود، و در صورت 401، یک‌بار به‌صورت خودکار refresh-and-retry می‌شود.
 */
async function proxy(request: NextRequest, path: string[]) {
  const targetUrl = `${BACKEND_URL}/api/${path.join("/")}${request.nextUrl.search}`;

  const forward = async (accessToken: string | undefined) => {
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("cookie"); // کوکی‌های httpOnly نباید به بک‌اند درز کنند
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    const hasBody = !["GET", "HEAD"].includes(request.method);

    return fetch(targetUrl, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: "no-store",
    });
  };

  const accessToken = await getAccessTokenCookie();
  let backendRes = await forward(accessToken);

  // refresh-and-retry: فقط یک بار، و فقط اگر refresh_token موجود باشد
  if (backendRes.status === 401) {
    const refreshToken = await getRefreshTokenCookie();

    if (refreshToken) {
      const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { Authorization: `Bearer ${refreshToken}` },
        cache: "no-store",
      });

      if (refreshRes.ok) {
        const data = (await refreshRes.json()) as { accessToken: string; refreshToken: string };
        await setAuthCookies({ accessToken: data.accessToken, refreshToken: data.refreshToken });
        backendRes = await forward(data.accessToken);
      } else {
        await clearAuthCookies();
      }
    }
  }

  const responseHeaders = new Headers(backendRes.headers);
  responseHeaders.delete("content-encoding"); // جلوگیری از دابل-دیکد شدن توسط Next

  return new NextResponse(backendRes.body, {
    status: backendRes.status,
    headers: responseHeaders,
  });
}

type Params = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: Params) {
  return proxy(request, (await params).path);
}
export async function POST(request: NextRequest, { params }: Params) {
  return proxy(request, (await params).path);
}
export async function PATCH(request: NextRequest, { params }: Params) {
  return proxy(request, (await params).path);
}
export async function PUT(request: NextRequest, { params }: Params) {
  return proxy(request, (await params).path);
}
export async function DELETE(request: NextRequest, { params }: Params) {
  return proxy(request, (await params).path);
}
