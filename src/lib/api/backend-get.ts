export class BackendError extends Error {
  constructor(public status: number) { super('دریافت اطلاعات از سرویس انجام نشد.'); }
}
export async function backendGet<T>(path: string, token?: string): Promise<T> {
  const base = process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, '');
  if (!base) throw new BackendError(503);
  const response = await fetch(base + path, {
    cache: 'no-store', headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    signal: AbortSignal.timeout(15000), redirect: 'error',
  });
  if (!response.ok) throw new BackendError(response.status);
  return response.json();
}
