"use client"

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"
import { cn } from "@/design/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-14 w-full min-w-0 rounded-[var(--radius-xs)] border border-[var(--input-border)] bg-[var(--surface)] px-4 text-base text-[var(--input-value)] transition-colors outline-none",
        "placeholder:text-[var(--input-placeholder)]",
        "focus-visible:border-2 focus-visible:border-[var(--input-border-active)]",
        "disabled:cursor-not-allowed disabled:border-transparent disabled:bg-[var(--input-disabled-bg)] disabled:opacity-100",
        "aria-invalid:border-2 aria-invalid:border-[var(--input-border-danger)]",
        "read-only:border-transparent read-only:bg-[var(--input-disabled-bg)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
