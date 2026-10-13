"use client"

import { DesktopBusinessesCategory } from "@/design/components/desktop-businesses-category"
import { cn } from "@/design/lib/utils"

type CategoryFilterProps = {
  className?: string
  defaultOpen?: boolean
  triggerVariant?: "outline" | "filled"
}

/** Figma Category filter — mega menu با لیبل «دسته بندی ها» */
function CategoryFilter({
  className,
  defaultOpen = false,
  triggerVariant = "outline",
}: CategoryFilterProps) {
  return (
    <DesktopBusinessesCategory
      className={cn(className)}
      defaultOpen={defaultOpen}
      triggerLabel="دسته بندی ها"
      triggerVariant={triggerVariant}
    />
  )
}

export { CategoryFilter }
