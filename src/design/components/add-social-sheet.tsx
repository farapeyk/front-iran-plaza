"use client"

import { useMemo, useState } from "react"
import { cn } from "@/design/lib/utils"
import { ModalHeader } from "@/design/components/modal-header"
import { SocialMediaIcon, type SocialName } from "@/design/components/social-media-icon"
const addIcon = "/design/icons/add.svg"
const searchIcon = "/design/icons/search-dark.svg"

const SOCIAL_OPTIONS: { name: SocialName; label: string }[] = [
  { name: "Instagram", label: "اینستاگرام" },
  { name: "Telegram", label: "تلگرام" },
  { name: "Whatsapp", label: "واتساپ" },
  { name: "Email", label: "ایمیل" },
  { name: "Website", label: "وبسایت" },
  { name: "Aparat", label: "آپارات" },
  { name: "Youtube", label: "یوتیوب" },
  { name: "X", label: "ایکس(توییتر)" },
  { name: "Facebook", label: "فیسبوک" },
  { name: "Linkedin", label: "لینکدین" },
  { name: "Roobika", label: "روبیکا" },
  { name: "Bale", label: "بله" },
  { name: "Eita", label: "ایتا" },
  { name: "Soroush", label: "سروش" },
]

type AddSocialSheetProps = {
  open: boolean
  onClose: () => void
  disabled?: SocialName[]
  onSelect?: (name: SocialName) => void
  className?: string
}

/** Figma Add social media — 7711:42786 */
function AddSocialSheet({
  open,
  onClose,
  disabled = ["Instagram", "Telegram"],
  onSelect,
  className,
}: AddSocialSheetProps) {
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim()
    if (!q) return SOCIAL_OPTIONS
    return SOCIAL_OPTIONS.filter((s) => s.label.includes(q) || s.name.includes(q))
  }, [query])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--backdrop)] lg:items-center"
      role="dialog"
      aria-modal
      aria-label="افزودن شبکه اجتماعی"
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="بستن"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 flex max-h-[85svh] w-full max-w-lg flex-col overflow-hidden rounded-t-[var(--radius-lg)] bg-[var(--main-bg)] lg:rounded-[var(--radius-xs)]",
          className
        )}
      >
        <ModalHeader
          title="افزودن شبکه اجتماعی"
          showClose
          device="desktop"
          onClose={onClose}
        />

        <div className="px-[var(--3xl)]">
          <label className="flex h-14 w-full items-center gap-[var(--lg)] rounded-full border border-[var(--opacity-dark-16)] bg-[var(--surface)] px-[var(--xl)]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجو..."
              className="min-w-0 flex-1 bg-transparent text-right text-base outline-none placeholder:text-[var(--input-placeholder)]"
            />
            <img alt="" className="size-6 shrink-0" height={24} src={searchIcon} width={24} />
          </label>
        </div>

        <div className="mt-2 max-h-[min(420px,50svh)] overflow-y-auto px-[var(--3xl)] pb-[var(--5xl)]">
          <ul className="w-full">
            {filtered.map((s) => {
              const isDisabled = disabled.includes(s.name)
              return (
                <li key={s.name}>
                  <button
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      onSelect?.(s.name)
                      onClose()
                    }}
                    className={cn(
                      "flex h-14 w-full items-center gap-[var(--lg)] border-b border-[var(--opacity-dark-8)] py-[var(--lg)] text-right",
                      isDisabled && "opacity-[0.24]"
                    )}
                  >
                    <img
                      alt=""
                      className="size-6 shrink-0"
                      height={24}
                      src={addIcon}
                      width={24}
                    />
                    <span className="min-w-0 flex-1 text-base font-bold text-[var(--text-body)]">
                      {s.label}
                    </span>
                    <SocialMediaIcon name={s.name} type="Icon" className="shrink-0" />
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </div>
  )
}

export { AddSocialSheet, SOCIAL_OPTIONS }
