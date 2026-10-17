"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
import { Button } from "@/design/components/ui/button"
const addIcon = "/design/icons/add.svg"
const playFill = "/design/icons/play-fill.svg"
const trashIcon = "/design/icons/trash.svg"

type VoiceProps = {
  className?: string
  /** Before add = CTA button; After add = player bar */
  state?: "before" | "after"
  currentTime?: string
  duration?: string
  onAdd?: () => void
  onPlay?: () => void
  onDelete?: () => void
}

/** Figma Voice — add voice CTA / recorded voice bar */
function Voice({
  className,
  state = "before",
  currentTime = "0:00",
  duration = "0:00",
  onAdd,
  onPlay,
  onDelete,
}: VoiceProps) {
  if (state === "before") {
    return (
      <Button
        type="button"
        variant="outline"
        className={cn(
          "rounded-full border-2 border-[var(--btn-black-outline)] bg-transparent text-[var(--btn-black-outline-label)] hover:bg-[var(--opacity-dark-8)]",
          className
        )}
        onClick={onAdd}
      >
        افزودن ویس
        <Image alt="" className="size-6" height={24} src={addIcon} width={24} />
      </Button>
    )
  }

  return (
    <div
      data-slot="voice"
      data-state="after"
      className={cn(
        "flex h-12 w-full max-w-[345px] items-center gap-[var(--sm)] rounded-full bg-secondary-100 pe-[var(--xs)] ps-[var(--md)]",
        className
      )}
    >
      <button
        type="button"
        aria-label="پخش"
        onClick={onPlay}
        className="flex size-8 shrink-0 items-center justify-center rounded-full"
      >
        <Image alt="" className="size-4" height={16} src={playFill} width={16} />
      </button>

      <div className="flex h-full min-w-0 flex-1 items-center gap-[var(--lg)]">
        <span className="shrink-0 pt-1.5 text-lg font-bold text-[var(--text-subtitle)]">
          {currentTime}
        </span>
        <div className="flex min-w-0 flex-1 items-center">
          <span className="size-3 shrink-0 rounded-full bg-primary-700" />
          <span className="h-1 min-w-0 flex-1 bg-[var(--opacity-dark-16)]" />
        </div>
        <span className="shrink-0 pt-1.5 text-lg font-bold text-[var(--text-subtitle)]">
          {duration}
        </span>
      </div>

      <button
        type="button"
        aria-label="حذف"
        onClick={onDelete}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--opacity-dark-8)] p-2.5"
      >
        <Image alt="" className="size-6" height={24} src={trashIcon} width={24} />
      </button>
    </div>
  )
}

export { Voice }
