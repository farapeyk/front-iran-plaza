"use client"
import Image from "next/image";

import { useState } from "react"
import { Link, Navigate, useNavigate, useParams, useSearchParams } from "@/design/navigation"
import { DashboardAccountLayout } from "@/design/components/dashboard-account-layout"
import { Button } from "@/design/components/ui/button"
import { Field } from "@/design/components/ui/field"
import { Switch } from "@/design/components/ui/switch"
import { VipBadge } from "@/design/components/vip-badge"
import { SocialMediaIcon, type SocialName } from "@/design/components/social-media-icon"
import { AddCategorySheet } from "@/design/components/add-category-sheet"
import { AddSocialSheet } from "@/design/components/add-social-sheet"
import { ConfirmDeleteSheet } from "@/design/components/confirm-delete-sheet"
import { HelpTip } from "@/design/components/help-tip"
import { InfoStatus } from "@/design/components/info-status"
import { cn } from "@/design/lib/utils"
const arrowLeft = "/design/icons/arrow-left.svg"
const arrowDown = "/design/icons/arrow-down.svg"
const searchNotFound = "/design/icons/search-not-found.svg"
const notFoundBox = "/design/icons/not-found-box.svg"
const addIcon = "/design/icons/add.svg"
const awardIcon = "/design/icons/award.svg"
const eyeIcon = "/design/icons/eye.svg"
const tickCircle = "/design/icons/tick-circle.svg"
const logoutIcon = "/design/icons/logout.svg"
const trashIcon = "/design/icons/trash.svg"
const briefcase = "/design/icons/briefcase.svg"
const callIcon = "/design/icons/call.svg"
const locationIcon = "/design/icons/location.svg"
const galleryIcon = "/design/icons/categories.svg"
const globalIcon = "/design/icons/link.svg"
const flagIcon = "/design/icons/flag.svg"
const shieldTick = "/design/icons/shield-tick.svg"
const threeSquare = "/design/icons/three-square.svg"
const clockIcon = "/design/icons/clock.svg"
const convertCard = "/design/icons/convert-card.svg"
import type { SubscriptionStatus } from "@/design/components/dashboard-sidebar"

const months = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
]
const days = Array.from({ length: 31 }, (_, i) => String(i + 1))
const years = Array.from({ length: 60 }, (_, i) => String(1404 - i))

function SelectField({
  label,
  placeholder,
  options,
}: {
  label: string
  placeholder: string
  options: string[]
}) {
  return (
    <div className="space-y-1">
      <p className="text-right text-lg font-bold text-[var(--input-label)]">{label}</p>
      <label className="flex h-14 w-full items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--input-border)] px-[var(--lg)]">
        <Image alt="" className="size-6" height={24} src={arrowDown} width={24} />
        <select className="h-full w-full appearance-none bg-transparent text-right text-base outline-none">
          <option value="">{placeholder}</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}

type ProfileVariant = "vip" | "free" | "none"

const profileEditItems = [
  {
    key: "bio",
    title: "نام، بیوگرافی و لوگو",
    icon: briefcase,
    vipOnly: false,
  },
  {
    key: "contact",
    title: "تماس و واتساپ",
    icon: callIcon,
    vipOnly: false,
  },
  {
    key: "address",
    title: "آدرس و لوکیشن",
    icon: locationIcon,
    vipOnly: false,
  },
  {
    key: "gallery",
    title: "گالری تصاویر و ویدیو",
    icon: galleryIcon,
    vipOnly: true,
  },
  {
    key: "social",
    title: "شبکه های اجتماعی",
    icon: globalIcon,
    vipOnly: true,
  },
  {
    key: "services",
    title: "خدمات",
    icon: flagIcon,
    vipOnly: true,
  },
  {
    key: "products",
    title: "محصولات",
    icon: shieldTick,
    vipOnly: true,
  },
  {
    key: "about",
    title: "درباره ما",
    icon: threeSquare,
    vipOnly: true,
  },
  {
    key: "hours",
    title: "ساعات کاری",
    icon: clockIcon,
    vipOnly: true,
  },
  {
    key: "installments",
    title: "شرایط اقساط",
    icon: convertCard,
    vipOnly: true,
  },
] as const

type ProfileEditKey = (typeof profileEditItems)[number]["key"]

const stats = [
  {
    title: "بازدید پروفایل",
    value: "۱٬۵۱۸",
    icon: eyeIcon,
    iconBg: "bg-secondary-50",
  },
  {
    title: "نرخ تبدیل به مشتری",
    value: "۵.۳٪",
    icon: tickCircle,
    iconBg: "bg-primary-25",
  },
  {
    title: "نرخ خروج سریع",
    value: "۱۷.۹٪",
    icon: logoutIcon,
    iconBg: "bg-red-25",
  },
] as const

function ProfileEditItem({
  title,
  icon,
  to,
  locked,
}: {
  title: string
  icon: string
  to: string
  locked?: boolean
}) {
  const className = cn(
    "flex h-16 w-full items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] p-[var(--lg)]",
    locked && "pointer-events-none"
  )

  const body = (
    <>
      {locked ? (
        <span className="shrink-0 text-base text-secondary-950">VIP</span>
      ) : (
        <Image alt="" className="size-4 shrink-0" height={16} src={arrowLeft} width={16} />
      )}
      <span
        className={cn(
          "min-w-0 flex-1 text-start text-base font-bold text-[var(--text-body)]",
          locked && "opacity-[0.24]"
        )}
      >
        {title}
      </span>
      <Image
        alt=""
        className={cn("size-6 shrink-0", locked && "opacity-[0.24]")}
        height={24}
        src={icon}
        width={24}
      />
    </>
  )

  if (locked) {
    return <div className={className}>{body}</div>
  }

  return (
    <Link to={to} className={cn(className, "transition-colors hover:border-primary-300")}>
      {body}
    </Link>
  )
}

function ProfileStats() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.title}
          className="flex items-center gap-3 rounded-[var(--radius-xs)] bg-[var(--surface)] px-3 py-4 shadow-[0_4px_4px_rgba(0,0,0,0.04)] sm:gap-4 sm:px-4 sm:py-5"
        >
          <div className="min-w-0 flex-1 space-y-1 text-start">
            <p className="text-xl font-bold text-[var(--text-title)] sm:text-[length:var(--text-title-3)]">
              {s.value}
            </p>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm text-[var(--text-subtitle)] sm:text-base">{s.title}</p>
              <Image alt="" className="size-4 shrink-0" height={16} src={arrowDown} width={16} />
            </div>
          </div>
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full sm:size-12",
              s.iconBg
            )}
          >
            <Image alt="" className="size-5 sm:size-6" height={24} src={s.icon} width={24} />
          </div>
        </div>
      ))}
    </div>
  )
}

function ProfileEditGrid({ lockedVip }: { lockedVip: boolean }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 md:gap-5">
      {profileEditItems.map((item) => (
        <ProfileEditItem
          key={item.key}
          title={item.title}
          icon={item.icon}
          to={`/profile/edit/${item.key}`}
          locked={lockedVip && item.vipOnly}
        />
      ))}
    </div>
  )
}

function ProfileEmptyState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center gap-[var(--2xl)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] bg-[var(--surface)] px-[var(--2xl)] py-[var(--5xl)] text-center">
      <Image alt="" className="size-20" height={80} src={notFoundBox} width={80} />
      <p className="max-w-md text-lg leading-relaxed text-[var(--text-body)]">
        برای داشتن پروفایل، ابتدا باید کسب و کارتان را ثبت و احراز هویت کنید.
      </p>
      <Link to="/business-registration">
        <Button size="lg" className="gap-2">
          ثبت رایگان کسب و کار
          <Image alt="" className="size-6 brightness-0 invert" height={24} src={addIcon} width={24} />
        </Button>
      </Link>
    </div>
  )
}

function ProfilePage() {
  const [params] = useSearchParams()
  const raw = params.get("variant")
  const variant: ProfileVariant =
    raw === "free" || raw === "none" ? raw : "vip"
  /** Matches Figma: vip | free (VIP locks) | none (empty state) */
  const sidebarStatus: SubscriptionStatus = variant === "none" ? "free" : "active"

  return (
    <DashboardAccountLayout
      title="پروفایل من"
      status={sidebarStatus}
      headerAction={
        <Link to="/businesses/1">
          <Button variant="outline" className="gap-2 border-[var(--border-default)]">
            نمایش پروفایل
            <Image alt="" className="size-6" height={24} src={eyeIcon} width={24} />
          </Button>
        </Link>
      }
    >
      {variant === "none" ? (
        <ProfileEmptyState />
      ) : (
        <div className="space-y-[var(--3xl)]">
          <ProfileStats />
          <ProfileEditGrid lockedVip={variant === "free"} />
        </div>
      )}
    </DashboardAccountLayout>
  )
}

