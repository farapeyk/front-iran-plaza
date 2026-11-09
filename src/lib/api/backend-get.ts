import { headers as requestHeaders } from 'next/headers';
import { redirect } from 'next/navigation';
import { clientAddressFromHeaders, INTERNAL_CLIENT_IP_HEADER } from './client-address';

export class BackendError extends Error {
  constructor(public status: number) { super('دریافت اطلاعات از سرویس انجام نشد.'); }
}
function throwForResponse(status: number): never {
  if (status === 429) redirect('/too-many-requests');
  throw new BackendError(status);
}
export async function backendGet<T>(path: string, token?: string): Promise<T> {
  const base = process.env.BACKEND_INTERNAL_URL?.replace(/\/$/, '');
  if (!base) throwForResponse(503);
  const incomingHeaders = await requestHeaders();
  const clientAddress = clientAddressFromHeaders(incomingHeaders);
  const headers = new Headers(token ? { Authorization: `Bearer ${token}` } : undefined);
  if (clientAddress) headers.set(INTERNAL_CLIENT_IP_HEADER, clientAddress);
  const response = await fetch(base + path, {
    cache: 'no-store', headers,
    signal: AbortSignal.timeout(15000), redirect: 'error',
  });
  if (!response.ok) throwForResponse(response.status);
  return response.json();
}
