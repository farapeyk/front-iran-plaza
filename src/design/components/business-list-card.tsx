"use client"
import Image from "next/image";

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { VipBadge } from "@/design/components/vip-badge"
import { CipBadge } from "@/design/components/cip-badge"
import type { BusinessCardData } from "@/design/components/business-card"
const locationIcon = "/design/icons/location.svg"
const callIcon = "/design/icons/call.svg"

type BusinessListCardProps = {
  business: BusinessCardData & {
    ad?: boolean
    phone?: string
    /** Free = no VIP badge / only تماس; VIP = badge + مشاهده پروفایل */
    status?: "vip" | "free"
    isCip?: boolean
    hasInstallment?: boolean
  }
  className?: string
  layout?: "mobile" | "desktop" | "listing"
}

/** Figma Table of Business — Mobile/Desktop × VIP/Free */
function BusinessListCard({
  business,
  className,
  layout = "mobile",
}: BusinessListCardProps) {
  const isDesktop = layout === "desktop"
  const isVip = (business.status ?? (business.vip === false ? "free" : "vip")) === "vip"
  const href = business.href ?? `/businesses/${business.id}`
  const phone = business.phone ?? "tel:+989120000000"
  const address = business.location

  if (layout === "listing") {
    return <article data-slot="table-of-business" data-layout="listing" className={cn("listing-card", className)}>
      {(isVip || business.isCip) && <div className="listing-vip flex items-center gap-1">{isVip && <VipBadge />}{business.isCip && <CipBadge />}</div>}
      <div className="listing-card-heading">
        <Link to={href} aria-label={business.name} className="listing-logo"><Image src={business.image} alt="" width={100} height={100}/></Link>
        <div className="min-w-0"><h2><Link to={href}>{business.name}</Link></h2><p>{business.description}</p></div>
      </div>
      <div className="listing-card-footer">
        <div className="listing-location"><Image src={locationIcon} alt="" width={16} height={16}/><span>{address}</span>{business.hasInstallment && <Image src="/design/icons/convert-card.svg" alt="فروش اقساطی" width={20} height={20}/>}</div>
        <Link to={href} className={cn(buttonVariants({variant:"light",size:"sm"}),"listing-profile")}>مشاهده پروفایل</Link>
      </div>
    </article>
  }

  const contactBtn = (
    <a
      href={phone.startsWith("tel:") ? phone : `tel:${phone}`}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "gap-2",
        !isVip && isDesktop === false && "w-full"
      )}
    >
      <Image alt="" className="size-4" height={16} src={callIcon} width={16} />
      تماس
    </a>
  )

  const profileBtn = (
    <Link to={href} className={cn(buttonVariants({ size: "sm" }), "gap-2")}>
      مشاهده پروفایل
    </Link>
  )

  if (isDesktop && isVip) {
    return (
      <article
        data-slot="table-of-business"
        data-layout="desktop"
        data-status="vip"
        className={cn(
          "flex w-full max-w-[775px] items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-[var(--lg)]",
          className
        )}
      >
        <div className="flex min-w-0 flex-1 items-center justify-start gap-[var(--md)]">
          <div className="size-12 shrink-0 overflow-hidden rounded-full">
            <Image alt="" className="size-full object-cover" src={business.image} width={96} height={96} sizes="48px" />
          </div>
          <h3 className="min-w-0 flex-1 truncate text-start text-lg font-bold text-[var(--text-title)]">
            {business.name}
          </h3>
          <div className="flex items-center gap-1"><VipBadge />{business.isCip && <CipBadge />}</div>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-[var(--sm)] border-x border-[var(--opacity-dark-24)] px-[var(--lg)]">
          <Image alt="" className="size-4 shrink-0" height={16} src={locationIcon} width={16} />
          <p className="min-w-0 flex-1 text-start text-sm leading-relaxed text-[var(--text-body)]">
            {address}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {profileBtn}
          {contactBtn}
        </div>
      </article>
    )
  }

  if (isDesktop && !isVip) {
    return (
      <article
        data-slot="table-of-business"
        data-layout="desktop"
        data-status="free"
        className={cn("flex w-full max-w-[775px] items-stretch", className)}
      >
        <div className="flex min-w-0 flex-1 items-center justify-start gap-[var(--sm)] border border-[var(--opacity-dark-8)] py-[var(--lg)] pe-[var(--sm)] ps-[var(--lg)]">
          <h3 className="text-base font-bold text-[var(--text-title)]">{business.name}</h3>
          {business.isCip && <CipBadge />}
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-start border-y border-[var(--opacity-dark-8)] p-[var(--lg)]">
          <p className="text-start text-sm leading-relaxed text-[var(--text-body)]">
            {address}
          </p>
        </div>
        <div className="flex shrink-0 items-center border border-[var(--opacity-dark-8)] px-[var(--lg)]">
          {contactBtn}
        </div>
      </article>
    )
  }

  /* Mobile VIP */
  if (isVip) {
    return (
      <article
        data-slot="table-of-business"
        data-layout="mobile"
        data-status="vip"
        className={cn(
          "relative flex w-full max-w-[345px] flex-col border-b-2 border-[var(--opacity-dark-8)]",
          className
        )}
      >
        <div className="flex w-full items-center gap-[var(--md)] py-[var(--lg)]">
          <div className="size-12 shrink-0 overflow-hidden rounded-full">
            <Image alt="" className="size-full object-cover" src={business.image} width={96} height={96} sizes="48px" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between">
            <h3 className="min-w-0 flex-1 truncate text-start text-lg font-bold text-[var(--text-title)]">
              {business.name}
            </h3>
            <div className="flex items-center gap-1"><VipBadge />{business.isCip && <CipBadge />}</div>
          </div>
        </div>

        {business.ad ? (
          <span className="absolute start-0 top-[68px] bg-[var(--main-bg)] pe-[var(--xs)] text-sm font-bold text-[var(--text-danger)]">
            Ads
          </span>
        ) : null}

        <div className="flex w-full items-center justify-center gap-[var(--sm)] border-t border-[var(--opacity-dark-8)] pt-[var(--lg)]">
          <Image alt="" className="size-4 shrink-0" height={16} src={locationIcon} width={16} />
          <p className="min-w-0 flex-1 text-start text-sm leading-relaxed text-[var(--text-body)]">
            {address}
          </p>
        </div>

        <div className="flex w-full gap-[var(--sm)] pb-[var(--2xl)] pt-[var(--lg)]">
          <div className="min-w-0 flex-1">{profileBtn}</div>
          <div className="min-w-0 flex-1">{contactBtn}</div>
        </div>
      </article>
    )
  }

  /* Mobile Free */
  return (
    <article
      data-slot="table-of-business"
      data-layout="mobile"
      data-status="free"
      className={cn("flex w-full max-w-[345px] items-stretch", className)}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-[var(--sm)] border border-[var(--opacity-dark-8)] py-[var(--lg)] pe-0 ps-[var(--sm)]">
        <h3 className="w-full text-start text-base font-bold text-[var(--text-title)]">
          {business.name}
        </h3>
        {business.isCip && <CipBadge />}
      </div>
      <div className="flex min-w-0 flex-1 items-start justify-center border-y border-[var(--opacity-dark-8)] px-[var(--sm)] py-[var(--lg)]">
        <p className="text-start text-sm leading-relaxed text-[var(--text-body)]">{address}</p>
      </div>
      <div className="flex w-[100px] shrink-0 flex-col items-start gap-[var(--sm)] border border-[var(--opacity-dark-8)] py-[var(--lg)] pe-[var(--sm)] ps-0">
        {contactBtn}
      </div>
    </article>
  )
}

export { BusinessListCard }
