"use client"

import { cn } from "@/design/lib/utils"
const userBold = "/design/icons/user-bold.svg"

/**
 * Iran Plaza User avatar — Figma Design System Components «User»
 * Size: 32 | 40 | 48 | 64 | 80 | 100 | 120
 * Color: primary | secondary | opacity-dark | opacity-white | white-neutral | gold-neutral
 */

const sizeMap = {
  32: { box: "size-8", icon: "size-4" },
  40: { box: "size-10", icon: "size-4" },
  48: { box: "size-12", icon: "size-6" },
  64: { box: "size-16", icon: "size-8" },
  80: { box: "size-20", icon: "size-10" },
  100: { box: "size-[100px]", icon: "size-12" },
  120: { box: "size-[120px]", icon: "size-14" },
} as const

const colorMap = {
  primary: "bg-primary-700",
  secondary: "bg-secondary-500",
  "opacity-dark": "bg-[var(--opacity-dark-16)]",
  "opacity-white": "bg-[var(--opacity-light-16)]",
  "white-neutral": "bg-[var(--gray-25)]",
  "gold-neutral": "bg-secondary-200",
} as const

type UserAvatarProps = {
  className?: string
  size?: keyof typeof sizeMap
  color?: keyof typeof colorMap
  src?: string
  alt?: string
}

function UserAvatar({
  className,
  size = 48,
  color = "primary",
  src,
  alt = "",
}: UserAvatarProps) {
  const dims = sizeMap[size]

  return (
    <div
      data-slot="user-avatar"
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        dims.box,
        !src && colorMap[color],
        className
      )}
    >
      {src ? (
        <img alt={alt} className="size-full object-cover" src={src} />
      ) : (
        <img
          alt=""
          className={cn(dims.icon, color === "opacity-dark" || color === "white-neutral" ? "opacity-70" : "brightness-0 invert")}
          height={24}
          src={userBold}
          width={24}
        />
      )}
    </div>
  )
}

export { UserAvatar }
export type { UserAvatarProps }
