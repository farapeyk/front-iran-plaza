import 'server-only';
import { getAccessTokenCookie } from '@/lib/auth/cookies';
import { BackendError } from '@/lib/api/backend-get';
export async function serverFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const base = process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, '');
  if (!base || !url.startsWith('/api/')) throw new Error('Backend unavailable');
  const token = await getAccessTokenCookie();
  const headers = new Headers(options.headers);
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(base + url, { ...options, headers, cache: 'no-store', redirect: 'error', signal: options.signal ?? AbortSignal.timeout(15000) });
  if (!response.ok) throw new BackendError(response.status);
  if (response.status === 204) return undefined as T;
  const type=response.headers.get('content-type')??'';
  return (type.includes('json')?await response.json():url.startsWith('/api/files/')?await response.blob():type.startsWith('text/')?await response.text():await response.blob()) as T;
}
