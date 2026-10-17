"use client"
import Image from "next/image";

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
const logoPrimary = "/design/brand/logo-primary.webp"
const logoWhite = "/design/brand/logo-white.webp"
const logoSecondary = "/design/brand/logo-secondary.webp"

const logos = {
  primary: logoPrimary,
  white: logoWhite,
  secondary: logoSecondary,
} as const

type LogoProps = {
  variant?: keyof typeof logos
  className?: string
  to?: string
}

function Logo({ variant = "primary", className, to = "/" }: LogoProps) {
  const img = (
    <Image
      alt="Iran Plaza"
      className={cn("h-[22px] w-[115px] object-contain object-right", className)}
      height={22}
      src={logos[variant]}
      width={115}
    />
  )

  if (!to) return img

  return (
    <Link to={to} className="inline-flex" aria-label="Iran Plaza">
      {img}
    </Link>
  )
}

export { Logo }
