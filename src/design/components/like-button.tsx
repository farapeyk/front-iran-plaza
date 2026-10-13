"use client"

import { useState } from "react"
import { cn } from "@/design/lib/utils"
const likeIcon = "/design/icons/like.svg"
const dislikeIcon = "/design/icons/dislike.svg"
const likeWhite = "/design/icons/like-white.svg"
const dislikeWhite = "/design/icons/dislike-white.svg"

type LikeButtonProps = {
  className?: string
  type?: "like" | "dislike"
  pressed?: boolean
  defaultPressed?: boolean
  onPressedChange?: (pressed: boolean) => void
}

/** Figma Like button — Neutral outline / Green fill (like) / Red fill (dislike) */
function LikeButton({
  className,
  type = "like",
  pressed: controlled,
  defaultPressed = false,
  onPressedChange,
}: LikeButtonProps) {
  const [internal, setInternal] = useState(defaultPressed)
  const pressed = controlled ?? internal

  const toggle = () => {
    const next = !pressed
    setInternal(next)
    onPressedChange?.(next)
  }

  const isLike = type === "like"

  return (
    <button
      type="button"
      data-slot="like-button"
      data-type={type}
      data-pressed={pressed || undefined}
      aria-pressed={pressed}
      aria-label={isLike ? "پسندیدن" : "نپسندیدن"}
      onClick={toggle}
      className={cn(
        "flex size-8 items-center justify-center rounded-full transition-colors",
        pressed
          ? isLike
            ? "bg-[var(--btn-success-fill)]"
            : "bg-[var(--btn-danger-fill)]"
          : "border border-[var(--border-default)] bg-transparent hover:bg-[var(--opacity-dark-8)]",
        className
      )}
    >
      <img
        alt=""
        className="size-4"
        height={16}
        width={16}
        src={
          pressed
            ? isLike
              ? likeWhite
              : dislikeWhite
            : isLike
              ? likeIcon
              : dislikeIcon
        }
      />
    </button>
  )
}

export { LikeButton }
