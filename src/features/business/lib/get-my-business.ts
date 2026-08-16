import { getAccessTokenCookie } from "@/lib/auth/cookies";
import type { BusinessProfile } from "@/features/business/types/business-profile";

/** کسب‌وکار فعلی کاربر را برمی‌گرداند؛ اگر هنوز ثبت نکرده null است. */
export async function getMyBusiness(): Promise<BusinessProfile | null> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) return null;

  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/mine`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return null;

  const businesses: BusinessProfile[] = await res.json();
  return businesses[0] ?? null;
}