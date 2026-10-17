"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
const notFoundBox = "/design/icons/not-found-box.svg"

type NotFoundProps = {
  className?: string
  title?: string
  description?: string
}

/** Figma not found — empty-state illustration + optional copy */
function NotFound({
  className,
  title = "موردی یافت نشد",
  description,
}: NotFoundProps) {
  return (
    <div
      data-slot="not-found"
      className={cn(
        "flex flex-col items-center justify-center gap-[var(--lg)] text-center",
        className
      )}
    >
      <Image
        alt=""
        src={notFoundBox}
        width={102}
        height={80}
        className="h-20 w-[102px]"
      />
      {title ? (
        <p className="text-lg font-bold text-[var(--text-title)]">{title}</p>
      ) : null}
      {description ? (
        <p className="max-w-xs text-base text-[var(--text-body)]">{description}</p>
      ) : null}
    </div>
  )
}

export { NotFound }
