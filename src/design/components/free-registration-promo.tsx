"use client"
import Image from "next/image";

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { buttonVariants } from "@/design/components/ui/button-variants"
const addIcon = "/design/icons/add.svg"
const vipBadgeLg = "/design/home/vip-badge-lg.webp"

const benefits = [
  "نمایش به هزاران کاربر فعال",
  "نمایش در جستجو های گوگل",
  "جذب مشتریان هدفمند",
  "افزایش اعتبار و اعتماد مشتری",
  "آغاز رایگان و بدون ریسک",
  "پروفایل حرفه ای و اختصاصی",
  "مدیریت کامل روی پروفایل",
]

function FreeRegistrationPromo({ className }: { className?: string }) {
  return (
    <section
      className={cn(
        "relative px-[var(--page-gutter)] py-[var(--7xl)] lg:px-[var(--page-gutter-lg)]",
        className
      )}
    >
      <div
        className="relative flex flex-col gap-[var(--5xl)] overflow-hidden rounded-[var(--radius-sm)] p-[var(--2xl)] lg:flex-row lg:items-stretch lg:gap-[var(--7xl)] lg:p-[var(--7xl)]"
        style={{
          backgroundImage:
            "linear-gradient(196deg, var(--primary-950) 13%, var(--primary-800) 32%, var(--primary-600) 51%, var(--primary-700) 70%, var(--primary-500) 88%)",
        }}
      >
        <div className="flex flex-1 flex-col items-start gap-[var(--3xl)]">
          <div className="w-full space-y-[var(--lg)] text-start">
            <h2 className="text-[length:var(--text-h1)] font-black text-[var(--text-light-title)]">
              ثبت نام رایگان کسب و کارها
            </h2>
            <div className="flex items-center gap-[var(--sm)]">
              <span className="h-1 w-10 bg-secondary-500" />
              <span className="h-1 w-2 bg-secondary-500" />
            </div>
          </div>
          <p className="text-start text-[length:var(--text-body-3)] leading-relaxed text-[var(--text-light-title)]">
            با ثبت کسب‌وکار خود در ایران پلازا، اطلاعات شما در دسترس کاربران قرار می‌گیرد.
            ثبت‌نام رایگان است و می‌توانید برای امکانات بیشتر، پلن‌های فعال VIP را در داشبورد بررسی کنید.
          </p>
          <Link
            to="/business-registration"
            className={cn(
              buttonVariants({ variant: "secondary", size: "default" }),
              "gap-2 bg-secondary-300 text-[var(--text-title)] hover:bg-secondary-400"
            )}
          >
            <Image alt="" className="size-6" height={24} src={addIcon} width={24} />
            ثبت نام رایگان
          </Link>
        </div>

        <div className="relative flex w-full max-w-md flex-col justify-center gap-[var(--xs)] rounded-[var(--radius-xs)] border border-[var(--opacity-light-24)] p-[var(--2xl)] lg:w-[400px] lg:shrink-0">
          <Image
            alt="VIP"
            className="absolute -bottom-4 end-4 h-16 w-14 object-cover lg:-top-5 lg:bottom-auto lg:end-6 lg:h-20 lg:w-[72px]"
            height={80}
            src={vipBadgeLg}
            width={72}
          />
          <div className="mt-20 flex flex-col gap-[var(--xs)]">
            {benefits.map((item) => (
              <div
                key={item}
                className="flex items-center gap-[var(--md)] py-0.5"
              >
                <span className="size-2 shrink-0 rotate-45 bg-secondary-500" />
                <p className="text-start text-[length:var(--text-label-2)] text-[var(--text-light-title)]">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { FreeRegistrationPromo }
