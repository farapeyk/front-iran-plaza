"use client"
import Image from "next/image";

import { Link } from "@/design/navigation"
import type { ImgHTMLAttributes, ReactNode } from "react"
import { useState } from "react"
import { cn } from "@/design/lib/utils"
import { Logo } from "@/design/components/logo"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { FooterSocialIcon } from "@/design/components/footer-social-icon"
import { useCategories } from '@/design/api/catalog'
const callIcon = "/design/icons/call.svg"
const arrowDown = "/design/icons/arrow-down.svg"
const samandehi = "/design/shared/samandehi.webp"
const enamadCode = "nvxOEnp57ndUasGvqyFejdrGnRPqExqe"
const enamadImageAttributes = {
  code: enamadCode,
} as unknown as ImgHTMLAttributes<HTMLImageElement>

function EnamadSeal() {
  return (
    <a
      referrerPolicy="origin"
      target="_blank"
      href={`https://trustseal.enamad.ir/?id=752601&Code=${enamadCode}`}
      aria-label="مشاهده نماد اعتماد الکترونیکی ایران پلازا"
      className="flex h-full w-full items-center justify-center"
    >
      <img
        {...enamadImageAttributes}
        referrerPolicy="origin"
        src={`https://trustseal.enamad.ir/logo.aspx?id=752601&Code=${enamadCode}`}
        alt=""
        className="max-h-full max-w-full object-contain"
        style={{ cursor: "pointer" }}
      />
    </a>
  )
}

const iranPlazaLinks = [
  { label: "خانه", to: "/" },
  { label: "ثبت رایگان کسب و کار", to: "/business-registration" },
  { label: "مقالات", to: "/articles" },
  { label: "سوالات متداول", to: "/faq" },
  { label: "تماس با ما", to: "/contact" },
  { label: "درباره ما", to: "/about" },
  { label: "قوانین و مقررات", to: "/terms" },
]

const socials = [
  { name: "X" as const, href: "#" },
  { name: "Telegram" as const, href: "#" },
  { name: "Instagram" as const, href: "#" },
  { name: "Whatsapp" as const, href: "#" },
]

function FooterLink({ label, to = "#" }: { label: string; to?: string }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-sm text-secondary-100 transition-colors hover:text-[var(--text-light-title)]"
    >
      <span className="size-1.5 shrink-0 rotate-45 bg-secondary-400" aria-hidden />
      <span>{label}</span>
    </Link>
  )
}

function FooterAccordion({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-full border-b border-[var(--opacity-light-8)]">
      <button
        type="button"
        className="flex h-16 w-full items-center justify-between"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-lg font-bold text-[var(--text-light-title)]">{title}</span>
        <span
          className={cn(
            "size-6 overflow-clip transition-transform",
            open && "rotate-180"
          )}
        >
          <Image alt="" className="size-full" height={24} src={arrowDown} width={24} />
        </span>
      </button>
      {open ? <div className="space-y-3 pb-4">{children}</div> : null}
    </div>
  )
}

