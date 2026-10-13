"use client"

import { cn } from "@/design/lib/utils"
const arrowLeft = "/design/icons/arrow-left.svg"
const arrowRight = "/design/icons/arrow-right.svg"

type CategoryItemState = "default" | "hover" | "active"

type CategoryItemProps = {
  className?: string
  label?: string
  state?: CategoryItemState
  /** default = chevron on far start (back); hover/active = chevron beside label */
  onClick?: () => void
}

/** Figma Category Item — Default / Hover / Active */
function CategoryItem({
  className,
  label = "دسته بندی",
  state = "default",
  onClick,
}: CategoryItemProps) {
  const active = state === "active"
  const grouped = state === "hover" || state === "active"

  return (
    <button
      type="button"
      data-slot="category-item"
      data-state={state}
      onClick={onClick}
      className={cn(
        "flex w-full max-w-[250px] items-center border-b border-[var(--opacity-dark-8)] py-[var(--lg)]",
        grouped ? "justify-start gap-[var(--sm)]" : "justify-between",
        className
      )}
    >
      {!grouped ? (
        <img alt="" className="size-4 shrink-0" height={16} src={arrowLeft} width={16} />
      ) : null}
      <span
        className={cn(
          "text-base leading-normal",
          active
            ? "font-bold text-primary-500"
            : "font-normal text-[var(--text-body)]"
        )}
      >
        {label}
      </span>
      {grouped ? (
        <img
          alt=""
          className={cn("size-4 shrink-0", active && "opacity-90")}
          height={16}
          src={arrowRight}
          width={16}
          style={active ? { filter: "invert(35%) sepia(40%) saturate(800%) hue-rotate(95deg)" } : undefined}
        />
      ) : null}
    </button>
  )
}

export { CategoryItem }
export type { CategoryItemState }
