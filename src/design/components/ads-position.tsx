"use client"
import Image from "next/image";

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { Button } from "@/design/components/ui/button"
const arrowLeft = "/design/icons/arrow-left.svg"

type AdsVariant = "list-desktop" | "list-mobile" | "banner-mobile"

type AdsPositionProps = {
  className?: string
  variant?: AdsVariant
  title?: string
  description?: string
  ctaLabel?: string
  href?: string
  onClick?: () => void
}

/** Figma Ads position — dashed red ad placeholder */
function AdsPosition({
  className,
  variant = "list-desktop",
  title = "اینجا محل تبلیغ شماست",
  description = "با تبلیغات موثر، فروش خود را افزایش دهید",
  ctaLabel = "سفارش",
  href,
  onClick,
}: AdsPositionProps) {
  const isBanner = variant === "banner-mobile"
  const isDesktop = variant === "list-desktop"

  const cta = (
    <Button
      variant="destructive"
      size={isDesktop ? "sm" : "sm"}
      className={cn(
        "rounded-full",
        isDesktop ? "h-10 px-4" : "h-8 px-3 text-sm",
        isBanner && "shrink-0"
      )}
      onClick={onClick}
    >
      {!isBanner ? (
        <Image
          alt=""
          className={cn("brightness-0 invert", isDesktop ? "size-6" : "size-4")}
          height={isDesktop ? 24 : 16}
          src={arrowLeft}
          width={isDesktop ? 24 : 16}
        />
      ) : null}
      {ctaLabel}
    </Button>
  )

  const ctaNode = href ? (
    <Link to={href} className={isBanner ? "shrink-0" : undefined}>
      {cta}
    </Link>
  ) : (
    cta
  )

  return (
    <div
      data-slot="ads-position"
      data-variant={variant}
      className={cn(
        "flex w-full flex-col rounded-[var(--radius-xs)] border-2 border-dashed border-[var(--danger)] bg-[var(--surface)]",
        isBanner
          ? "h-[86px] flex-row items-center justify-between gap-[var(--lg)] px-[var(--lg)]"
          : isDesktop
            ? "min-h-[280px] items-center justify-center gap-[var(--lg)] px-[var(--lg)] pt-[var(--lg)]"
            : "min-h-[172px] max-w-[345px] items-center justify-center gap-[var(--lg)] px-[var(--lg)] pt-[var(--sm)]",
        className
      )}
    >
      {isBanner ? (
        <>
          {ctaNode}
          <div className="flex min-w-0 flex-col items-start text-right">
            <p className="text-xl font-bold leading-normal text-[var(--danger)]">{title}</p>
            <p className="text-sm leading-relaxed text-[var(--text-body)]">
              {description}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center text-center">
            <p
              className={cn(
                "font-bold leading-normal text-[var(--danger)]",
                isDesktop ? "text-[22px]" : "text-xl"
              )}
            >
              {title}
            </p>
            <p
              className={cn(
                "leading-relaxed text-[var(--text-body)]",
                isDesktop ? "text-xl" : "text-lg"
              )}
            >
              {description}
            </p>
          </div>
          {ctaNode}
        </>
      )}
    </div>
  )
}

export { AdsPosition }
export type { AdsVariant, AdsPositionProps }
