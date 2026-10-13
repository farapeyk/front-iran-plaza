"use client"

import { cn } from "@/design/lib/utils"
const arrowLeft = "/design/icons/arrow-left.svg"
const profileCircle = "/design/icons/profile-circle.svg"

type IdentityCardProps = {
  className?: string
  title?: string
  description?: string
  active?: boolean
  onClick?: () => void
}

/** Figma Identity card — verification method selector */
function IdentityCard({
  className,
  title = "با کارت ملی",
  description = "تصویر کارت ملی و سلفی",
  active = false,
  onClick,
}: IdentityCardProps) {
  return (
    <button
      type="button"
      data-slot="identity-card"
      data-state={active ? "active" : "default"}
      onClick={onClick}
      className={cn(
        "flex w-full max-w-[345px] items-center justify-start gap-[var(--lg)] rounded-[var(--radius-xs)] p-[var(--lg)] text-right transition-colors",
        active
          ? "bg-secondary-100"
          : "border border-[var(--opacity-dark-16)] bg-transparent hover:bg-secondary-50",
        className
      )}
    >
      <img alt="" className="size-6 shrink-0" height={24} src={arrowLeft} width={24} />
      <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
        <p className="w-full text-lg font-bold leading-normal text-[var(--text-title)]">{title}</p>
        <p className="w-full text-sm leading-normal text-[var(--text-subtitle)]">
          {description}
        </p>
      </div>
      <span
        className={cn(
          "flex size-14 shrink-0 items-center justify-center rounded-full",
          active ? "bg-secondary-25" : "bg-secondary-100"
        )}
      >
        <img alt="" className="size-6" height={24} src={profileCircle} width={24} />
      </span>
    </button>
  )
}

export { IdentityCard }
