import { pageFetch } from '@/lib/api/page-fetch';
import 'server-only';
import type { RegistrationDocument } from './registration';

export async function getRegistrationDocuments(token: string, businessId: string): Promise<RegistrationDocument[]> {
  const response = await pageFetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${encodeURIComponent(businessId)}/documents`, {
    headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
  });
  if (!response.ok) throw new Error('دریافت وضعیت مدارک ممکن نشد؛ دوباره تلاش کنید.');
  return response.json();
}
