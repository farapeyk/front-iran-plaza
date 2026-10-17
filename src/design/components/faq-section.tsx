"use client"
import Image from "next/image";

import type { CSSProperties } from "react"
import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { SectionHeading } from "@/design/components/section-heading"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/design/components/ui/accordion"
import { buttonVariants } from "@/design/components/ui/button-variants"
const addIcon = "/design/icons/add.svg"
const faqLooper = "/design/home/faq-vector.svg"

/** Extruded depth layers behind the front mark (Figma Group 7). */
const faqMarkDepth = Array.from({ length: 14 }, (_, i) => {
  const t = i / 13
  return {
    left: `${13 + t * 17.5}%`,
    top: `${34.2 - t * 19.1}%`,
    fill: i < 11 ? "var(--secondary-500)" : "var(--primary-800)",
  }
})

function FaqQuestionMark({
  className,
  fill,
  style,
}: {
  className?: string
  fill: string
  style?: CSSProperties
}) {
  return (
    <svg
      aria-hidden
      className={className}
      fill="none"
      style={style}
      viewBox="0 0 147.968 248.132"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 24.8428C6.70256 36.3095 10.991 43.9769 14.2317 48.8777C17.4727 53.7788 19.666 55.9138 22.1789 56.3163C24.6917 56.719 27.5236 55.389 32.0417 53.3605C36.5599 51.332 42.7638 48.6045 52.0206 46.2121C60.7462 43.9623 68.3474 43.9275 74.6189 45.4877C80.8904 47.0478 85.832 50.203 89.2383 54.333C92.6446 58.463 94.5154 63.5684 94.6452 69.0286C94.775 74.4888 93.164 80.3043 89.6064 85.8546C86.4493 90.7806 82.7477 94.6648 78.7731 98.0015C74.7983 101.338 70.5504 104.127 66.3002 106.863C62.05 109.598 57.7976 112.28 53.8145 115.402C49.831 118.524 46.1165 122.087 42.9421 126.584C41.1949 129.059 40.0506 131.461 39.3575 134.13C38.6641 136.798 38.422 139.732 38.4788 143.273C38.5355 146.813 38.8913 150.96 39.3945 156.053C39.8973 161.145 40.5475 167.184 41.1927 174.508C60.4156 175.43 70.9785 175.276 76.753 174.019C82.5276 172.762 83.5136 170.403 83.5824 166.917C83.6513 163.43 82.8032 158.816 84.9097 153.048C87.0159 147.281 92.0766 140.36 103.963 132.26C131.181 113.73 144.367 93.1375 147.318 73.8258C150.269 54.5141 142.985 36.483 129.26 23.0751C115.536 9.66705 95.3711 0.882215 72.5626 0.062777C49.754 -0.756661 24.3014 6.3893 0 24.8428Z"
        fill={fill}
      />
      <path
        d="M34.0653 219.604C33.6293 228.692 36.8069 235.657 41.8456 240.429C46.8844 245.201 53.7844 247.781 60.7926 248.099C67.8012 248.416 74.918 246.471 80.391 242.194C85.8641 237.916 89.693 231.306 90.1256 222.294C90.5567 213.308 87.3771 206.383 82.3383 201.614C77.2993 196.846 70.4011 194.236 63.3943 193.881C56.3877 193.526 49.2729 195.427 43.8008 199.681C38.3288 203.936 34.5 210.545 34.0653 219.604Z"
        fill={fill}
      />
    </svg>
  )
}

const faqs = [
  {
    q: "ایران پلازا چیست و چطور کسب‌وکارها را پیدا کنم؟",
    a: "ایران پلازا بستری برای معرفی و جستجوی کسب‌وکارهاست. ثبت‌نام رایگان است و می‌توانید پروفایل خود را مدیریت کنید.",
  },
  {
    q: "چطور کسب‌وکارم را ثبت کنم؟",
    a: "پس از ثبت اطلاعات کاربری و کسب‌وکار، احراز هویت و تکمیل پروفایل را انجام دهید.",
  },
  {
    q: "اطلاعات اشتراک VIP را از کجا ببینم؟",
    a: "در بخش خرید اشتراک VIP، پلن‌های فعال، قیمت و امکانات آن‌ها نمایش داده می‌شود. نشان VIP برای کسب‌وکار دارای اشتراک معتبر نمایش داده می‌شود.",
  },
  {
    q: "برای پیگیری مشکل چطور با پشتیبانی ارتباط بگیرم؟",
    a: "ثبت و پیگیری پیام پشتیبانی در حال حاضر در دسترس نیست. با فعال‌شدن این امکان، ارسال و پیگیری پیام از بخش پشتیبانی داشبورد انجام می‌شود.",
  },
]

function FaqSection({ className }: { className?: string }) {
  return (
    <section
      id="faq"
      className={cn(
        "flex flex-col items-center gap-[var(--5xl)] px-[var(--lg)] py-[var(--8xl)] lg:px-[var(--8xl)]",
        className
      )}
    >
      <SectionHeading title="سوالات متداول" />

      <div className="flex w-full flex-col items-center justify-between gap-[var(--5xl)] lg:flex-row lg:items-start">
        <div
          className="relative hidden size-[280px] shrink-0 lg:block lg:size-[360px]"
          aria-hidden
        >
          <Image
            alt=""
            className="absolute inset-0 size-full object-contain"
            fill
            sizes="360px"
            src={faqLooper}
          />
          {faqMarkDepth.map((layer, i) => (
            <FaqQuestionMark
              key={i}
              className="absolute h-[68.9%] w-[37.7%]"
              fill={layer.fill}
              style={{ left: layer.left, top: layer.top }}
            />
          ))}
          <FaqQuestionMark
            className="absolute h-[68.9%] w-[37.7%]"
            fill="var(--primary-950)"
            style={{ left: "30.5%", top: "15.1%" }}
          />
        </div>

        <div className="flex w-full max-w-[700px] flex-col items-center gap-[var(--2xl)]">
          <Accordion className="w-full gap-[var(--lg)]">
            {faqs.map((item, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] px-[var(--2xl)] not-last:border-b"
              >
                <AccordionTrigger className="py-[var(--2xl)] text-right text-xl font-bold text-[var(--text-title)] hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-[var(--2xl)] text-right text-base leading-relaxed text-[var(--text-body)]">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <Link
            to="/faq"
            className={cn(
              buttonVariants({ variant: "light", size: "sm" }),
              "gap-2 bg-[var(--opacity-dark-8)] text-[var(--text-title)]"
            )}
          >
            مشاهده همه
            <Image alt="" className="size-6" height={24} src={addIcon} width={24} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export { FaqSection }
