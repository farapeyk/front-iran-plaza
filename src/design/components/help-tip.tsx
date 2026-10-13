"use client"

import { cn } from "@/design/lib/utils"
const infoCircle = "/design/icons/info-circle.svg"

type HelpTipProps = {
  title: string
  body: string
  className?: string
}

/** Figma help callout — e.g. 7735:40264 */
function HelpTip({ title, body, className }: HelpTipProps) {
  return (
    <aside
      className={cn(
        "space-y-[var(--lg)] rounded-[var(--radius-xs)] bg-secondary-50 p-[var(--2xl)] text-right",
        className
      )}
    >
      <div className="flex items-center justify-start gap-[var(--md)]">
        <p className="text-base font-bold text-[var(--text-title)]">{title}</p>
        <img alt="" className="size-6 shrink-0" height={24} src={infoCircle} width={24} />
      </div>
      <p className="text-sm leading-relaxed text-[var(--text-body)]">{body}</p>
    </aside>
  )
}

export { HelpTip }
