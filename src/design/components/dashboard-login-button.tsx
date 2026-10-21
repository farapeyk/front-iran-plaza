"use client"
import Image from "next/image";

import { useState } from "react"
import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { UserAvatar } from "@/design/components/user-avatar"
import { useDesignBusiness, useDesignUser } from '@/design/provider'
const arrowDown = "/design/icons/arrow-down.svg"
const addIcon = "/design/icons/add.svg"
const briefcase = "/design/icons/briefcase.svg"
const userIcon = "/design/icons/user.svg"
const award = "/design/icons/award.svg"
const card = "/design/icons/card.svg"
const headphone = "/design/icons/headphone.svg"
const profile2user = "/design/icons/profile-2user.svg"
const logout = "/design/icons/logout.svg"

type MenuItem = {
  label: string
  icon: string
  to?: string
  danger?: boolean
}

const MENU_ITEMS: MenuItem[] = [
  { label: "پروفایل من", icon: briefcase, to: "/dashboard" },
  { label: "اطلاعات حساب کاربری", icon: userIcon, to: "/user-info" },
  { label: "خرید اشتراک VIP", icon: award, to: "/subscription" },
  { label: "پرداخت ها", icon: card, to: "/payments" },
  { label: "پشتیبانی", icon: headphone, to: "/support" },
  { label: "دعوت دوستان (به زودی)", icon: profile2user },
  { label: "خروج از حساب", icon: logout, danger: true, to: "/logout" },
]

type DashboardLoginButtonProps = {
  className?: string
  phone?: string
  name?: string
  vipStatus?: string
  defaultOpen?: boolean
}

/** Figma login button (dashboard) — avatar trigger + account dropdown */
function DashboardLoginButton({
  className,
  phone: suppliedPhone,
  name: suppliedName,
  vipStatus = "ثبت نام نشده",
  defaultOpen = false,
}: DashboardLoginButtonProps) {
  const [open, setOpen] = useState(defaultOpen)
  const user=useDesignUser()
  const business=useDesignBusiness()
  const phone=suppliedPhone??user?.phone??''
  const name=suppliedName??user?.fullName??'حساب کاربری'

  return (
    <div
      data-slot="dashboard-login-button"
      className={cn("relative inline-flex flex-col items-start", className)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 items-center gap-2 rounded-full border-2 border-[var(--btn-black-outline)] pe-2 ps-4"
      >
        <Image
          alt=""
          className={cn("size-4 transition-transform", open && "rotate-180")}
          height={16}
          src={arrowDown}
          width={16}
        />
        <span className="pt-0.5 text-lg font-bold text-[var(--btn-black-outline-label)]">
          {phone}
        </span>
        <UserAvatar size={32} />
      </button>

      {open ? (
        <div className="absolute start-0 top-[52px] z-50 flex w-[300px] flex-col gap-[var(--sm)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] bg-[var(--surface)] p-[var(--lg)] shadow-[var(--shadow-md)]">
          <div
            className="flex w-full flex-col rounded-[var(--radius-xs)] px-[var(--lg)] pb-[var(--lg)]"
            style={{
              backgroundImage:
                "linear-gradient(245deg, var(--secondary-50) 0%, var(--secondary-300) 100%)",
            }}
          >
            <div className="flex items-center justify-start gap-[var(--md)] border-b border-[var(--opacity-dark-8)] py-[var(--lg)]">
              <div className="flex min-w-0 flex-1 flex-col items-start text-right">
                <p className="w-full text-lg font-bold text-[var(--text-title)]">{name}</p>
                <p className="w-full text-sm text-[var(--text-subtitle)]">{phone}</p>
              </div>
              <UserAvatar size={48} />
            </div>
            <div className="flex items-start justify-between py-[var(--md)] text-sm">
              <span className="text-[var(--text-danger)]">{vipStatus}</span>
              <span className="text-[var(--text-title)]">اشتراک پروفایل VIP شما</span>
            </div>
            {!business ? (
              <Link
                to="/business-registration"
                className={cn(buttonVariants({ size: "sm" }), "w-full")}
                onClick={() => setOpen(false)}
              >
                ثبت رایگان کسب وکار
                <Image
                  alt=""
                  className="size-6 brightness-0 invert"
                  height={24}
                  src={addIcon}
                  width={24}
                />
              </Link>
            ) : null}
          </div>

          <nav className="flex w-full flex-col">
            {MENU_ITEMS.map((item) => {
              const content = (
                <>
                  <span
                    className={cn(
                      "min-w-0 flex-1 text-right text-base font-bold",
                      item.danger ? "text-[var(--text-danger)]" : "text-[var(--text-body)]"
                    )}
                  >
                    {item.label}
                  </span>
                  <Image
                    alt=""
                    className="size-6 shrink-0"
                    height={24}
                    src={item.icon}
                    width={24}
                  />
                </>
              )
              const cls =
                "flex h-14 w-full items-center gap-[var(--lg)] rounded-[var(--radius-xs)] p-[var(--lg)] hover:bg-secondary-50"
              return item.to ? (
                <Link key={item.label} to={item.to} className={cls} onClick={() => setOpen(false)}>
                  {content}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  className={cls}
                  onClick={() => setOpen(false)}
                >
                  {content}
                </button>
              )
            })}
          </nav>
        </div>
      ) : null}
    </div>
  )
}

export { DashboardLoginButton }
