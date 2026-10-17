"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
const socialX = "/design/icons/social-x.svg"
const socialTelegram = "/design/icons/social-telegram.svg"
const socialInstagram = "/design/icons/social-instagram.svg"
const socialWhatsapp = "/design/icons/social-whatsapp.svg"

const FOOTER_SOCIAL = {
  X: socialX,
  Telegram: socialTelegram,
  Instagram: socialInstagram,
  Whatsapp: socialWhatsapp,
} as const

type FooterSocialName = keyof typeof FOOTER_SOCIAL

type FooterSocialIconProps = {
  className?: string
  name?: FooterSocialName
  /** ghost = bare icon; contained = frosted circle on dark footer */
  variant?: "ghost" | "contained"
  href?: string
  "aria-label"?: string
}

/** Figma Footer social icon — cream icons on dark green */
function FooterSocialIcon({
  className,
  name = "Instagram",
  variant = "contained",
  href = "#",
  "aria-label": ariaLabel,
}: FooterSocialIconProps) {
  const Tag = href && href !== '#' ? 'a' : 'span'
  return (
    <Tag
      {...(Tag === 'a' ? {href,target:'_blank',rel:'noreferrer'} : {'aria-disabled':true,title:'آدرس این شبکه هنوز تنظیم نشده است'})}
      data-slot="footer-social-icon"
      data-name={name}
      data-variant={variant}
      aria-label={ariaLabel ?? name}
      className={cn(
        "inline-flex size-12 items-center justify-center rounded-full transition-opacity hover:opacity-80",
        variant === "contained" && "bg-[var(--opacity-light-16)]",
        className
      )}
    >
      <Image
        alt=""
        src={FOOTER_SOCIAL[name]}
        width={24}
        height={24}
        className="size-6 brightness-0 invert sepia-[.35] saturate-[.6] hue-rotate-[5deg]"
      />
    </Tag>
  )
}

export { FooterSocialIcon, FOOTER_SOCIAL }
export type { FooterSocialName }
