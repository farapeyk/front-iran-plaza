"use client"
import Image from "next/image";

import { useState, type FormEvent } from "react"
import { cn } from "@/design/lib/utils"
const sendIcon = "/design/icons/send.svg"

type WriteCommentProps = {
  className?: string
  size?: "mobile" | "desktop"
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (value: string) => void
  onSubmit?: (value: string) => void
}

/** Figma Write a comment — cream field + primary send button */
function WriteComment({
  className,
  size = "mobile",
  placeholder = "نظر خود را بنویسید...",
  value: controlled,
  defaultValue = "",
  onChange,
  onSubmit,
}: WriteCommentProps) {
  const [internal, setInternal] = useState(defaultValue)
  const [focused, setFocused] = useState(false)
  const value = controlled ?? internal
  const isDesktop = size === "desktop"

  const setValue = (v: string) => {
    setInternal(v)
    onChange?.(v)
  }

  const submit = (e?: FormEvent) => {
    e?.preventDefault()
    const trimmed = value.trim()
    if (!trimmed) return
    onSubmit?.(trimmed)
    setValue("")
  }

  return (
    <form
      data-slot="write-comment"
      onSubmit={submit}
      className={cn(
        "flex items-center gap-[var(--lg)] rounded-[var(--radius-xs)] transition-colors",
        isDesktop ? "h-[72px] ps-4 pe-6" : "h-14 ps-2 pe-4",
        focused
          ? "border-2 border-[var(--opacity-dark-16)] bg-secondary-25"
          : "border border-[var(--border-subtle)] bg-secondary-50",
        className
      )}
    >
      <button
        type="submit"
        aria-label="ارسال نظر"
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-primary-700",
          isDesktop ? "size-12" : "size-10"
        )}
      >
        <Image
          alt=""
          className="size-6 -scale-x-100"
          height={24}
          src={sendIcon}
          width={24}
        />
      </button>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-right text-[var(--input-value)] outline-none placeholder:text-[var(--input-placeholder)]",
          isDesktop ? "text-xl" : "text-base"
        )}
      />
    </form>
  )
}

export { WriteComment }
