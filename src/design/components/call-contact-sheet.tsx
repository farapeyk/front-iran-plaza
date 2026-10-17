"use client"
import Image from "next/image";

import { cn } from "@/design/lib/utils"
import { ModalHeader } from "@/design/components/modal-header"
import { Button } from "@/design/components/ui/button"
import { SocialMediaIcon } from "@/design/components/social-media-icon"
import { socialLinks } from '@/design/api/socials'
import { useModalFocus } from '@/design/lib/use-modal-focus'
const callIcon = "/design/icons/call.svg"
const whatsappIcon = "/design/icons/social-whatsapp.svg"
const infoCircle = "/design/icons/info-circle.svg"
const arrowDown = "/design/icons/arrow-down.svg"

type CallContactSheetProps = {
  open: boolean
  onClose: () => void
  phone?: string
  whatsapp?: string
  socialMedia?: unknown
  className?: string
}


/** Figma Call / Whatsapp — bottom sheet contact channels */
function CallContactSheet({
  open,
  onClose,
  phone = "09120000000",
  whatsapp,
  socialMedia,
  className,
}: CallContactSheetProps) {
  const modalRef = useModalFocus(open, onClose)
  if (!open) return null

  const wa = whatsapp?.replace(/[^\d]/g,'').replace(/^0/,'98')

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-end justify-center bg-[var(--backdrop)]"
      role="dialog"
      aria-modal
      aria-label="راه های ارتباطی"
    >
      <button
        type="button"
        className="absolute inset-0"
        aria-label="بستن"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 flex w-full max-w-lg flex-col rounded-t-[var(--radius-lg)] bg-[var(--surface-cream)]",
          className
        )}
      >
        <ModalHeader
          title="راه های ارتباطی"
          showClose
          showDragHandle
          showIcon
          iconSrc={arrowDown}
          onClose={onClose}
        />

        <div className="flex flex-col gap-[var(--7xl)] px-[var(--2xl)] pb-[var(--2xl)]">
          <div className="flex w-full flex-col gap-[var(--2xl)]">
            <div className="flex flex-col gap-[var(--md)]">
              <a href={`tel:${phone}`} className="block w-full">
                <Button size="lg" className="h-12 w-full gap-2">
                  تماس
                  <Image
                    alt=""
                    className="size-6 brightness-0 invert"
                    height={24}
                    src={callIcon}
                    width={24}
                  />
                </Button>
              </a>
              {wa && <a
                href={`https://wa.me/${wa}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full"
              >
                <Button size="lg" variant="light" className="h-12 w-full gap-2">
                  واتساپ
                  <Image
                    alt=""
                    className="size-6"
                    height={24}
                    src={whatsappIcon}
                    width={24}
                  />
                </Button>
              </a>}
            </div>

            <div className="flex items-start justify-start gap-[var(--lg)]">
              <p className="min-w-0 flex-1 text-right text-sm leading-relaxed text-[var(--text-body)]">
                برای دریافت خدمات ویژه، هنگام تماس یا پیام بگویید که از سایت ایران
                پلازا تماس گرفته اید.
              </p>
              <Image
                alt=""
                className="mt-0.5 size-6 shrink-0"
                height={24}
                src={infoCircle}
                width={24}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-[var(--sm)]">
            {socialLinks(socialMedia).map((link) => (
              <SocialMediaIcon key={link.name} {...link} type="Button" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export { CallContactSheet }
