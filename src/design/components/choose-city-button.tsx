"use client"

import { CityFilter } from "@/design/components/city-filter"
import { cn } from "@/design/lib/utils"

type ChooseCityButtonProps = {
  className?: string
  defaultOpen?: boolean
  defaultValue?: string
  onChange?: (city: string) => void
}

/** Figma Choose city button — alias of City Filter for home/search surfaces */
function ChooseCityButton({
  className,
  defaultOpen,
  defaultValue,
  onChange,
}: ChooseCityButtonProps) {
  return (
    <CityFilter
      className={cn(className)}
      label="انتخاب شهر"
      defaultOpen={defaultOpen}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  )
}

export { ChooseCityButton }
