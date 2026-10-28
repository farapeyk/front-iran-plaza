"use server";

import { redirect } from "next/navigation";
import { clearAuthCookies, getAccessTokenCookie } from "@/lib/auth/cookies";
import { getBackendUrl } from "@/lib/api/backend-url";

export async function logoutAction() {
  const accessToken = await getAccessTokenCookie();

  if (accessToken) {
    try {
      await fetch(getBackendUrl('/api/auth/logout', 'POST'), {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: "no-store",
      });
    } catch {
      // اگر بک‌اند در دسترس نبود، همچنان کوکی‌های محلی پاک می‌شوند
    }
  }

  await clearAuthCookies();
  redirect("/login");
}
