"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
import { useNavigate } from "@/design/navigation"
const locationIcon = "/design/icons/solid/location.svg"
const searchIcon = "/design/icons/search-dark.svg"
const closeCircle = "/design/icons/close-circle.svg"

type BusinessSearchState = "default" | "active" | "searching"

type BusinessSearchProps = {
  className?: string
  city?: string
  placeholder?: string
  value?: string
  /** Override visual state; otherwise inferred from focus/value */
  state?: BusinessSearchState
  active?: boolean
  size?: "mobile" | "desktop" | "responsive"
  onSearchClick?: () => void
  onCityClick?: () => void
  onClear?: () => void
  onChange?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

/** Figma Business Search — mobile/desktop × Default / Active / Searching */
function BusinessSearch({
  className,
  city = "همه شهرها",
  placeholder = "جستجوی کسب وکار",
  value,
  state: stateProp,
  active,
  size = "desktop",
  onSearchClick: suppliedSearch,
  onCityClick,
  onClear,
  onChange,
  onFocus,
  onBlur,
}: BusinessSearchProps) {
  const navigate = useNavigate()
  const onSearchClick = suppliedSearch ?? (() => navigate("/search"))
  const searching = Boolean(value)
  const resolved: BusinessSearchState =
    stateProp ??
    (searching ? "searching" : active ? "active" : "default")

  const isEmphasized = resolved === "active" || resolved === "searching"

  return (
    <div
      role="search"
      dir="ltr"
      data-slot="business-search"
      data-state={resolved}
      data-size={size}
      className={cn(
        "flex items-center rounded-full border-solid bg-[var(--surface)]",
        isEmphasized
          ? "border-2 border-[var(--input-border-active)]"
          : "border border-[var(--opacity-dark-16)]",
        size === "responsive"
          ? "h-14 w-full max-w-none lg:h-16 lg:max-w-[500px]"
          : size === "desktop"
            ? "h-16 w-full max-w-[500px]"
            : "h-14 w-full max-w-[345px]",
        className
      )}
    >
      <button
        type="button"
        onClick={onCityClick}
        className={cn(
          "flex h-6 shrink-0 items-center gap-[var(--xs)] border-e border-[var(--opacity-dark-24)]",
          size === "responsive"
            ? "ps-[var(--sm)] pe-[var(--xs)] lg:ps-[var(--md)]"
            : size === "desktop"
              ? "ps-[var(--md)] pe-[var(--xs)]"
              : "ps-[var(--sm)] pe-[var(--xs)]"
        )}
      >
        <span
          dir="rtl"
          className={cn(
            "py-[var(--sm)] text-[var(--text-title)]",
            size === "responsive" ? "px-2 text-sm lg:px-[var(--lg)] lg:text-base" : "px-[var(--lg)] text-base"
          )}
        >
          {city}
        </span>
        <Image alt="" className="size-4 shrink-0" height={16} src={locationIcon} width={16} />
      </button>

      {onChange ? (
        <div
          className={cn(
            "flex h-full min-w-0 flex-1 items-center gap-[var(--md)]",
            size === "responsive"
              ? "ps-[var(--md)] pe-[var(--lg)] lg:ps-[var(--lg)] lg:pe-[var(--2xl)]"
              : size === "desktop"
                ? "ps-[var(--lg)] pe-[var(--2xl)]"
                : "ps-[var(--md)] pe-[var(--lg)]"
          )}
        >
          {searching ? (
            <button
              type="button"
              onClick={onClear}
              className="size-6 shrink-0"
              aria-label="پاک کردن"
            >
              <Image alt="" className="size-full" height={24} src={closeCircle} width={24} />
            </button>
          ) : null}
          <input
            dir="rtl"
            aria-label="جستجوی کسب‌وکار"
            onKeyDown={(event) => { if(event.key === 'Enter') { event.preventDefault(); onSearchClick() } }}
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-right text-[var(--input-value)] outline-none placeholder:text-[var(--input-placeholder)]",
              size === "responsive" ? "text-sm lg:text-base" : "text-base"
            )}
          />
          <button
            type="button"
            onClick={onSearchClick}
            className="size-6 shrink-0"
            aria-label="جستجو"
          >
            <Image alt="" className="size-full" height={24} src={searchIcon} width={24} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onSearchClick}
          className={cn(
            "flex h-full min-w-0 flex-1 items-center justify-between gap-[var(--md)]",
            size === "responsive"
              ? "ps-[var(--md)] pe-[var(--lg)] lg:ps-[var(--lg)] lg:pe-[var(--2xl)]"
              : size === "desktop"
                ? "ps-[var(--lg)] pe-[var(--2xl)]"
                : "ps-[var(--md)] pe-[var(--lg)]"
          )}
        >
          {searching ? (
            <span className="size-6 shrink-0" aria-hidden>
              <Image alt="" className="size-full" height={24} src={closeCircle} width={24} />
            </span>
          ) : (
            <span className="size-6 shrink-0" aria-hidden />
          )}
          <span className="flex min-w-0 items-center justify-start gap-[var(--md)]">
            <span
              className={cn(
                "truncate",
                size === "responsive" ? "text-sm lg:text-base" : "text-base",
                searching
                  ? "text-[var(--input-value)]"
                  : "text-[var(--input-placeholder)]"
              )}
            >
              {value || placeholder}
            </span>
            <span className="size-6 shrink-0 overflow-clip">
              <Image alt="" className="size-full" height={24} src={searchIcon} width={24} />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

export { BusinessSearch }
export type { BusinessSearchState }