function UserInfoPage() {
  const [gender, setGender] = useState<"male" | "female" | "other">("male")

  return (
    <DashboardAccountLayout title="اطلاعات حساب کاربری" status="active">
      <form
        className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-x-6 md:gap-y-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <Field label="نام" requiredMark placeholder="نام خود را وارد کنید" />
        <Field
          label="نام خانوادگی"
          requiredMark
          placeholder="نام خانوادگی خود را وارد کنید"
        />
        <Field label="کد ملی" requiredMark placeholder="کد ملی را وارد کنید" />
        <Field label="ایمیل" type="email" placeholder="ایمیل خود را  وارد کنید" />
        <Field
          label="شماره موبایل"
          requiredMark
          locked
          defaultValue="09174550108"
        />

        <div className="space-y-1 md:col-span-2">
          <p className="text-right text-lg font-bold text-[var(--input-label)]">
            تاریخ تولد
          </p>
          <div className="flex">
            {[
              { ph: "سال", opts: years, round: "start" as const },
              { ph: "ماه", opts: months, round: "none" as const },
              { ph: "روز", opts: days, round: "end" as const },
            ].map((seg) => (
              <label
                key={seg.ph}
                className={cn(
                  "flex h-14 flex-1 items-center gap-2 border border-[var(--input-border)] px-[var(--lg)]",
                  seg.round === "start" && "rounded-s-[var(--radius-xs)]",
                  seg.round === "end" && "rounded-e-[var(--radius-xs)]",
                  seg.round === "none" && "border-x-0"
                )}
              >
                <Image alt="" className="size-4" height={16} src={arrowDown} width={16} />
                <select className="h-full w-full appearance-none bg-transparent text-right text-base outline-none">
                  <option value="">{seg.ph}</option>
                  {seg.opts.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-3 md:col-span-2">
          <p className="text-start text-lg font-bold text-[var(--text-body)]">جنسیت</p>
          <div className="flex flex-wrap justify-start gap-4 sm:gap-6">
            {(
              [
                ["other", "غیره"],
                ["female", "خانم"],
                ["male", "آقا"],
              ] as const
            ).map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setGender(val)}
                className="flex items-center gap-2 text-base text-[var(--text-body)]"
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "size-[22px] rounded-full border border-[var(--input-border)]",
                    gender === val && "border-[6px] border-primary-700"
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        <SelectField
          label="استان"
          placeholder="استان خود را انتخاب کنید"
          options={["فارس", "تهران", "اصفهان"]}
        />
        <SelectField
          label="شهر"
          placeholder="شهر خود را انتخاب کنید"
          options={["شیراز", "مرودشت", "جهرم"]}
        />

        <div className="md:col-span-2">
          <Button type="submit" size="lg" className="w-full sm:w-auto sm:min-w-[200px]">
            ذخیره اطلاعات
          </Button>
        </div>
      </form>
    </DashboardAccountLayout>
  )
}

const vipFeatures = [
  "عکس پروفایل",
  "تماس و واتساپ",
  "شبکه های اجتماعی",
  "گالری تصاویر/ ویدئو",
  "آدرس و لوکیشن",
  "درباره ما + ویس",
  "خدمات/ محصولات",
  "شرایط اقساط",
  "ساعات کاری",
  "نظردهی و امتیازدهی",
]

function SubscriptionPage() {
  return (
    <DashboardAccountLayout title="خرید اشتراک VIP" status="active">
      <div className="space-y-8 sm:space-y-10">
        <div className="space-y-3 text-start">
          <h2 className="text-xl font-black text-[var(--text-title)] sm:text-2xl">
            شروع رایگان با پروفایل VIP
          </h2>
          <p className="text-sm leading-relaxed text-[var(--text-body)] sm:text-base">
            ۳۰ روز اول رایگان است. پس از آن می‌توانید با خرید پلن، نمایش پروفایل را ادامه
            دهید و در گوگل، دسته‌بندی‌ها و نتایج جستجوی ایران پلازا دیده شوید.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] px-4 pb-4 pt-12 sm:px-6 sm:pb-6 sm:pt-14">
          <div className="absolute -top-8 start-1/2 -translate-x-1/2">
            <VipBadge className="scale-150" />
          </div>
          <div className="space-y-2 text-center">
            <p className="text-xl font-black text-[var(--text-title)] sm:text-2xl">
              پروفایل VIP
            </p>
            <Button variant="secondary" size="sm">
              پیشنهاد ویژه
            </Button>
          </div>
          <ul className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
            {vipFeatures.map((f) => (
              <li
                key={f}
                className="flex items-center justify-start gap-2 text-start text-sm text-[var(--text-title)] sm:text-base"
              >
                <Image alt="" className="size-5 shrink-0 sm:size-6" height={24} src={awardIcon} width={24} />
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 space-y-3 text-center sm:mt-8 sm:space-y-4">
            <div className="flex flex-wrap items-center justify-center gap-2 text-lg font-bold sm:gap-3 sm:text-xl">
              <span className="text-[var(--text-title)]">۲٬۵۰۰٬۰۰۰ تومان</span>
              <span className="text-primary-500">رایگان</span>
            </div>
            <Button size="lg" className="w-full gap-2">
              <Image alt="" className="size-6" height={24} src={addIcon} width={24} />
              فعال‌سازی رایگان
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          {[
            { title: "یک‌ماهه", price: "۲۹۰٬۰۰۰ تومان" },
            { title: "سه‌ماهه", price: "۷۵۰٬۰۰۰ تومان" },
            { title: "شش‌ماهه", price: "۱٬۳۵۰٬۰۰۰ تومان" },
            { title: "سالانه", price: "۲٬۵۰۰٬۰۰۰ تومان" },
          ].map((p) => (
            <div
              key={p.title}
              className="flex flex-col gap-3 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-4 text-start sm:gap-4 sm:p-5"
            >
              <div>
                <p className="text-lg font-black text-[var(--text-title)] sm:text-xl">
                  VIP {p.title}
                </p>
                <p className="mt-1 text-base text-[var(--text-body)] sm:mt-2 sm:text-lg">
                  {p.price}
                </p>
              </div>
              <Button className="w-full">خرید و تمدید</Button>
            </div>
          ))}
        </div>
      </div>
    </DashboardAccountLayout>
  )
}

const payments = [
  {
    title: "اشتراک VIP شش ماهه",
    tracking: "5478965214",
    date: "۱۴۰۴/۰۹/۲۲",
    duration: "شش ماهه",
    amount: "۱۰٬۵۰۰٬۰۰۰",
    start: "۱۴۰۴/۰۹/۲۲",
    end: "۱۴۰۵/۰۳/۲۲",
  },
  {
    title: "اشتراک VIP یک ماهه",
    tracking: "5478965214",
    date: "۱۴۰۴/۰۹/۲۲",
    duration: "۱ ماهه",
    amount: "رایگان",
    start: "۱۴۰۴/۰۹/۲۲",
    end: "۱۴۰۵/۰۳/۲۲",
  },
]

function PaymentsPage() {
  const [params] = useSearchParams()
  /** Default shows list; `?view=empty` matches the Figma empty state */
  const empty = params.get("view") === "empty"

  return (
    <DashboardAccountLayout title="پرداخت ها" status="active">
      <div className="space-y-4 sm:space-y-5">
        {empty ? (
          <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 px-4 text-center sm:min-h-[400px]">
            <Image
              alt=""
              className="h-16 w-[82px] sm:h-20 sm:w-[102px]"
              height={80}
              src={searchNotFound}
              width={102}
            />
            <p className="text-base text-[var(--text-body)] sm:text-lg">
              تاکنون هیچ پرداختی نداشته اید
            </p>
            <Link to="/subscription">
              <Button>خرید اشتراک VIP</Button>
            </Link>
          </div>
        ) : (
          payments.map((p) => (
            <article
              key={`${p.tracking}-${p.title}`}
              className="overflow-hidden rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] lg:flex"
            >
              <div className="flex items-center justify-center bg-secondary-100 px-4 py-4 text-center sm:px-5 lg:w-[280px] lg:shrink-0 xl:w-[300px]">
                <p className="font-bold text-[var(--text-title)]">{p.title}</p>
              </div>
              <div className="flex-1 space-y-3 p-4 sm:space-y-4 sm:p-5">
                {(
                  [
                    ["کد رهگیری", p.tracking],
                    ["تاریخ خرید", p.date],
                    ["مدت اشتراک", p.duration],
                    ["مبلغ پرداختی", p.amount],
                    ["شروع اشتراک", p.start],
                    ["پایان اشتراک", p.end],
                  ] as const
                ).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between gap-3 text-sm sm:gap-4 sm:text-base"
                  >
                    <span className="text-[var(--text-title)]">{v}</span>
                    <span className="shrink-0 text-[var(--text-body)]">{k}</span>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full border-[var(--border-default)] sm:mt-3"
                >
                  دریافت فاکتور
                </Button>
              </div>
            </article>
          ))
        )}
      </div>
    </DashboardAccountLayout>
  )
}

const supportTopics = [
  {
    q: "چطور کسب‌وکار ثبت کنم؟",
    a: "از داشبورد یا صفحه ثبت کسب‌وکار وارد شوید، اطلاعات کاربری و کسب‌وکار را کامل کنید و احراز هویت را انجام دهید.",
  },
  {
    q: "اشتراک VIP چه امکاناتی دارد؟",
    a: "گالری، شبکه‌های اجتماعی، خدمات/محصولات، ساعات کاری و نمایش ویژه در نتایج از امکانات VIP است.",
  },
  {
    q: "چطور با پشتیبانی تماس بگیرم؟",
    a: "می‌توانید با شماره ۰۹۱۷۴۵۵۰۱۰۸ تماس بگیرید یا از صفحه تماس با ما پیام بگذارید.",
  },
]

function SupportPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <DashboardAccountLayout title="پشتیبانی" status="active">
      <div className="space-y-6 sm:space-y-8">
        <div className="rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-4 sm:p-5">
          <p className="text-start text-base font-bold text-[var(--text-title)] sm:text-lg">
            تماس با پشتیبانی
          </p>
          <p className="mt-2 text-start text-sm leading-relaxed text-[var(--text-body)] sm:text-base">
            برای رفع مشکل حساب، اشتراک یا پروفایل کسب‌وکار با ما در ارتباط باشید.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="tel:09174550108">
              <Button className="w-full gap-2 sm:w-auto">
                <Image alt="" className="size-5" height={20} src={callIcon} width={20} />
                ۰۹۱۷۴۵۵۰۱۰۸
              </Button>
            </a>
            <Link to="/contact">
              <Button variant="outline" className="w-full border-[var(--border-default)] sm:w-auto">
                فرم تماس با ما
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="light" className="w-full sm:w-auto">
                سوالات متداول
              </Button>
            </Link>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-start text-lg font-black text-[var(--text-title)] sm:text-xl">
            پرسش‌های پرتکرار
          </h2>
          <div className="space-y-3">
            {supportTopics.map((item, i) => {
              const open = openIndex === i
              return (
                <div
                  key={item.q}
                  className="rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] bg-[var(--surface)] px-4"
                >
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 py-4 text-start"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? null : i)}
                  >
                    <span className="min-w-0 flex-1 text-base font-bold text-[var(--text-title)]">
                      {item.q}
                    </span>
                    <Image
                      alt=""
                      className={cn(
                        "size-5 shrink-0 transition-transform",
                        open && "rotate-180"
                      )}
                      height={20}
                      src={arrowDown}
                      width={20}
                    />
                  </button>
                  {open ? (
                    <p className="pb-4 text-start text-sm leading-relaxed text-[var(--text-body)] sm:text-base">
                      {item.a}
                    </p>
                  ) : null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </DashboardAccountLayout>
  )
}

function TextAreaField({
  label,
  placeholder,
  hint,
  requiredMark,
  rows = 4,
}: {
  label: string
  placeholder?: string
  hint?: string
  requiredMark?: boolean
  rows?: number
}) {
  return (
    <div className="space-y-1 text-right">
      <p className="text-lg font-bold text-[var(--input-label)]">
        {label}
        {requiredMark ? <span className="text-red-500">*</span> : null}
      </p>
      <textarea
        rows={rows}
        placeholder={placeholder}
        className="w-full resize-none rounded-[var(--radius-xs)] border border-[var(--input-border)] bg-transparent p-[var(--lg)] text-right text-base outline-none placeholder:text-[var(--input-placeholder)]"
      />
      {hint ? (
        <p className="text-sm text-[var(--text-subtitle)]">{hint}</p>
      ) : null}
    </div>
  )
}

function SaveButton() {
  return (
    <Button type="submit" size="lg" className="h-14 w-full max-w-[200px]">
      ذخیره اطلاعات
    </Button>
  )
}

function EmptyEditState({ message }: { message: string }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-dashed border-[var(--opacity-dark-16)] bg-[var(--surface)] px-[var(--2xl)] py-[var(--5xl)] text-center">
      <Image alt="" className="size-16" height={64} src={searchNotFound} width={64} />
      <p className="text-base text-[var(--text-body)]">{message}</p>
    </div>
  )
}

const weekDays = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه شنبه",
  "چهارشنبه",
  "پنج شنبه",
  "جمعه",
]

function ProfileEditForm({ section }: { section: ProfileEditKey }) {
  const [doubleShift, setDoubleShift] = useState(false)
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [socialOpen, setSocialOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [categories, setCategories] = useState<string[]>(["تخت خواب"])
  const [activeCategory, setActiveCategory] = useState("تخت خواب")
  const [socials, setSocials] = useState<SocialName[]>(["Instagram", "Telegram"])
  const [services, setServices] = useState<string[]>([""])
  const [products, setProducts] = useState<
    { id: string; category: string; name: string; price: string }[]
  >([
    {
      id: "p1",
      category: "تخت خواب",
      name: "سرویس خواب دونفره راش",
      price: "۱۸٬۵۰۰٬۰۰۰ تومان",
    },
    {
      id: "p2",
      category: "تخت خواب",
      name: "تخت کودک چوبی",
      price: "۶٬۹۰۰٬۰۰۰ تومان",
    },
  ])
  const [deleteProductId, setDeleteProductId] = useState<string | null>(null)
  const navigate = useNavigate()
  const categoryProducts = products.filter((p) => p.category === activeCategory)

  switch (section) {
    case "bio":
      return (
        <form
          className="space-y-[var(--2xl)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <InfoStatus variant="approved" className="max-w-none" />
          <div className="flex flex-col gap-[var(--2xl)] lg:flex-row lg:items-start">
            <div className="relative mx-auto size-[100px] shrink-0 lg:mx-0">
              <div className="size-full overflow-hidden rounded-[var(--radius-xs)] bg-secondary-100" />
              <button
                type="button"
                aria-label="تغییر لوگو"
                className="absolute -bottom-1 -start-1 flex size-8 items-center justify-center rounded-full border border-[var(--opacity-dark-16)] bg-[var(--surface)]"
              >
                <Image alt="" className="size-4" height={16} src={galleryIcon} width={16} />
              </button>
            </div>
            <div className="min-w-0 flex-1 space-y-[var(--2xl)]">
              <Field
                label="نام کسب و کار"
                requiredMark
                placeholder="نام کسب و کار خود را وارد کنید"
              />
              <TextAreaField
                label="بیوگرافی"
                requiredMark
                placeholder="یک بیوگرافی کوتاه و مفید از کسب و کار خود بنویسید"
                hint="حداکثر ۱۰۰ کاراکتر"
                rows={3}
              />
              <Field label="دسته بندی" placeholder="دسته بندی را انتخاب کنید" />
              <Field label="برچسب ها" placeholder="برچسب ها را وارد کنید" />
              <Field label="وبسایت" placeholder="آدرس وبسایت" />
            </div>
          </div>
          <SaveButton />
        </form>
      )

    case "contact":
      return (
        <form
          className="space-y-[var(--2xl)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <Field
            label="شماره تماس ۱ (اصلی)"
            requiredMark
            placeholder="شماره تماس اصلی خود را وارد کنید"
          />
          <div className="flex justify-center">
            <button
              type="button"
              aria-label="افزودن شماره"
              className="flex size-12 items-center justify-center rounded-full border border-[var(--opacity-dark-16)]"
            >
              <Image alt="" className="size-6" height={24} src={addIcon} width={24} />
            </button>
          </div>
          <Field label="واتساپ" placeholder="شماره واتساپ خود را وارد کنید" />
          <SaveButton />
        </form>
      )

    case "address":
      return (
        <form
          className="space-y-[var(--2xl)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <Field label="شهر" requiredMark placeholder="شهر را انتخاب کنید" />
          <Field label="محله" placeholder="محله را انتخاب کنید" />
          <TextAreaField
            label="آدرس کامل"
            placeholder="آدرس کامل خود را بنویسید"
            rows={3}
          />
          <Field label="کد پستی" placeholder="کد پستی" />
          <div className="flex h-48 items-center justify-center rounded-[var(--radius-xs)] border border-dashed border-[var(--opacity-dark-16)] bg-secondary-50 text-sm text-[var(--text-subtitle)]">
            انتخاب موقعیت روی نقشه
          </div>
          <SaveButton />
        </form>
      )

    case "gallery":
      return (
        <form
          className="space-y-[var(--2xl)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="space-y-[var(--lg)] text-right">
            <h2 className="text-lg font-bold text-[var(--text-title)]">ویدیو</h2>
            <button
              type="button"
              className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-xs)] border border-dashed border-[var(--opacity-dark-16)] bg-[var(--surface)] text-sm text-[var(--text-body)]"
            >
              <Image alt="" className="size-6" height={24} src={addIcon} width={24} />
              افزودن ویدیو
            </button>
          </div>
          <div className="space-y-[var(--lg)] text-right">
            <h2 className="text-lg font-bold text-[var(--text-title)]">تصاویر</h2>
            <p className="text-sm text-[var(--text-subtitle)]">
              حداکثر ۱۰۰ عکس با حجم کمتر از ۵ مگابایت
            </p>
            <button
              type="button"
              className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-[var(--radius-xs)] border border-dashed border-[var(--opacity-dark-16)] bg-[var(--surface)] text-sm text-[var(--text-body)]"
            >
              <Image alt="" className="size-6" height={24} src={addIcon} width={24} />
              افزودن تصویر
            </button>
          </div>
          <SaveButton />
        </form>
      )

    case "social":
      return (
        <>
          <form
            className="space-y-[var(--2xl)]"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex justify-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setSocialOpen(true)}
              >
                افزودن شبکه اجتماعی
                <Image alt="" className="size-5" height={20} src={addIcon} width={20} />
              </Button>
            </div>
            <div className="grid gap-[var(--lg)] sm:grid-cols-2">
              {socials.map((name) => (
                <div key={name} className="flex items-end gap-[var(--md)]">
                  <Field
                    className="min-w-0 flex-1"
                    label={name}
                    placeholder={`لینک ${name}`}
                  />
                  <SocialMediaIcon name={name} type="Button" className="mb-1 shrink-0" />
                </div>
              ))}
            </div>
            <SaveButton />
          </form>
          <AddSocialSheet
            open={socialOpen}
            onClose={() => setSocialOpen(false)}
            disabled={socials}
            onSelect={(name) =>
              setSocials((prev) =>
                prev.includes(name) ? prev : [...prev, name]
              )
            }
          />
        </>
      )

    case "services":
      return (
        <form
          className="space-y-[var(--2xl)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <HelpTip
            title="راهنمای افزودن خدمات"
            body="با افزودن خدمت جدید، یک فیلد به بالای دکمه اضافه میشود و هر فیلد امکان حذف شدن دارد.(بجز فیلد اول)"
          />
          <div className="space-y-[var(--lg)]">
            {services.map((value, i) => (
              <div key={i} className="flex items-end gap-[var(--md)]">
                <Field
                  className="min-w-0 flex-1"
                  label={i === 0 ? "خدمت" : undefined}
                  placeholder="عنوان خدمت را وارد کنید"
                  value={value}
                  onChange={(e) =>
                    setServices((prev) =>
                      prev.map((s, idx) => (idx === i ? e.target.value : s))
                    )
                  }
                />
                {i > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="حذف خدمت"
                    onClick={() =>
                      setServices((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    <Image alt="" className="size-6" height={24} src={trashIcon} width={24} />
                  </Button>
                ) : null}
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => setServices((prev) => [...prev, ""])}
          >
            افزودن خدمت
            <Image alt="" className="size-6" height={24} src={addIcon} width={24} />
          </Button>
          <SaveButton />
        </form>
      )

    case "products":
      return (
        <>
          <form
            className="space-y-[var(--2xl)]"
            onSubmit={(e) => e.preventDefault()}
          >
            <HelpTip
              title="راهنمای محصولات"
              body="ابتدا دسته بندی بسازید، سپس برای هر دسته محصول اضافه کنید. با حذف دسته، محصولات آن هم حذف میشوند."
            />
            <div className="flex flex-wrap items-center justify-between gap-[var(--lg)]">
              <div className="flex flex-wrap gap-[var(--md)]">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => navigate("/profile/edit/products/new")}
                >
                  افزودن محصول
                  <Image alt="" className="size-5" height={20} src={addIcon} width={20} />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setCategoryOpen(true)}
                >
                  افزودن دسته
                  <Image alt="" className="size-5" height={20} src={addIcon} width={20} />
                </Button>
              </div>
              <div className="flex flex-wrap justify-start gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setActiveCategory(c)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-sm font-bold",
                      activeCategory === c
                        ? "border-primary-700 bg-primary-25 text-primary-700"
                        : "border-[var(--opacity-dark-16)] text-[var(--text-body)]"
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => setDeleteOpen(true)}
              >
                حذف دسته بندی
              </Button>
              <p className="text-lg font-bold text-[var(--text-title)]">
                محصولات / {activeCategory || "—"}
              </p>
            </div>
            {categoryProducts.length === 0 ? (
              <EmptyEditState message="هیچ محصولی ثبت نشده است" />
            ) : (
              <ul className="space-y-[var(--lg)]">
                {categoryProducts.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] p-[var(--lg)]"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="حذف محصول"
                      onClick={() => setDeleteProductId(p.id)}
                    >
                      <Image
                        alt=""
                        className="size-6"
                        height={24}
                        src={trashIcon}
                        width={24}
                      />
                    </Button>
                    <div className="min-w-0 flex-1 space-y-1 text-right">
                      <p className="font-bold text-[var(--text-title)]">{p.name}</p>
                      <p className="text-sm text-[var(--text-body)]">{p.price}</p>
                    </div>
                    <div className="size-14 shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-secondary-100" />
                  </li>
                ))}
              </ul>
            )}
            <SaveButton />
          </form>
          <AddCategorySheet
            open={categoryOpen}
            onClose={() => setCategoryOpen(false)}
            onSave={(name) => {
              setCategories((prev) =>
                prev.includes(name) ? prev : [...prev, name]
              )
              setActiveCategory(name)
            }}
          />
          <ConfirmDeleteSheet
            open={deleteOpen}
            onClose={() => setDeleteOpen(false)}
            description={`با حذف دسته بندی ${activeCategory} همه محصولات درون این دسته بندی هم حذف خواهند شد.`}
            onConfirm={() => {
              setProducts((prev) =>
                prev.filter((p) => p.category !== activeCategory)
              )
              setCategories((prev) => {
                const next = prev.filter((c) => c !== activeCategory)
                setActiveCategory(next[0] ?? "")
                return next
              })
            }}
          />
          <ConfirmDeleteSheet
            open={Boolean(deleteProductId)}
            onClose={() => setDeleteProductId(null)}
            description="آیا از حذف این محصول مطمئن هستید؟"
            onConfirm={() => {
              setProducts((prev) =>
                prev.filter((p) => p.id !== deleteProductId)
              )
              setDeleteProductId(null)
            }}
          />
        </>
      )

    case "about":
      return (
        <form
          className="space-y-[var(--2xl)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex justify-start">
            <Button type="button" variant="outline" size="sm" className="gap-2">
              افزودن ویس
              <Image alt="" className="size-5" height={20} src={addIcon} width={20} />
            </Button>
          </div>
          <TextAreaField
            label="متن درباره ما"
            placeholder="درباره خودتان و کسب و کارتان بنویسید"
            rows={8}
          />
          <SaveButton />
        </form>
      )

    case "hours":
      return (
        <form
          className="space-y-[var(--2xl)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex items-center justify-start gap-[var(--md)]">
            <label
              htmlFor="double-shift"
              className="text-lg font-bold text-[var(--text-body)]"
            >
              ساعات کاری دو شیفت
            </label>
            <Switch
              id="double-shift"
              checked={doubleShift}
              onCheckedChange={setDoubleShift}
            />
          </div>
          <div className="space-y-[var(--2xl)]">
            {weekDays.map((day) => (
              <div key={day} className="space-y-[var(--md)] text-right">
                <p className="text-xl font-bold text-[var(--text-title)]">{day}</p>
                <div className="flex items-center gap-[var(--lg)]">
                  <label className="flex h-14 min-w-0 flex-1 items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--input-border)] px-[var(--lg)]">
                    <Image alt="" className="size-4" height={16} src={arrowDown} width={16} />
                    <span className="flex-1 text-right text-base text-[var(--input-placeholder)]">
                      ساعت
                    </span>
                  </label>
                  <span className="text-base text-[var(--text-body)]">تا</span>
                  <label className="flex h-14 min-w-0 flex-1 items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--input-border)] px-[var(--lg)]">
                    <Image alt="" className="size-4" height={16} src={arrowDown} width={16} />
                    <span className="flex-1 text-right text-base text-[var(--input-placeholder)]">
                      ساعت
                    </span>
                  </label>
                </div>
                {doubleShift ? (
                  <div className="flex items-center gap-[var(--lg)]">
                    <label className="flex h-14 min-w-0 flex-1 items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--input-border)] px-[var(--lg)]">
                      <Image alt="" className="size-4" height={16} src={arrowDown} width={16} />
                      <span className="flex-1 text-right text-base text-[var(--input-placeholder)]">
                        ساعت
                      </span>
                    </label>
                    <span className="text-base text-[var(--text-body)]">تا</span>
                    <label className="flex h-14 min-w-0 flex-1 items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--input-border)] px-[var(--lg)]">
                      <Image alt="" className="size-4" height={16} src={arrowDown} width={16} />
                      <span className="flex-1 text-right text-base text-[var(--input-placeholder)]">
                        ساعت
                      </span>
                    </label>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <SaveButton />
        </form>
      )

    case "installments":
      return (
        <form
          className="space-y-[var(--2xl)]"
          onSubmit={(e) => e.preventDefault()}
        >
          <HelpTip
            title="راهنمای شرایط اقساط"
            body="شروع اقساط، فاصله پرداخت و سود را مشخص کنید تا در پروفایل عمومی نمایش داده شود."
          />
          <Field label="شروع اقساط" placeholder="مثلاً از ۱ میلیون تومان" />
          <Field label="فاصله پرداخت اقساط" placeholder="مثلاً ماهانه" />
          <Field label="سود اقساط" placeholder="درصد سود" />
          <TextAreaField
            label="توضیحات"
            placeholder="شرایط اقساط را بنویسید"
            rows={4}
          />
          <SaveButton />
        </form>
      )

    default:
      return null
  }
}

function ProfileEditPage() {
  const { section } = useParams<{ section: string }>()
  const item = profileEditItems.find((i) => i.key === section)

  if (!item) {
    return <Navigate to="/profile" replace />
  }

  return (
    <DashboardAccountLayout title={item.title} backTo="/profile" status="active">
      <ProfileEditForm section={item.key} />
    </DashboardAccountLayout>
  )
}

function AddProductPage() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [price, setPrice] = useState("")

  const valid = name.trim().length > 0

  return (
    <DashboardAccountLayout
      title="افزودن محصول جدید"
      backTo="/profile/edit/products"
      status="active"
    >
      <form
        className="space-y-[var(--7xl)]"
        onSubmit={(e) => {
          e.preventDefault()
          if (!valid) return
          navigate("/profile/edit/products")
        }}
      >
        <div className="space-y-[var(--2xl)]">
          <button
            type="button"
            className="flex size-[100px] flex-col items-center justify-center gap-2 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)]"
          >
            <Image alt="" className="size-6" height={24} src={addIcon} width={24} />
            <span className="text-sm font-bold text-[var(--text-body)]">عکس محصول</span>
          </button>
          <Field
            label="نام محصول"
            requiredMark
            placeholder="نام محصول را وارد کنید..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="space-y-1 text-right">
            <p className="text-lg font-bold text-[var(--input-label)]">توضیح</p>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value.slice(0, 100))}
              rows={4}
              placeholder="یک توضیح کوتاه درمورد محصول بنویسید..."
              className="h-[120px] w-full resize-none rounded-[var(--radius-xs)] border border-[var(--input-border)] p-[var(--lg)] text-right text-base outline-none placeholder:text-[var(--input-placeholder)]"
            />
            <p className="text-sm text-[var(--text-body)]">حداکثر ۱۰۰ کاراکتر</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-lg font-bold text-[var(--input-label)]">قیمت</p>
            <label className="flex h-14 w-full items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--input-border)] px-[var(--lg)]">
              <span className="border-e border-[var(--opacity-dark-24)] pe-[var(--lg)] text-base text-[var(--text-title)]">
                تومان
              </span>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="قیمت را وارد کنید..."
                className="min-w-0 flex-1 bg-transparent text-right text-base outline-none placeholder:text-[var(--input-placeholder)]"
              />
            </label>
          </div>
        </div>
        <Button type="submit" size="lg" className="h-12 w-full max-w-md" disabled={!valid}>
          ثبت محصول
        </Button>
      </form>
    </DashboardAccountLayout>
  )
}

export {
  ProfilePage,
  ProfileEditPage,
  AddProductPage,
  UserInfoPage,
  SubscriptionPage,
  PaymentsPage,
  SupportPage,
}
