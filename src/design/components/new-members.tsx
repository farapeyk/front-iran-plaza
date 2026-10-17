"use client"
import Image from "next/image";

import { useNewMembers } from "@/design/api/catalog"
import { useRef } from "react"
import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { BusinessCard } from "@/design/components/business-card"
import { SectionHeading } from "@/design/components/section-heading"
const arrowLeft = "/design/icons/arrow-left.svg"
const arrowRight = "/design/icons/arrow-right.svg"



function NewMembers({ className, title = "عضوهای جدید ما" }: { className?: string; title?: string }) {
  const scroller = useRef<HTMLDivElement>(null)
  const { items: newMembers, error } = useNewMembers()

  const scrollBy = (dir: 1 | -1) => {
    scroller.current?.scrollBy({ left: dir * -280, behavior: "smooth" })
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-b from-secondary-400 to-secondary-25 px-[var(--page-gutter)] py-16 lg:px-[var(--page-gutter-lg)] lg:pb-16 lg:pt-[var(--8xl)]",
        className
      )}
    >
      <div className="mb-6 flex flex-col gap-6 lg:mb-8 lg:flex-row lg:items-start lg:justify-between">
        <SectionHeading
          title={title}
          align="center"
          className="lg:items-end lg:text-start"
        />
        <div className="hidden items-center gap-4 lg:flex">
          <Link to="/businesses" className="text-lg font-bold text-primary-500">
            مشاهده همه
          </Link>
          <div className="flex gap-4">
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
        </div>
      </div>

      <div
        ref={scroller}
        className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {error && <p role="status">{error}</p>}
        {newMembers.map((b, i) => (
          <BusinessCard key={`${b.id}-${i}`} business={b} />
        ))}
      </div>
    </section>
  )
}

export { NewMembers }
