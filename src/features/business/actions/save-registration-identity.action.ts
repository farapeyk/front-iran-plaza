"use server";

import { actionFetch } from '@/lib/api/action-fetch';

import { getActionAccessToken } from '@/lib/auth/action-access-token';
import { identitySchema } from '../schemas/identity.schema';
import { jalaliToGregorian } from '@/lib/utils/jalali';
import { extractErrorMessage } from '@/lib/api/error-message';

export async function saveRegistrationIdentity(input: unknown) {
  const parsed = identitySchema.safeParse(input);
  if (!parsed.success) return { success: false, message: 'اطلاعات هویتی معتبر نیست.' };
  const token = await getActionAccessToken();
  if (!token) return { success: false, message: 'دوباره وارد حساب شوید.' };
  const value = parsed.data;
  try {
    const response = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}/api/users/me`, {
      method: 'PATCH', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, cache: 'no-store',
      body: JSON.stringify({ fullName: `${value.firstName} ${value.lastName}`, fatherName: value.fatherName,
        nationalCode: value.nationalCode, email: value.email || undefined,
        birthDate: `${jalaliToGregorian(value.birthYear, value.birthMonth, value.birthDay)}T00:00:00.000Z` }),
    });
    if (!response.ok) return { success: false, message: extractErrorMessage(await response.json().catch(() => null), 'ذخیره اطلاعات هویتی انجام نشد.') };
    return { success: true };
  } catch { return { success: false, message: 'ارتباط با سرور برقرار نشد.' }; }
}
