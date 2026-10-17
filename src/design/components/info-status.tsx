"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
const tickCircle = "/design/icons/tick-circle.svg"
const infoCircleWarning = "/design/icons/info-circle-warning.svg"

type InfoStatusVariant = "approved" | "review"

type InfoStatusProps = {
  className?: string
  variant?: InfoStatusVariant
  message?: string
}

const defaults: Record<
  InfoStatusVariant,
  { message: string; border: string; text: string; icon: string }
> = {
  approved: {
    message: "اطلاعات شما تایید شده است",
    border: "border-[var(--success)]",
    text: "text-[var(--green-600)]",
    icon: tickCircle,
  },
  review: {
    message: "اطلاعات شما درحال برسی است",
    border: "border-[var(--btn-warning-fill)]",
    text: "text-[var(--warning)]",
    icon: infoCircleWarning,
  },
}

/** Figma Info status — approved / under review banner */
function InfoStatus({
  className,
  variant = "approved",
  message,
}: InfoStatusProps) {
  const styles = defaults[variant]

  return (
    <div
      data-slot="info-status"
      data-variant={variant}
      className={cn(
        "flex h-14 w-full max-w-[345px] items-center justify-start gap-[var(--sm)] overflow-hidden rounded-[var(--radius-xs)] border px-[var(--lg)]",
        styles.border,
        className
      )}
    >
      <p
        className={cn(
          "min-w-0 flex-1 text-right text-lg font-bold leading-normal",
          styles.text
        )}
      >
        {message ?? styles.message}
      </p>
      <Image
        alt=""
        className="size-6 shrink-0"
        height={24}
        src={styles.icon}
        width={24}
      />
    </div>
  )
}

export { InfoStatus }
export type { InfoStatusVariant }
