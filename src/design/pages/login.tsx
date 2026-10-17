"use client"
import Image from "next/image";

import { useEffect, useState, useTransition, useId } from "react"
import { requestOtpAction } from "@/features/auth/actions/request-otp.action"
import { verifyOtpAction } from "@/features/auth/actions/verify-otp.action"
import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { Button } from "@/design/components/ui/button"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { MobileHeader } from "@/design/components/mobile-header"
const loginSide = "/design/login/side.webp"
const arrowRight = "/design/icons/arrow-right-ltr.svg"
const timerIcon = "/design/icons/timer.svg"
const infoCircle = "/design/icons/info-circle.svg"

type Step = "phone" | "otp"
function normalizeDigits(value: string) { return value.replace(/[۰-۹]/g, digit => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))).replace(/[٠-٩]/g, digit => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))) }
function normalizePhone(value: string) { const digits=normalizeDigits(value).replace(/\D/g,''); return (digits.startsWith('0098')&&digits.length===14?'0'+digits.slice(4):digits.startsWith('98')&&digits.length===12?'0'+digits.slice(2):digits).slice(0,11) }

function LoginPage() {
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState("")
  const [step, setStep] = useState<Step>("phone")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const [error, setError] = useState(false)
  const [seconds, setSeconds] = useState(0)

  const normalizedPhone = phone.startsWith("0") ? phone : "0" + phone
  const phoneReady = /^09\d{9}$/.test(normalizedPhone) && seconds <= 0
  const otpValue = otp.join("")
  const otpReady = otpValue.length === 5
  const canResend = seconds <= 0

  useEffect(() => {
    if (seconds <= 0) return
    const id = window.setInterval(() => setSeconds((s) => s - 1), 1000)
    return () => window.clearInterval(id)
  }, [step, seconds])
  useEffect(()=>{if(step==='otp')Array.from(document.querySelectorAll<HTMLInputElement>('[data-otp-index="0"]')).find(input=>input.getClientRects().length>0)?.focus();},[step])

  const onOtpChange = (index: number, value: string) => {
    const digits=normalizeDigits(value).replace(/\D/g,'')
    if(digits.length>1){const next=[...otp];digits.slice(0,5-index).split('').forEach((digit,offset)=>{next[index+offset]=digit});setOtp(next);setError(false);return;}
    const digit = normalizeDigits(value).replace(/\D/g, "").slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)
    setError(false)
    if (digit && index < 4) {
      Array.from(document.querySelectorAll<HTMLInputElement>(`[data-otp-index="${index + 1}"]`)).find(input => input.getClientRects().length > 0)?.focus()
    }
  }

  const submitPhone = () => {
    if (!phoneReady || pending) return
    startTransition(async () => {
      const result = await requestOtpAction({ phone: normalizedPhone })
      if (!result.success) { setMessage(result.message); if(result.cooldownSeconds) setSeconds(result.cooldownSeconds); return }
      setMessage(result.debugCode ? `کد آزمایشی محیط لوکال: ${result.debugCode}` : ""); setOtp(["", "", "", "", ""]); setError(false)
      setSeconds(result.cooldownSeconds); setStep("otp")
    })
  }

  const submitOtp = () => {
    if (!otpReady || pending) return
    startTransition(async () => {
      const result = await verifyOtpAction({ phone: normalizedPhone, code: otpValue })
      if (!result.success) { setError(true); setMessage(result.message) }
    })
  }

  const resend = () => {
    if (!canResend) return
    submitPhone()
  }

  const timerLabel = `${String(Math.floor(Math.max(seconds, 0) / 60)).padStart(2, "0")}:${String(
    Math.max(seconds, 0) % 60
  ).padStart(2, "0")}`

  return (
    <div className="min-h-dvh bg-[var(--main-bg)]" aria-busy={pending}>
      {message && <p role="alert" className="p-4 text-center text-[var(--danger)]">{message}</p>}
      {step==='phone'&&seconds>0&&<p role="status" className="p-4 text-center">ارسال مجدد کد پس از {seconds} ثانیه</p>}
      {/* Mobile */}
      <div className="flex min-h-dvh flex-col min-[700px]:hidden">
        <MobileHeader />
        <div className="flex flex-1 flex-col justify-between px-[var(--2xl)] pb-[var(--2xl)] pt-[var(--9xl)]">
          <LoginForm
            step={step}
            phone={phone}
            setPhone={setPhone}
            otp={otp}
            onOtpChange={onOtpChange}
            error={error}
            onBack={() => setStep("phone")}
            timerLabel={timerLabel}
            canResend={canResend}
            onResend={resend}
          />
          <LoginActions
            step={step}
            phoneReady={phoneReady && !pending}
            otpReady={otpReady && !pending}
            onSubmitPhone={submitPhone}
            onSubmitOtp={submitOtp}
          />
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden min-h-dvh items-center justify-center p-[var(--sm)] min-[700px]:flex">
        <div dir="ltr" className="flex w-full max-w-[754px] items-center gap-[var(--5xl)] rounded-[var(--radius-xs)] bg-[var(--main-bg)] pe-[var(--5xl)]">
          <div className="h-[584px] w-[350px] shrink-0 overflow-hidden rounded-[var(--radius-xs)] bg-primary-800">
            <Image
              alt=""
              className="size-full object-cover"
              height={584}
              src={loginSide}
              width={350}
            />
          </div>
          <div dir="rtl" className="flex w-[300px] flex-col gap-[var(--5xl)]">
            <LoginForm
              step={step}
              phone={phone}
              setPhone={setPhone}
              otp={otp}
              onOtpChange={onOtpChange}
              error={error}
              onBack={() => setStep("phone")}
              timerLabel={timerLabel}
              canResend={canResend}
              onResend={resend}
              compact
            />
            <LoginActions
              step={step}
              phoneReady={phoneReady && !pending}
              otpReady={otpReady && !pending}
              onSubmitPhone={submitPhone}
              onSubmitOtp={submitOtp}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function LoginForm({
  step,
  phone,
  setPhone,
  otp,
  onOtpChange,
  error,
  onBack,
  timerLabel,
  canResend,
  onResend,
  compact,
}: {
  step: Step
  phone: string
  setPhone: (v: string) => void
  otp: string[]
  onOtpChange: (i: number, v: string) => void
  error: boolean
  onBack: () => void
  timerLabel: string
  canResend: boolean
  onResend: () => void
  compact?: boolean
}) {
  const inputPrefix = useId()
  if (step === "otp") {
    const displayPhone = `09${phone.replace(/\D/g, "").slice(-9)}`
    const filled = otp.every(Boolean)
    const activeIndex = otp.findIndex((x) => !x)
    return (
      <div className="flex w-full flex-col items-start gap-[var(--2xl)]">
        <button
          type="button"
          onClick={onBack}
          aria-label="بازگشت"
          className={cn(
            buttonVariants({ variant: "outline", size: "icon" }),
            "border-[var(--border-default)] bg-transparent"
          )}
        >
          <Image alt="" className="size-6" height={24} src={arrowRight} width={24} />
        </button>

        <div className="flex w-full flex-col gap-[var(--lg)]">
          <div className="flex flex-col gap-[var(--xs)] text-right">
            <h1 className="h-9 text-[length:var(--text-title-2)] font-black leading-[1.5] text-[var(--text-title)]">
              ورود / ثبت نام
            </h1>
            <p className="text-[length:var(--text-body-5)] leading-relaxed text-[var(--text-body)]">
              کد ۵ رقمی ارسال شده به شماره {displayPhone} را وارد کنید.
            </p>
          </div>

          <div className="flex w-full gap-[var(--md)]" dir="ltr">
            {otp.map((d, i) => (
              <input
                key={i}
                id={`${inputPrefix}-otp-${i}`}
                data-otp-index={i}
                aria-label={`رقم ${i + 1} کد تأیید`}
                autoComplete={i === 0 ? "one-time-code" : "off"}
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => onOtpChange(i, e.target.value)}
                onPaste={event=>{event.preventDefault();onOtpChange(i,event.clipboardData.getData('text'))}}
                onKeyDown={event=>{if(event.key==='Backspace'&&!d&&i>0)Array.from(document.querySelectorAll<HTMLInputElement>(`[data-otp-index="${i-1}"]`)).find(input=>input.getClientRects().length>0)?.focus()}}
                className={cn(
                  "h-[var(--button-xl)] min-w-0 flex-1 rounded-[var(--radius-xs)] text-center text-[length:var(--text-label-3)] font-bold text-[var(--input-value)] outline-none",
                  compact && "size-12 flex-none",
                  error
                    ? "border-2 border-[var(--input-border-danger)]"
                    : i === activeIndex || (filled && i === 4)
                      ? "border-2 border-[var(--input-border-active)]"
                      : "border border-[var(--input-border)]"
                )}
              />
            ))}
          </div>

          {error && (
            <p className="flex items-center justify-start gap-[var(--sm)] text-sm text-[var(--danger)]">
              کد وارد شده صحیح نمی باشد
              <Image alt="" className="size-6" height={24} src={infoCircle} width={24} />
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onResend}
          disabled={!canResend}
          className={cn(
            buttonVariants({ variant: "light", size: "sm" }),
            "gap-2 bg-[var(--input-disabled-bg)] text-[var(--text-body)] disabled:opacity-100"
          )}
        >
          {canResend ? "ارسال مجدد کد" : timerLabel}
          <Image alt="" className="size-6" height={24} src={timerIcon} width={24} />
        </button>
      </div>
    )
  }

  return (
    <div className="flex w-full flex-col gap-[var(--lg)]">
      <div className="flex flex-col gap-[var(--xs)] text-right">
        <h1 className="h-9 text-[length:var(--text-title-2)] font-black leading-[1.5] text-[var(--text-title)]">
          ورود / ثبت نام
        </h1>
        <p className="text-[length:var(--text-body-5)] leading-relaxed text-[var(--text-body)]">
          برای ادامه شماره موبایل خود را وارد کنید.
        </p>
      </div>
      <label dir="ltr" className="flex h-[var(--button-xl)] items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--input-border)] px-[var(--lg)]">
        <span dir="ltr" className="border-e border-[var(--border-strong)] pe-[var(--lg)] [font-family:Arial,sans-serif] text-[length:var(--text-label-3)] font-bold text-[var(--input-value)]">
          +98
        </span>
        <input
          dir="rtl"
          type="tel"
          inputMode="numeric"
          placeholder="شماره موبایل"
          value={phone}
          aria-label="شماره موبایل"
          autoComplete="tel-national"
          onChange={(e) => setPhone(normalizePhone(e.target.value))}
          className="min-w-0 flex-1 bg-transparent text-right text-[length:var(--text-label-3)] text-[var(--input-value)] outline-none placeholder:text-[var(--input-placeholder)]"
        />
      </label>
    </div>
  )
}

function LoginActions({
  step,
  phoneReady,
  otpReady,
  onSubmitPhone,
  onSubmitOtp,
}: {
  step: Step
  phoneReady: boolean
  otpReady: boolean
  onSubmitPhone: () => void
  onSubmitOtp: () => void
}) {
  const ready = step === "phone" ? phoneReady : otpReady
  return (
    <div className="flex w-full flex-col gap-[var(--lg)]">
      <Button
        type="button"
        className="w-full"
        disabled={!ready}
        onClick={step === "phone" ? onSubmitPhone : onSubmitOtp}
      >
        {step === "phone" ? "تایید و دریافت کد" : "تایید کد"}
      </Button>
      <p className="text-center text-sm leading-relaxed text-[var(--text-body)]">
        ورود / ثبت‌نام شما به منزله‌ پذیرفتن{" "}
        <Link to="/terms" className="text-[var(--link)] underline">
          قوانین و مقررات
        </Link>{" "}
        می‌باشد.
      </p>
    </div>
  )
}

export { LoginPage }
