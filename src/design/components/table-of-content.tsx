"use client"

import { useState } from "react"
import { cn } from "@/design/lib/utils"
const arrowDown = "/design/icons/arrow-down.svg"
const arrowLeft = "/design/icons/arrow-left.svg"

type TocItem = {
  id?: string
  label: string
  href?: string
}

type TableOfContentProps = {
  className?: string
  title?: string
  items?: TocItem[]
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const defaultItems: TocItem[] = [
  { label: "لورم ایپسوم متن ساختگی با تولید سادگی" },
  { label: "لورم ایپسوم متن ساختگی تولید" },
  { label: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ" },
  { label: "لورم ایپسوم متن ساختگی با تولید سادگی" },
  { label: "لورم ایپسوم متن ساختگی تولید" },
  { label: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ" },
]

/** Figma table of content — collapsible article TOC */
function TableOfContent({
  className,
  title = "آنچه در این مقاله می خوانید:",
  items = defaultItems,
  defaultOpen = false,
  open: controlled,
  onOpenChange,
}: TableOfContentProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen)
  const open = controlled ?? uncontrolled

  function toggle() {
    const next = !open
    if (controlled === undefined) setUncontrolled(next)
    onOpenChange?.(next)
  }

  return (
    <div
      data-slot="table-of-content"
      data-state={open ? "open" : "closed"}
      className={cn(
        "flex w-full flex-col items-stretch rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] px-[var(--lg)]",
        open
          ? "gap-[var(--2xl)] pb-[var(--3xl)] pt-[var(--2xl)]"
          : "gap-[var(--md)] py-[var(--2xl)]",
        className
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between gap-[var(--md)]"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="text-start text-xl font-bold leading-normal text-[var(--text-title)]">
          {title}
        </span>
        <img
          alt=""
          className={cn("size-6 shrink-0 transition-transform", open && "rotate-180")}
          height={24}
          src={arrowDown}
          width={24}
        />
      </button>

      {open ? (
        <ul className="flex w-full flex-col gap-3">
          {items.map((item, i) => {
            const content = (
              <>
                <span className="min-w-0 flex-1 text-start text-base leading-normal text-[var(--text-title)]">
                  {item.label}
                </span>
                <img
                  alt=""
                  className="size-6 shrink-0"
                  height={24}
                  src={arrowLeft}
                  width={24}
                />
              </>
            )
            return (
              <li key={item.id ?? i}>
                {item.href ? (
                  <a
                    href={item.href}
                    className="flex w-full items-center justify-start gap-[var(--sm)]"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex w-full items-center justify-start gap-[var(--sm)]">
                    {content}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      ) : null}
    </div>
  )
}

export { TableOfContent }
export type { TocItem, TableOfContentProps }
