# فهرست سورس

این فهرست در تاریخ ۲۰۲۶-۱۰-۰۷ از فایل‌های موجود در `src/` و `tests/` تهیه شده است. برای مسئولیت هر بخش، [معماری](ARCHITECTURE.md) و برای رفتار صفحات، [مسیرها](ROUTES.md) را بخوانید. فایل‌های نصب‌شده و خروجی build در این فهرست نیستند.

تعداد فایل‌های فهرست‌شده: **200**.

## فایل‌ها

```text
src/app/(auth)/login/page.tsx
src/app/(dashboard)/dashboard/business/documents/page.tsx
src/app/(dashboard)/dashboard/business/new/page.tsx
src/app/(dashboard)/dashboard/business/profile/about/page.tsx
src/app/(dashboard)/dashboard/business/profile/address/page.tsx
src/app/(dashboard)/dashboard/business/profile/basic/page.tsx
src/app/(dashboard)/dashboard/business/profile/contact/page.tsx
src/app/(dashboard)/dashboard/business/profile/features/page.tsx
src/app/(dashboard)/dashboard/business/profile/gallery/page.tsx
src/app/(dashboard)/dashboard/business/profile/hours/page.tsx
src/app/(dashboard)/dashboard/business/profile/installment/page.tsx
src/app/(dashboard)/dashboard/business/profile/layout.tsx
src/app/(dashboard)/dashboard/business/profile/page.tsx
src/app/(dashboard)/dashboard/business/profile/products/page.tsx
src/app/(dashboard)/dashboard/business/profile/services/page.tsx
src/app/(dashboard)/dashboard/business/profile/social/page.tsx
src/app/(dashboard)/dashboard/favorites/page.tsx
src/app/(dashboard)/dashboard/loading.tsx
src/app/(dashboard)/dashboard/notifications/page.tsx
src/app/(dashboard)/dashboard/page.tsx
src/app/(dashboard)/dashboard/profile/page.tsx
src/app/(public)/businesses/[slug]/page.tsx
src/app/(public)/businesses/page.tsx
src/app/(public)/layout.tsx
src/app/admin/(panel)/businesses/[id]/page.tsx
src/app/admin/(panel)/businesses/new/page.tsx
src/app/admin/(panel)/businesses/page.tsx
src/app/admin/(panel)/businesses/pending/page.tsx
src/app/admin/(panel)/businesses/rejected/page.tsx
src/app/admin/(panel)/categories/page.tsx
src/app/admin/(panel)/layout.tsx
src/app/admin/(panel)/page.tsx
src/app/admin/(panel)/reviews/page.tsx
src/app/admin/(panel)/users/[id]/page.tsx
src/app/admin/(panel)/users/page.tsx
src/app/admin/login/page.tsx
src/app/api/auth/silent-refresh/route.ts
src/app/api/backend/[...path]/route.ts
src/app/complete-profile/page.tsx
src/app/error.tsx
src/app/favicon.ico
src/app/globals.css
src/app/layout.tsx
src/app/not-found.tsx
src/app/page.tsx
src/app/robots.ts
src/app/sitemap.ts
src/components/pagination.tsx
src/components/ui/accordion.tsx
src/components/ui/avatar.tsx
src/components/ui/button.tsx
src/components/ui/card.tsx
src/components/ui/input.tsx
src/components/ui/sheet.tsx
src/features/admin/actions/admin-auth.action.ts
src/features/admin/actions/categories.action.ts
src/features/admin/actions/manual-business.action.ts
src/features/admin/actions/moderation.action.ts
src/features/admin/actions/plan.action.ts
src/features/admin/actions/reviews.action.ts
src/features/admin/actions/users.action.ts
src/features/admin/components/admin-login-form.tsx
src/features/admin/components/admin-sidebar.tsx
src/features/admin/components/business-approval-actions.tsx
src/features/admin/components/business-profile-overview.tsx
src/features/admin/components/category-manager.tsx
src/features/admin/components/document-review-card.tsx
src/features/admin/components/manual-business-form.tsx
src/features/admin/components/pending-business-row.tsx
src/features/admin/components/plan-change-control.tsx
src/features/admin/components/review-row.tsx
src/features/admin/components/user-suspension-actions.tsx
src/features/admin/lib/get-business-detail.ts
src/features/admin/lib/get-business-page.ts
src/features/admin/types/plan.ts
src/features/admin/types/user.ts
src/features/auth/actions/logout.action.ts
src/features/auth/actions/request-otp.action.ts
src/features/auth/actions/verify-otp.action.ts
src/features/auth/components/login-flow.tsx
src/features/auth/components/otp-request-form.tsx
src/features/auth/components/otp-verify-form.tsx
src/features/auth/schemas/otp.schema.ts
src/features/business/actions/advance-onboarding.action.ts
src/features/business/actions/authed-fetch.ts
src/features/business/actions/branches.action.ts
src/features/business/actions/create-business.action.ts
src/features/business/actions/features.action.ts
src/features/business/actions/gallery.action.ts
src/features/business/actions/installment.action.ts
src/features/business/actions/products.action.ts
src/features/business/actions/save-registration-identity.action.ts
src/features/business/actions/services.action.ts
src/features/business/actions/submit-document.action.ts
src/features/business/actions/update-business-profile.action.ts
src/features/business/actions/upload-file.action.ts
src/features/business/actions/working-hours.action.ts
src/features/business/components/business-wizard.tsx
src/features/business/components/jalali-date-select.tsx
src/features/business/components/profile/about-form.tsx
src/features/business/components/profile/basic-info-form.tsx
src/features/business/components/profile/branches-manager.tsx
src/features/business/components/profile/coming-soon-notice.tsx
src/features/business/components/profile/contact-form.tsx
src/features/business/components/profile/features-manager.tsx
src/features/business/components/profile/gallery-manager.tsx
src/features/business/components/profile/installment-form.tsx
src/features/business/components/profile/location-picker.tsx
src/features/business/components/profile/onboarding-context.tsx
src/features/business/components/profile/primary-address-form.tsx
src/features/business/components/profile/products-manager.tsx
src/features/business/components/profile/profile-edit-shell.tsx
src/features/business/components/profile/services-manager.tsx
src/features/business/components/profile/social-media-form.tsx
src/features/business/components/profile/working-hours-form.tsx
src/features/business/components/reupload-documents-form.tsx
src/features/business/components/steps/business-info-step.tsx
src/features/business/components/steps/documents-step.tsx
src/features/business/components/steps/identity-step.tsx
src/features/business/components/steps/success-step.tsx
src/features/business/lib/advance-onboarding.ts
src/features/business/lib/category-options.ts
src/features/business/lib/get-my-business.ts
src/features/business/lib/get-registration-documents.ts
src/features/business/lib/onboarding-steps.ts
src/features/business/lib/registration.ts
src/features/business/schemas/business-info.schema.ts
src/features/business/schemas/identity.schema.ts
src/features/business/types/business-extras.ts
src/features/business/types/business-feature.ts
src/features/business/types/business-profile.ts
src/features/dashboard/components/dashboard-header.tsx
src/features/dashboard/components/dashboard-logout-item.tsx
src/features/dashboard/components/dashboard-menu-item.tsx
src/features/dashboard/components/dashboard-user-card.tsx
src/features/dashboard/components/edit-profile-form.tsx
src/features/home/components/categories-section.tsx
src/features/home/components/faq-section.tsx
src/features/home/components/footer.tsx
src/features/home/components/hero-section.tsx
src/features/home/components/mobile-drawer.tsx
src/features/home/components/navbar.tsx
src/features/home/components/new-members-section.tsx
src/features/home/components/process-section.tsx
src/features/home/components/register-cta-banner.tsx
src/features/home/components/testimonials-section.tsx
src/features/notifications/actions/notifications.action.ts
src/features/notifications/components/notification-row.tsx
src/features/notifications/types.ts
src/features/profile/actions/complete-profile.action.ts
src/features/profile/actions/update-profile.action.ts
src/features/profile/components/complete-profile-form.tsx
src/features/profile/schemas/complete-profile.schema.ts
src/features/profile/schemas/edit-profile.schema.ts
src/features/public/actions/favorite.action.ts
src/features/public/actions/reviews.action.ts
src/features/public/components/breadcrumb.tsx
src/features/public/components/business-card.tsx
src/features/public/components/business-location-map.tsx
src/features/public/components/favorite-button.tsx
src/features/public/components/features-checklist.tsx
src/features/public/components/promo-banner.tsx
src/features/public/components/review-form.tsx
src/features/public/components/reviews-list.tsx
src/features/public/components/site-header.tsx
src/features/public/components/static-location-map.tsx
src/features/public/types/public-business.ts
src/features/public/types/review.ts
src/lib/api/action-fetch.ts
src/lib/api/backend-get.ts
src/lib/api/client.ts
src/lib/api/error-message.ts
src/lib/api/mutation-validation.ts
src/lib/api/page-fetch.ts
src/lib/auth/action-access-token.ts
src/lib/auth/cookies.ts
src/lib/auth/get-current-user.ts
src/lib/auth/refresh-session.ts
src/lib/auth/roles.ts
src/lib/auth/safe-redirect.ts
src/lib/auth/validate-auth-response.ts
src/lib/auth/verify-access-token.ts
src/lib/constants/auth.ts
src/lib/constants/iran-locations.ts
src/lib/nav-config.ts
src/lib/utils.ts
src/lib/utils/jalali.ts
src/lib/validate-file.ts
src/lib/validate-upload.ts
src/lib/validators/national-code.ts
src/proxy.ts
src/types/auth.ts
tests/admin-business-detail.production.cjs
tests/admin-business-detail.test.cjs
tests/admin-routing.test.cjs
tests/docs.test.cjs
tests/helpers.cjs
tests/http.test.cjs
tests/onboarding.test.cjs
tests/security.test.cjs
```

## فایل‌های ریشه مرتبط

| فایل | کاربرد |
| --- | --- |
| `package.json` | dependencyها و scriptها |
| `package-lock.json` / `pnpm-lock.yaml` | دو lockfile حفظ شده؛ pnpm مرجع ثبت‌شده است |
| `pnpm-workspace.yaml` | تنظیم build dependencyها برای pnpm |
| `tsconfig.json` | strict TypeScript و alias |
| `next.config.ts` | سقف Server Action و origin توسعه |
| `eslint.config.mjs` | قواعد Next، TypeScript و ignoreهای build |
| `postcss.config.mjs` | پردازش Tailwind |
| `components.json` | تنظیم تولید اجزای shadcn |
| `.gitignore` | حذف env، dependency و build از نسخه‌بندی |
| `README.md` | معرفی پروژه، اجرای سریع و لینک مستندات |
| `ONBOARDING-UPDATE.md` | سابقه بسته تغییر onboarding؛ QA آن تاریخی است |

فایل خصوصی `.env` در این فهرست محتوایی بررسی نشده و مقادیر آن مستند نشده‌اند. `src/error.tsx` حذف و error boundary در `src/app/error.tsx` ایجاد شده است.
