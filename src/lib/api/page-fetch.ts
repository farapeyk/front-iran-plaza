import { notFound } from 'next/navigation';
import { BackendError } from './backend-get';

/** Server-rendered reads: never turn a failed service into an empty collection. */
export async function pageFetch(url: string, options?: RequestInit): Promise<Response> {
  const response = await fetch(url, { ...options, cache: 'no-store', signal: AbortSignal.timeout(15000), redirect: 'error' });
  if (response.status === 404 && /\/installment-plan$/.test(url)) return response;
  if (response.status === 404) notFound();
  if (!response.ok) throw new BackendError(response.status);
  return response;
}
