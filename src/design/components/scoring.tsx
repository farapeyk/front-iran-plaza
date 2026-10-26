"use client"
import { useState } from "react"
import { Star } from "lucide-react"
import { cn } from "@/design/lib/utils"

type ScoringProps = {
  className?: string
  /** vertical | horizontal */
  orientation?: "horizontal" | "vertical"
  divider?: boolean
  title?: string
  average?: number
  count?: number
  value?: number
  defaultValue?: number
  onChange?: (value: number) => void
}

/** Figma scoring — 5 numbered stars + average label */
function Scoring({
  className,
  orientation = "horizontal",
  divider = true,
  title = "چه امتیازی می دهید؟",
  average = 4.2,
  count = 7,
  value: controlled,
  defaultValue = 0,
  onChange,
}: ScoringProps) {
  const [internal, setInternal] = useState(defaultValue)
  const value = controlled ?? internal
  const isVertical = orientation === "vertical"

  const pick = (n: number) => {
    setInternal(n)
    onChange?.(n)
  }

  return (
    <div
      data-slot="scoring"
      className={cn(
        "rounded-[var(--radius-xs)]",
        divider && "border border-[var(--border-subtle)]",
        isVertical
          ? "flex flex-col items-center gap-[var(--lg)] px-[var(--2xl)] py-[var(--lg)]"
          : "flex flex-wrap items-center justify-between gap-[var(--lg)] px-[var(--2xl)] py-[var(--lg)]",
        className
      )}
    >
      <div className="flex min-w-0 flex-wrap gap-[var(--lg)] sm:gap-[var(--2xl)]">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`امتیاز ${n}`}
            aria-pressed={value === n}
            onClick={() => pick(n)}
            className={cn(
              "relative size-8 transition-opacity",
              value > 0 && value !== n && "opacity-40"
            )}
          >
            <Star
              aria-hidden="true"
              className={cn(
                "size-full stroke-[var(--yellow-400)] stroke-[1.5]",
                value >= n && "fill-[var(--yellow-400)]"
              )}
            />
            <span className="absolute inset-0 flex items-center justify-center pt-0.5 text-[10px] font-bold text-[var(--yellow-400)]">
              {n}
            </span>
          </button>
        ))}
      </div>

      <div
        className={cn(
          "flex flex-col leading-normal",
          isVertical ? "items-center text-center" : "items-start text-right"
        )}
      >
        <p className="text-[22px] font-bold text-[var(--text-title)]">{title}</p>
        <p className="text-lg text-[var(--text-body)]">
          {average.toFixed(1)} ( {count} نفر )
        </p>
      </div>
    </div>
  )
}

export { Scoring }
