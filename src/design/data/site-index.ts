/** Finder for product pages and components. Preview `to` is a live route. */

export type FinderItem = {
  title: string
  to: string
  file: string
}

export type FinderGroup = {
  title: string
  items: FinderItem[]
}

export const productPages: FinderItem[] = [
  { title: "خانه", to: "/", file: "src/pages/home.tsx" },
  { title: "کاور", to: "/cover", file: "src/pages/home.tsx" },
  { title: "ورود / ثبت‌نام", to: "/login", file: "src/pages/login.tsx" },
  { title: "جستجو", to: "/search", file: "src/pages/search.tsx" },
  { title: "کسب‌وکارها", to: "/businesses", file: "src/pages/search.tsx" },
  { title: "پروفایل کسب‌وکار", to: "/businesses/1", file: "src/pages/business-profile.tsx" },
  { title: "دسته‌بندی‌ها", to: "/categories", file: "src/pages/categories.tsx" },
  { title: "مقالات", to: "/articles", file: "src/pages/articles.tsx" },
  { title: "جزئیات مقاله", to: "/articles/2", file: "src/pages/articles.tsx" },
  { title: "ثبت کسب‌وکار", to: "/business-registration", file: "src/pages/registration.tsx" },
  { title: "داشبورد", to: "/dashboard", file: "src/pages/registration.tsx" },
  { title: "پروفایل من", to: "/profile", file: "src/pages/profile.tsx" },
  { title: "ویرایش پروفایل", to: "/profile/edit/bio", file: "src/pages/profile.tsx" },
  { title: "اطلاعات کاربری", to: "/user-info", file: "src/pages/profile.tsx" },
  { title: "خرید اشتراک", to: "/subscription", file: "src/pages/profile.tsx" },
  { title: "پرداخت‌ها", to: "/payments", file: "src/pages/profile.tsx" },
  { title: "پشتیبانی", to: "/support", file: "src/pages/profile.tsx" },
  { title: "سوالات متداول", to: "/faq", file: "src/pages/legal.tsx" },
  { title: "قوانین", to: "/terms", file: "src/pages/legal.tsx" },
  { title: "درباره ما", to: "/about", file: "src/pages/legal.tsx" },
  { title: "تماس با ما", to: "/contact", file: "src/pages/legal.tsx" },
]

