"use client"

import { cn } from "@/design/lib/utils"

type IconStyle = "solid" | "outline"
type IconSize = "sm" | "md" | "lg"

type IconProps = {
  /** Figma icon name or local file stem under assets/icons */
  name: string
  style?: IconStyle
  size?: IconSize
  className?: string
  alt?: string
}

const sizeClass: Record<IconSize, string> = {
  sm: "size-4", // 16
  md: "size-6", // 24
  lg: "size-8", // 32
}

/** Figma catalog name → local SVG stem */
const NAME_ALIASES: Record<string, string> = {
  "3square": "three-square",
  close: "close-x",
  "search-normal": "search",
  "fill instagram": "instagram",
  "fill whatsapp": "social-whatsapp",
  "media-aparat": "social-aparat",
  "media-facebook": "social-facebook",
  "media-linkedin": "social-linkedin",
  "media-telegram": "social-telegram",
  "media-whatsapp": "social-whatsapp",
  "media-x": "social-x",
  "media-youtube": "social-youtube",
}

const outlineModules: Record<string, string> = {
  "/assets/icons/add-circle.svg": "/design/icons/add-circle.svg",
  "/assets/icons/add.svg": "/design/icons/add.svg",
  "/assets/icons/archive-slash.svg": "/design/icons/archive-slash.svg",
  "/assets/icons/archive.svg": "/design/icons/archive.svg",
  "/assets/icons/arrow-2.svg": "/design/icons/arrow-2.svg",
  "/assets/icons/arrow-down.svg": "/design/icons/arrow-down.svg",
  "/assets/icons/arrow-left.svg": "/design/icons/arrow-left.svg",
  "/assets/icons/arrow-right-ltr.svg": "/design/icons/arrow-right-ltr.svg",
  "/assets/icons/arrow-right.svg": "/design/icons/arrow-right.svg",
  "/assets/icons/arrow-up.svg": "/design/icons/arrow-up.svg",
  "/assets/icons/award.svg": "/design/icons/award.svg",
  "/assets/icons/book.svg": "/design/icons/book.svg",
  "/assets/icons/briefcase.svg": "/design/icons/briefcase.svg",
  "/assets/icons/building-4.svg": "/design/icons/building-4.svg",
  "/assets/icons/call.svg": "/design/icons/call.svg",
  "/assets/icons/candle-2.svg": "/design/icons/candle-2.svg",
  "/assets/icons/card.svg": "/design/icons/card.svg",
  "/assets/icons/cat-airplane.svg": "/design/icons/cat-airplane.svg",
  "/assets/icons/cat-award.svg": "/design/icons/cat-award.svg",
  "/assets/icons/cat-building.svg": "/design/icons/cat-building.svg",
  "/assets/icons/cat-camera.svg": "/design/icons/cat-camera.svg",
  "/assets/icons/cat-car.svg": "/design/icons/cat-car.svg",
  "/assets/icons/cat-clock.svg": "/design/icons/cat-clock.svg",
  "/assets/icons/cat-coffee.svg": "/design/icons/cat-coffee.svg",
  "/assets/icons/cat-heart-add.svg": "/design/icons/cat-heart-add.svg",
  "/assets/icons/cat-lamp.svg": "/design/icons/cat-lamp.svg",
  "/assets/icons/cat-money.svg": "/design/icons/cat-money.svg",
  "/assets/icons/cat-monitor.svg": "/design/icons/cat-monitor.svg",
  "/assets/icons/cat-music.svg": "/design/icons/cat-music.svg",
  "/assets/icons/cat-profile-circle.svg": "/design/icons/cat-profile-circle.svg",
  "/assets/icons/cat-scissor.svg": "/design/icons/cat-scissor.svg",
  "/assets/icons/cat-teacher.svg": "/design/icons/cat-teacher.svg",
  "/assets/icons/categories.svg": "/design/icons/categories.svg",
  "/assets/icons/category-coffee.svg": "/design/icons/category-coffee.svg",
  "/assets/icons/clock.svg": "/design/icons/clock.svg",
  "/assets/icons/close-circle.svg": "/design/icons/close-circle.svg",
  "/assets/icons/close-square.svg": "/design/icons/close-square.svg",
  "/assets/icons/close-x.svg": "/design/icons/close-x.svg",
  "/assets/icons/convert-card.svg": "/design/icons/convert-card.svg",
  "/assets/icons/copy.svg": "/design/icons/copy.svg",
  "/assets/icons/danger.svg": "/design/icons/danger.svg",
  "/assets/icons/diagram.svg": "/design/icons/diagram.svg",
  "/assets/icons/direct-down.svg": "/design/icons/direct-down.svg",
  "/assets/icons/direct-left.svg": "/design/icons/direct-left.svg",
  "/assets/icons/direct-right.svg": "/design/icons/direct-right.svg",
  "/assets/icons/direct-up.svg": "/design/icons/direct-up.svg",
  "/assets/icons/discount-shape.svg": "/design/icons/discount-shape.svg",
  "/assets/icons/dislike-white.svg": "/design/icons/dislike-white.svg",
  "/assets/icons/dislike.svg": "/design/icons/dislike.svg",
  "/assets/icons/document-text.svg": "/design/icons/document-text.svg",
  "/assets/icons/edit-2.svg": "/design/icons/edit-2.svg",
  "/assets/icons/element-1.svg": "/design/icons/element-1.svg",
  "/assets/icons/element-3.svg": "/design/icons/element-3.svg",
  "/assets/icons/empty-wallet.svg": "/design/icons/empty-wallet.svg",
  "/assets/icons/eye-slash.svg": "/design/icons/eye-slash.svg",
  "/assets/icons/eye.svg": "/design/icons/eye.svg",
  "/assets/icons/flag.svg": "/design/icons/flag.svg",
  "/assets/icons/folder-2.svg": "/design/icons/folder-2.svg",
  "/assets/icons/gallery.svg": "/design/icons/gallery.svg",
  "/assets/icons/gift.svg": "/design/icons/gift.svg",
  "/assets/icons/global.svg": "/design/icons/global.svg",
  "/assets/icons/gps.svg": "/design/icons/gps.svg",
  "/assets/icons/hashtag.svg": "/design/icons/hashtag.svg",
  "/assets/icons/headphone.svg": "/design/icons/headphone.svg",
  "/assets/icons/home-2.svg": "/design/icons/home-2.svg",
  "/assets/icons/home.svg": "/design/icons/home.svg",
  "/assets/icons/hospital.svg": "/design/icons/hospital.svg",
  "/assets/icons/import.svg": "/design/icons/import.svg",
  "/assets/icons/info-circle-warning.svg": "/design/icons/info-circle-warning.svg",
  "/assets/icons/info-circle.svg": "/design/icons/info-circle.svg",
  "/assets/icons/instagram.svg": "/design/icons/instagram.svg",
  "/assets/icons/lamp-charge.svg": "/design/icons/lamp-charge.svg",
  "/assets/icons/like-white.svg": "/design/icons/like-white.svg",
  "/assets/icons/like.svg": "/design/icons/like.svg",
  "/assets/icons/link.svg": "/design/icons/link.svg",
  "/assets/icons/location.svg": "/design/icons/location.svg",
  "/assets/icons/lock.svg": "/design/icons/lock.svg",
  "/assets/icons/logout.svg": "/design/icons/logout.svg",
  "/assets/icons/map.svg": "/design/icons/map.svg",
  "/assets/icons/math.svg": "/design/icons/math.svg",
  "/assets/icons/maximize-4.svg": "/design/icons/maximize-4.svg",
  "/assets/icons/medal.svg": "/design/icons/medal.svg",
  "/assets/icons/menu-looper-2.svg": "/design/icons/menu-looper-2.svg",
  "/assets/icons/menu-looper.svg": "/design/icons/menu-looper.svg",
  "/assets/icons/menu.svg": "/design/icons/menu.svg",
  "/assets/icons/message-text.svg": "/design/icons/message-text.svg",
  "/assets/icons/message.svg": "/design/icons/message.svg",
  "/assets/icons/messages.svg": "/design/icons/messages.svg",
  "/assets/icons/minus-cirlce.svg": "/design/icons/minus-cirlce.svg",
  "/assets/icons/minus-square.svg": "/design/icons/minus-square.svg",
  "/assets/icons/minus.svg": "/design/icons/minus.svg",
  "/assets/icons/money-4.svg": "/design/icons/money-4.svg",
  "/assets/icons/more-circle.svg": "/design/icons/more-circle.svg",
  "/assets/icons/more-square.svg": "/design/icons/more-square.svg",
  "/assets/icons/more.svg": "/design/icons/more.svg",
  "/assets/icons/not-found-box.svg": "/design/icons/not-found-box.svg",
  "/assets/icons/note-text.svg": "/design/icons/note-text.svg",
  "/assets/icons/notification-bing.svg": "/design/icons/notification-bing.svg",
  "/assets/icons/pause.svg": "/design/icons/pause.svg",
  "/assets/icons/people.svg": "/design/icons/people.svg",
  "/assets/icons/percentage-circle.svg": "/design/icons/percentage-circle.svg",
  "/assets/icons/percentage-square.svg": "/design/icons/percentage-square.svg",
  "/assets/icons/play-fill.svg": "/design/icons/play-fill.svg",
  "/assets/icons/profile-2user.svg": "/design/icons/profile-2user.svg",
  "/assets/icons/profile-circle.svg": "/design/icons/profile-circle.svg",
  "/assets/icons/question.svg": "/design/icons/question.svg",
  "/assets/icons/quote-down.svg": "/design/icons/quote-down.svg",
  "/assets/icons/quote-up.svg": "/design/icons/quote-up.svg",
  "/assets/icons/receipt-disscount.svg": "/design/icons/receipt-disscount.svg",
  "/assets/icons/redo.svg": "/design/icons/redo.svg",
  "/assets/icons/refresh-2.svg": "/design/icons/refresh-2.svg",
  "/assets/icons/rotate-right.svg": "/design/icons/rotate-right.svg",
  "/assets/icons/routing.svg": "/design/icons/routing.svg",
  "/assets/icons/scan-barcode.svg": "/design/icons/scan-barcode.svg",
  "/assets/icons/search-dark.svg": "/design/icons/search-dark.svg",
  "/assets/icons/search-not-found.svg": "/design/icons/search-not-found.svg",
  "/assets/icons/search.svg": "/design/icons/search.svg",
  "/assets/icons/send.svg": "/design/icons/send.svg",
  "/assets/icons/setting-2.svg": "/design/icons/setting-2.svg",
  "/assets/icons/setting-4.svg": "/design/icons/setting-4.svg",
  "/assets/icons/setting-5.svg": "/design/icons/setting-5.svg",
  "/assets/icons/share.svg": "/design/icons/share.svg",
  "/assets/icons/shield-tick.svg": "/design/icons/shield-tick.svg",
  "/assets/icons/sms.svg": "/design/icons/sms.svg",
  "/assets/icons/social-aparat.svg": "/design/icons/social-aparat.svg",
  "/assets/icons/social-bale.svg": "/design/icons/social-bale.svg",
  "/assets/icons/social-eitaa.svg": "/design/icons/social-eitaa.svg",
  "/assets/icons/social-email.svg": "/design/icons/social-email.svg",
  "/assets/icons/social-facebook.svg": "/design/icons/social-facebook.svg",
  "/assets/icons/social-instagram.svg": "/design/icons/social-instagram.svg",
  "/assets/icons/social-linkedin.svg": "/design/icons/social-linkedin.svg",
  "/assets/icons/social-rubika.svg": "/design/icons/social-rubika.svg",
  "/assets/icons/social-soroush.svg": "/design/icons/social-soroush.svg",
  "/assets/icons/social-telegram.svg": "/design/icons/social-telegram.svg",
  "/assets/icons/social-website.svg": "/design/icons/social-website.svg",
  "/assets/icons/social-whatsapp.svg": "/design/icons/social-whatsapp.svg",
  "/assets/icons/social-x.svg": "/design/icons/social-x.svg",
  "/assets/icons/social-youtube.svg": "/design/icons/social-youtube.svg",
  "/assets/icons/sort.svg": "/design/icons/sort.svg",
  "/assets/icons/star.svg": "/design/icons/star.svg",
  "/assets/icons/three-square.svg": "/design/icons/three-square.svg",
  "/assets/icons/tick-circle.svg": "/design/icons/tick-circle.svg",
  "/assets/icons/tick.svg": "/design/icons/tick.svg",
  "/assets/icons/timer.svg": "/design/icons/timer.svg",
  "/assets/icons/trash.svg": "/design/icons/trash.svg",
  "/assets/icons/truck-fast.svg": "/design/icons/truck-fast.svg",
  "/assets/icons/undo.svg": "/design/icons/undo.svg",
  "/assets/icons/unlimited.svg": "/design/icons/unlimited.svg",
  "/assets/icons/user-bold.svg": "/design/icons/user-bold.svg",
  "/assets/icons/user.svg": "/design/icons/user.svg"
}

