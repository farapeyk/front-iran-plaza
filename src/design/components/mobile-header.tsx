"use client"
import Image from "next/image";

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { Logo } from "@/design/components/logo"
const userIcon = "/design/icons/user.svg"
const menuIcon = "/design/icons/menu.svg"

type MobileHeaderProps = {
  className?: string
  divider?: boolean
  mode?: "light" | "dark"
  onMenuClick?: () => void
}

function MobileHeader({
  className,
  divider = false,
  mode = "light",
  onMenuClick,
}: MobileHeaderProps) {
  const isDark = mode === "dark"

  return (
    <header
      dir="ltr"
      className={cn(
        "flex h-[72px] w-full items-center justify-between px-5 lg:hidden",
        isDark ? "bg-primary-950" : "bg-[var(--surface-muted)]",
        divider && "border-b border-[var(--border-default)]",
        className
      )}
    >
      <Logo variant={isDark ? "white" : "primary"} />

      <div className="flex items-center gap-3" dir="ltr">
        <Link
          to="/login"
          aria-label="ورود"
          className="flex size-12 items-center justify-center"
        >
          <span className="size-6 overflow-clip">
            <Image alt="" className="size-full" height={24} src={userIcon} width={24} />
          </span>
        </Link>
        <button
          type="button"
          aria-label="منو"
          className="flex size-12 items-center justify-center"
          onClick={onMenuClick}
        >
          <span className="size-6 overflow-clip">
            <Image alt="" className="size-full" height={24} src={menuIcon} width={24} />
          </span>
        </button>
      </div>
    </header>
  )
}

export { MobileHeader }
