import { NextRequest, NextResponse } from 'next/server';
import { getAccessTokenCookie } from '@/lib/auth/cookies';
import { verifyAccessToken } from '@/lib/auth/verify-access-token';
import { refreshSession } from '@/lib/auth/refresh-session';
import { safeRedirect } from '@/lib/auth/safe-redirect';

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  if (origin && origin !== request.nextUrl.origin) return NextResponse.json({ success: false }, { status: 403 });
  const payload = await verifyAccessToken(await getAccessTokenCookie());
  if (payload?.exp && payload.exp > Date.now() / 1000 + 30) {
    return NextResponse.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
  }
  const result = await refreshSession();
  return NextResponse.json({ success: result.success }, {
    status: result.success ? 200 : result.status, headers: { 'Cache-Control': 'no-store' },
  });
}

export async function GET(request: NextRequest) {
  const redirectTo = safeRedirect(request.nextUrl.searchParams.get('redirect'));
  const loginPath = redirectTo.startsWith('/admin') ? '/admin/login' : '/login';
  const result = await refreshSession();
  if (!result.success && result.status === 503) return NextResponse.json({ message: 'تمدید نشست موقتاً در دسترس نیست؛ دوباره تلاش کنید.' }, {
    status: 503, headers: { 'Cache-Control': 'no-store' },
  });
  const response = NextResponse.redirect(new URL(result.success ? redirectTo : loginPath, request.url));
  response.headers.set('Cache-Control', 'no-store');
  return response;
}
