import { validateMutation } from './mutation-validation';

/** Server-side fetch for JSON mutations; validates caller-supplied values before HTTP. */
export async function actionFetch(url: string, options: RequestInit): Promise<Response> {
  const base = process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, '');
  if (!base || !url.startsWith(base + '/')) return Response.json({ message: 'تنظیمات سرویس معتبر نیست.' }, { status: 503 });
  const path = url.slice(base.length).replace(/^\/notifications/, '/api/notifications');
  let payload: unknown;
  try { payload = typeof options.body === 'string' ? JSON.parse(options.body) : undefined; }
  catch { return Response.json({ message: 'داده JSON معتبر نیست.' }, { status: 400 }); }
  const error = validateMutation(path, options.method ?? 'GET', payload);
  if (error) return Response.json({ message: error }, { status: 400 });
  return fetch(url, { ...options, cache: 'no-store', redirect: 'error' });
}
