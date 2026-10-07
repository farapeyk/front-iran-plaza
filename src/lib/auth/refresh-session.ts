import { clearAuthCookies, getRefreshTokenCookie, setAuthCookies } from './cookies';
import { verifyAccessToken } from './verify-access-token';

export type RefreshResult = { success: true; accessToken: string } | { success: false; status: 401 | 503 };

/** Only call in a Route Handler or Server Action, where cookies may be written. */
export async function refreshSession(): Promise<RefreshResult> {
  const refreshToken = await getRefreshTokenCookie();
  if (!refreshToken) return { success: false, status: 401 };
  try {
    const response = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/auth/refresh`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }), cache: 'no-store',
    });
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        await clearAuthCookies();
        return { success: false, status: 401 };
      }
      return { success: false, status: 503 };
    }
    const data: unknown = await response.json();
    if (!data || typeof data !== 'object' || !('accessToken' in data) || !('refreshToken' in data) ||
        typeof data.accessToken !== 'string' || typeof data.refreshToken !== 'string' || !data.refreshToken ||
        !await verifyAccessToken(data.accessToken)) return { success: false, status: 503 };
    await setAuthCookies({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    return { success: true, accessToken: data.accessToken };
  } catch { return { success: false, status: 503 }; }
}
