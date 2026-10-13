"use client"

import { cn } from "@/design/lib/utils"
import { SectionHeading } from "@/design/components/section-heading"

const steps = [
  {
    n: 1,
    title: "ثبت اطلاعات کاربری",
    desc: "اطلاعات اولیه خود را وارد کنید تا حساب کاربری شما با موفقیت ساخته شود.",
    tone: "bg-primary-950",
  },
  {
    n: 2,
    title: "ثبت اطلاعات کسب وکار",
    desc: "مشخصات اصلی و ضروری کسب‌وکار خود را برای ادامه فرآیند ثبت کنید.",
    tone: "bg-primary-800",
  },
  {
    n: 3,
    title: "احراز هویت",
    desc: "برای افزایش امنیت و اعتماد، هویت خود را تأیید کنید.",
    tone: "bg-primary-600",
  },
  {
    n: 4,
    title: "تکمیل پروفایل کسب وکار",
    desc: "پروفایل را نهایی کنید و کسب‌وکار خود را فعال نمایید.",
    tone: "bg-primary-500",
  },
] as const

function ProcessSteps({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "flex flex-col gap-[var(--5xl)] px-[var(--page-gutter)] py-[var(--7xl)] lg:px-[var(--page-gutter-lg)]",
        className
      )}
    >
      <SectionHeading title="فرآیند ثبت کسب وکار" />
      <div className="flex gap-[var(--3xl)] overflow-x-auto rounded-[var(--radius-xs)] border border-[var(--border-default)] px-[var(--3xl)] py-[var(--5xl)]">
        {steps.map((step) => (
          <div key={step.n} className="flex min-w-[200px] flex-1 gap-[var(--lg)]">
            <div
              className={cn(
                "flex w-8 shrink-0 items-center justify-center rounded-b-[var(--radius-full)] text-[length:var(--text-label-1)] font-bold text-[var(--text-light-title)]",
                step.tone
              )}
            >
              {step.n}
            </div>
            <div className="min-w-0 flex-1 text-start">
              <p className="text-[length:var(--text-title-4)] font-bold text-[var(--text-title)]">
                {step.title}
              </p>
              <p className="mt-[var(--xs)] text-[length:var(--text-body-5)] leading-relaxed text-[var(--text-body)]">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export { ProcessSteps }
