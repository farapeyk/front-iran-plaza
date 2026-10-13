"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { cn } from "@/design/lib/utils"

/** Figma Checkbox — 20×20, unselected / hover / selected */
function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-xs)] border border-[var(--opacity-dark-24)] bg-[var(--surface)] transition-colors outline-none",
        "hover:border-primary-500 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/30",
        "data-checked:border-primary-500 data-checked:bg-primary-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-[var(--input-border-danger)]",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-[var(--text-light-title)]"
      >
        <svg
          aria-hidden
          viewBox="0 0 12 10"
          className="size-3"
          fill="none"
        >
          <path
            d="M1 5.2 4.2 8.5 11 1.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
