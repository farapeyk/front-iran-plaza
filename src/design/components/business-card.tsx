"use client"

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { VipBadge } from "@/design/components/vip-badge"
const locationIcon = "/design/icons/location.svg"

export type BusinessCardData = {
  id: string
  name: string
  description: string
  location: string
  image: string
  vip?: boolean
  href?: string
}

function BusinessCard({
  business,
  className,
}: {
  business: BusinessCardData
  className?: string
}) {
  return (
    <article
      className={cn(
        "relative flex w-[260px] shrink-0 flex-col items-center gap-6 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] px-4 pb-4 pt-8",
        className
      )}
    >
      {business.vip !== false && (
        <VipBadge className="absolute start-4 top-4" />
      )}
      <div className="flex w-full flex-col items-center gap-4">
        <div className="size-[100px] overflow-hidden rounded-full border-[6px] border-secondary-25">
          <img
            alt=""
            className="size-full object-cover"
            height={100}
            src={business.image}
            width={100}
          />
        </div>
        <div className="w-full space-y-1 text-center">
          <h3 className="text-xl font-bold text-primary-950">{business.name}</h3>
          <p className="line-clamp-2 text-sm text-[var(--text-body)]">
            {business.description}
          </p>
        </div>
        <div className="flex items-center gap-1 text-sm text-[var(--text-title)]">
          <span>{business.location}</span>
          <img alt="" className="size-4" height={16} src={locationIcon} width={16} />
        </div>
      </div>
      <Link
        to={business.href ?? `/businesses/${business.id}`}
        className={cn(
          buttonVariants({ variant: "light", size: "sm" }),
          "w-full bg-[var(--opacity-dark-8)] text-[var(--text-title)] hover:bg-[var(--opacity-dark-16)]"
        )}
      >
        مشاهده پروفایل
      </Link>
    </article>
  )
}

export { BusinessCard }
