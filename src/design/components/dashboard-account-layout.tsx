"use client"
import Image from "next/image";

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import { Link } from "@/design/navigation"
import {
  DashboardSidebar,
  type SubscriptionStatus,
} from "@/design/components/dashboard-sidebar"
import { cn } from "@/design/lib/utils"
const arrowRight = "/design/icons/arrow-right.svg"
const element3 = "/design/icons/element-3.svg"
const closeCircle = "/design/icons/close-circle.svg"

type DashboardAccountLayoutProps = {
  title: string
  backTo?: string
  status?: SubscriptionStatus
  /** Desktop-only action on the leading side of the page title row (e.g. view profile). */
  headerAction?: ReactNode
  children: ReactNode
  className?: string
  contentClassName?: string
}

function DashboardAccountLayout({
  title,
  backTo = "/dashboard",
  status = "active",
  headerAction,
  children,
  className,
  contentClassName,
}: DashboardAccountLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <div className={cn("min-h-svh bg-[var(--surface-muted)]", className)}>
      <div className="flex min-h-svh">
        <DashboardSidebar
          className="sticky top-0 hidden h-svh shrink-0 lg:flex"
          status={status}
        />

        {/* Mobile / tablet drawer */}
        <div
          className={cn(
            "fixed inset-0 z-50 lg:hidden",
            menuOpen ? "pointer-events-auto" : "pointer-events-none"
          )}
          aria-hidden={!menuOpen}
          inert={!menuOpen ? true : undefined}
        >
          <button
            type="button"
            aria-label="بستن منو"
            className={cn(
              "absolute inset-0 bg-[var(--opacity-dark-32)] transition-opacity",
              menuOpen ? "opacity-100" : "opacity-0"
            )}
            onClick={() => setMenuOpen(false)}
          />
          <div
            className={cn(
              "absolute inset-y-0 start-0 flex w-[min(100%,300px)] transition-transform duration-300 ease-out",
              menuOpen
                ? "translate-x-0"
                : "-translate-x-full rtl:translate-x-full"
            )}
          >
            <DashboardSidebar
              className="h-full max-w-none shadow-lg"
              status={status}
              onNavigate={() => setMenuOpen(false)}
            />
            <button
              type="button"
              aria-label="بستن"
              onClick={() => setMenuOpen(false)}
              className="absolute end-3 top-3 flex size-10 items-center justify-center rounded-full bg-[var(--surface)] shadow-sm"
            >
              <Image alt="" className="size-6" height={24} src={closeCircle} width={24} />
            </button>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b border-[var(--opacity-dark-8)] bg-[var(--surface-muted)] px-3 sm:h-16 sm:px-4 lg:hidden">
            <button
              type="button"
              aria-label="منوی داشبورد"
              onClick={() => setMenuOpen(true)}
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface)]"
            >
              <Image alt="" className="size-5" height={20} src={element3} width={20} />
            </button>
            <h1 className="min-w-0 flex-1 truncate text-start text-base font-bold text-[var(--text-title)] sm:text-lg">
              {title}
            </h1>
            <Link
              to={backTo}
              className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface)]"
              aria-label="بازگشت"
            >
              <Image alt="" className="size-5" height={20} src={arrowRight} width={20} />
            </Link>
          </header>

          <div className="mx-auto hidden w-full max-w-[960px] items-center justify-between gap-[var(--lg)] px-6 pt-8 xl:px-10 xl:pt-10 lg:flex">
            <div className="flex min-w-0 items-center gap-4 xl:gap-[var(--2xl)]">
              <Link
                to={backTo}
                className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[var(--border-default)] bg-[var(--surface)]"
                aria-label="بازگشت"
              >
                <Image alt="" className="size-6" height={24} src={arrowRight} width={24} />
              </Link>
              <h1 className="truncate text-[length:var(--text-h1)] font-black text-[var(--text-title)]">
                {title}
              </h1>
            </div>
            {headerAction ? <div className="shrink-0">{headerAction}</div> : null}
          </div>

          {headerAction ? (
            <div className="px-3 pt-3 sm:px-4 lg:hidden">{headerAction}</div>
          ) : null}

          <section
            className={cn(
              "mx-auto w-full flex-1 px-3 pb-10 pt-4 sm:px-5 sm:pb-12 sm:pt-5",
              "max-w-[960px] lg:px-6 lg:pb-16 lg:pt-6 xl:px-10",
              contentClassName
            )}
          >
            {children}
          </section>
        </div>
      </div>
    </div>
  )
}

export { DashboardAccountLayout }
