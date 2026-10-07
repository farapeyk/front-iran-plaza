import { getAccessTokenCookie } from './cookies';
import { verifyAccessToken } from './verify-access-token';
import { refreshSession } from './refresh-session';

/** Server Actions only: Server Components must not mutate cookies. */
export async function getActionAccessToken(): Promise<string | undefined> {
  const token = await getAccessTokenCookie();
  const payload = await verifyAccessToken(token);
  if (payload?.exp && payload.exp > Date.now() / 1000 + 30) return token;
  const result = await refreshSession();
  return result.success ? result.accessToken : undefined;
}
