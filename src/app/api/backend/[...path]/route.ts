import { NextRequest, NextResponse } from 'next/server';
import { getAccessTokenCookie } from '@/lib/auth/cookies';
import { refreshSession } from '@/lib/auth/refresh-session';

const HOP_HEADERS = ['connection', 'keep-alive', 'proxy-authenticate', 'proxy-authorization', 'te', 'trailer', 'transfer-encoding', 'upgrade'];
async function proxy(request: NextRequest, path: string[]) {
  const mutation = !['GET', 'HEAD'].includes(request.method);
  const origin = request.headers.get('origin');
  if (mutation && origin && origin !== request.nextUrl.origin) return NextResponse.json({ message: 'مبدأ درخواست معتبر نیست.' }, { status: 403 });
  if (!process.env.BACKEND_INTERNAL_URL) return NextResponse.json({ message: 'سرویس در دسترس نیست.' }, { status: 503 });
  if (path.some(segment => !segment || segment === '.' || segment === '..' || /[/\\]/.test(segment))) return NextResponse.json({ message: 'مسیر معتبر نیست.' }, { status: 400 });
  try {
    const targetUrl = process.env.BACKEND_INTERNAL_URL.replace(/\/$/, '') + '/api/' + path.map(encodeURIComponent).join('/') + request.nextUrl.search;
    const body = mutation ? await request.arrayBuffer() : undefined;
    if (body && body.byteLength > 25 * 1024 * 1024) return NextResponse.json({ message: 'حجم درخواست بیش از حد مجاز است.' }, { status: 413 });
    const forward = (token?: string) => {
      const headers = new Headers(request.headers);
      for (const header of [...HOP_HEADERS, 'host', 'cookie', 'authorization', 'content-length']) headers.delete(header);
      headers.set('accept-encoding', 'identity');
      if (token) headers.set('Authorization', 'Bearer ' + token);
      return fetch(targetUrl, { method: request.method, headers, body, cache: 'no-store', redirect: 'manual' });
    };
    let response = await forward(await getAccessTokenCookie());
    if (response.status === 401) {
      const refreshed = await refreshSession();
      if (refreshed.success) {
        await response.body?.cancel();
        response = await forward(refreshed.accessToken);
      } else if (refreshed.status === 503) {
        await response.body?.cancel();
        return NextResponse.json({ message: 'تمدید نشست موقتاً انجام نشد.' }, { status: 503 });
      }
    }
    const headers = new Headers(response.headers);
    for (const header of [...HOP_HEADERS, 'content-encoding', 'content-length', 'set-cookie']) headers.delete(header);
    headers.set('Cache-Control', 'private, no-store');
    headers.set('X-Content-Type-Options', 'nosniff');
    return new NextResponse(response.body, { status: response.status, headers });
  } catch { return NextResponse.json({ message: 'ارتباط با سرور برقرار نشد.' }, { status: 502 }); }
}
type Params = { params: Promise<{ path: string[] }> };
export async function GET(request: NextRequest, { params }: Params) { return proxy(request, (await params).path); }
export async function POST(request: NextRequest, { params }: Params) { return proxy(request, (await params).path); }
export async function PATCH(request: NextRequest, { params }: Params) { return proxy(request, (await params).path); }
export async function PUT(request: NextRequest, { params }: Params) { return proxy(request, (await params).path); }
export async function DELETE(request: NextRequest, { params }: Params) { return proxy(request, (await params).path); }
