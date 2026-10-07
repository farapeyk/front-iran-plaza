"use client";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useProfileFlow } from './onboarding-context';
import { PROFILE_STEPS, profileStepUrl } from '../../lib/onboarding-steps';

export function ProfileEditShell({ title, children }: { title: string; children: React.ReactNode }) {
  const flow = useProfileFlow();
  const step = PROFILE_STEPS[flow.index];
  return (
    <div className="min-h-screen bg-[#FBF1E8]" dir="rtl">
      <div className="max-w-md mx-auto pt-6 pb-10 px-4">
        <div className="flex items-center gap-2 mb-6">
          <Link href={flow.active ? (flow.index > 0 ? profileStepUrl(flow.index - 1) : '/dashboard') : '/dashboard/business/profile'} className="text-neutral-500">
            <ChevronRight size={20} />
          </Link>
          <h1 className="text-lg font-bold text-neutral-900">{title}</h1>
        </div>

        {flow.active && step && <div className="mb-5 space-y-3">
          <div className="flex justify-between text-sm"><span>مرحله {flow.index + 1} از {PROFILE_STEPS.length}</span><span>{step.important ? 'مهم' : 'اختیاری'}</span></div>
          <progress className="w-full accent-emerald-800" value={flow.index + 1} max={PROFILE_STEPS.length} aria-label="پیشرفت تکمیل پروفایل" />
          <p className="text-sm text-neutral-600">{step.collection ? 'موارد دلخواه را اضافه کنید و سپس به مرحله بعد بروید. فقط موارد ذخیره‌شده ثبت می‌شوند.' : 'با ذخیره موفق اطلاعات، به مرحله بعد می‌روید.'}</p>
        </div>}
        <fieldset disabled={flow.pending} className="bg-white border border-neutral-200 rounded-lg p-5 min-w-0">{children}</fieldset>
        {flow.active && step && <div className="mt-5 flex flex-col gap-3">
          {step.collection && <button type="button" disabled={flow.pending} onClick={() => flow.advance()} className="rounded-md bg-emerald-950 text-white p-3 disabled:opacity-50">{flow.pending ? 'در حال ثبت مرحله...' : 'تأیید موارد ذخیره‌شده و ادامه'}</button>}
          {flow.index > 1 && <button type="button" disabled={flow.pending} onClick={() => flow.advance()} className="text-sm text-neutral-600 disabled:opacity-50">{flow.index === 10 ? 'شرایط اقساط ندارم؛ پایان و نمایش همه بخش‌ها' : 'فعلاً ندارم / بعداً تکمیل می‌کنم'}</button>}
        </div>}
      </div>
    </div>
  );
}