const solidModules: Record<string, string> = {
  "/assets/icons/solid/add-circle.svg": "/design/icons/solid/add-circle.svg",
  "/assets/icons/solid/add-square.svg": "/design/icons/solid/add-square.svg",
  "/assets/icons/solid/add.svg": "/design/icons/solid/add.svg",
  "/assets/icons/solid/airplane.svg": "/design/icons/solid/airplane.svg",
  "/assets/icons/solid/archive-slash.svg": "/design/icons/solid/archive-slash.svg",
  "/assets/icons/solid/archive.svg": "/design/icons/solid/archive.svg",
  "/assets/icons/solid/arrow-2.svg": "/design/icons/solid/arrow-2.svg",
  "/assets/icons/solid/arrow-down.svg": "/design/icons/solid/arrow-down.svg",
  "/assets/icons/solid/arrow-left.svg": "/design/icons/solid/arrow-left.svg",
  "/assets/icons/solid/arrow-right.svg": "/design/icons/solid/arrow-right.svg",
  "/assets/icons/solid/arrow-up.svg": "/design/icons/solid/arrow-up.svg",
  "/assets/icons/solid/award.svg": "/design/icons/solid/award.svg",
  "/assets/icons/solid/book.svg": "/design/icons/solid/book.svg",
  "/assets/icons/solid/briefcase.svg": "/design/icons/solid/briefcase.svg",
  "/assets/icons/solid/building-4.svg": "/design/icons/solid/building-4.svg",
  "/assets/icons/solid/call.svg": "/design/icons/solid/call.svg",
  "/assets/icons/solid/camera.svg": "/design/icons/solid/camera.svg",
  "/assets/icons/solid/candle-2.svg": "/design/icons/solid/candle-2.svg",
  "/assets/icons/solid/car.svg": "/design/icons/solid/car.svg",
  "/assets/icons/solid/card-pos.svg": "/design/icons/solid/card-pos.svg",
  "/assets/icons/solid/card-receive.svg": "/design/icons/solid/card-receive.svg",
  "/assets/icons/solid/card.svg": "/design/icons/solid/card.svg",
  "/assets/icons/solid/cat-airplane.svg": "/design/icons/solid/cat-airplane.svg",
  "/assets/icons/solid/cat-car.svg": "/design/icons/solid/cat-car.svg",
  "/assets/icons/solid/cat-coffee.svg": "/design/icons/solid/cat-coffee.svg",
  "/assets/icons/solid/cat-heart-add.svg": "/design/icons/solid/cat-heart-add.svg",
  "/assets/icons/solid/cat-lamp.svg": "/design/icons/solid/cat-lamp.svg",
  "/assets/icons/solid/cat-monitor.svg": "/design/icons/solid/cat-monitor.svg",
  "/assets/icons/solid/cat-music.svg": "/design/icons/solid/cat-music.svg",
  "/assets/icons/solid/cat-scissor.svg": "/design/icons/solid/cat-scissor.svg",
  "/assets/icons/solid/cat-teacher.svg": "/design/icons/solid/cat-teacher.svg",
  "/assets/icons/solid/clock.svg": "/design/icons/solid/clock.svg",
  "/assets/icons/solid/close-circle.svg": "/design/icons/solid/close-circle.svg",
  "/assets/icons/solid/close-square.svg": "/design/icons/solid/close-square.svg",
  "/assets/icons/solid/coffee.svg": "/design/icons/solid/coffee.svg",
  "/assets/icons/solid/convert-card.svg": "/design/icons/solid/convert-card.svg",
  "/assets/icons/solid/copy.svg": "/design/icons/solid/copy.svg",
  "/assets/icons/solid/danger.svg": "/design/icons/solid/danger.svg",
  "/assets/icons/solid/diagram.svg": "/design/icons/solid/diagram.svg",
  "/assets/icons/solid/direct-down.svg": "/design/icons/solid/direct-down.svg",
  "/assets/icons/solid/direct-left.svg": "/design/icons/solid/direct-left.svg",
  "/assets/icons/solid/direct-right.svg": "/design/icons/solid/direct-right.svg",
  "/assets/icons/solid/direct-up.svg": "/design/icons/solid/direct-up.svg",
  "/assets/icons/solid/discount-shape.svg": "/design/icons/solid/discount-shape.svg",
  "/assets/icons/solid/dislike.svg": "/design/icons/solid/dislike.svg",
  "/assets/icons/solid/document-text.svg": "/design/icons/solid/document-text.svg",
  "/assets/icons/solid/edit-2.svg": "/design/icons/solid/edit-2.svg",
  "/assets/icons/solid/element-1.svg": "/design/icons/solid/element-1.svg",
  "/assets/icons/solid/element-3.svg": "/design/icons/solid/element-3.svg",
  "/assets/icons/solid/empty-wallet.svg": "/design/icons/solid/empty-wallet.svg",
  "/assets/icons/solid/eye-slash.svg": "/design/icons/solid/eye-slash.svg",
  "/assets/icons/solid/flag.svg": "/design/icons/solid/flag.svg",
  "/assets/icons/solid/folder-2.svg": "/design/icons/solid/folder-2.svg",
  "/assets/icons/solid/gift.svg": "/design/icons/solid/gift.svg",
  "/assets/icons/solid/global.svg": "/design/icons/solid/global.svg",
  "/assets/icons/solid/gps.svg": "/design/icons/solid/gps.svg",
  "/assets/icons/solid/hashtag.svg": "/design/icons/solid/hashtag.svg",
  "/assets/icons/solid/headphone.svg": "/design/icons/solid/headphone.svg",
  "/assets/icons/solid/heart-add.svg": "/design/icons/solid/heart-add.svg",
  "/assets/icons/solid/heart.svg": "/design/icons/solid/heart.svg",
  "/assets/icons/solid/home-2.svg": "/design/icons/solid/home-2.svg",
  "/assets/icons/solid/hospital.svg": "/design/icons/solid/hospital.svg",
  "/assets/icons/solid/import.svg": "/design/icons/solid/import.svg",
  "/assets/icons/solid/info-circle.svg": "/design/icons/solid/info-circle.svg",
  "/assets/icons/solid/instagram.svg": "/design/icons/solid/instagram.svg",
  "/assets/icons/solid/lamp-charge.svg": "/design/icons/solid/lamp-charge.svg",
  "/assets/icons/solid/lamp.svg": "/design/icons/solid/lamp.svg",
  "/assets/icons/solid/like.svg": "/design/icons/solid/like.svg",
  "/assets/icons/solid/line-arrow-down.svg": "/design/icons/solid/line-arrow-down.svg",
  "/assets/icons/solid/line-arrow-left.svg": "/design/icons/solid/line-arrow-left.svg",
  "/assets/icons/solid/line-arrow-right.svg": "/design/icons/solid/line-arrow-right.svg",
  "/assets/icons/solid/location.svg": "/design/icons/solid/location.svg",
  "/assets/icons/solid/lock.svg": "/design/icons/solid/lock.svg",
  "/assets/icons/solid/logout.svg": "/design/icons/solid/logout.svg",
  "/assets/icons/solid/math.svg": "/design/icons/solid/math.svg",
  "/assets/icons/solid/maximize-4.svg": "/design/icons/solid/maximize-4.svg",
  "/assets/icons/solid/medal-star.svg": "/design/icons/solid/medal-star.svg",
  "/assets/icons/solid/medal.svg": "/design/icons/solid/medal.svg",
  "/assets/icons/solid/menu-left.svg": "/design/icons/solid/menu-left.svg",
  "/assets/icons/solid/menu-right.svg": "/design/icons/solid/menu-right.svg",
  "/assets/icons/solid/menu.svg": "/design/icons/solid/menu.svg",
  "/assets/icons/solid/message-text.svg": "/design/icons/solid/message-text.svg",
  "/assets/icons/solid/message.svg": "/design/icons/solid/message.svg",
  "/assets/icons/solid/messages.svg": "/design/icons/solid/messages.svg",
  "/assets/icons/solid/minus-cirlce.svg": "/design/icons/solid/minus-cirlce.svg",
  "/assets/icons/solid/minus-square.svg": "/design/icons/solid/minus-square.svg",
  "/assets/icons/solid/minus.svg": "/design/icons/solid/minus.svg",
  "/assets/icons/solid/money-4.svg": "/design/icons/solid/money-4.svg",
  "/assets/icons/solid/monitor.svg": "/design/icons/solid/monitor.svg",
  "/assets/icons/solid/more-circle.svg": "/design/icons/solid/more-circle.svg",
  "/assets/icons/solid/more-square.svg": "/design/icons/solid/more-square.svg",
  "/assets/icons/solid/more.svg": "/design/icons/solid/more.svg",
  "/assets/icons/solid/music.svg": "/design/icons/solid/music.svg",
  "/assets/icons/solid/note-text.svg": "/design/icons/solid/note-text.svg",
  "/assets/icons/solid/notification-bing.svg": "/design/icons/solid/notification-bing.svg",
  "/assets/icons/solid/pause.svg": "/design/icons/solid/pause.svg",
  "/assets/icons/solid/people.svg": "/design/icons/solid/people.svg",
  "/assets/icons/solid/percentage-circle.svg": "/design/icons/solid/percentage-circle.svg",
  "/assets/icons/solid/percentage-square.svg": "/design/icons/solid/percentage-square.svg",
  "/assets/icons/solid/play.svg": "/design/icons/solid/play.svg",
  "/assets/icons/solid/profile-2user.svg": "/design/icons/solid/profile-2user.svg",
  "/assets/icons/solid/profile-add.svg": "/design/icons/solid/profile-add.svg",
  "/assets/icons/solid/profile-circle.svg": "/design/icons/solid/profile-circle.svg",
  "/assets/icons/solid/question.svg": "/design/icons/solid/question.svg",
  "/assets/icons/solid/quote-down.svg": "/design/icons/solid/quote-down.svg",
  "/assets/icons/solid/quote-up.svg": "/design/icons/solid/quote-up.svg",
  "/assets/icons/solid/receipt-disscount.svg": "/design/icons/solid/receipt-disscount.svg",
  "/assets/icons/solid/redo.svg": "/design/icons/solid/redo.svg",
  "/assets/icons/solid/refresh-2.svg": "/design/icons/solid/refresh-2.svg",
  "/assets/icons/solid/rotate-right.svg": "/design/icons/solid/rotate-right.svg",
  "/assets/icons/solid/routing.svg": "/design/icons/solid/routing.svg",
  "/assets/icons/solid/scan-barcode.svg": "/design/icons/solid/scan-barcode.svg",
  "/assets/icons/solid/scissor.svg": "/design/icons/solid/scissor.svg",
  "/assets/icons/solid/search-dark.svg": "/design/icons/solid/search-dark.svg",
  "/assets/icons/solid/search-normal.svg": "/design/icons/solid/search-normal.svg",
  "/assets/icons/solid/search.svg": "/design/icons/solid/search.svg",
  "/assets/icons/solid/send.svg": "/design/icons/solid/send.svg",
  "/assets/icons/solid/setting-2.svg": "/design/icons/solid/setting-2.svg",
  "/assets/icons/solid/setting-4.svg": "/design/icons/solid/setting-4.svg",
  "/assets/icons/solid/setting-5.svg": "/design/icons/solid/setting-5.svg",
  "/assets/icons/solid/share.svg": "/design/icons/solid/share.svg",
  "/assets/icons/solid/shield-tick.svg": "/design/icons/solid/shield-tick.svg",
  "/assets/icons/solid/sms.svg": "/design/icons/solid/sms.svg",
  "/assets/icons/solid/sort.svg": "/design/icons/solid/sort.svg",
  "/assets/icons/solid/star.svg": "/design/icons/solid/star.svg",
  "/assets/icons/solid/teacher.svg": "/design/icons/solid/teacher.svg",
  "/assets/icons/solid/tick-circle.svg": "/design/icons/solid/tick-circle.svg",
  "/assets/icons/solid/tick-square.svg": "/design/icons/solid/tick-square.svg",
  "/assets/icons/solid/tick.svg": "/design/icons/solid/tick.svg",
  "/assets/icons/solid/ticket-discount.svg": "/design/icons/solid/ticket-discount.svg",
  "/assets/icons/solid/timer-start.svg": "/design/icons/solid/timer-start.svg",
  "/assets/icons/solid/timer.svg": "/design/icons/solid/timer.svg",
  "/assets/icons/solid/trash.svg": "/design/icons/solid/trash.svg",
  "/assets/icons/solid/truck-fast.svg": "/design/icons/solid/truck-fast.svg",
  "/assets/icons/solid/undo.svg": "/design/icons/solid/undo.svg",
  "/assets/icons/solid/unlimited.svg": "/design/icons/solid/unlimited.svg",
  "/assets/icons/solid/user-square.svg": "/design/icons/solid/user-square.svg",
  "/assets/icons/solid/user.svg": "/design/icons/solid/user.svg"
}

