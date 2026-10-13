import type { NextRequest } from 'next/server';
/** SITE_URL is the trusted external origin when Next uses an internal listener URL. */
export function isSameOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return request.headers.get('sec-fetch-site') !== 'cross-site';
  try { return origin === new URL(process.env.SITE_URL || request.nextUrl.origin).origin; }
  catch { return false; }
}
