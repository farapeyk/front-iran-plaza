"use client"

import { useState } from "react"
import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { isNavActive, profileSubmenuItems } from "@/design/data/dashboard-nav"
const briefcase = "/design/icons/briefcase.svg"
const arrowDown = "/design/icons/arrow-down.svg"

type ProfileSubmenuProps = {
  className?: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  pathname?: string
}

/** Figma Submenu My profile — accordion trigger + profile edit links */
function ProfileSubmenu({
  className,
  open: controlled,
  onOpenChange,
  defaultOpen = true,
  pathname = "",
}: ProfileSubmenuProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const open = controlled ?? uncontrolled

  function toggle() {
    const next = !open
    if (controlled === undefined) setUncontrolled(next)
    onOpenChange?.(next)
  }

  return (
    <div data-slot="profile-submenu" className={cn("w-full", className)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className={cn(
          "flex h-14 w-full items-center gap-[var(--lg)] rounded-[var(--radius-xs)] p-[var(--lg)]",
          open && "bg-secondary-100"
        )}
      >
        <img
          alt=""
          className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
          height={16}
          src={arrowDown}
          width={16}
        />
        <span className="min-w-0 flex-1 text-start text-base font-bold text-[var(--text-body)]">
          پروفایل من
        </span>
        <img alt="" className="size-6 shrink-0" height={24} src={briefcase} width={24} />
      </button>

      {open ? (
        <ul className="flex flex-col py-1">
          {profileSubmenuItems.map((item) => {
            const active = isNavActive(pathname, item.to, "end" in item && item.end)
            return (
              <li key={item.title}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex h-12 items-center gap-3 px-[var(--lg)] py-2 text-start hover:bg-secondary-50",
                    active && "bg-secondary-50 font-bold text-[var(--text-title)]"
                  )}
                >
                  <span className="min-w-0 flex-1 text-sm font-medium text-[var(--text-body)]">
                    {item.title}
                  </span>
                  <img
                    alt=""
                    className="size-5 shrink-0 opacity-70"
                    height={20}
                    src={item.icon}
                    width={20}
                  />
                </Link>
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export { ProfileSubmenu }
