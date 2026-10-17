"use client"
import Image from "next/image";

import { useState } from "react"
import { Link, useNavigate } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
import { CategoryItem } from "@/design/components/category-item"
import { Scroller } from "@/design/components/scroller"
import { useCategories } from "@/design/api/catalog"
const arrowDown = "/design/icons/arrow-down.svg"
const arrowLeft = "/design/icons/arrow-left.svg"

type DesktopBusinessesCategoryProps = {
  className?: string
  defaultOpen?: boolean
  defaultCategoryIndex?: number
  triggerLabel?: string
  /** outline = bordered white; filled = secondary-100 (Figma open/hover) */
  triggerVariant?: "outline" | "filled"
}


/** Figma Desktop Businesses category / Category filter mega menu */
function DesktopBusinessesCategory({
  className,
  defaultOpen = false,
  defaultCategoryIndex = 0,
  triggerLabel = "کسب و کارها",
  triggerVariant = "filled",
}: DesktopBusinessesCategoryProps) {
  const [open, setOpen] = useState(defaultOpen)
  const [active, setActive] = useState(defaultCategoryIndex)
  const {cards:homeCategories,categories}=useCategories()
  const navigate=useNavigate()
  const current = homeCategories[active] ?? homeCategories[0]

  return (
    <div
      data-slot="desktop-businesses-category"
      className={cn("relative inline-flex flex-col items-start", className)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-12 items-center gap-2 rounded-full px-5 text-lg font-bold",
          triggerVariant === "filled" || open
            ? "bg-secondary-100 text-primary-700"
            : "border border-[var(--opacity-dark-16)] bg-[var(--surface)] text-[var(--text-body)]"
        )}
      >
        <Image
          alt=""
          className={cn("size-6 transition-transform", open && "rotate-180")}
          height={24}
          src={arrowDown}
          width={24}
        />
        <span className="pt-0.5">{triggerLabel}</span>
      </button>

      {open ? (
        <div className="absolute start-0 top-[52px] z-40 flex h-[560px] w-[min(720px,90vw)] overflow-hidden rounded-[var(--radius-md)] border border-[var(--opacity-dark-16)] bg-[var(--surface)] shadow-[var(--shadow-md)]">
          {/* Subcategories (start / left in LTR visual = end in RTL) */}
          <div className="relative flex min-w-0 flex-1 flex-col bg-[var(--surface)]">
            <div className="flex items-center justify-between gap-3 px-[var(--2xl)] pt-[var(--2xl)]">
              <Link
                to="/businesses"
                className="flex items-center gap-1 text-sm font-bold text-primary-500"
                onClick={() => setOpen(false)}
              >
                <Image alt="" className="size-4" height={16} src={arrowLeft} width={16} />
                همه
              </Link>
              <p className="text-lg font-bold text-primary-700">{current?.label??'دسته‌بندی‌ها'}</p>
            </div>
            <div className="relative min-h-0 flex-1 overflow-y-auto px-[var(--2xl)] pb-[var(--2xl)]">
              <div className="pointer-events-none absolute start-2 top-8">
                <Scroller height={191} />
              </div>
              {categories.filter(category=>category.parentId===current?.id).map((category) => (
                <CategoryItem
                  key={category.id}
                  label={category.name}
                  onClick={()=>{setOpen(false);navigate('/businesses?categoryId='+encodeURIComponent(category.id))}}
                  className="max-w-none"
                />
              ))}
            </div>
          </div>

          {/* Main categories */}
          <div className="flex w-[280px] shrink-0 flex-col gap-1 overflow-y-auto bg-secondary-50 p-[var(--md)]">
            {homeCategories.map((cat, i) => {
              const isActive = i === active
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative flex h-12 items-center justify-start gap-3 rounded-[var(--radius-xs)] px-3 text-right",
                    isActive
                      ? "bg-primary-700 text-[var(--text-light-title)]"
                      : "text-[var(--text-body)] hover:bg-secondary-100"
                  )}
                >
                  {isActive ? (
                    <span className="absolute -start-1 top-1/2 size-0 -translate-y-1/2 border-y-[8px] border-e-[10px] border-y-transparent border-e-primary-700" />
                  ) : null}
                  <span className="min-w-0 flex-1 text-sm font-bold">{cat.label}</span>
                  <Image
                    alt=""
                    className={cn("size-6 shrink-0", isActive && "brightness-0 invert")}
                    height={24}
                    src={cat.icon}
                    width={24}
                  />
                </button>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export { DesktopBusinessesCategory }
