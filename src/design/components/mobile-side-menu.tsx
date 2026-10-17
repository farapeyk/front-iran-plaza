"use client"
import Image from "next/image";

import { Link, useLocation } from "@/design/navigation"
import { useDesignUser } from '@/design/provider'
import { cn } from "@/design/lib/utils"
import { useModalFocus } from "@/design/lib/use-modal-focus"
import { Logo } from "@/design/components/logo"
import { Button } from "@/design/components/ui/button"
const homeIcon = "/design/icons/home-2.svg"
const categoriesIcon = "/design/icons/element-3.svg"
const briefcaseIcon = "/design/icons/briefcase.svg"
const bookIcon = "/design/icons/book.svg"
const questionIcon = "/design/icons/question.svg"
const callIcon = "/design/icons/call.svg"
const flagIcon = "/design/icons/flag.svg"
const shieldIcon = "/design/icons/shield-tick.svg"
const arrowLeft = "/design/icons/arrow-left.svg"
const userBold = "/design/icons/user-bold.svg"
const looper1 = "/design/icons/menu-looper.svg"
const looper2 = "/design/icons/menu-looper-2.svg"
const closeIcon = "/design/icons/close-x.svg"

type MenuAuth = "logout" | "login" | "member"

type MobileSideMenuProps = {
  open: boolean
  onClose: () => void
  auth?: MenuAuth
  userName?: string
  userPhone?: string
}

const primaryLinks = [
  { title: "خانه", to: "/", icon: homeIcon },
  { title: "دسته بندی کسب وکارها", to: "/categories", icon: categoriesIcon },
  { title: "ثبت رایگان کسب و کار", to: "/business-registration", icon: briefcaseIcon },
  { title: "مقالات", to: "/articles", icon: bookIcon },
] as const

const secondaryLinks = [
  { title: "سوالات متداول", to: "/faq", icon: questionIcon },
  { title: "تماس با ما", to: "/contact", icon: callIcon },
  { title: "درباره ما", to: "/about", icon: flagIcon },
  { title: "قوانین و مقررات", to: "/terms", icon: shieldIcon },
] as const

function MenuLink({
  title,
  to,
  icon,
  active,
  onClick,
}: {
  title: string
  to: string
  icon: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex h-16 w-full items-center justify-start gap-4 rounded-lg px-4 text-xl font-bold text-[var(--text-light-title)]",
        active && "bg-[var(--opacity-light-16)]"
      )}
    >
      <Image alt="" className="size-8 shrink-0 brightness-0 invert opacity-70" height={32} src={icon} width={32} />
      <span>{title}</span>
    </Link>
  )
}

function MobileSideMenu({
  open,
  onClose,
  auth = "logout",
  userName: suppliedName,
  userPhone: suppliedPhone,
}: MobileSideMenuProps) {
  const { pathname } = useLocation()
  const user=useDesignUser()
  const userName=suppliedName??user?.fullName??'حساب کاربری'
  const userPhone=suppliedPhone??user?.phone??''
  const isLoggedIn = auth === "login" || auth === "member"
  const modalRef = useModalFocus(open, onClose)

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "pointer-events-auto" : "pointer-events-none"
      )}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="بستن منو با لمس پس‌زمینه"
        className={cn(
          "absolute inset-0 bg-[var(--opacity-dark-32)] transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "absolute inset-y-0 right-0 flex w-full flex-col overflow-y-auto overflow-x-hidden px-6 pb-12 pt-20 text-[var(--text-light-title)] transition-transform duration-300 ease-out sm:px-8",
          open ? "translate-x-0" : "translate-x-full"
        )}
        style={{
          backgroundImage:
            "linear-gradient(200.57deg, var(--primary-950) 0%, var(--primary-600) 100%)",
        }}
        role="dialog"
        aria-modal="true"
        aria-label="منوی اصلی"
      >
        <button
          type="button"
          aria-label="بستن منو"
          onClick={onClose}
          className="absolute right-5 top-5 z-20 flex size-12 items-center justify-center rounded-full border border-[var(--opacity-light-32)] bg-[var(--opacity-light-16)] transition-colors hover:bg-[var(--opacity-light-32)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <Image
            alt=""
            className="size-6 brightness-0 invert"
            height={24}
            src={closeIcon}
            width={24}
          />
        </button>

        <div className="relative z-10 mx-auto flex w-full max-w-[520px] flex-col gap-12">
          <div
            className={cn(
              "flex w-full flex-col items-center gap-5 pt-2"
            )}
          >
            <div className="flex w-full flex-col items-center gap-3">
              <Logo variant="secondary" to="/" className="h-auto w-[190px]" />
              <p className="text-lg text-[var(--text-light-title)]">مرجع معرفی بهترین کسب و کارها</p>
            </div>

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                onClick={onClose}
                className="flex h-16 w-full items-center gap-2 rounded border border-[var(--opacity-light-32)] p-3"
              >
                <Image alt="" className="size-4 shrink-0 invert" height={16} src={arrowLeft} width={16} />
                <span className="min-w-0 flex-1 text-right text-sm text-[var(--text-light-title)]">
                  <span className="block font-bold">{userName}</span>
                  <span className="block">{userPhone}</span>
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-700">
                  <Image alt="" className="size-4" height={16} src={userBold} width={16} />
                </span>
              </Link>
            ) : (
              <Link to="/login" onClick={onClose}>
                <Button variant="white" size="lg" className="h-14 w-[210px] text-xl">
                  ورود / ثبت نام
                </Button>
              </Link>
            )}
          </div>

          <nav
            className={cn(
              "flex w-full flex-col gap-1 border-[var(--opacity-light-16)]",
              isLoggedIn ? "border-b pb-6" : "border-y py-6"
            )}
          >
            {primaryLinks.map((link) => (
              <MenuLink
                key={link.to}
                {...link}
                active={
                  link.to === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.to)
                }
                onClick={onClose}
              />
            ))}
          </nav>

          <nav className="flex w-full flex-col gap-1">
            {secondaryLinks.map((link) => (
              <MenuLink key={link.title} {...link} onClick={onClose} />
            ))}
          </nav>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-[220px] w-[230px] opacity-20">
          <Image
            alt=""
            className="absolute left-0 top-0 w-[220px] rotate-[4deg]"
            height={320}
            src={looper1}
            width={320}
          />
          <Image
            alt=""
            className="absolute left-2 top-10 w-[205px] -rotate-[176deg]"
            height={320}
            src={looper2}
            width={320}
          />
        </div>
      </aside>
    </div>
  )
}

export { MobileSideMenu }
export type { MenuAuth }
