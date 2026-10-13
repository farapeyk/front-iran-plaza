"use client"

import { useState } from "react"
import { cn } from "@/design/lib/utils"
const linkIcon = "/design/icons/link.svg"

type CopyLinkButtonProps = {
  className?: string
  value?: string
  label?: string
  copiedLabel?: string
}

/** Figma copy link button — not Copied / Copied */
function CopyLinkButton({
  className,
  value,
  label = "کپی لینک",
  copiedLabel = "کپی شد..",
}: CopyLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    const text = value ?? (typeof window !== "undefined" ? window.location.href : "")
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      data-slot="copy-link-button"
      data-state={copied ? "copied" : "idle"}
      onClick={copy}
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-full px-4 text-base font-bold text-[var(--text-body)] transition-colors",
        copied
          ? "w-[120px] bg-[var(--btn-soft-fill)]"
          : "border border-[var(--opacity-dark-16)] bg-transparent hover:bg-[var(--opacity-dark-8)]",
        className
      )}
    >
      <img alt="" className="size-6 shrink-0" height={24} src={linkIcon} width={24} />
      <span className="pt-0.5">{copied ? copiedLabel : label}</span>
    </button>
  )
}

export { CopyLinkButton }
