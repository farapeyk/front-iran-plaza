"use client"
import Image from "next/image";

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"

export type SearchRowData = {
  id: string
  title: string
  subtitle: string
  image?: string
  iconSrc?: string
  ad?: boolean
  href?: string
}

function SearchRow({
  item,
  className,
}: {
  item: SearchRowData
  className?: string
}) {
  const media = item.image ? (
    <Image
      alt=""
      className="size-full object-cover"
      height={56}
      src={item.image}
      width={56}
    />
  ) : item.iconSrc ? (
    <span className="flex size-full items-center justify-center rounded-full border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-[10px]">
      <Image alt="" className="size-6" height={24} src={item.iconSrc} width={24} />
    </span>
  ) : null

  return (
    <Link
      to={item.href ?? `/businesses/${item.id}`}
      className={cn(
        "flex w-full items-center gap-[var(--md)] text-right",
        className
      )}
    >
      {item.ad && (
        <span className="shrink-0 text-sm font-bold text-[var(--danger)]">
          Ads
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-bold text-[var(--text-title)]">
          {item.title}
        </p>
        <p className="truncate text-sm text-[var(--text-body)]">{item.subtitle}</p>
      </div>
      <div className="size-14 shrink-0 overflow-hidden rounded-full">
        {media}
      </div>
    </Link>
  )
}

export { SearchRow }
