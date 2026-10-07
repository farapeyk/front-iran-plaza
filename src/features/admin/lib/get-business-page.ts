import { backendGet } from '@/lib/api/backend-get';

export function pageNumber(value?: string): number {
  const number = Number(value ?? 1);
  return Number.isSafeInteger(number) && number > 0 && number <= 100000 ? number : 1;
}
export async function getBusinessPage<T>(token: string, page: number, status?: 'PENDING' | 'REJECTED') {
  const take = 20;
  const query = new URLSearchParams({ skip: String((page - 1) * take), take: String(take) });
  if (status) query.set('status', status);
  const result = await backendGet<{ data: T[]; total: number }>('/api/businesses/admin?' + query, token);
  if (!Array.isArray(result.data) || !Number.isSafeInteger(result.total) || result.total < 0) throw new Error('پاسخ فهرست کسب‌وکار معتبر نیست.');
  return { ...result, page, take };
}
