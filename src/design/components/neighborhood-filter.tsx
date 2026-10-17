"use client"
import Image from "next/image";

import { useMemo, useState } from "react"
import { cn } from "@/design/lib/utils"
import { Button } from "@/design/components/ui/button"
import { Checkbox } from "@/design/components/ui/checkbox"
import { Scroller } from "@/design/components/scroller"
const arrowDown = "/design/icons/arrow-down.svg"
const searchIcon = "/design/icons/search-dark.svg"

const DEFAULT_NEIGHBORHOODS = [
  "همه محله ها",
  "فرهنگ شهر",
  "تاچارا",
  "قصرودشت",
  "فلکه معلم",
  "معالی آباد",
  "زرگری",
  "ستارخان",
]

type NeighborhoodFilterProps = {
  className?: string
  label?: string
  neighborhoods?: string[]
  defaultOpen?: boolean
  defaultSelected?: string[]
  onApply?: (selected: string[]) => void
}

/** Figma Neighborhood filter — pill trigger + searchable checkbox list */
function NeighborhoodFilter({
  className,
  label = "انتخاب محله",
  neighborhoods = DEFAULT_NEIGHBORHOODS,
  defaultOpen = false,
  defaultSelected = ["همه محله ها"],
  onApply,
}: NeighborhoodFilterProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string[]>(defaultSelected)

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return neighborhoods
    return neighborhoods.filter((n) => n.includes(q))
  }, [neighborhoods, query])

  function toggle(name: string) {
    setSelected((prev) => {
      if (name === "همه محله ها") return ["همه محله ها"]
      const withoutAll = prev.filter((n) => n !== "همه محله ها")
      if (withoutAll.includes(name)) {
        const next = withoutAll.filter((n) => n !== name)
        return next.length ? next : ["همه محله ها"]
      }
      return [...withoutAll, name]
    })
  }

  return (
    <div
      data-slot="neighborhood-filter"
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
                placeholder="جستجوی محله"
                className="min-w-0 flex-1 bg-transparent text-right text-base outline-none placeholder:text-[var(--input-placeholder)]"
              />
              <Image alt="" className="size-6 shrink-0" height={24} src={searchIcon} width={24} />
            </div>
          </div>

          <div className="relative min-h-0 flex-1 overflow-y-auto px-[var(--2xl)] pb-[var(--5xl)] pt-[var(--sm)]">
            <div className="pointer-events-none absolute start-1 top-4">
              <Scroller height={191} />
            </div>
            {filtered.map((name) => {
              const checked = selected.includes(name)
              return (
                <label
                  key={name}
                  className="flex h-14 cursor-pointer items-center justify-start gap-[var(--lg)] border-b border-[var(--opacity-dark-8)] py-[var(--lg)]"
                >
                  <span className="text-lg text-[var(--text-body)]">{name}</span>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggle(name)}
                    className="size-5"
                  />
                </label>
              )
            })}
          </div>

          <div className="shrink-0 px-[var(--2xl)] pb-[var(--lg)] pt-[var(--sm)]">
            <Button
              size="sm"
              className="w-full"
              disabled={selected.length === 0}
              onClick={() => {
                onApply?.(selected)
                setOpen(false)
              }}
            >
              اعمال فیلتر
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { NeighborhoodFilter }
