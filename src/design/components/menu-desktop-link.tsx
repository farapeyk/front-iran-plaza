"use client"

import { NavLink } from "@/design/navigation"
import type { ReactNode } from "react"
import { cn } from "@/design/lib/utils"
const arrowDown = "/design/icons/arrow-down.svg"

type MenuDesktopLinkProps = {
  className?: string
  to?: string
  children: ReactNode
  icon?: boolean
  end?: boolean
  onClick?: () => void
}

/** Figma menu desktop link — Default / Hover / Active × icon */
function MenuDesktopLink({
  className,
  to,
  children,
  icon = false,
  end,
  onClick,
}: MenuDesktopLinkProps) {
  const base =
    "inline-flex h-12 items-center justify-center gap-2 rounded-full px-5 text-lg font-bold transition-colors"

  const content = (active: boolean) => (
    <>
      <span className="pt-0.5">{children}</span>
      {icon ? (
        <img
          alt=""
          className={cn("size-4 shrink-0", active && "opacity-90")}
          height={16}
          src={arrowDown}
          width={16}
        />
      ) : null}
    </>
  )

  if (to) {
    return (
      <NavLink
        to={to}
        end={end}
        onClick={onClick}
        data-slot="menu-desktop-link"
        className={({ isActive }) =>
          cn(
            base,
            isActive
              ? "bg-secondary-100 text-primary-500"
              : "text-[var(--text-body)] hover:bg-secondary-100 hover:text-primary-500",
            className
          )
        }
      >
        {({ isActive }) => content(isActive)}
      </NavLink>
    )
  }

  return (
    <button
      type="button"
      data-slot="menu-desktop-link"
      onClick={onClick}
      className={cn(
        base,
        "text-[var(--text-body)] hover:bg-secondary-100 hover:text-primary-500",
        className
      )}
    >
      {content(false)}
    </button>
  )
}

export { MenuDesktopLink }
