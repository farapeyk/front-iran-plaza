import { backendGet } from '@/lib/api/backend-get';

export function pageNumber(value?: string): number {
  const number = Number(value ?? 1);
  return Number.isSafeInteger(number) && number > 0 && number <= 100000 ? number : 1;
}

export type AdminBusinessStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
export type AdminRegistrationType = 'USER_SELF' | 'ADMIN_MANUAL' | 'IN_PERSON' | 'TELEPHONE';

export function businessSearch(value: string | string[] | undefined): string {
  return typeof value === 'string' ? value.trim().slice(0, 120) : '';
}

export function businessStatus(value: string | string[] | undefined): AdminBusinessStatus | undefined {
  return typeof value === 'string' && ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].includes(value)
    ? value as AdminBusinessStatus
    : undefined;
}

export function businessRegistrationType(value: string | string[] | undefined): AdminRegistrationType | undefined {
  return typeof value === 'string' && ['USER_SELF', 'ADMIN_MANUAL', 'IN_PERSON', 'TELEPHONE'].includes(value)
    ? value as AdminRegistrationType
    : undefined;
}

export async function getBusinessPage<T>(token: string, page: number, filters: {
  status?: AdminBusinessStatus;
  search?: string;
  registrationType?: AdminRegistrationType;
} = {}) {
  const take = 20;
  const query = new URLSearchParams({ skip: String((page - 1) * take), take: String(take) });
  if (filters.status) query.set('status', filters.status);
  if (filters.search) query.set('search', filters.search);
  if (filters.registrationType) query.set('registrationType', filters.registrationType);
  const result = await backendGet<{ data: T[]; total: number }>('/api/businesses/admin?' + query, token);
  if (!Array.isArray(result.data) || !Number.isSafeInteger(result.total) || result.total < 0) throw new Error('پاسخ فهرست کسب‌وکار معتبر نیست.');
  return { ...result, page, take };
}
