"use client"
import Image from "next/image";

import { galleryProfileDefaults, type GalleryItem } from "@/design/data/gallery"
import { cn } from "@/design/lib/utils"
import { MediaPlayer } from "@/design/components/media-player"


type GalleryProfileProps = {
  className?: string
  /** Figma type 1–4 — which cell is expanded (1-based from start/RTL-left in LTR code = first in flex) */
  type?: "1" | "2" | "3" | "4"
  items?: GalleryItem[]
}



/** Figma Gallery profile — 4-cell media strip; one cell expands per type */
function GalleryProfile({
  className,
  type = "1",
  items = galleryProfileDefaults,
}: GalleryProfileProps) {
  const expandedIndex = Number(type) - 1
  const cells = items.slice(0, 4)

  return (
    <div
      data-slot="gallery-profile"
      className={cn(
        "flex h-[220px] w-full gap-0.5 overflow-hidden lg:h-[400px]",
        className
      )}
    >
      {cells.map((item, i) => {
        const isFirst = i === 0
        const isLast = i === cells.length - 1
        const expanded = i === expandedIndex

        return (
          <div
            key={`${item.src}-${i}`}
            className={cn(
              "relative h-full overflow-hidden border border-[var(--opacity-dark-8)] bg-secondary-100",
              expanded ? "min-w-0 flex-[2.5]" : "min-w-0 flex-1",
              isFirst && "rounded-s-[var(--radius-xs)]",
              isLast && "rounded-e-[var(--radius-xs)]"
            )}
          >
            <Image
              alt=""
              className="absolute inset-0 size-full object-cover"
              fill
              sizes="(min-width: 1024px) 40vw, 60vw"
              src={item.src}
            />
            {item.isVideo ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <MediaPlayer
                  decorative
                  size="desktop"
                  className="pointer-events-none max-lg:size-12"
                />
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}

export { GalleryProfile }
