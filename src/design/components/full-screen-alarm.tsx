"use client"

import type { ReactNode } from "react"
import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { Button } from "@/design/components/ui/button"
const tickIcon = "/design/icons/tick.svg"
const infoCircle = "/design/icons/info-circle.svg"
const arrowRight = "/design/icons/arrow-right.svg"

type AlarmVariant = "success" | "info"

type FullScreenAlarmProps = {
  className?: string
  variant?: AlarmVariant
  title: ReactNode
  description?: string
  primaryAction?: { label: string; to?: string; onClick?: () => void; showBackIcon?: boolean }
  secondaryAction?: { label: string; to?: string; onClick?: () => void }
}

const variantStyles: Record<
  AlarmVariant,
  { iconWrap: string; title: string; icon: string }
> = {
  success: {
    iconWrap: "border-[var(--green-25)] bg-[var(--success)]",
    title: "text-[var(--green-600)]",
    icon: tickIcon,
  },
  info: {
    iconWrap: "border-[var(--blue-50)] bg-[var(--info)]",
    title: "text-[var(--link)]",
    icon: infoCircle,
  },
}

/** Figma Successful / Information Full Screen Alarm */
function FullScreenAlarm({
  className,
  variant = "success",
  title,
  description,
  primaryAction,
  secondaryAction,
}: FullScreenAlarmProps) {
  const styles = variantStyles[variant]

  const primaryBtn = (
    <Button
      variant={variant === "success" ? "success" : "default"}
      className={cn(
        "w-full",
        variant === "info" &&
          "bg-[var(--info)] text-[var(--text-light-title)] hover:bg-[var(--link)]"
      )}
      onClick={primaryAction?.onClick}
    >
      {primaryAction?.label}
      {primaryAction?.showBackIcon ? (
        <img alt="" className="size-6 brightness-0 invert" height={24} src={arrowRight} width={24} />
      ) : null}
    </Button>
  )

  return (
    <div
      data-slot="full-screen-alarm"
      data-variant={variant}
      className={cn(
        "flex w-full max-w-[700px] flex-col items-center gap-[var(--2xl)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] px-[var(--2xl)] pb-[var(--3xl)] pt-[var(--5xl)]",
        className
      )}
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-full border-8 p-2.5",
          styles.iconWrap
        )}
      >
        <img
          alt=""
          className={cn("size-6", variant === "info" && "brightness-0 invert")}
          height={24}
          src={styles.icon}
          width={24}
        />
      </div>

      <div className="flex w-full flex-col items-center gap-1 text-center">
        <h2
          className={cn(
            "text-[28px] font-extrabold leading-normal",
            styles.title
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="text-lg leading-normal text-[var(--text-body)]">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex w-full flex-col gap-[var(--md)] sm:flex-row">
        {primaryAction ? (
          primaryAction.to ? (
            <Link to={primaryAction.to} className="w-full">
              {primaryBtn}
            </Link>
          ) : (
            primaryBtn
          )
        ) : null}
        {secondaryAction ? (
          secondaryAction.to ? (
            <Link to={secondaryAction.to} className="w-full">
              <Button variant="outline" className="w-full" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            </Link>
          ) : (
            <Button
              variant="outline"
              className="w-full"
              onClick={secondaryAction.onClick}
            >
              {secondaryAction.label}
            </Button>
          )
        ) : null}
      </div>
    </div>
  )
}

export { FullScreenAlarm }
