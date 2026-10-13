"use client"

import { cn } from "@/design/lib/utils"

type ActiveStatusProps = {
  className?: string
  active?: boolean
}

/** Figma Active Status — 8px dot with white ring */
function ActiveStatus({ className, active = true }: ActiveStatusProps) {
  return (
    <span
      data-slot="active-status"
      aria-hidden
      className={cn(
        "inline-block size-2 rounded-full border-2 border-white",
        active ? "bg-[var(--success)]" : "bg-[var(--color-white)]",
        className
      )}
    />
  )
}

export { ActiveStatus }
