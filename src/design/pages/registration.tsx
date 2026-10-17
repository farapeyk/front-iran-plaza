"use client"
import Image from "next/image";

import { useState, type ReactNode } from "react"
import { Link, useNavigate } from "@/design/navigation"
import { SiteLayout } from "@/design/components/site-layout"
import { FreeRegistrationPromo } from "@/design/components/free-registration-promo"
import { FaqSection } from "@/design/components/faq-section"
import { DashboardSidebar } from "@/design/components/dashboard-sidebar"
import { IdentityCard } from "@/design/components/identity-card"
import { FullScreenAlarm } from "@/design/components/full-screen-alarm"
import { Button } from "@/design/components/ui/button"
import { Field } from "@/design/components/ui/field"
import { cn } from "@/design/lib/utils"
import {
  dashboardHomeItems,
  dashboardLogoutItem,
} from "@/design/data/dashboard-nav"
import { homeCategories } from "@/design/data/home-categories"
const arrowRight = "/design/icons/arrow-right.svg"
const arrowLeft = "/design/icons/arrow-left.svg"
const arrowDown = "/design/icons/arrow-down.svg"
const addIcon = "/design/icons/add.svg"
const categoriesIcon = "/design/icons/categories.svg"
const userIcon = "/design/icons/user.svg"
const landingHero = "/design/registration/landing-hero.webp"
const stepUserImg = "/design/registration/step-user.webp"
const stepBusinessImg = "/design/registration/step-business.webp"
const stepIdentityImg = "/design/registration/step-identity.webp"
const stepNationalImg = "/design/registration/step-national.webp"
const stepLicenseImg = "/design/registration/step-license.webp"

type RegStep =
  | "landing"
  | "user"
  | "business"
  | "identity"
  | "national"
  | "national-docs"
  | "license"
  | "license-docs"
  | "success"

type IdentityMethod = "national" | "license" | null

const days = Array.from({ length: 31 }, (_, i) => String(i + 1))
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
const years = Array.from({ length: 60 }, (_, i) => String(1404 - i))

const LOCKED_MOBILE = "09174550108"

const stepSideImage: Partial<Record<RegStep, string>> = {
  user: stepUserImg,
  business: stepBusinessImg,
  identity: stepIdentityImg,
  national: stepNationalImg,
  "national-docs": stepNationalImg,
  license: stepLicenseImg,
  "license-docs": stepLicenseImg,
}

function DateSelect({
  value,
  onChange,
  options,
  placeholder,
  rounded,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder: string
  rounded?: "start" | "end" | "none"
}) {
  return (
    <label
      className={cn(
        "relative flex h-14 flex-1 items-center gap-2 border border-[var(--input-border)] bg-transparent px-[var(--lg)]",
        rounded === "start" && "rounded-s-[var(--radius-xs)]",
        rounded === "end" && "rounded-e-[var(--radius-xs)]",
        rounded === "none" && "border-x-0"
      )}
    >
      <Image alt="" className="size-4 shrink-0" height={16} src={arrowDown} width={16} />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full appearance-none bg-transparent text-right text-base text-[var(--input-value)] outline-none"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function DateRow({
  label,
  requiredMark,
  day,
  month,
  year,
  onDay,
  onMonth,
  onYear,
}: {
  label: string
  requiredMark?: boolean
  day: string
  month: string
  year: string
  onDay: (v: string) => void
  onMonth: (v: string) => void
  onYear: (v: string) => void
}) {
  return (
    <div className="space-y-1">
      <p className="text-right text-lg font-bold text-[var(--input-label)]">
        {label}
        {requiredMark ? <span className="text-[var(--danger)]">*</span> : null}
      </p>
      <div className="flex w-full">
        <DateSelect
          value={year}
          onChange={onYear}
          options={years}
          placeholder="سال"
          rounded="start"
        />
        <DateSelect
          value={month}
          onChange={onMonth}
          options={months}
          placeholder="ماه"
          rounded="none"
        />
        <DateSelect
          value={day}
          onChange={onDay}
          options={days}
          placeholder="روز"
          rounded="end"
        />
      </div>
    </div>
  )
}

