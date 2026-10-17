"use client"
import Image from "next/image";

import { useMemo, useState } from "react"
import { cn } from "@/design/lib/utils"
import { Radio, RadioGroup } from "@/design/components/ui/radio"
import { Scroller } from "@/design/components/scroller"
const arrowDown = "/design/icons/arrow-down.svg"
const searchIcon = "/design/icons/search-dark.svg"

const DEFAULT_CITIES = [
  "همه شهرها",
  "شیراز",
  "اصفهان",
  "تبریز",
  "مشهد",
  "تهران",
  "اهواز",
  "کرج",
]

type CityFilterProps = {
  className?: string
  label?: string
  cities?: string[]
  defaultOpen?: boolean
  defaultValue?: string
  onChange?: (city: string) => void
}

/** Figma City Filter — pill trigger + searchable radio list */
function CityFilter({
  className,
  label = "انتخاب شهر",
  cities = DEFAULT_CITIES,
  defaultOpen = false,
  defaultValue = "شیراز",
  onChange,
}: CityFilterProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [query, setQuery] = useState("")
  const [value, setValue] = useState(defaultValue)

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return cities
    return cities.filter((c) => c.includes(q))
  }, [cities, query])

  return (
    <div
      data-slot="city-filter"
      className={cn("relative inline-flex flex-col items-start", className)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-12 items-center justify-center gap-2 rounded-full pe-5 ps-4 text-lg font-bold text-[var(--text-body)]",
          open
            ? "bg-[var(--opacity-dark-8)]"
            : "border border-[var(--opacity-dark-16)] bg-transparent"
        )}
      >
        <Image
          alt=""
          className={cn("size-6 transition-transform", open && "rotate-180")}
          height={24}
          src={arrowDown}
          width={24}
        />
        <span className="pt-0.5">{label}</span>
      </button>

      {open ? (
        <div className="absolute start-0 top-[52px] z-40 flex h-[520px] w-[260px] flex-col rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] bg-[var(--surface)] pt-[var(--2xl)] shadow-[var(--shadow-lg)]">
          <div className="px-[var(--2xl)]">
            <div className="flex h-14 items-center gap-[var(--lg)] rounded-full border border-[var(--opacity-dark-16)] px-[var(--xl)]">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="جستجوی شهر"
                className="min-w-0 flex-1 bg-transparent text-right text-base outline-none placeholder:text-[var(--input-placeholder)]"
              />
              <Image alt="" className="size-6 shrink-0" height={24} src={searchIcon} width={24} />
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto px-[var(--2xl)] pb-[var(--5xl)] pt-2">
            <div className="pointer-events-none absolute start-1 top-4">
              <Scroller height={191} />
            </div>
            <RadioGroup
              value={value}
              onValueChange={(v) => {
                const next = String(v)
                setValue(next)
                onChange?.(next)
                setOpen(false)
              }}
              className="flex w-full flex-col gap-0"
            >
              {filtered.map((city) => (
                <label
                  key={city}
                  className="flex h-14 cursor-pointer items-center justify-start gap-[var(--lg)] border-b border-[var(--opacity-dark-8)] px-[var(--sm)] py-[var(--lg)]"
                >
                  <span className="text-lg text-[var(--text-body)]">{city}</span>
                  <Radio value={city} className="size-[22px]" />
                </label>
              ))}
            </RadioGroup>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { CityFilter }
