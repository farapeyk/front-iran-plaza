import { NextRequest, NextResponse } from "next/server";
import {
  getAccessTokenCookie,
  getRefreshTokenCookie,
  setAuthCookies,
  clearAuthCookies,
} from "@/lib/auth/cookies";

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL;

async function isTrackingEnabled(): Promise<boolean> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/settings/tracking-enabled`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const data = await res.json();
      return data.enabled ?? true;
    }
    return true;
  } catch {
    return true;
  }
}

async function proxy(request: NextRequest, path: string[]) {
  const targetUrl = `${BACKEND_URL}/api/${path.join("/")}${request.nextUrl.search}`;

  // مسدودسازی tracking (از کد دوم)
  if (path.join("/").includes("tracking/events")) {
    const enabled = await isTrackingEnabled();
    if (!enabled) {
      return NextResponse.json({ queued: false }, { status: 200 });
    }
  }

  // ✅ خواندن body فقط یک بار (از کد اول)
  const hasBody = !["GET", "HEAD"].includes(request.method);
  const body = hasBody ? await request.arrayBuffer() : undefined;

  const forward = async (accessToken: string | undefined) => {
    const headers = new Headers(request.headers);
    headers.delete("host");
    headers.delete("cookie");
    if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);

    return fetch(targetUrl, {
      method: request.method,
      headers,
      body: hasBody ? body : undefined,  // ← استفاده از body کش‌شده
      cache: "no-store",
    });
  };

  const accessToken = await getAccessTokenCookie();
  let backendRes = await forward(accessToken);

  if (backendRes.status === 401) {
    const refreshToken = await getRefreshTokenCookie();
    if (refreshToken) {
      // ✅ refreshToken در body (از کد اول) — امن‌تر
      const refreshRes = await fetch(`${BACKEND_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
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
  responseHeaders.delete("content-encoding");

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