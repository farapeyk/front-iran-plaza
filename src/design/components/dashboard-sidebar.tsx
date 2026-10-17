"use client"
import Image from "next/image";

import { useState } from "react"
import { Link, useLocation } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { Logo } from "@/design/components/logo"
import { useDesignUser, useDesignBusiness } from "@/design/provider"
import { DashboardInformationCard } from "@/design/components/dashboard-information-card"
import {
  dashboardLogoutItem,
  dashboardMainItems,
  isNavActive,
  isProfileSection,
  profileSubmenuItems,
} from "@/design/data/dashboard-nav"
const briefcase = "/design/icons/briefcase.svg"
const arrowDown = "/design/icons/arrow-down.svg"

type SubscriptionStatus = "free" | "active" | "expired"

type DashboardSidebarProps = {
  className?: string
  status?: SubscriptionStatus
  userName?: string
  userPhone?: string
  onNavigate?: () => void
}

function SidebarItem({
  title,
  icon,
  to,
  active,
  openable,
  open,
  onToggle,
  disabled,
  onNavigate,
}: {
  title: string
  icon: string
  to?: string
  active?: boolean
  openable?: boolean
  open?: boolean
  onToggle?: () => void
  disabled?: boolean
  onNavigate?: () => void
}) {
  const className = cn(
    "flex h-14 w-full items-center gap-3 rounded px-3 text-[var(--text-body)] sm:gap-4 sm:px-4",
    active && "bg-[var(--opacity-dark-8)] text-[var(--text-title)]",
    disabled && "pointer-events-none opacity-40",
    !disabled && "hover:bg-[var(--opacity-dark-8)]"
  )

  if (openable && to) {
    return (
      <div
        className={cn(className, "gap-2 pe-2")}
        data-active={active ? "true" : undefined}
      >
        <button
          type="button"
          aria-label={open ? "بستن زیرمنو" : "باز کردن زیرمنو"}
          aria-expanded={open}
          onClick={onToggle}
          className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-[var(--opacity-dark-8)]"
        >
          <Image
            alt=""
            className={cn("size-4 transition-transform", open && "rotate-180")}
            height={16}
            src={arrowDown}
            width={16}
          />
        </button>
        <Link
          to={to}
          onClick={onNavigate}
          aria-current={active ? "page" : undefined}
          className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4"
        >
          <span className="min-w-0 flex-1 text-start text-base font-bold">{title}</span>
          <Image alt="" className="size-6 shrink-0" height={24} src={icon} width={24} />
        </Link>
      </div>
    )
  }

  if (disabled || !to || to === "#") {
    return (
      <div className={className} aria-disabled>
        <span className="size-4 shrink-0" aria-hidden />
        <span className="min-w-0 flex-1 text-start text-base font-bold">{title}</span>
        <Image alt="" className="size-6 shrink-0" height={24} src={icon} width={24} />
      </div>
    )
  }

  return (
    <Link
      to={to}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      data-active={active ? "true" : undefined}
      className={className}
    >
      <span className="size-4 shrink-0" aria-hidden />
      <span className="min-w-0 flex-1 text-start text-base font-bold">{title}</span>
      <Image alt="" className="size-6 shrink-0" height={24} src={icon} width={24} />
    </Link>
  )
}

function DashboardSidebar({
  className,
  status = "free",
  userName: suppliedName,
  userPhone: suppliedPhone,
  onNavigate,
}: DashboardSidebarProps) {
  const { pathname } = useLocation()
  const user = useDesignUser()
  const userName = suppliedName ?? user?.fullName ?? "حساب کاربری"
  const userPhone = suppliedPhone ?? user?.phone ?? ""
  const hasBusiness = !!useDesignBusiness()
  const [menu, setMenu] = useState(() => ({
    pathname,
    hasBusiness,
    open: hasBusiness && isProfileSection(pathname),
  }))
  let profileOpen = menu.open
  if (menu.pathname !== pathname || menu.hasBusiness !== hasBusiness) {
    profileOpen = hasBusiness && (isProfileSection(pathname) || menu.open)
    setMenu({ pathname, hasBusiness, open: profileOpen })
  }

  return (
    <aside
      data-slot="dashboard-sidebar"
      className={cn(
        "flex h-full w-full max-w-[300px] flex-col border-s-2 border-[var(--opacity-dark-8)] bg-[var(--surface)]",
        className
      )}
    >
      <div className="flex h-16 w-full shrink-0 items-center justify-start px-5 sm:h-20 sm:px-8">
        <Logo variant="primary" to="/dashboard" className="h-7 w-[146px]" />
      </div>

      <nav className="flex flex-1 flex-col overflow-y-auto px-3 pb-2 sm:px-4">
        <SidebarItem
          title="پروفایل من"
          icon={briefcase}
          to="/profile"
          openable={hasBusiness}
          open={profileOpen}
          onToggle={() => setMenu((current) => ({ ...current, open: !current.open }))}
          active={isProfileSection(pathname)}
          onNavigate={onNavigate}
        />

        {profileOpen && hasBusiness
          ? profileSubmenuItems.map((item) => {
              const active = isNavActive(pathname, item.to, "end" in item && item.end)
              return (
                <Link
                  key={item.title}
                  to={item.to}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  data-active={active ? "true" : undefined}
                  className={cn(
                    "flex h-12 w-full items-center gap-3 rounded px-3 text-sm font-bold text-[var(--text-body)] sm:h-14 sm:gap-4 sm:px-4 sm:text-base",
                    active
                      ? "bg-secondary-100 text-[var(--text-title)]"
                      : "hover:bg-[var(--opacity-dark-8)]"
                  )}
                >
                  <span className="size-4 shrink-0" aria-hidden />
                  <span className="min-w-0 flex-1 text-start">{item.title}</span>
                  <Image
                    alt=""
                    className="size-5 shrink-0 sm:size-6"
                    height={24}
                    src={item.icon}
                    width={24}
                  />
                </Link>
              )
            })
          : null}

        {dashboardMainItems.map((item) => (
          <SidebarItem
            key={item.title}
            title={item.title}
            icon={item.icon}
            to={item.to}
            disabled={"disabled" in item && item.disabled}
            active={isNavActive(pathname, item.to)}
            onNavigate={onNavigate}
          />
        ))}

        <SidebarItem
          title={dashboardLogoutItem.title}
          icon={dashboardLogoutItem.icon}
          to={dashboardLogoutItem.to}
          onNavigate={onNavigate}
        />
      </nav>

      <div className="shrink-0 p-3 sm:p-4">
        <DashboardInformationCard
          variant={status}
          name={userName}
          phone={userPhone}
          className="max-w-none"
        />
      </div>
    </aside>
  )
}

export { DashboardSidebar }
export type { SubscriptionStatus }
