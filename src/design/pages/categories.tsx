"use client"

import { SiteLayout } from "@/design/components/site-layout"
import { CategoryCard } from "@/design/components/category-card"
import { SectionHeading } from "@/design/components/section-heading"
import { BusinessSearch } from "@/design/components/business-search"
import { useCategories } from "@/design/api/catalog"
import { RegistrationBanner } from "@/design/components/registration-banner"
import { NewMembers } from "@/design/components/new-members"

/** UX Categories — standalone category browsing (Figma UX Categories) */
function CategoriesPage() {
  const { cards: homeCategories, error } = useCategories()
  return (
    <SiteLayout>
      <section className="mx-auto max-w-[1440px] space-y-[var(--3xl)] px-[var(--page-gutter)] pb-[var(--5xl)] pt-[var(--2xl)] lg:px-[var(--page-gutter-lg)] lg:pt-[var(--5xl)]">
        <div className="space-y-[var(--lg)] text-right">
          <SectionHeading title="دسته بندی کسب و کارها" />
          <p className="me-auto max-w-2xl text-base leading-relaxed text-[var(--text-body)]">
            از میان دسته بندی ها انتخاب کنید و کسب و کارهای مرتبط را ببینید.
          </p>
        </div>

        <div className="me-auto max-w-xl">
          <BusinessSearch />
        </div>

        <div className="grid grid-cols-3 gap-[var(--lg)] sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8">
          {homeCategories.map((c) => (
            <CategoryCard
              key={c.label}
              label={c.label}
              iconSrc={c.icon}
              to={c.href}
            />
          ))}
        </div>

        <RegistrationBanner />
        {error && <p role="status">{error}</p>}
        <NewMembers />
      </section>
    </SiteLayout>
  )
}

export { CategoriesPage }
