"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
const facebook = "/design/icons/social-facebook.svg"
const linkedin = "/design/icons/social-linkedin.svg"
const email = "/design/icons/social-email.svg"
const xIcon = "/design/icons/social-x.svg"
const aparat = "/design/icons/social-aparat.svg"
const youtube = "/design/icons/social-youtube.svg"
const website = "/design/icons/social-website.svg"
const instagram = "/design/icons/social-instagram.svg"
const whatsapp = "/design/icons/social-whatsapp.svg"
const telegram = "/design/icons/social-telegram.svg"
const eitaa = "/design/icons/social-eitaa.svg"
const soroush = "/design/icons/social-soroush.svg"
const bale = "/design/icons/social-bale.svg"
const rubika = "/design/icons/social-rubika.svg"

const SOCIAL_ICONS = {
  Facebook: facebook,
  Linkedin: linkedin,
  Email: email,
  X: xIcon,
  Aparat: aparat,
  Youtube: youtube,
  Website: website,
  Instagram: instagram,
  Whatsapp: whatsapp,
  Telegram: telegram,
  Eita: eitaa,
  Soroush: soroush,
  Bale: bale,
  Roobika: rubika,
} as const

type SocialName = keyof typeof SOCIAL_ICONS

type SocialMediaIconProps = {
  className?: string
  name?: SocialName
  type?: "Button" | "Icon"
  href?: string
  "aria-label"?: string
  onClick?: () => void
}

const SOCIAL_NAMES = Object.keys(SOCIAL_ICONS) as SocialName[]

/** Figma Social media icon — Button (48) / Icon (24) × networks × hover */
function SocialMediaIcon({
  className,
  name = "Instagram",
  type = "Icon",
  href,
  "aria-label": ariaLabel,
  onClick,
}: SocialMediaIconProps) {
  const src = SOCIAL_ICONS[name]
  const isButton = type === "Button"

  const inner = (
    <Image
      alt=""
      src={src}
      width={isButton ? 24 : 22}
      height={isButton ? 24 : 22}
      className={cn(isButton ? "size-6" : "size-[22px]")}
    />
  )

  const classes = cn(
    "inline-flex items-center justify-center rounded-full transition-colors",
    isButton
      ? "size-12 border border-[var(--opacity-dark-8)] bg-transparent hover:border-transparent hover:bg-secondary-50"
      : "size-6",
    className
  )

  if (href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        data-slot="social-media-icon"
        data-name={name}
        data-type={type}
        aria-label={ariaLabel ?? name}
        className={classes}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      type="button"
      data-slot="social-media-icon"
      data-name={name}
      data-type={type}
      aria-label={ariaLabel ?? name}
      onClick={onClick}
      className={classes}
    >
      {inner}
    </button>
  )
}

export { SocialMediaIcon, SOCIAL_NAMES, SOCIAL_ICONS }
export type { SocialName, SocialMediaIconProps }