function UploadSlot({
  label,
  filled,
  onToggle,
  tall,
}: {
  label: string
  filled: boolean
  onToggle: () => void
  tall?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "relative flex w-full flex-col items-center justify-center gap-[var(--md)] rounded-[var(--radius-xs)] border border-[var(--input-border)] bg-[var(--opacity-dark-8)]/40",
        tall ? "min-h-[280px] lg:min-h-[480px]" : "min-h-[160px]"
      )}
    >
      <Image
        alt=""
        className="size-8 opacity-50"
        height={32}
        src={categoriesIcon}
        width={32}
      />
      <span className="text-base text-[var(--text-body)]">{label}</span>
      <span className="absolute bottom-3 flex size-10 items-center justify-center rounded-full bg-[var(--btn-primary-fill)]">
        <Image
          alt=""
          className="size-6 brightness-0 invert"
          height={24}
          src={addIcon}
          width={24}
        />
      </span>
      {filled ? (
        <span className="absolute inset-2 rounded-[var(--radius-xs)] border-2 border-[var(--success)]/40 bg-secondary-50/80" />
      ) : null}
    </button>
  )
}

function StepShell({
  step,
  title,
  description,
  onBack,
  children,
  footer,
}: {
  step: RegStep
  title: string
  description: string
  onBack: () => void
  children: ReactNode
  footer?: ReactNode
}) {
  const side = stepSideImage[step]

  return (
    <section className="mx-auto w-full max-w-md px-[var(--page-gutter)] py-[var(--5xl)] lg:max-w-[1440px] lg:px-[var(--page-gutter-lg)] lg:py-[var(--5xl)]">
      <div className="flex flex-col gap-[var(--5xl)] lg:flex-row lg:items-start lg:justify-between lg:gap-[var(--8xl)]">
        <div className="w-full space-y-[var(--2xl)] lg:max-w-[540px] lg:flex-1">
          <header className="space-y-[var(--2xl)] text-right">
            <button
              type="button"
              onClick={onBack}
              className="flex size-12 items-center justify-center rounded-full border border-[var(--border-default)]"
              aria-label="بازگشت"
            >
              <Image alt="" className="size-6" height={24} src={arrowRight} width={24} />
            </button>
            <div className="space-y-1">
              <h1 className="text-2xl font-bold text-[var(--text-title)] lg:text-[32px] lg:font-black lg:leading-[1.4]">
                {title}
              </h1>
              <p className="text-lg leading-relaxed text-[var(--text-body)]">
                {description}
              </p>
            </div>
          </header>

          <div className="space-y-[var(--2xl)]">{children}</div>
          {footer ? <div className="pt-[var(--lg)]">{footer}</div> : null}
        </div>

        {side ? (
          <div className="hidden lg:sticky lg:top-24 lg:block lg:w-[540px] lg:shrink-0">
            <Image
              alt=""
              className="h-auto w-full rounded-[var(--radius-xs)] object-cover"
              height={1080}
              sizes="540px"
              src={side}
              width={1080}
            />
          </div>
        ) : null}
      </div>
    </section>
  )
}

function BusinessRegistrationPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<RegStep>("landing")
  const [identityMethod, setIdentityMethod] = useState<IdentityMethod>(null)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [day, setDay] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")

  const [bizName, setBizName] = useState("")
  const [bio, setBio] = useState("")
  const [category, setCategory] = useState("")
  const [province, setProvince] = useState("")
  const [city, setCity] = useState("")

  const [fatherName, setFatherName] = useState("")
  const [nationalId, setNationalId] = useState("")
  const [idDay, setIdDay] = useState("")
  const [idMonth, setIdMonth] = useState("")
  const [idYear, setIdYear] = useState("")
  const [idEmail, setIdEmail] = useState("")
  const [idFront, setIdFront] = useState(false)
  const [idBack, setIdBack] = useState(false)

  const [companyName, setCompanyName] = useState("")
  const [licenseNo, setLicenseNo] = useState("")
  const [isicCode, setIsicCode] = useState("")
  const [issueDay, setIssueDay] = useState("")
  const [issueMonth, setIssueMonth] = useState("")
  const [issueYear, setIssueYear] = useState("")
  const [ceoFirst, setCeoFirst] = useState("")
  const [ceoLast, setCeoLast] = useState("")
  const [ceoNationalId, setCeoNationalId] = useState("")
  const [ceoDay, setCeoDay] = useState("")
  const [ceoMonth, setCeoMonth] = useState("")
  const [ceoYear, setCeoYear] = useState("")
  const [ceoMobile, setCeoMobile] = useState("")
  const [ceoEmail, setCeoEmail] = useState("")
  const [licenseDoc, setLicenseDoc] = useState(false)

  const step0Valid = firstName.trim().length > 0 && lastName.trim().length > 0
  const step1Valid =
    bizName.trim().length > 0 &&
    bio.trim().length > 0 &&
    bio.length <= 100 &&
    category.trim().length > 0 &&
    province.trim().length > 0 &&
    city.trim().length > 0
  const nationalValid =
    fatherName.trim().length > 0 &&
    nationalId.trim().length > 0 &&
    idDay &&
    idMonth &&
    idYear
  const nationalDocsValid = idFront && idBack
  const licenseValid =
    companyName.trim().length > 0 &&
    licenseNo.trim().length > 0 &&
    isicCode.trim().length > 0 &&
    issueDay &&
    issueMonth &&
    issueYear &&
    ceoFirst.trim().length > 0 &&
    ceoLast.trim().length > 0 &&
    ceoNationalId.trim().length > 0 &&
    ceoDay &&
    ceoMonth &&
    ceoYear &&
    ceoMobile.trim().length > 0

  function goBack() {
    switch (step) {
      case "user":
        setStep("landing")
        break
      case "business":
        setStep("user")
        break
      case "identity":
        setStep("business")
        break
      case "national":
        setStep("identity")
        break
      case "national-docs":
        setStep("national")
        break
      case "license":
        setStep("identity")
        break
      case "license-docs":
        setStep("license")
        break
      default:
        navigate(-1)
    }
  }

  if (step === "landing") {
    return (
      <SiteLayout>
        <section className="border-b border-[var(--opacity-dark-8)]">
          <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-[var(--5xl)] px-[var(--page-gutter)] py-[var(--5xl)] lg:flex-row lg:items-center lg:gap-[var(--8xl)] lg:px-[var(--page-gutter-lg)]">
            <div className="w-full max-w-xl space-y-[var(--2xl)] text-right lg:max-w-[560px]">
              <h1 className="text-[length:var(--text-h1)] font-black text-[var(--text-title)]">
                ثبت رایگان کسب و کار
              </h1>
              <p className="text-lg leading-relaxed text-[var(--text-body)]">
                با ثبت‌نام در ایران پلازا، پروفایل کسب‌وکار شما در گوگل، صفحه
                دسته‌بندی‌ها و نتایج جستجو نمایش داده می‌شود و شامل اطلاعات تماس،
                آدرس، تصاویر و لینک شبکه‌های اجتماعی است. ثبت‌نام اولیه کاملاً رایگان
                است و پروفایل شما به مدت ۳۰ روز بدون هزینه نمایش داده می‌شود؛ پس از
                آن می‌توانید با خرید پلن، نمایش آن را ادامه دهید.
              </p>
              <p className="text-base leading-relaxed text-[var(--text-body)]">
                ایران پلازا مرجع معرفی بهترین کسب‌وکارهای شیراز است — از افزایش
                دیده‌شدن در گوگل تا جذب مشتری هدفمند و توسعه برند.
              </p>
              <Button
                type="button"
                size="lg"
                className="gap-2"
                onClick={() => setStep("user")}
              >
                ثبت نام رایگان
                <Image alt="" className="size-6 brightness-0 invert" height={24} src={addIcon} width={24} />
              </Button>
            </div>
            <Image
              alt=""
              className="h-[240px] w-full max-w-[560px] rounded-[var(--radius-xs)] object-cover lg:h-[350px]"
              height={700}
              sizes="(min-width: 1024px) 560px, 100vw"
              src={landingHero}
              width={1120}
            />
          </div>
        </section>

        <div className="hidden lg:block">
          <FreeRegistrationPromo />
          <FaqSection />
        </div>

        <section className="px-[var(--page-gutter)] py-[var(--5xl)] lg:hidden">
          <Button
            type="button"
            size="lg"
            className="w-full gap-2"
            onClick={() => setStep("user")}
          >
            شروع ثبت نام
            <Image alt="" className="size-6 brightness-0 invert" height={24} src={arrowLeft} width={24} />
          </Button>
        </section>
      </SiteLayout>
    )
  }

  if (step === "success") {
    return (
      <SiteLayout showBottomNav={false}>
        <div className="flex min-h-[calc(100svh-80px)] items-center justify-center px-[var(--page-gutter)] py-[var(--7xl)] lg:px-[var(--page-gutter-lg)]">
          <FullScreenAlarm
            variant="success"
            title="ثبت نام شما با موفقیت انجام شد"
            description="اطلاعات شما به زودی بررسی خواهد شد و پس از تایید، پروفایل VIP یکماهه برای شما فعال خواهد شد."
            primaryAction={{
              label: "بازگشت به صفحه خانه",
              to: "/",
              showBackIcon: true,
            }}
            secondaryAction={{
              label: "رفتن به داشبورد",
              to: "/dashboard",
            }}
          />
        </div>
      </SiteLayout>
    )
  }

  return (
    <SiteLayout showFooter={step === "user" || step === "business"} showBottomNav={false}>
      {step === "user" && (
        <StepShell
          step={step}
          title="ثبت رایگان کسب و کار"
          description="اطلاعات کاربری خود را به درستی وارد کنید تا حساب کاربری شما تکمیل شود."
          onBack={goBack}
          footer={
            <Button
              type="button"
              size="lg"
              disabled={!step0Valid}
              className="w-full gap-2 lg:me-auto lg:w-auto"
              onClick={() => step0Valid && setStep("business")}
            >
              <Image alt="" className="size-6" height={24} src={arrowLeft} width={24} />
              تایید اطلاعات و ادامه
            </Button>
          }
        >
          <h2 className="text-right text-xl font-bold text-[var(--text-title)]">
            اطلاعات کاربری
          </h2>
          <Field
            label="نام"
            requiredMark
            placeholder="نام خود را وارد کنید"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Field
            label="نام خانوادگی"
            requiredMark
            placeholder="نام خانوادگی خود را وارد کنید"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Field
            label="شماره موبایل"
            requiredMark
            locked
            defaultValue={LOCKED_MOBILE}
          />
          <Field
            label="ایمیل"
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <DateRow
            label="تاریخ تولد"
            day={day}
            month={month}
            year={year}
            onDay={setDay}
            onMonth={setMonth}
            onYear={setYear}
          />
        </StepShell>
      )}

      {step === "business" && (
        <StepShell
          step={step}
          title="ثبت رایگان کسب و کار"
          description="چند مورد از اطلاعات اصلی کسب و کار خود را وارد کنید تا پروفایل کسب‌وکار شما ایجاد شود."
          onBack={goBack}
          footer={
            <Button
              type="button"
              size="lg"
              disabled={!step1Valid}
              className="w-full gap-2 lg:me-auto lg:w-auto"
              onClick={() => step1Valid && setStep("identity")}
            >
              <Image alt="" className="size-6" height={24} src={arrowLeft} width={24} />
              تایید اطلاعات و احراز هویت
            </Button>
          }
        >
          <h2 className="text-right text-xl font-bold text-[var(--text-title)]">
            اطلاعات کسب و کار
          </h2>
          <Field
            label="نام کسب وکار"
            requiredMark
            placeholder="نام کسب وکار را وارد کنید"
            value={bizName}
            onChange={(e) => setBizName(e.target.value)}
          />
          <div className="space-y-1">
            <label className="block text-right text-lg font-bold text-[var(--input-label)]">
              بیوگرافی
              <span className="text-[var(--danger)]">*</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value.slice(0, 100))}
              rows={3}
              placeholder="یک بیوگرافی کوتاه و مفید از کسب و کار خود بنویسید"
              className="w-full rounded-[var(--radius-xs)] border border-[var(--input-border)] bg-transparent p-[var(--lg)] text-right text-base outline-none placeholder:text-[var(--input-placeholder)] focus:border-[var(--input-border-active)]"
            />
            <p className="text-right text-sm text-[var(--input-label)]">
              حداکثر ۱۰۰ کاراکتر ({bio.length}/۱۰۰)
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-right text-lg font-bold text-[var(--input-label)]">
              زمینه فعالیت <span className="text-[var(--danger)]">*</span>
            </p>
            <label className="flex h-14 w-full items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--input-border)] px-[var(--lg)]">
              <Image alt="" className="size-6" height={24} src={arrowDown} width={24} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-full w-full appearance-none bg-transparent text-right text-base outline-none"
              >
                <option value="">انتخاب کنید</option>
                {homeCategories.map((c) => (
                  <option key={c.label} value={c.label}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Field
            label="استان"
            requiredMark
            placeholder="نام استان خود را وارد کنید"
            value={province}
            onChange={(e) => setProvince(e.target.value)}
          />
          <Field
            label="شهر"
            requiredMark
            placeholder="نام شهر خود را وارد کنید — مثلاً شیراز"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </StepShell>
      )}

      {step === "identity" && (
        <StepShell
          step={step}
          title="احراز هویت"
          description="برای تایید نهایی اطلاعات، احراز هویت را انجام دهید."
          onBack={goBack}
        >
          <div className="flex flex-col gap-[var(--lg)]">
            <IdentityCard
              className="max-w-none"
              title="با کارت ملی"
              description="تصویر کارت ملی و سلفی"
              active={identityMethod === "national"}
              onClick={() => {
                setIdentityMethod("national")
                setStep("national")
              }}
            />
            <IdentityCard
              className="max-w-none"
              title="با پروانه کسب"
              description="شماره آیسیک و پروانه کسب"
              active={identityMethod === "license"}
              onClick={() => {
                setIdentityMethod("license")
                setStep("license")
              }}
            />
          </div>
        </StepShell>
      )}

      {step === "national" && (
        <StepShell
          step={step}
          title="احراز هویت با کارت ملی"
          description="احراز هویت کسب و کار خود را با اطلاعات کارت ملی خود انجام دهید."
          onBack={goBack}
          footer={
            <Button
              type="button"
              size="lg"
              disabled={!nationalValid}
              className="w-full gap-2 lg:me-auto lg:w-auto"
              onClick={() => nationalValid && setStep("national-docs")}
            >
              <Image alt="" className="size-6" height={24} src={arrowLeft} width={24} />
              تایید و بارگذاری تصویر مدارک
            </Button>
          }
        >
          <Field
            label="نام"
            requiredMark
            placeholder="نام خود را وارد کنید"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Field
            label="نام خانوادگی"
            requiredMark
            placeholder="نام خانوادگی خود را وارد کنید"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <Field
            label="نام پدر"
            requiredMark
            placeholder="نام پدر خود را وارد کنید"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
          />
          <Field
            label="کد ملی"
            requiredMark
            placeholder="کد ملی خود را وارد کنید"
            value={nationalId}
            onChange={(e) => setNationalId(e.target.value)}
          />
          <DateRow
            label="تاریخ تولد"
            requiredMark
            day={idDay}
            month={idMonth}
            year={idYear}
            onDay={setIdDay}
            onMonth={setIdMonth}
            onYear={setIdYear}
          />
          <Field
            label="شماره موبایل"
            requiredMark
            locked
            defaultValue={LOCKED_MOBILE}
          />
          <Field
            label="ایمیل"
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            value={idEmail}
            onChange={(e) => setIdEmail(e.target.value)}
          />
        </StepShell>
      )}

      {step === "national-docs" && (
        <StepShell
          step={step}
          title="بارگذاری تصویر مدارک"
          description="تصاویر خواسته شده از مدارک را بگیرید و آپلود کنید."
          onBack={goBack}
          footer={
            <Button
              type="button"
              size="lg"
              disabled={!nationalDocsValid}
              className="w-full gap-2 lg:me-auto lg:w-auto"
              onClick={() => nationalDocsValid && setStep("success")}
            >
              <Image alt="" className="size-6" height={24} src={arrowLeft} width={24} />
              تایید و ارسال مدارک
            </Button>
          }
        >
          <p className="text-right text-lg font-bold text-[var(--input-label)]">
            تصویر کارت ملی<span className="text-[var(--danger)]">*</span>
          </p>
          <div className="grid grid-cols-2 gap-[var(--lg)]">
            <UploadSlot
              label="روی کارت ملی"
              filled={idFront}
              onToggle={() => setIdFront((v) => !v)}
            />
            <UploadSlot
              label="پشت کارت ملی"
              filled={idBack}
              onToggle={() => setIdBack((v) => !v)}
            />
          </div>
        </StepShell>
      )}

      {step === "license" && (
        <StepShell
          step={step}
          title="احراز هویت با پروانه کسب"
          description="احراز هویت کسب و کار خود را با اطلاعات پروانه کسب خود انجام دهید."
          onBack={goBack}
          footer={
            <Button
              type="button"
              size="lg"
              disabled={!licenseValid}
              className="w-full gap-2 lg:me-auto lg:w-auto"
              onClick={() => licenseValid && setStep("license-docs")}
            >
              <Image alt="" className="size-6" height={24} src={arrowLeft} width={24} />
              تایید و بارگذاری تصویر مدارک
            </Button>
          }
        >
          <h2 className="text-right text-xl font-bold text-[var(--text-title)]">
            اطلاعات شرکت:
          </h2>
          <Field
            label="نام شرکت"
            requiredMark
            placeholder="نام شرکت خود را وارد کنید"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <Field
            label="شماره پروانه کسب"
            requiredMark
            placeholder="شماره پروانه کسب را وارد کنید"
            value={licenseNo}
            onChange={(e) => setLicenseNo(e.target.value)}
          />
          <Field
            label="کد آیسیک"
            requiredMark
            placeholder="کد آیسیک را وارد کنید"
            value={isicCode}
            onChange={(e) => setIsicCode(e.target.value)}
          />
          <DateRow
            label="تاریخ صدور"
            requiredMark
            day={issueDay}
            month={issueMonth}
            year={issueYear}
            onDay={setIssueDay}
            onMonth={setIssueMonth}
            onYear={setIssueYear}
          />

          <h2 className="pt-[var(--lg)] text-right text-xl font-bold text-[var(--text-title)]">
            اطلاعات مدیرعامل یا نماینده قانونی:
          </h2>
          <Field
            label="نام"
            requiredMark
            placeholder="نام خود را وارد کنید"
            value={ceoFirst}
            onChange={(e) => setCeoFirst(e.target.value)}
          />
          <Field
            label="نام خانوادگی"
            requiredMark
            placeholder="نام خانوادگی خود را وارد کنید"
            value={ceoLast}
            onChange={(e) => setCeoLast(e.target.value)}
          />
          <Field
            label="کد ملی"
            requiredMark
            placeholder="کد ملی خود را وارد کنید"
            value={ceoNationalId}
            onChange={(e) => setCeoNationalId(e.target.value)}
          />
          <DateRow
            label="تاریخ تولد"
            requiredMark
            day={ceoDay}
            month={ceoMonth}
            year={ceoYear}
            onDay={setCeoDay}
            onMonth={setCeoMonth}
            onYear={setCeoYear}
          />
          <Field
            label="شماره موبایل"
            requiredMark
            placeholder="شماره موبایل را وارد کنید"
            value={ceoMobile}
            onChange={(e) => setCeoMobile(e.target.value)}
          />
          <Field
            label="ایمیل"
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            value={ceoEmail}
            onChange={(e) => setCeoEmail(e.target.value)}
          />
        </StepShell>
      )}

      {step === "license-docs" && (
        <StepShell
          step={step}
          title="بارگذاری تصویر مدارک"
          description="تصاویر خواسته شده از مدارک را بگیرید و آپلود کنید."
          onBack={goBack}
          footer={
            <Button
              type="button"
              size="lg"
              disabled={!licenseDoc}
              className="w-full gap-2 lg:me-auto lg:w-auto"
              onClick={() => licenseDoc && setStep("success")}
            >
              <Image alt="" className="size-6" height={24} src={arrowLeft} width={24} />
              تایید و ارسال مدارک
            </Button>
          }
        >
          <p className="text-right text-lg font-bold text-[var(--input-label)]">
            تصویر پروانه کسب <span className="text-[var(--danger)]">*</span>
          </p>
          <UploadSlot
            label="افزودن تصویر پروانه کسب"
            filled={licenseDoc}
            onToggle={() => setLicenseDoc((v) => !v)}
            tall
          />
        </StepShell>
      )}
    </SiteLayout>
  )
}

