"use client"

import { cn } from "@/design/lib/utils"
import { SectionHeading } from "@/design/components/section-heading"
const userBold = "/design/icons/user-bold.svg"

const testimonials = [
  {
    name: "علیرضا خلقت",
    role: "مدیر محصول فلوتیک",
    text: "خیلی عالی بود! کارت ویزیت هوشمندتون هم کیفیت بالایی داشت هم کار کردن باهاش خیلی راحت بود. واقعاً برای کسب‌وکارم کاربردی و حرفه‌ایه. ممنون از خدمات خوبتون",
  },
  {
    name: "علیرضا خلقت",
    role: "مدیر محصول فلوتیک",
    text: "خیلی عالی بود! کارت ویزیت هوشمندتون هم کیفیت بالایی داشت هم کار کردن باهاش خیلی راحت بود. واقعاً برای کسب‌وکارم کاربردی و حرفه‌ایه. ممنون از خدمات خوبتون",
  },
]

function Testimonials({ className }: { className?: string }) {
  return (
    <section className={cn("relative pt-[var(--space-16)]", className)}>
      <SectionHeading title="نظرات کاربران" className="px-[var(--lg)] lg:px-[var(--8xl)]" />

      <div className="relative mt-[var(--5xl)]">
        <div
          className="absolute inset-x-0 bottom-0 h-[234px]"
          style={{
            backgroundImage:
              "linear-gradient(191deg, var(--primary-500) 0%, var(--primary-950) 100%)",
          }}
        />

        <div className="relative z-10 flex gap-[var(--3xl)] overflow-x-auto px-[var(--lg)] pb-[var(--5xl)] pt-[var(--3xl)] lg:justify-center lg:px-[var(--8xl)]">
          {testimonials.map((t, i) => (
            <article
              key={i}
              className="flex min-w-[min(100%,345px)] flex-1 flex-col items-center gap-[var(--2xl)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-[var(--2xl)] lg:max-w-[560px] lg:flex-row lg:items-center lg:py-[var(--2xl)] lg:ps-[var(--2xl)] lg:pe-0"
            >
              <div className="flex shrink-0 flex-col items-center gap-[var(--sm)] lg:border-s lg:border-[var(--opacity-dark-8)] lg:px-[var(--3xl)]">
                <div className="rounded-full border border-secondary-50 p-[var(--sm)]">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary-700">
                    <img alt="" className="size-8" height={32} src={userBold} width={32} />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-primary-950">{t.name}</p>
                  <p className="text-sm text-[var(--text-body)]">{t.role}</p>
                </div>
              </div>
              <p className="min-w-0 flex-1 text-start text-base leading-relaxed text-[var(--text-body)]">
                {t.text}
              </p>
            </article>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-center gap-[var(--sm)] pb-[var(--3xl)]">
          <span className="size-2 rounded-full bg-[var(--opacity-light-32)]" />
          <span className="size-2 rounded-full bg-[var(--opacity-light-32)]" />
          <span className="h-2 w-6 rounded-full bg-secondary-300" />
          <span className="size-2 rounded-full bg-[var(--opacity-light-32)]" />
          <span className="size-2 rounded-full bg-[var(--opacity-light-32)]" />
        </div>
      </div>
    </section>
  )
}

export { Testimonials }