function fileStem(name: string): string {
  return NAME_ALIASES[name] ?? name.replace(/\s+/g, "-")
}

function resolveSrc(name: string, style: IconStyle): string | undefined {
  const stem = fileStem(name)
  const file = `${stem}.svg`
  if (style === "solid") {
    const solidHit = Object.entries(solidModules).find(([p]) =>
      p.endsWith(`/solid/${file}`)
    )
    if (solidHit) return solidHit[1]
  }
  const outlineHit = Object.entries(outlineModules).find(([p]) =>
    p.endsWith(`/icons/${file}`)
  )
  return outlineHit?.[1]
}

/** Figma Icons — Style Solid (default) / Outline × Size 16/24/32 */
function Icon({
  name,
  style = "solid",
  size = "md",
  className,
  alt = "",
}: IconProps) {
  const src = resolveSrc(name, style) ?? resolveSrc(name, "outline")
  if (!src) return null

  const px = size === "sm" ? 16 : size === "lg" ? 32 : 24

  return (
    <img
      alt={alt}
      data-slot="icon"
      data-style={style}
      data-size={size}
      className={cn(sizeClass[size], "shrink-0", className)}
      height={px}
      src={src}
      width={px}
    />
  )
}

export { Icon, NAME_ALIASES }
export type { IconProps, IconStyle, IconSize }
