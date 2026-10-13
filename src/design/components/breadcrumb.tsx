"use client"

import { Fragment } from "react"
import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
const arrowLeft = "/design/icons/arrow-left.svg"

type Crumb = {
  label: string
  to?: string
}

type BreadcrumbProps = {
  className?: string
  /** Ordered from root → current (خانه → … → صفحه فعلی) */
  items: Crumb[]
}

/** Figma breadcrumb — RTL trail; separators are arrow-left between crumbs */
function Breadcrumb({ className, items }: BreadcrumbProps) {
  return (
    <nav
      aria-label="مسیر صفحه"
      data-slot="breadcrumb"
      className={cn("flex flex-wrap items-center justify-start gap-1", className)}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <Fragment key={`${item.label}-${i}`}>
            {i > 0 ? (
              <img
                alt=""
                className="size-4 shrink-0"
                height={16}
                src={arrowLeft}
                width={16}
              />
            ) : null}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="text-sm text-[var(--text-body)] hover:text-primary-500"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={cn(
                  "text-sm",
                  isLast ? "text-[var(--text-title)]" : "text-[var(--text-body)]"
                )}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </Fragment>
        )
      })}
    </nav>
  )
}

export { Breadcrumb }
export type { Crumb }
