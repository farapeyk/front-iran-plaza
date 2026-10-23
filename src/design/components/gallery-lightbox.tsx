"use client"
import Image from "next/image";

import { useState } from "react"
import { useModalFocus } from '@/design/lib/use-modal-focus'
import { cn } from "@/design/lib/utils"
import { ModalHeader } from "@/design/components/modal-header"
import { MediaPlayer } from "@/design/components/media-player"
const galleryIcon = "/design/icons/gallery.svg"
const arrowLeft = "/design/icons/arrow-left.svg"
const arrowRight = "/design/icons/arrow-right.svg"
import {
  galleryProfileDefaults,
  type GalleryItem,
} from "@/design/data/gallery"

type GalleryLightboxProps = {
  open: boolean
  onClose: () => void
  items?: GalleryItem[]
  initialIndex?: number
  className?: string
}

/** Figma Image gallery / Gallery — 6908:14368 + 7327:33598 */
function GalleryLightbox(props: GalleryLightboxProps) {
  if (!props.open || props.items?.length === 0) return null
  return <GalleryLightboxContent key={props.initialIndex ?? 0} {...props} />
}

function GalleryLightboxContent({
  onClose,
  items = galleryProfileDefaults,
  initialIndex = 0,
  className,
}: GalleryLightboxProps) {
  const [index, setIndex] = useState(initialIndex)
  const modalRef = useModalFocus(true, onClose)

  const current = items[index] ?? items[0]
  const count = items.length

  function go(delta: number) {
    setIndex((i) => (i + delta + count) % count)
  }

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-[var(--main-bg)]",
        className
      )}
      role="dialog"
      aria-modal
      aria-label="گالری"
    >
      <ModalHeader
        title="گالری تصاویر / ویدئو"
        showClose
        showIcon
        iconSrc={galleryIcon}
        device="desktop"
        onClose={onClose}
      />

      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-between gap-[var(--2xl)] px-[var(--page-gutter)] pb-[var(--2xl)] lg:px-[var(--8xl)] lg:pb-[var(--2xl)] lg:pt-[var(--5xl)]">
        <div className="flex w-full flex-1 items-center gap-[var(--3xl)] lg:gap-[var(--7xl)]">
          <button
            type="button"
            aria-label="بعدی"
            onClick={() => go(1)}
            className="hidden size-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--btn-black-outline)] lg:flex"
          >
            <Image alt="" className="size-6" height={24} src={arrowLeft} width={24} />
          </button>

          <div className="relative min-h-[260px] min-w-0 flex-1 overflow-hidden rounded-[var(--radius-xs)] border-[length:var(--xl)] border-secondary-50 lg:min-h-[480px]">
            <Image
              alt=""
              fill
              sizes="(min-width: 1024px) calc(100vw - 256px), 100vw"
              src={current.src}
              className="absolute inset-0 size-full object-contain"
            />
            {current.isVideo ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <MediaPlayer size="desktop" />
              </div>
            ) : null}

            <div className="absolute inset-x-0 bottom-5 flex justify-between px-5 lg:hidden">
              <button
                type="button"
                aria-label="قبلی"
                onClick={() => go(-1)}
                className="flex size-10 items-center justify-center rounded-full bg-[var(--backdrop)]"
              >
                <Image
                  alt=""
                  className="size-6 brightness-0 invert"
                  height={24}
                  src={arrowRight}
                  width={24}
                />
              </button>
              <button
                type="button"
                aria-label="بعدی"
                onClick={() => go(1)}
                className="flex size-10 items-center justify-center rounded-full bg-[var(--backdrop)]"
              >
                <Image
                  alt=""
                  className="size-6 brightness-0 invert"
                  height={24}
                  src={arrowLeft}
                  width={24}
                />
              </button>
            </div>
          </div>

          <button
            type="button"
            aria-label="قبلی"
            onClick={() => go(-1)}
            className="hidden size-12 shrink-0 items-center justify-center rounded-full border-2 border-[var(--btn-black-outline)] lg:flex"
          >
            <Image alt="" className="size-6" height={24} src={arrowRight} width={24} />
          </button>
        </div>

        <div className="flex w-full gap-0.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {items.map((item, i) => {
            const active = i === index
            return (
              <button
                key={`${item.src}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                className={cn(
                  "relative h-20 w-[100px] shrink-0 overflow-hidden bg-white lg:h-32 lg:w-40",
                  active
                    ? "border-4 border-primary-700"
                    : "opacity-50 lg:opacity-[0.48]"
                )}
              >
                <Image
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 160px, 100px"
                  src={item.src}
                  className="absolute inset-0 size-full object-cover"
                />
                {item.isVideo ? (
                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex size-8 items-center justify-center rounded-full bg-[var(--opacity-dark-56)]">
                      <span className="ms-0.5 size-0 border-y-[6px] border-s-[10px] border-y-transparent border-s-white" />
                    </span>
                  </span>
                ) : null}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { GalleryLightbox }
