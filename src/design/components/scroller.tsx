"use client"

import { cn } from "@/design/lib/utils"

type ScrollerProps = {
  className?: string
  /** track height in px */
  height?: number
}

/** Figma Scroller — thin vertical grip handle */
function Scroller({ className, height = 191 }: ScrollerProps) {
  return (
    <div
      data-slot="scroller"
      role="presentation"
      className={cn(
        "flex w-2 flex-col items-center justify-center gap-0.5 rounded-full bg-[var(--opacity-dark-24)]",
        className
      )}
      style={{ height }}
    >
      <span className="h-0.5 w-1.5 shrink-0 bg-[var(--surface)]" />
      <span className="h-0.5 w-1.5 shrink-0 bg-[var(--surface)]" />
      <span className="h-0.5 w-1.5 shrink-0 bg-[var(--surface)]" />
    </div>
  )
}

export { Scroller }
