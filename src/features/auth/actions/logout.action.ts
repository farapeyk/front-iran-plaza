"use server";

import { redirect } from "next/navigation";
import { clearAuthCookies, getAccessTokenCookie } from "@/lib/auth/cookies";

export async function logoutAction() {
  const accessToken = await getAccessTokenCookie();

  if (accessToken) {
    try {
      await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/auth/logout`, {
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
