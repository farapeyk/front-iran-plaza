"use client"

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
const awardIcon = "/design/icons/award.svg"

type CategoryCardProps = {
  label: string
  iconSrc?: string
  to?: string
  active?: boolean
  /** card = bordered desktop tile; icon = mobile circle without a frame */
  variant?: "card" | "icon"
  className?: string
}

function CategoryCard({
  label,
  iconSrc = awardIcon,
  to = "/businesses",
  active = false,
  variant = "card",
  className,
}: CategoryCardProps) {
  const iconOnly = variant === "icon"
  return (
    <Link
      to={to}
      className={cn(
        "flex flex-col items-center justify-center gap-[var(--sm)] px-[var(--sm)] transition-colors",
        iconOnly
          ? "rounded-none border-0 py-0"
          : "rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] py-[var(--lg)] hover:border-primary-300",
        className
      )}
    >
      <span className="rounded-full bg-secondary-50 p-2">
        <span
          className={cn(
            "flex size-16 items-center justify-center rounded-full",
            active ? "bg-primary-700" : "bg-secondary-300"
          )}
        >
          <span className="size-8 overflow-clip">
            <img
              alt=""
              className={cn("size-full", active && "brightness-0 invert")}
              height={32}
              src={iconSrc}
              width={32}
            />
          </span>
        </span>
      </span>
      <span
        className={cn(
          "text-center font-bold",
          iconOnly ? "text-sm text-[var(--text-title)]" : "text-lg text-[var(--text-body)]"
        )}
      >
        {label}
      </span>
    </Link>
  )
}

export { CategoryCard }
