import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/auth/verify-access-token";
import { ACCESS_TOKEN_COOKIE } from "@/lib/constants/auth";
import { isAdminUser } from "@/lib/auth/roles";
import { RESERVED_ROOT_SLUGS } from "@/features/content/lib/public-paths";

const PROTECTED_SEGMENTS = ["/dashboard", "/complete-profile", "/admin", "/content"];
const LOGIN_PAGES = ["/login", "/admin/login"];

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const rootSlug = pathname.match(/^\/([a-z0-9]+(?:-[a-z0-9]+)*)$/)?.[1];
  const isLegacyArticle = Boolean(rootSlug && !RESERVED_ROOT_SLUGS.has(rootSlug));
  const isLegacyCategory = pathname.startsWith("/category/") && pathname.length > "/category/".length;
  if (!pathname.endsWith("/") && (isLegacyArticle || isLegacyCategory)) {
    const canonicalUrl = new URL(request.url);
    canonicalUrl.pathname = `${pathname}/`;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  const redirectPathParts = pathname.split("/").filter(Boolean);
  const redirectRoot = redirectPathParts[0];
  if (request.method === "GET" && redirectRoot && !RESERVED_ROOT_SLUGS.has(redirectRoot)) {
    const backend = process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, "");
    if (backend) {
      try {
        const response = await fetch(`${backend}/api/articles/redirect?path=${encodeURIComponent(decodeURIComponent(pathname))}`, {
          cache: "no-store",
          signal: AbortSignal.timeout(3000),
        });
        if (response.ok) {
          const result: unknown = await response.json();
          if (typeof result === "object" && result !== null && "redirectTo" in result && typeof result.redirectTo === "string") {
            const target = new URL(`/${result.redirectTo.replace(/^\/+|\/+$/g, "")}/`, request.url);
            target.search = search;
            return NextResponse.redirect(target, 301);
          }
        }
      } catch {
        // Allow the public page to render normally if the backend is unavailable.
      }
    }
  }

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
  if (isAdmin && (isLoginPage || (!pathname.startsWith("/admin") && !pathname.startsWith("/content")))) {
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