export const componentGroups: FinderGroup[] = [
  {
    title: "چیدمان و ناوبری",
    items: [
      { title: "SiteLayout", to: "/", file: "src/components/site-layout.tsx" },
      { title: "SiteHeader", to: "/", file: "src/components/site-header.tsx" },
      { title: "SiteFooter", to: "/", file: "src/components/site-footer.tsx" },
      { title: "MobileHeader", to: "/", file: "src/components/mobile-header.tsx" },
      { title: "MobileSideMenu", to: "/", file: "src/components/mobile-side-menu.tsx" },
      { title: "BottomNav", to: "/", file: "src/components/bottom-nav.tsx" },
      { title: "MenuDesktopLink", to: "/design-system/iran-plaza", file: "src/components/menu-desktop-link.tsx" },
      { title: "Logo", to: "/design-system/iran-plaza", file: "src/components/logo.tsx" },
      { title: "Breadcrumb", to: "/articles/2", file: "src/components/breadcrumb.tsx" },
    ],
  },
  {
    title: "خانه",
    items: [
      { title: "HomeHero", to: "/", file: "src/components/home-hero.tsx" },
      { title: "SectionHeading", to: "/", file: "src/components/section-heading.tsx" },
      { title: "CategoryCard", to: "/", file: "src/components/category-card.tsx" },
      { title: "ProcessSteps", to: "/", file: "src/components/process-steps.tsx" },
      { title: "FreeRegistrationPromo", to: "/", file: "src/components/free-registration-promo.tsx" },
      { title: "NewMembers", to: "/", file: "src/components/new-members.tsx" },
      { title: "Testimonials", to: "/", file: "src/components/testimonials.tsx" },
      { title: "FaqSection", to: "/#faq", file: "src/components/faq-section.tsx" },
      { title: "RegistrationBanner", to: "/articles", file: "src/components/registration-banner.tsx" },
      { title: "BusinessSearch", to: "/", file: "src/components/business-search.tsx" },
    ],
  },
  {
    title: "کسب‌وکار",
    items: [
      { title: "BusinessCard", to: "/", file: "src/components/business-card.tsx" },
      { title: "BusinessSlider", to: "/", file: "src/components/business-slider.tsx" },
      { title: "BusinessListCard", to: "/articles/1", file: "src/components/business-list-card.tsx" },
      { title: "DesktopBusinessesCategory", to: "/businesses", file: "src/components/desktop-businesses-category.tsx" },
      { title: "CategoryFilter", to: "/businesses", file: "src/components/category-filter.tsx" },
      { title: "CityFilter", to: "/businesses", file: "src/components/city-filter.tsx" },
      { title: "NeighborhoodFilter", to: "/businesses", file: "src/components/neighborhood-filter.tsx" },
      { title: "BusinessesFiltersSheet", to: "/businesses", file: "src/components/businesses-filters-sheet.tsx" },
      { title: "VipBadge", to: "/design-system/iran-plaza", file: "src/components/vip-badge.tsx" },
      { title: "CallContactSheet", to: "/businesses/1", file: "src/components/call-contact-sheet.tsx" },
      { title: "GalleryLightbox", to: "/businesses/1", file: "src/components/gallery-lightbox.tsx" },
      { title: "GalleryProfile", to: "/design-system/iran-plaza", file: "src/components/gallery-profile.tsx" },
      { title: "ReplyCommentSheet", to: "/businesses/1", file: "src/components/reply-comment-sheet.tsx" },
    ],
  },
  {
    title: "مقاله",
    items: [
      { title: "ArticleCard", to: "/articles", file: "src/components/article-card.tsx" },
      { title: "TableOfContent", to: "/articles/2", file: "src/components/table-of-content.tsx" },
      { title: "CopyLinkButton", to: "/articles/2", file: "src/components/copy-link-button.tsx" },
      { title: "AdsPosition", to: "/articles/2", file: "src/components/ads-position.tsx" },
      { title: "Scoring", to: "/articles/2", file: "src/components/scoring.tsx" },
      { title: "Comment", to: "/articles/2", file: "src/components/comment.tsx" },
      { title: "WriteComment", to: "/design-system/components", file: "src/components/write-comment.tsx" },
    ],
  },
  {
    title: "داشبورد و پروفایل",
    items: [
      { title: "DashboardSidebar", to: "/dashboard", file: "src/components/dashboard-sidebar.tsx" },
      { title: "DashboardAccountLayout", to: "/profile", file: "src/components/dashboard-account-layout.tsx" },
      { title: "DashboardInformationCard", to: "/profile", file: "src/components/dashboard-information-card.tsx" },
      { title: "ProfileSubmenu", to: "/profile", file: "src/components/profile-submenu.tsx" },
      { title: "DashboardLoginButton", to: "/dashboard", file: "src/components/dashboard-login-button.tsx" },
      { title: "IdentityCard", to: "/design-system/iran-plaza", file: "src/components/identity-card.tsx" },
      { title: "AddCategorySheet", to: "/profile/edit/bio", file: "src/components/add-category-sheet.tsx" },
      { title: "AddSocialSheet", to: "/profile/edit/social", file: "src/components/add-social-sheet.tsx" },
      { title: "ConfirmDeleteSheet", to: "/profile/edit/products", file: "src/components/confirm-delete-sheet.tsx" },
    ],
  },
  {
    title: "رابط کاربری",
    items: [
      { title: "Button", to: "/design-system/buttons", file: "src/components/ui/button.tsx" },
      { title: "Input", to: "/design-system/components", file: "src/components/ui/input.tsx" },
      { title: "Field", to: "/design-system/components", file: "src/components/ui/field.tsx" },
      { title: "Accordion", to: "/design-system/components", file: "src/components/ui/accordion.tsx" },
      { title: "Checkbox", to: "/design-system/components", file: "src/components/ui/checkbox.tsx" },
      { title: "Switch", to: "/design-system/components", file: "src/components/ui/switch.tsx" },
      { title: "Radio", to: "/design-system/components", file: "src/components/ui/radio.tsx" },
      { title: "Tab", to: "/design-system/components", file: "src/components/tab.tsx" },
      { title: "Badge", to: "/design-system/components", file: "src/components/ui/badge.tsx" },
      { title: "Avatar", to: "/design-system/components", file: "src/components/ui/avatar.tsx" },
      { title: "UserAvatar", to: "/design-system/components", file: "src/components/user-avatar.tsx" },
      { title: "ActiveStatus", to: "/design-system/components", file: "src/components/active-status.tsx" },
      { title: "LikeButton", to: "/design-system/components", file: "src/components/like-button.tsx" },
      { title: "SearchField", to: "/design-system/components", file: "src/components/search-field.tsx" },
      { title: "NotFound", to: "/design-system/components", file: "src/components/not-found.tsx" },
      { title: "Icon", to: "/design-system/icons", file: "src/components/icon.tsx" },
    ],
  },
]