function SiteFooter({ className }: { className?: string }) {
  const {categories}=useCategories()
  const names=categories.filter(category=>!category.parentId).map(category=>category.name)
  const groupSize=Math.max(1,Math.ceil(names.length/3))
  const businessLinksCol1=names.slice(0,groupSize),businessLinksCol2=names.slice(groupSize,groupSize*2),businessLinksCol3=names.slice(groupSize*2)
  const categoryHref=(name:string)=>'/businesses?categoryId='+encodeURIComponent(categories.find(category=>!category.parentId&&category.name===name)?.id??'')
  return (
    <footer className={cn("w-full overflow-hidden bg-gradient-to-br from-primary-950 via-primary-950 to-primary-700", className)}>
      {/* Registration strip */}
      <div className="flex items-center justify-between gap-4 bg-secondary-100 px-[var(--page-gutter)] py-4 lg:px-[var(--page-gutter-lg)]">
        <div className="text-start">
          <p className="text-lg font-black text-primary-950">ثبت رایگان کسب و کار</p>
          <p className="text-sm text-[var(--text-title)] lg:hidden">
            پروفایل رایگان برای معرفی کسب‌وکار شما
          </p>
        </div>
        <div className="hidden text-center text-sm text-[var(--text-title)] lg:block">
          پروفایل رایگان برای معرفی کسب‌وکار شما
        </div>
        <Link
          to="/business-registration"
          className={buttonVariants({ size: "sm" })}
        >
          ثبت نام رایگان
        </Link>
      </div>

      {/* Desktop */}
      <div className="mx-auto hidden max-w-[1440px] px-[var(--page-gutter-lg)] py-16 lg:block">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr] gap-10">
          <div className="space-y-4 text-right">
            <Logo variant="secondary" to="/" className="me-auto" />
            <p className="text-base text-[var(--text-light-title)]">مرجع معرفی بهترین کسب وکارها</p>
            <div className="flex justify-start gap-1">
              {socials.map((s) => (
                <FooterSocialIcon
                  key={s.name}
                  name={s.name}
                  href={s.href}
                  variant="contained"
                />
              ))}
            </div>
            <div className="space-y-1 pt-2">
              <p className="text-sm text-secondary-200">پشتیبانی :</p>
              <Link
                to="/dashboard/support"
                className="inline-flex items-center gap-2 text-lg text-secondary-100"
              >
                پشتیبانی
                <span className="size-4 overflow-clip">
                  <Image alt="" className="size-full" height={16} src={callIcon} width={16} />
                </span>
              </Link>
            </div>
          </div>

          <div className="space-y-3 text-right">
            <h3 className="mb-4 text-lg font-bold text-[var(--text-light-title)]">ایران پلازا</h3>
            {iranPlazaLinks.map((l) => (
              <FooterLink key={l.label} {...l} />
            ))}
          </div>

          <div className="space-y-3 text-right">
            <h3 className="mb-4 text-lg font-bold text-[var(--text-light-title)]">کسب و کارها</h3>
            {businessLinksCol1.map((label) => (
              <FooterLink key={label} label={label} to={categoryHref(label)} />
            ))}
          </div>

          <div className="space-y-3 pt-11 text-right">
            {[...businessLinksCol2, ...businessLinksCol3].map((label) => (
              <FooterLink key={label} label={label} to={categoryHref(label)} />
            ))}
          </div>
        </div>

        <div className="mt-12 flex items-start justify-between gap-8 border-t border-[var(--opacity-light-8)] pt-8">
          <div className="flex gap-4">
            <div className="flex size-24 items-center justify-center rounded border border-[var(--opacity-light-8)] bg-[var(--opacity-light-8)] p-3">
              <EnamadSeal />
            </div>
            <div className="flex size-24 items-center justify-center rounded border border-[var(--opacity-light-8)] bg-[var(--opacity-light-8)] p-3">
              <Image alt="ساماندهی" className="max-h-full max-w-full object-contain" src={samandehi} width={96} height={96} sizes="96px" />
            </div>
          </div>
          <p className="max-w-2xl text-right text-base leading-relaxed text-secondary-100">
            ایران پلازا یک پلتفرم آنلاین برای معرفی کسب‌وکارها، خدمات و برندهای ایرانی است.
            شما می‌توانید کسب‌وکار خود را به‌صورت رایگان ثبت کنید و در معرض دید مخاطبان بیشتر
            قرار بگیرید.
          </p>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col items-center px-[var(--page-gutter)] pb-6 pt-16 lg:hidden">
        <Logo variant="secondary" to="/" className="h-7 w-[146px]" />
        <p className="mt-4 text-center text-lg text-[var(--text-light-title)]">
          مرجع معرفی بهترین کسب وکارها
        </p>
        <div className="mt-4 flex gap-1">
          {socials.map((s) => (
            <FooterSocialIcon
              key={s.name}
              name={s.name}
              href={s.href}
              variant="contained"
            />
          ))}
        </div>

        <div className="mt-6 w-full">
          <FooterAccordion title="ایران پلازا">
            {iranPlazaLinks.map((l) => (
              <FooterLink key={l.label} {...l} />
            ))}
          </FooterAccordion>
          <FooterAccordion title="کسب وکارها">
            {[...businessLinksCol1, ...businessLinksCol2, ...businessLinksCol3].map(
              (label) => (
                <FooterLink key={label} label={label} to={categoryHref(label)} />
              )
            )}
          </FooterAccordion>
        </div>

        <div className="mt-6 w-full space-y-4 text-right">
          <p className="line-clamp-4 text-base leading-relaxed text-secondary-100">
            ایران پلازا یک پلتفرم آنلاین برای معرفی کسب‌وکارها، خدمات و برندهای ایرانی است.
          </p>
          <div className="space-y-1">
            <p className="text-sm text-secondary-200">پشتیبانی :</p>
            <Link to="/dashboard/support" className="inline-flex items-center gap-2 text-lg text-secondary-100">
              پشتیبانی
              <span className="size-4 overflow-clip">
                <Image alt="" className="size-full" height={16} src={callIcon} width={16} />
              </span>
            </Link>
          </div>
          <div className="flex gap-4">
            <div className="flex h-28 flex-1 items-center justify-center rounded border border-[var(--opacity-light-8)] p-4">
              <EnamadSeal />
            </div>
            <div className="flex h-28 flex-1 items-center justify-center rounded border border-[var(--opacity-light-8)] p-4">
              <Image alt="ساماندهی" className="max-h-full object-contain" src={samandehi} width={112} height={112} sizes="50vw" />
            </div>
          </div>
        </div>
      </div>

      <p className="border-t border-[var(--opacity-light-8)] px-[var(--page-gutter)] py-6 text-center text-base text-secondary-100">
        تمامی حقوق برای{" "}
        <span className="text-[var(--text-light-title)] underline">ایران پلازا</span> محفوظ است ©
      </p>
    </footer>
  )
}

export { SiteFooter }
