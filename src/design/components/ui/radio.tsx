"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "@/design/lib/utils"

/**
 * Iran Plaza Radio — Figma Design System Components
 * States: unselected | hover | selected
 * Size: 22px outer, 12px inner dot
 */
function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("flex flex-col gap-[var(--md)]", className)}
      {...props}
    />
  )
}

function Radio({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio"
      className={cn(
        "peer relative flex size-[22px] shrink-0 items-center justify-center rounded-full border border-[var(--input-border)] transition-colors outline-none",
        "hover:border-primary-500",
        "focus-visible:ring-2 focus-visible:ring-primary-500/40",
        "data-checked:border-2 data-checked:border-primary-500",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-indicator"
        className="flex size-3 items-center justify-center"
      >
        <span className="size-3 rounded-full bg-primary-500" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { Radio, RadioGroup }
