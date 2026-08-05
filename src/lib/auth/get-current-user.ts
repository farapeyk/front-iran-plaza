import { getAccessTokenCookie } from "@/lib/auth/cookies";
import type { CurrentUser } from "@/types/auth";

/**
 * دریافت اطلاعات کاربر فعلی از بک‌اند با استفاده از Access Token کوکی.
 * مخصوص استفاده در Server Components و Server Actions.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) return null;

  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store", // اطلاعات کاربر همیشه باید بروز باشد
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}