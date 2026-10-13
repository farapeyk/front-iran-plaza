"use client"

import { cn } from "@/design/lib/utils"
import { ModalHeader } from "@/design/components/modal-header"
import { Switch } from "@/design/components/ui/switch"
import { VipBadge } from "@/design/components/vip-badge"
const arrowLeft = "/design/icons/arrow-left.svg"
const locationIcon = "/design/icons/location.svg"
const element3 = "/design/icons/element-3.svg"
const galleryIcon = "/design/icons/gallery.svg"
const mapIcon = "/design/icons/map.svg"

type BusinessesFiltersSheetProps = {
  open: boolean
  onClose: () => void
  vipOnly: boolean
  onVipOnlyChange: (v: boolean) => void
  hasMedia: boolean
  onHasMediaChange: (v: boolean) => void
  cityLabel?: string
  neighborhoodLabel?: string
  categoryLabel?: string
  onOpenCategory?: () => void
  onOpenCity?: () => void
  onOpenNeighborhood?: () => void
  className?: string
}

type NavRowProps = {
  title: string
  subtitle: string
  icon: string
  onClick?: () => void
}

function NavRow({ title, subtitle, icon, onClick }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-[var(--lg)] border-b border-[var(--opacity-dark-8)] py-[var(--lg)] text-right"
    >
      <img alt="" className="size-4 shrink-0" height={16} src={arrowLeft} width={16} />
      <div className="min-w-0 flex-1">
        <p className="text-lg font-bold text-[var(--text-title)]">{title}</p>
        <p className="text-sm text-[var(--text-subtitle)]">{subtitle}</p>
      </div>
      <img alt="" className="size-6 shrink-0" height={24} src={icon} width={24} />
    </button>
  )
}

type SwitchRowProps = {
  title: string
  subtitle: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  icon?: string
  vip?: boolean
}

function SwitchRow({
  title,
  subtitle,
  checked,
  onCheckedChange,
  icon,
  vip,
}: SwitchRowProps) {
  return (
    <div className="flex w-full items-center gap-[var(--lg)] border-b border-[var(--opacity-dark-8)] py-[var(--lg)]">
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
      <div className="min-w-0 flex-1 text-right">
        <p className="text-lg font-bold text-[var(--text-title)]">{title}</p>
        <p className="text-sm text-[var(--text-subtitle)]">{subtitle}</p>
      </div>
      {vip ? (
        <VipBadge className="shrink-0" />
      ) : icon ? (
        <img alt="" className="size-6 shrink-0" height={24} src={icon} width={24} />
      ) : null}
    </div>
  )
}

/** Figma Businesses filters — full-screen mobile sheet */
function BusinessesFiltersSheet({
  open,
  onClose,
  vipOnly,
  onVipOnlyChange,
  hasMedia,
  onHasMediaChange,
  cityLabel = "همه شهرها",
  neighborhoodLabel = "همه محله ها",
  categoryLabel = "همه دسته بندی ها",
  onOpenCategory,
  onOpenCity,
  onOpenNeighborhood,
  className,
}: BusinessesFiltersSheetProps) {
  if (!open) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-[var(--surface-cream)] lg:hidden",
        className
      )}
      role="dialog"
      aria-modal
      aria-label="فیلترها"
    >
      <ModalHeader title="فیلترها" showClose={false} showBack onBack={onClose} />

      <div className="flex-1 overflow-y-auto px-[var(--2xl)] pb-[var(--5xl)]">
        <NavRow
          title="دسته بندی کسب وکارها"
          subtitle={categoryLabel}
          icon={element3}
          onClick={onOpenCategory}
        />
        <NavRow
          title="شهر"
          subtitle={cityLabel}
          icon={locationIcon}
          onClick={onOpenCity}
        />
        <NavRow
          title="محله"
          subtitle={neighborhoodLabel}
          icon={mapIcon}
          onClick={onOpenNeighborhood}
        />
        <SwitchRow
          title="گالری تصاویر/ ویدئو"
          subtitle="فقط نمایش مشاغلی که گالری فعال دارند"
          checked={hasMedia}
          onCheckedChange={onHasMediaChange}
          icon={galleryIcon}
        />
        <SwitchRow
          title="فقط کسب وکارهای VIP"
          subtitle="عدم نمایش پروفایل کسب وکارهای رایگان"
          checked={vipOnly}
          onCheckedChange={onVipOnlyChange}
          vip
        />
      </div>
    </div>
  )
}

export { BusinessesFiltersSheet }
