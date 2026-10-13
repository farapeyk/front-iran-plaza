"use client"

import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/design/lib/utils"

type TabVariant = "border" | "button"
type TabSize = "mobile" | "desktop"

type TabProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
  active?: boolean
  variant?: TabVariant
  size?: TabSize
}

function Tab({
  children,
  active = false,
  variant = "border",
  size = "mobile",
  className,
  ...props
}: TabProps) {
  const isDesktop = size === "desktop"
  const isBorder = variant === "border"

  return (
    <button
      type="button"
      data-slot="tab"
      data-active={active || undefined}
      className={cn(
        "shrink-0 whitespace-nowrap transition-colors",
        isBorder &&
          cn(
            "flex items-center justify-center",
            isDesktop ? "h-14 px-6 text-lg" : "h-14 px-4 text-base",
            active
              ? "border-b-4 border-[var(--text-title)] font-bold text-[var(--text-title)]"
              : "font-normal text-[var(--text-body)] hover:border-b-4 hover:border-[var(--text-title)]"
          ),
        !isBorder &&
          cn(
            "flex items-center justify-center rounded-full",
            isDesktop ? "h-12 px-6 text-lg" : "h-10 px-4 text-base",
            active
              ? "bg-primary-950 font-bold text-secondary-25"
              : "font-normal text-[var(--text-body)] hover:bg-[var(--opacity-dark-8)]"
          ),
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

type TabsListProps = {
  children: ReactNode
  className?: string
}

function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex gap-1 overflow-x-auto [scrollbar-width:none]",
        className
      )}
    >
      {children}
    </div>
  )
}

export { Tab, TabsList }
export type { TabVariant, TabSize }
