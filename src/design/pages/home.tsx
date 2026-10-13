"use client"

import { Link } from "@/design/navigation"
import { Cover } from "@/design/components/cover"
import { SiteLayout } from "@/design/components/site-layout"
import { HomeHero } from "@/design/components/home-hero"
import { FreeRegistrationPromo } from "@/design/components/free-registration-promo"
import { ProcessSteps } from "@/design/components/process-steps"
import { NewMembers } from "@/design/components/new-members"
import { FaqSection } from "@/design/components/faq-section"
import { Testimonials } from "@/design/components/testimonials"
import { CategoryCard } from "@/design/components/category-card"
import { SectionHeading } from "@/design/components/section-heading"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { useCategories } from "@/design/api/catalog"
import { cn } from "@/design/lib/utils"

/** Figma home mobile 7680:13403 — 3×3, right-to-left */

export function HomePage() {
  const { cards: homeCategories, error } = useCategories()
  const row1 = homeCategories.slice(0, 8)
  const row2 = homeCategories.slice(8)
  const mobileCategories = homeCategories.slice(0, 9)

  return (
    <SiteLayout className="reference-home">
      <HomeHero />

      <section className="home-categories flex flex-col items-center gap-[var(--5xl)] px-[var(--2xl)] pb-[var(--5xl)] pt-[var(--space-16)] lg:px-[var(--page-gutter-lg)] lg:pb-[var(--7xl)] lg:pt-[var(--8xl)]">
        <SectionHeading title="دسته بندی کسب وکارها" />
        {error && <p role="status">{error}</p>}
        <div className="flex w-full flex-col gap-[var(--2xl)] lg:hidden">
          <div className="grid grid-cols-3 gap-[var(--xl)]">
            {mobileCategories.map((c) => (
              <CategoryCard
                key={c.label}
                label={c.label}
                iconSrc={c.icon}
                to={c.href}
                variant="icon"
              />
            ))}
          </div>
          <Link
            to="/categories"
            className={cn(
              buttonVariants({ variant: "neutral", size: "default" }),
              "w-full border-[var(--border-default)] text-lg text-[var(--text-body)]"
            )}
          >
            مشاهده همه
          </Link>
        </div>
        <div className="hidden w-full flex-col gap-[var(--lg)] lg:flex">
          <div className="grid grid-cols-8 gap-[var(--lg)]">
            {row1.map((c) => (
              <CategoryCard
                key={c.label}
                label={c.label}
                iconSrc={c.icon}
                to={c.href}
              />
            ))}
          </div>
          <div className="mx-auto grid w-full max-w-5xl grid-cols-7 gap-[var(--lg)]">
            {row2.map((c) => (
              <CategoryCard
                key={c.label}
                label={c.label}
                iconSrc={c.icon}
                to={c.href}
              />
            ))}
          </div>
        </div>
      </section>

      <FreeRegistrationPromo className="home-registration" />

      <ProcessSteps className="home-process" />

      <NewMembers className="home-members" />

      <Testimonials className="home-testimonials" />
      <FaqSection className="home-faq" />
    </SiteLayout>
  )
}

export function CoverPage() {
  return <Cover />
}
