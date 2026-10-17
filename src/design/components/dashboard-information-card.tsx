"use client"
import Image from "next/image";

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { UserAvatar } from "@/design/components/user-avatar"
import { useDesignBusiness } from '@/design/provider'
const addIcon = "/design/icons/add.svg"

type DashboardInfoVariant = "free" | "active" | "expired"

type DashboardInformationCardProps = {
  className?: string
  variant?: DashboardInfoVariant
  name?: string
  phone?: string
  avatarSrc?: string
}

const statusCopy: Record<
  DashboardInfoVariant,
  { status: string; statusClass: string; cta?: { label: string; to: string; showAdd?: boolean } }
> = {
  free: {
    status: "ثبت نام نشده",
    statusClass: "text-[var(--text-danger)]",
    cta: {
      label: "ثبت رایگان کسب وکار",
      to: "/business-registration",
      showAdd: true,
    },
  },
  active: {
    status: "۳۰ روز مانده",
    statusClass: "text-primary-500",
  },
  expired: {
    status: "تمام شد",
    statusClass: "text-[var(--text-danger)]",
    cta: { label: "خرید اشتراک VIP", to: "/subscription" },
  },
}

/** Figma Dashboard information card — Free / Active / Expired */
function DashboardInformationCard({
  className,
  variant = "free",
  name = "علیرضا خلقت",
  phone = "۰۹۱۷۴۵۵۰۱۰۸",
  avatarSrc,
}: DashboardInformationCardProps) {
  const copy = statusCopy[variant]
  const business = useDesignBusiness()
  const expiry = business?.planExpiryDate ? new Date(business.planExpiryDate).toLocaleDateString('fa-IR',{timeZone:'Asia/Tehran'}) : ''

  return (
    <div
      data-slot="dashboard-information-card"
      data-variant={variant}
      className={cn(
        "flex w-full max-w-[284px] flex-col items-start rounded-[var(--radius-xs)] px-[var(--lg)]",
        variant !== "active" && "pb-[var(--lg)]",
        className
      )}
      style={{
        backgroundImage:
          "linear-gradient(57deg, var(--secondary-300) 0%, var(--secondary-50) 100%)",
      }}
    >
      <div className="flex w-full items-center justify-start gap-[var(--md)] border-b border-[var(--opacity-dark-8)] py-[var(--lg)]">
        <div className="flex min-w-0 flex-1 flex-col items-start text-start">
          <p className="w-full text-lg font-bold text-[var(--text-title)]">{name}</p>
          <p className="w-full text-sm text-[var(--text-subtitle)]">{phone}</p>
        </div>
        {variant === "free" ? (
          <UserAvatar size={48} color="opacity-dark" />
        ) : (
          <UserAvatar size={48} src={avatarSrc} color="opacity-dark" />
        )}
      </div>

      <div className="flex w-full items-start justify-between py-[var(--md)] text-sm">
        <span className={copy.statusClass}>{business ? business.planType : 'ثبت نام نشده'}</span>
        <span className="text-[var(--text-title)]">{business?.planType==='VIP' ? `اعتبار VIP تا ${expiry}` : business ? 'پروفایل رایگان' : 'کسب‌وکار ثبت نشده'}</span>
      </div>

      {copy.cta ? (
        <Link
          to={copy.cta.to}
          className={cn(buttonVariants({ size: "sm" }), "w-full")}
        >
          {copy.cta.label}
          {copy.cta.showAdd ? (
            <Image
              alt=""
              className="size-6 brightness-0 invert"
              height={24}
              src={addIcon}
              width={24}
            />
          ) : null}
        </Link>
      ) : null}
    </div>
  )
}

export { DashboardInformationCard }
export type { DashboardInfoVariant }
