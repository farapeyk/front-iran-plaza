"use client";
import { DashboardAccountLayout } from '@/design/components/dashboard-account-layout';
import { useProfileFlow } from './onboarding-context';
import { PROFILE_STEPS, profileStepUrl } from '../../lib/onboarding-steps';
export function ProfileEditShell({title,children}:{title:string;children:React.ReactNode}) {
  const flow=useProfileFlow();
  const step=PROFILE_STEPS[flow.index];
  return <DashboardAccountLayout title={title} backTo={flow.active?(flow.index>0?profileStepUrl(flow.index-1):'/dashboard'):'/profile'}>
    {flow.active && step && <div className="mb-5 space-y-3">
      <div className="flex justify-between text-sm"><span>مرحله {flow.index+1} از {PROFILE_STEPS.length}</span><span>{step.important?'مهم':'اختیاری'}</span></div>
      <progress className="w-full accent-emerald-800" value={flow.index+1} max={PROFILE_STEPS.length} aria-label="پیشرفت تکمیل پروفایل"/>
      <p className="text-sm text-[var(--text-body)]">{step.collection?'موارد دلخواه را اضافه کنید و سپس به مرحله بعد بروید. فقط موارد ذخیره‌شده ثبت می‌شوند.':'با ذخیره موفق اطلاعات، به مرحله بعد می‌روید.'}</p>
    </div>}
    <fieldset disabled={flow.pending} className="design-form min-w-0 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] bg-[var(--surface)] p-4 sm:p-6">{children}</fieldset>
    {flow.active&&step&&<div className="mt-5 flex flex-col gap-3">
      {step.collection&&<button type="button" disabled={flow.pending} onClick={()=>flow.advance()} className="rounded-md bg-primary-700 p-3 text-white disabled:opacity-50">{flow.pending?'در حال ثبت مرحله…':'تأیید موارد ذخیره‌شده و ادامه'}</button>}
      {flow.index>1&&<button type="button" disabled={flow.pending} onClick={()=>flow.advance()} className="text-sm text-[var(--text-body)] disabled:opacity-50">{flow.index===10?'شرایط اقساط ندارم؛ پایان و نمایش همه بخش‌ها':'فعلاً ندارم / بعداً تکمیل می‌کنم'}</button>}
    </div>}
  </DashboardAccountLayout>;
}