const dashMenu = dashboardHomeItems

function DashboardPage() {
  return (
    <SiteLayout
      auth="dashboard"
      showFooter={false}
      showHeader={false}
      showBottomNav
      showMobileHeader
    >
      <div className="flex min-h-[calc(100svh-72px)] lg:min-h-svh">
        <DashboardSidebar
          className="sticky top-0 hidden h-svh shrink-0 lg:flex"
          status="free"
        />

        <section className="mx-auto w-full max-w-[960px] flex-1 space-y-4 px-3 pb-10 pt-3 sm:space-y-5 sm:px-5 sm:pb-12 sm:pt-5 lg:px-6 lg:pt-8 xl:px-10">
          <div
            className="rounded-[var(--radius-xs)] px-3 pb-3 sm:px-4 sm:pb-4 lg:hidden"
            style={{
              backgroundImage:
                "linear-gradient(52deg, var(--secondary-300) 0%, var(--secondary-50) 100%)",
            }}
          >
            <div className="flex items-center justify-start gap-3 border-b border-[var(--border-subtle)] py-3 sm:gap-4 sm:py-4">
              <div className="min-w-0 flex-1 text-start">
                <p className="text-base font-bold text-[var(--text-title)] sm:text-lg">
                  علیرضا خلقت
                </p>
                <p className="text-sm text-[var(--text-body)]">۰۹۱۷۴۵۵۰۱۰۸</p>
              </div>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[var(--opacity-dark-16)] sm:size-12">
                <Image alt="" className="size-5 sm:size-6" height={24} src={userIcon} width={24} />
              </div>
            </div>
            <div className="flex items-start justify-between gap-3 py-3 text-sm">
              <span className="text-[var(--danger)]">ثبت نام نشده</span>
              <span className="text-start text-[var(--text-title)]">
                اشتراک پروفایل VIP شما
              </span>
            </div>
            <Link to="/business-registration">
              <Button size="sm" className="w-full gap-2">
                <Image alt="" className="size-5 sm:size-6" height={24} src={addIcon} width={24} />
                ثبت رایگان کسب وکار
              </Button>
            </Link>
          </div>

          <div className="hidden space-y-3 lg:block">
            <h1 className="text-start text-[length:var(--text-h1)] font-black text-[var(--text-title)]">
              داشبورد
            </h1>
            <p className="max-w-xl text-start text-base leading-relaxed text-[var(--text-body)]">
              از منوی کناری بخش مورد نظر را انتخاب کنید. روی دسکتاپ زیرمنوی پروفایل
              و در موبایل همین فهرست در دسترس است.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {dashMenu
                .filter((item) => !("disabled" in item && item.disabled))
                .map((item) => (
                  <Link
                    key={item.title}
                    to={item.to}
                    className="flex items-center gap-3 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-4 transition-colors hover:border-primary-200 hover:bg-secondary-50"
                  >
                    <div className="min-w-0 flex-1 text-start">
                      <p className="font-bold text-[var(--text-title)]">{item.title}</p>
                      <p className="mt-1 text-sm text-[var(--text-body)]">{item.subtitle}</p>
                    </div>
                    <Image alt="" className="size-6 shrink-0" height={24} src={item.icon} width={24} />
                  </Link>
                ))}
            </div>
          </div>

          <nav className="flex flex-col lg:hidden">
            {dashMenu.map((item) => {
              const disabled = "disabled" in item && item.disabled
              const className =
                "flex min-h-16 items-center gap-3 border-b border-[var(--border-subtle)] py-3 sm:min-h-20 sm:gap-4 sm:py-4"
              if (disabled) {
                return (
                  <div key={item.title} className={cn(className, "opacity-40")}>
                    <Image alt="" className="size-4" height={16} src={arrowLeft} width={16} />
                    <span className="min-w-0 flex-1 text-start">
                      <span className="block text-base font-bold text-[var(--text-title)] sm:text-lg">
                        {item.title}
                      </span>
                      <span className="block text-sm text-[var(--text-body)]">
                        {item.subtitle}
                      </span>
                    </span>
                    <Image alt="" className="size-6" height={24} src={item.icon} width={24} />
                  </div>
                )
              }
              return (
                <Link key={item.title} to={item.to} className={className}>
                  <Image alt="" className="size-4" height={16} src={arrowLeft} width={16} />
                  <span className="min-w-0 flex-1 text-start">
                    <span className="block text-base font-bold text-[var(--text-title)] sm:text-lg">
                      {item.title}
                    </span>
                    <span className="block text-sm text-[var(--text-body)]">
                      {item.subtitle}
                    </span>
                  </span>
                  <Image alt="" className="size-6" height={24} src={item.icon} width={24} />
                </Link>
              )
            })}
            <Link
              to={dashboardLogoutItem.to}
              className="flex min-h-16 items-center gap-3 py-3 sm:min-h-20 sm:gap-4 sm:py-4"
            >
              <Image alt="" className="size-4" height={16} src={arrowLeft} width={16} />
              <span className="min-w-0 flex-1 text-start">
                <span className="block text-base font-bold text-[var(--text-title)] sm:text-lg">
                  {dashboardLogoutItem.title}
                </span>
                <span className="block text-sm text-[var(--text-body)]">
                  {dashboardLogoutItem.subtitle}
                </span>
              </span>
              <Image
                alt=""
                className="size-6"
                height={24}
                src={dashboardLogoutItem.icon}
                width={24}
              />
            </Link>
          </nav>
        </section>
      </div>
    </SiteLayout>
  )
}

export { BusinessRegistrationPage, DashboardPage }
