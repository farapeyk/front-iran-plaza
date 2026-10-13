export class ApiError extends Error {
  constructor(public status: number, public body: unknown) { super(typeof body === 'object' && body !== null && 'message' in body ? String(body.message) : 'ارتباط با سرویس انجام نشد.'); }
}
export async function browserFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  if (!url.startsWith('/api/') || url.startsWith('//')) throw new Error('Invalid API path');
  const response = await fetch('/api/backend/' + url.slice(5), { ...options, credentials: 'same-origin', redirect: 'error', signal: options.signal ?? AbortSignal.timeout(15000) });
  const type = response.headers.get('content-type') ?? '';
  const body = response.status === 204 ? undefined : type.includes('json') ? await response.json() : url.startsWith('/api/files/') && response.ok ? await response.blob() : type.startsWith('text/') ? await response.text() : await response.blob();
  if (!response.ok) throw new ApiError(response.status, body);
  return body as T;
}
