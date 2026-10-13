"use client"

import { Link } from "@/design/navigation"
import { cn } from "@/design/lib/utils"
const noteIcon = "/design/icons/clock.svg"

export type ArticleCardVariant = "slider" | "category" | "variant3"

export type ArticleCardModel = {
  id: string
  title: string
  image: string
  date: string
  href?: string
}

type ArticleCardProps = {
  article: ArticleCardModel
  className?: string
  /** Figma: slider (boxed 260) | category (horizontal) | variant3 (vertical large) */
  variant?: ArticleCardVariant
  /** Green title (primary) vs dark title */
  titleTone?: "default" | "primary"
}

function Meta({ date, className }: { date: string; className?: string }) {
  return (
    <div
      className={cn(
        "flex w-fit items-center justify-start gap-[var(--sm)] self-start",
        className
      )}
    >
      <img alt="" className="size-4 shrink-0" height={16} src={noteIcon} width={16} />
      <p className="text-sm text-[var(--text-body)]">{date}</p>
    </div>
  )
}

/** Figma Article card — slider / category / Variant3 */
function ArticleCard({
  article,
  className,
  variant = "slider",
  titleTone = "default",
}: ArticleCardProps) {
  const to = article.href ?? `/articles/${article.id}`
  const titleClass = cn(
    "font-bold text-start",
    titleTone === "primary" ? "text-primary-500" : "text-[var(--text-title)]",
    variant === "variant3" ? "text-2xl" : variant === "category" ? "text-xl" : "text-lg"
  )

  if (variant === "category") {
    return (
      <Link
        to={to}
        data-slot="article-card"
        data-variant="category"
        className={cn(
          "flex w-full max-w-[345px] items-center justify-start gap-[var(--lg)] text-start",
          className
        )}
      >
        {/* Image on the start (right) — Figma x=225 */}
        <div className="size-[120px] shrink-0 overflow-hidden rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)]">
          <img alt="" className="size-full object-cover" src={article.image} />
        </div>
        <div className="min-w-0 flex-1 space-y-[var(--sm)]">
          <h3 className={cn(titleClass, "line-clamp-3")}>{article.title}</h3>
          <Meta date={article.date} />
        </div>
      </Link>
    )
  }

  if (variant === "variant3") {
    return (
      <Link
        to={to}
        data-slot="article-card"
        data-variant="variant3"
        className={cn(
          "flex w-full max-w-[379px] flex-col items-stretch gap-[var(--md)] rounded-[var(--radius-xs)] text-start",
          className
        )}
      >
        <div className="h-[200px] w-full overflow-hidden rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] lg:h-[250px]">
          <img alt="" className="size-full object-cover" src={article.image} />
        </div>
        <div className="flex w-full flex-col items-stretch gap-2">
          <h3 className={cn(titleClass, "w-full")}>{article.title}</h3>
          <Meta date={article.date} />
        </div>
      </Link>
    )
  }

  /* slider — boxed card 260×310 */
  return (
    <Link
      to={to}
      data-slot="article-card"
      data-variant="slider"
      className={cn(
        "flex h-[310px] w-[260px] shrink-0 flex-col items-stretch gap-[var(--md)] rounded-[var(--radius-xs)] bg-[var(--surface)] p-[var(--lg)] text-start shadow-[var(--shadow-sm)]",
        className
      )}
    >
      <div className="h-40 w-full overflow-hidden rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)]">
        <img alt="" className="size-full object-cover" src={article.image} />
      </div>
      <div className="flex min-h-0 flex-1 w-full flex-col items-stretch justify-between">
        <h3 className={cn(titleClass, "line-clamp-3 w-full")}>{article.title}</h3>
        <Meta date={article.date} />
      </div>
    </Link>
  )
}

export { ArticleCard }
