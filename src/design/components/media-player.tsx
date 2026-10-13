"use client"

import { cn } from "@/design/lib/utils"

type MediaPlayerProps = {
  className?: string
  size?: "mobile" | "desktop"
  /** hover/active = primary fill */
  active?: boolean
  /** Visual play indicator inside an existing interactive control. */
  decorative?: boolean
  onClick?: () => void
  "aria-label"?: string
}

/** Figma Player — circular play control */
function MediaPlayer({
  className,
  size = "desktop",
  active = false,
  decorative = false,
  onClick,
  "aria-label": ariaLabel = "پخش",
}: MediaPlayerProps) {
  const isMobile = size === "mobile"
  const Tag = decorative ? "span" : "button"

  return (
    <Tag
      type={decorative ? undefined : "button"}
      data-slot="media-player"
      aria-label={decorative ? undefined : ariaLabel}
      aria-hidden={decorative || undefined}
      onClick={decorative ? undefined : onClick}
      className={cn(
        "flex items-center justify-center rounded-full ps-1 transition-colors",
        isMobile ? "size-12" : "size-16",
        active
          ? "bg-primary-700 hover:bg-primary-600"
          : "bg-[var(--opacity-dark-56)] hover:bg-primary-700",
        className
      )}
    >
      <span
        className={cn(
          "ms-0.5 block border-y-transparent border-s-transparent",
          isMobile
            ? "size-0 border-y-[7px] border-s-[12px]"
            : "size-0 border-y-[9px] border-s-[16px]",
          active ? "border-s-secondary-25" : "border-s-white group-hover:border-s-secondary-25"
        )}
        style={{
          borderInlineStartColor: active ? "var(--secondary-25)" : "white",
          borderBlockColor: "transparent",
          borderInlineEndWidth: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: isMobile ? "7px 0 7px 12px" : "9px 0 9px 16px",
        }}
      />
    </Tag>
  )
}

export { MediaPlayer }
