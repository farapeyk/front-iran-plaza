"use client"
import Image from "next/image";

import { useState } from "react"
import { cn } from "@/design/lib/utils"
const searchIcon = "/design/icons/search-dark.svg"
const closeCircle = "/design/icons/close-circle.svg"

type SearchFieldProps = {
  className?: string
  value?: string
  defaultValue?: string
  placeholder?: string
  onChange?: (value: string) => void
  onClear?: () => void
}

/** Figma Search — pill search input (Default / Active / Searching) */
function SearchField({
  className,
  value: controlled,
  defaultValue = "",
  placeholder = "جستجو",
  onChange,
  onClear,
}: SearchFieldProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue)
  const [focused, setFocused] = useState(false)
  const value = controlled ?? uncontrolled
  const hasValue = value.length > 0
  const active = focused || hasValue

  function setValue(next: string) {
    if (controlled === undefined) setUncontrolled(next)
    onChange?.(next)
  }

  function clear() {
    setValue("")
    onClear?.()
  }

  return (
    <div
      data-slot="search-field"
      data-state={hasValue ? "searching" : active ? "active" : "default"}
      className={cn(
        "flex h-14 w-full max-w-[345px] items-center gap-[var(--lg)] rounded-full bg-[var(--surface)] pe-[var(--xl)] ps-[var(--lg)]",
        active
          ? "border-2 border-[var(--input-active-border)]"
          : "border border-[var(--opacity-dark-16)]",
        className
      )}
    >
      {hasValue ? (
        <button
          type="button"
          aria-label="پاک کردن"
          onClick={clear}
          className="shrink-0"
        >
          <Image alt="" className="size-6" height={24} src={closeCircle} width={24} />
        </button>
      ) : null}

      <div className="flex min-w-0 flex-1 items-center justify-start gap-[var(--lg)]">
        <input
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="min-w-0 flex-1 bg-transparent text-right text-base text-[var(--text-title)] outline-none placeholder:text-[var(--input-placeholder)]"
        />
        <Image
          alt=""
          className="size-6 shrink-0"
          height={24}
          src={searchIcon}
          width={24}
        />
      </div>
    </div>
  )
}

export { SearchField }
