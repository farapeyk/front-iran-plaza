"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "@/design/lib/utils"

/**
 * Figma switch button — 44×24
 * `dir="ltr"` keeps off→on as left→right regardless of page RTL
 */
function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      dir="ltr"
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-primary-500/40",
        "data-checked:border-transparent data-checked:bg-primary-500 data-checked:p-1",
        "data-unchecked:border-2 data-unchecked:border-[var(--opacity-dark-16)] data-unchecked:bg-transparent data-unchecked:p-1",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "data-[size=default]:h-6 data-[size=default]:w-11",
        "data-[size=sm]:h-4 data-[size=sm]:w-7",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full transition-transform duration-200 ease-out",
          "group-data-unchecked/switch:bg-[var(--opacity-dark-32)] group-data-unchecked/switch:hover:bg-primary-500",
          "group-data-checked/switch:bg-[var(--surface)]",
          "group-data-checked/switch:translate-x-5",
          "group-data-[size=default]/switch:size-4",
          "group-data-[size=sm]/switch:size-3 group-data-[size=sm]/switch:group-data-checked/switch:translate-x-3"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
