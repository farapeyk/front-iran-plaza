"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
const closeX = "/design/icons/close-x.svg"
const arrowRight = "/design/icons/arrow-right.svg"

type ModalHeaderProps = {
  className?: string
  title?: string
  description?: string
  showClose?: boolean
  showBack?: boolean
  showDragHandle?: boolean
  showIcon?: boolean
  iconSrc?: string
  /** mobile sheet | desktop modal | page hero with back */
  device?: "mobile" | "desktop" | "page"
  onClose?: () => void
  onBack?: () => void
}

/** Figma Modal Header — close/back/drag/title/icon/description combinations */
function ModalHeader({
  className,
  title,
  description,
  showClose = true,
  showBack = false,
  showDragHandle = false,
  showIcon = false,
  iconSrc,
  device = "mobile",
  onClose,
  onBack,
}: ModalHeaderProps) {
  const isDesktop = device === "desktop"
  const isPage = device === "page"
  const hasTitle = Boolean(title)

  if (isPage || description) {
    return (
      <header
        data-slot="modal-header"
        className={cn(
          "flex w-full flex-col items-start gap-[var(--2xl)] bg-[var(--main-bg)]",
          isPage ? "gap-[var(--5xl)]" : "px-[var(--2xl)] py-[var(--5xl)]",
          className
        )}
      >
        {showBack ? (
          <button
            type="button"
            aria-label="بازگشت"
            onClick={onBack}
            className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[var(--opacity-dark-16)]"
          >
            <Image alt="" className="size-6" height={24} src={arrowRight} width={24} />
          </button>
        ) : null}
        <div className="flex w-full flex-col items-start gap-[var(--sm)]">
          {hasTitle ? (
            <h2
              className={cn(
                "text-right text-[var(--text-title)]",
                isPage ? "text-[32px] font-black leading-[1.4]" : "text-2xl font-bold"
              )}
            >
              {title}
            </h2>
          ) : null}
          {description ? (
            <p className="w-full text-right text-lg leading-relaxed text-[var(--text-body)]">
              {description}
            </p>
          ) : null}
        </div>
      </header>
    )
  }

  return (
    <header
      data-slot="modal-header"
      className={cn(
        "relative flex w-full items-center bg-[var(--main-bg)]",
        showDragHandle ? "h-20 justify-between ps-3 pe-6" : "h-[72px] justify-between ps-3 pe-6",
        isDesktop && "h-[88px] ps-4 pe-8",
        className
      )}
    >
      {showDragHandle ? (
        <span
          aria-hidden
          className="absolute start-1/2 top-3 h-1 w-12 -translate-x-1/2 rounded-full bg-[var(--opacity-dark-32)]"
        />
      ) : null}

      <div
        className={cn(
          "flex w-full items-center",
          hasTitle || showBack ? "justify-between" : "justify-start"
        )}
      >
        {showClose ? (
          <button
            type="button"
            aria-label="بستن"
            onClick={onClose}
            className="flex size-12 shrink-0 items-center justify-center rounded-full"
          >
            <Image alt="" className="size-6" height={24} src={closeX} width={24} />
          </button>
        ) : showBack ? (
          <button
            type="button"
            aria-label="بازگشت"
            onClick={onBack}
            className="flex size-12 shrink-0 items-center justify-center rounded-full"
          >
            <Image alt="" className="size-6" height={24} src={arrowRight} width={24} />
          </button>
        ) : (
          <span className="size-12 shrink-0" aria-hidden />
        )}

        {hasTitle ? (
          <div className="flex min-w-0 flex-1 items-center justify-start gap-[var(--md)]">
            <p
              className={cn(
                "truncate font-bold text-[var(--text-title)]",
                isDesktop ? "text-[22px]" : "text-lg"
              )}
            >
              {title}
            </p>
            {showIcon && iconSrc ? (
              <Image alt="" className="size-6 shrink-0" height={24} src={iconSrc} width={24} />
            ) : null}
          </div>
        ) : null}

        {showBack && showClose ? (
          <button
            type="button"
            aria-label="بازگشت"
            onClick={onBack}
            className="flex size-12 shrink-0 items-center justify-center rounded-full"
          >
            <Image alt="" className="size-6" height={24} src={arrowRight} width={24} />
          </button>
        ) : !showClose && !showBack && hasTitle ? (
          <span className="size-12 shrink-0" aria-hidden />
        ) : null}
      </div>
    </header>
  )
}

export { ModalHeader }
