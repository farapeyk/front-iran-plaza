import { clearAuthCookies, getAccessTokenCookie } from "@/lib/auth/cookies";
import { getBackendUrl } from "@/lib/api/backend-url";

/** Clears the browser session even when the backend cannot revoke it. */
export async function endAuthSession() {
  const accessToken = await getAccessTokenCookie();
  await clearAuthCookies();

  if (!accessToken) return;

  try {
    await fetch(getBackendUrl("/api/auth/logout", "POST"), {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // Local cookies are already cleared; backend revocation is best effort.
  }
}
