"use client"

import { Logo } from "@/design/components/logo"
import { VipBadge } from "@/design/components/vip-badge"
import { BusinessSearch } from "@/design/components/business-search"
import { CategoryCard } from "@/design/components/category-card"
import { RegistrationBanner } from "@/design/components/registration-banner"
import { GalleryProfile } from "@/design/components/gallery-profile"
import { BottomNav } from "@/design/components/bottom-nav"
import { MobileHeader } from "@/design/components/mobile-header"
import { DashboardSidebar } from "@/design/components/dashboard-sidebar"
import { BusinessSlider } from "@/design/components/business-slider"
import { DashboardInformationCard } from "@/design/components/dashboard-information-card"
import { ProfileSubmenu } from "@/design/components/profile-submenu"
import { AdsPosition } from "@/design/components/ads-position"
import { IdentityCard } from "@/design/components/identity-card"
import { Voice } from "@/design/components/voice"
import { VideoInput } from "@/design/components/video-input"
import { InfoStatus } from "@/design/components/info-status"
import { CategoryItem } from "@/design/components/category-item"
import { DashboardLoginButton } from "@/design/components/dashboard-login-button"
import { NeighborhoodFilter } from "@/design/components/neighborhood-filter"
import { DesktopBusinessesCategory } from "@/design/components/desktop-businesses-category"
import { CityFilter } from "@/design/components/city-filter"
import { CategoryFilter } from "@/design/components/category-filter"
import { ChooseCityButton } from "@/design/components/choose-city-button"
import { SiteHeader } from "@/design/components/site-header"
import { MenuDesktopLink } from "@/design/components/menu-desktop-link"
import { CopyLinkButton } from "@/design/components/copy-link-button"
import { FooterSocialIcon } from "@/design/components/footer-social-icon"
import { BusinessListCard } from "@/design/components/business-list-card"
import { ArticleCard } from "@/design/pages/articles"
import { articles } from "@/design/data/articles"
import { newMembers } from "@/design/data/new-members"
import { DsShell } from "@/design/pages/design-system/index"
import { homeCategories } from "@/design/data/home-categories"

