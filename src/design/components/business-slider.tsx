"use client"
import Image from "next/image";

import { useRef } from "react"
import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { BusinessCard, type BusinessCardData } from "@/design/components/business-card"
const arrowLeft = "/design/icons/arrow-left.svg"
const arrowRight = "/design/icons/arrow-right.svg"

type BusinessSliderProps = {
  className?: string
  items: BusinessCardData[]
  title?: string
  showArrows?: boolean
}

/** Figma Business Slider — horizontal scroll of Slider Business cards */
function BusinessSlider({
  className,
  items,
  title,
  showArrows = false,
}: BusinessSliderProps) {
  const scroller = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * -280, behavior: "smooth" })
  }

  return (
    <section data-slot="business-slider" className={cn("w-full", className)}>
      {title || showArrows ? (
        <div className="mb-[var(--lg)] flex items-center justify-between gap-[var(--lg)] px-[var(--page-gutter)] lg:px-[var(--page-gutter-lg)]">
          <div className="flex items-center gap-[var(--lg)]">
            {showArrows ? (
              <div className="flex gap-[var(--lg)]">
                <button
                  type="button"
                  aria-label="قبلی"
                  onClick={() => scrollBy(-1)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "border-[var(--opacity-dark-16)] bg-transparent"
                  )}
                >
                  <Image alt="" className="size-6" height={24} src={arrowRight} width={24} />
                </button>
                <button
                  type="button"
                  aria-label="بعدی"
                  onClick={() => scrollBy(1)}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "icon" }),
                    "border-[var(--opacity-dark-16)] bg-transparent"
                  )}
                >
                  <Image alt="" className="size-6" height={24} src={arrowLeft} width={24} />
                </button>
              </div>
            ) : null}
            <Link
              to="/businesses"
              className="text-sm font-bold text-primary-500 hover:underline lg:text-lg"
            >
              مشاهده همه
            </Link>
          </div>
          {title ? (
            <h2 className="text-xl font-bold text-[var(--text-title)]">{title}</h2>
          ) : null}
        </div>
      ) : null}
      <div
        ref={scroller}
        className="flex gap-[var(--md)] overflow-x-auto px-[var(--page-gutter)] pb-2 [scrollbar-width:none] lg:px-[var(--page-gutter-lg)] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((b) => (
          <BusinessCard key={b.id} business={b} />
        ))}
      </div>
    </section>
  )
}

/** Alias — Figma «Slider Business card» is the same card used in the slider */
const SliderBusinessCard = BusinessCard

export { BusinessSlider, SliderBusinessCard }
