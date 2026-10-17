"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
const vipBadge = "/design/shared/vip-badge.webp"

function VipBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn("relative inline-block h-7 w-[25px] overflow-clip", className)}
      aria-label="VIP"
    >
      <Image
        alt="VIP"
        className="absolute inset-0 size-full object-cover"
        height={28}
        src={vipBadge}
        width={25}
      />
    </span>
  )
}

export { VipBadge }
