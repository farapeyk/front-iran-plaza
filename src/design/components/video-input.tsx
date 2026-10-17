"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
const addCircle = "/design/icons/add-circle.svg"
const trashIcon = "/design/icons/trash.svg"
const playFill = "/design/icons/play-fill.svg"
const videoThumb = "/design/video-thumb.webp"

type VideoInputProps = {
  className?: string
  /** empty = add placeholder; filled = thumbnail with delete */
  state?: "empty" | "filled"
  title?: string
  description?: string
  thumbnailSrc?: string
  onAdd?: () => void
  onDelete?: () => void
}

/** Figma video input — empty / filled gallery upload */
function VideoInput({
  className,
  state = "empty",
  title = "ویدیو",
  description = "برای جذب مشتریان بیشتر، یک ویدیو حداکثر یک دقیقه ای اضافه کنید.",
  thumbnailSrc = videoThumb,
  onAdd,
  onDelete,
}: VideoInputProps) {
  const filled = state === "filled"

  return (
    <div
      data-slot="video-input"
      data-state={state}
      className={cn(
        "flex w-full max-w-[345px] items-center justify-start gap-[var(--lg)]",
        className
      )}
    >
      <div
        className={cn(
          "relative h-[117px] w-[164.5px] shrink-0 overflow-hidden rounded-[var(--radius-xs)]",
          filled
            ? "border border-[var(--opacity-dark-8)] bg-[var(--surface-muted)]"
            : "bg-secondary-50"
        )}
      >
        {filled ? (
          <>
            <Image
              alt=""
              className="absolute inset-0 size-full object-cover"
              height={234}
              sizes="165px"
              src={thumbnailSrc}
              width={329}
            />
            <button
              type="button"
              aria-label="حذف ویدیو"
              onClick={onDelete}
              className="absolute start-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--opacity-dark-56)] p-2.5"
            >
              <Image
                alt=""
                className="size-6 brightness-0 invert"
                height={24}
                src={trashIcon}
                width={24}
              />
            </button>
            <Image
              alt=""
              className="absolute bottom-3 start-3 size-4 brightness-0 invert"
              height={16}
              src={playFill}
              width={16}
            />
          </>
        ) : (
          <button
            type="button"
            aria-label="افزودن ویدیو"
            onClick={onAdd}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Image alt="" className="size-8" height={32} src={addCircle} width={32} />
          </button>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-px text-right">
        <p className="w-full text-[22px] font-bold leading-normal text-[var(--text-title)]">
          {title}
        </p>
        <p className="w-full text-base leading-relaxed text-[var(--text-body)]">
          {description}
        </p>
      </div>
    </div>
  )
}

export { VideoInput }
