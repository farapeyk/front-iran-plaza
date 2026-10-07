import { extractErrorMessage } from '@/lib/api/error-message';

export async function advanceOnboarding(businessId: string, step: number): Promise<
  { success: true; onboardingStep: number } | { success: false; message: string }
> {
  try {
    // The refresh cookie is scoped to /api/auth; refresh there before sending the mutation.
    const session = await fetch('/api/auth/silent-refresh', { method: 'POST', credentials: 'same-origin', cache: 'no-store' });
    if (!session.ok) return { success: false, message: session.status === 401 ? 'نشست شما تمام شده؛ دوباره وارد شوید.' : 'تمدید نشست انجام نشد؛ دوباره تلاش کنید.' };
    const response = await fetch(`/api/backend/businesses/${encodeURIComponent(businessId)}/onboarding/advance`, {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step }), cache: 'no-store',
    });
    const data = await response.json();
    if (!response.ok) return { success: false, message: extractErrorMessage(data, 'ثبت مرحله انجام نشد') };
    if (!Number.isInteger(data.onboardingStep) || data.onboardingStep < 0 || data.onboardingStep > 11) {
      return { success: false, message: 'پاسخ مرحله معتبر نیست؛ صفحه را دوباره بارگذاری کنید.' };
    }
    return { success: true, onboardingStep: data.onboardingStep };
  } catch { return { success: false, message: 'ارتباط با سرور برقرار نشد؛ دوباره تلاش کنید.' }; }
}