function IranPlazaComponentsPage() {
  return (
    <DsShell title="💠 Iran Plaza Components" figma="5156:951">
      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Logo / VIP</h2>
        <div className="flex flex-wrap items-center justify-start gap-[var(--3xl)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
          <Logo variant="primary" />
          <div className="rounded-[var(--radius-xs)] bg-primary-950 px-[var(--lg)] py-[var(--md)]">
            <Logo variant="white" />
          </div>
          <Logo variant="secondary" />
          <VipBadge />
        </div>
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Business Search</h2>
        <div className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
          <BusinessSearch size="desktop" state="default" />
          <BusinessSearch size="desktop" state="active" />
          <BusinessSearch size="desktop" state="searching" value="رستوران" />
          <BusinessSearch size="mobile" city="تهران" state="default" />
          <BusinessSearch size="mobile" state="active" />
          <BusinessSearch size="mobile" state="searching" value="رستوران" />
        </div>
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Home page category</h2>
        <div className="grid grid-cols-2 gap-[var(--lg)] sm:grid-cols-4">
          {homeCategories.slice(0, 4).map((c, i) => (
            <CategoryCard
              key={c.label}
              label={c.label}
              iconSrc={c.icon}
              active={i === 0}
            />
          ))}
        </div>
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Business registration banner</h2>
        <RegistrationBanner />
        <RegistrationBanner variant="footer-strip" />
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Slider Business card / Business Slider</h2>
        <BusinessSlider items={newMembers} title="اعضای جدید" showArrows />
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Dashboard information / Profile submenu</h2>
        <div className="flex flex-wrap justify-start gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
          <DashboardInformationCard variant="free" />
          <DashboardInformationCard variant="active" />
          <DashboardInformationCard variant="expired" />
          <ProfileSubmenu className="w-full max-w-sm" defaultOpen />
        </div>
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Article card</h2>
        <div className="flex flex-wrap items-start justify-start gap-[var(--lg)]">
          <ArticleCard article={articles[0]} variant="slider" />
          <ArticleCard article={articles[0]} variant="slider" titleTone="primary" />
          <ArticleCard article={articles[1]} variant="category" />
          <ArticleCard article={articles[2]} variant="variant3" />
          <ArticleCard article={articles[2]} variant="variant3" titleTone="primary" />
        </div>
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Gallery profile</h2>
        <div className="space-y-[var(--lg)]">
          <GalleryProfile type="1" />
          <GalleryProfile type="2" />
          <GalleryProfile type="3" />
          <GalleryProfile type="4" />
        </div>
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Desktop menu / links / copy / footer social</h2>
        <div className="space-y-[var(--lg)] overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)]">
          <SiteHeader auth="logout" />
          <SiteHeader auth="dashboard" divider />
          <div className="flex flex-wrap items-center justify-start gap-2 p-[var(--2xl)]">
            <MenuDesktopLink to="/">خانه</MenuDesktopLink>
            <MenuDesktopLink to="/businesses" icon>
              کسب و کارها
            </MenuDesktopLink>
            <MenuDesktopLink to="/articles">مقالات</MenuDesktopLink>
            <CopyLinkButton />
            <FooterSocialIcon name="X" className="bg-primary-950" />
            <FooterSocialIcon name="Telegram" className="bg-primary-950" />
            <FooterSocialIcon name="Instagram" className="bg-primary-950" />
            <FooterSocialIcon name="Whatsapp" className="bg-primary-950" />
          </div>
        </div>
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Top header / Bottom menu</h2>
        <div className="space-y-[var(--lg)] overflow-hidden rounded-[var(--radius-xs)] border border-[var(--border-default)]">
          <MobileHeader divider />
          <div className="relative h-28 bg-[var(--main-bg)]">
            <BottomNav className="absolute inset-x-0 bottom-0" auth="logout" />
          </div>
          <div className="relative h-28 bg-[var(--main-bg)]">
            <BottomNav className="absolute inset-x-0 bottom-0" auth="login" />
          </div>
        </div>
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Ads / Identity / Voice / Video / Info status</h2>
        <div className="space-y-[var(--2xl)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
          <AdsPosition variant="list-desktop" className="max-w-3xl me-auto" />
          <div className="flex flex-wrap justify-start gap-[var(--lg)]">
            <AdsPosition variant="list-mobile" />
            <AdsPosition variant="banner-mobile" className="max-w-[345px]" />
          </div>
          <div className="flex flex-col items-start gap-[var(--md)]">
            <IdentityCard />
            <IdentityCard active />
          </div>
          <div className="flex flex-col items-start gap-[var(--md)]">
            <Voice state="before" />
            <Voice state="after" />
          </div>
          <div className="flex flex-col items-start gap-[var(--lg)]">
            <VideoInput state="empty" />
            <VideoInput state="filled" />
          </div>
          <div className="flex flex-col items-start gap-[var(--md)]">
            <InfoStatus variant="approved" />
            <InfoStatus variant="review" />
          </div>
          <div className="me-auto w-full max-w-[250px]">
            <CategoryItem state="default" />
            <CategoryItem state="hover" />
            <CategoryItem state="active" />
          </div>
          <div className="flex flex-wrap justify-start gap-[var(--lg)] pb-[28rem]">
            <ChooseCityButton />
            <CityFilter />
            <NeighborhoodFilter />
            <CategoryFilter triggerVariant="outline" />
            <DesktopBusinessesCategory />
            <DashboardLoginButton />
          </div>
        </div>
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Table of Business</h2>
        <div className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
          <BusinessListCard
            layout="desktop"
            business={{ ...newMembers[0], status: "vip", ad: true }}
          />
          <BusinessListCard
            layout="desktop"
            business={{ ...newMembers[1], status: "free", vip: false }}
          />
          <div className="flex flex-wrap justify-start gap-[var(--lg)]">
            <BusinessListCard
              layout="mobile"
              business={{ ...newMembers[0], status: "vip", ad: true }}
            />
            <BusinessListCard
              layout="mobile"
              business={{ ...newMembers[1], status: "free", vip: false }}
            />
          </div>
        </div>
      </section>

      <section className="space-y-[var(--lg)]">
        <h2 className="text-right text-lg font-bold">Dashboard sidebar</h2>
        <div className="overflow-auto rounded-[var(--radius-xs)] border border-[var(--border-default)]">
          <DashboardSidebar status="free" className="h-[640px]" />
        </div>
      </section>
    </DsShell>
  )
}

export { IranPlazaComponentsPage }
