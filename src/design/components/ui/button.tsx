"use client"

import { buttonVariants } from "@/design/components/ui/button-variants"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"
import { cn } from "@/design/lib/utils"

/**
 * Iran Plaza Button — Figma 💠 Buttons (9 color families × Fill/Outline/Light/Text)
 * Size: Small 40 | Medium 48 | Large 52 | XLarge 56
 */

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button }
