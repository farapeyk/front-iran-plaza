"use client"

import { cn } from "@/design/lib/utils"

function SectionHeading({
  title,
  align = "center",
  className,
  accent = "primary",
}: {
  title: string
  align?: "center" | "end"
  className?: string
  accent?: "primary" | "secondary"
}) {
  const bar = accent === "secondary" ? "bg-secondary-500" : "bg-primary-500"
  return (
    <div
      className={cn(
        "flex flex-col gap-[var(--lg)]",
        align === "center" ? "items-center text-center" : "items-start text-right",
        className
      )}
    >
      <h2 className="text-2xl font-black leading-[1.5] text-[var(--text-title)] lg:text-[length:var(--text-h1)] lg:leading-[1.4]">
        {title}
      </h2>
      <div className="flex items-center gap-[var(--sm)]">
        <span className={cn("h-1 w-2", bar)} />
        <span className={cn("h-1 w-10", bar)} />
      </div>
    </div>
  )
}

export { SectionHeading }
