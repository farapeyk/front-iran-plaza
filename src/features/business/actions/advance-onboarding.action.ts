"use server";

import { actionFetch } from '@/lib/api/action-fetch';

import { revalidatePath } from 'next/cache';
import { getActionAccessToken } from '@/lib/auth/action-access-token';
import { extractErrorMessage } from '@/lib/api/error-message';

export async function advanceOnboardingAction(businessId: string, step: number): Promise<
  { success: true; onboardingStep: number } | { success: false; message: string }
> {
  const token = await getActionAccessToken();
  if (!token) return { success: false, message: 'دوباره وارد حساب شوید' };
  try {
    const res = await actionFetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/${businessId}/onboarding/advance`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ step }), cache: 'no-store',
    });
    const data = await res.json();
    if (!res.ok) return { success: false, message: extractErrorMessage(data, 'ثبت مرحله انجام نشد') };
    if (!Number.isInteger(data.onboardingStep) || data.onboardingStep < 0 || data.onboardingStep > 11) return { success: false, message: 'پاسخ پیشرفت مرحله معتبر نیست.' };
    revalidatePath('/dashboard/business/profile', 'layout');
    return { success: true, onboardingStep: data.onboardingStep };
  } catch {
    return { success: false, message: 'ارتباط با سرور برقرار نشد؛ دوباره تلاش کنید' };
  }
}
