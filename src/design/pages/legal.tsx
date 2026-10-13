"use client"

import { SiteLayout } from "@/design/components/site-layout"
import { Breadcrumb } from "@/design/components/breadcrumb"
import { FaqSection } from "@/design/components/faq-section"
import { Link } from "@/design/navigation"

function FaqPage() {
  return (
    <SiteLayout>
      <nav className="px-[var(--page-gutter)] pt-[var(--lg)] lg:px-[var(--page-gutter-lg)]">
        <Breadcrumb
          items={[{ label: "خانه", to: "/" }, { label: "سوالات متداول" }]}
        />
      </nav>
      <FaqSection />
    </SiteLayout>
  )
}

function TermsPage() {
  return (
    <SiteLayout>
      <nav className="px-[var(--page-gutter)] pt-[var(--lg)] lg:px-[var(--page-gutter-lg)]">
        <Breadcrumb
          items={[{ label: "خانه", to: "/" }, { label: "قوانین و مقررات" }]}
        />
      </nav>
      <article className="mx-auto max-w-3xl space-y-[var(--2xl)] px-[var(--page-gutter)] py-[var(--5xl)] text-right lg:px-[var(--page-gutter-lg)]">
        <h1 className="text-3xl font-black text-[var(--text-title)]">
          قوانین و مقررات
        </h1>
        <p className="text-base leading-relaxed text-[var(--text-body)]">
          استفاده از ایران پلازا به‌منزلهٔ پذیرش قوانین زیر است. محتوای پروفایل‌ها
          توسط صاحبان کسب‌وکار منتشر می‌شود و صحت اطلاعات بر عهدهٔ آنان است.
        </p>
        <ul className="list-inside list-disc space-y-[var(--md)] text-base leading-relaxed text-[var(--text-body)]">
          <li>ثبت‌نام و ایجاد پروفایل رایگان است؛ پلن VIP اختیاری است.</li>
          <li>انتشار محتوای توهین‌آمیز، خلاف قانون یا گمراه‌کننده ممنوع است.</li>
          <li>ایران پلازا حق حذف یا تعلیق حساب متخلف را دارد.</li>
          <li>
            برای پشتیبانی با بخش{" "}
            <Link to="/contact" className="font-bold text-primary-500 underline">
              تماس با ما
            </Link>{" "}
            در ارتباط باشید.
          </li>
        </ul>
      </article>
    </SiteLayout>
  )
}

function AboutPage() {
  return (
    <SiteLayout>
      <nav className="px-[var(--page-gutter)] pt-[var(--lg)] lg:px-[var(--page-gutter-lg)]">
        <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "درباره ما" }]} />
      </nav>
      <article className="mx-auto max-w-3xl space-y-[var(--2xl)] px-[var(--page-gutter)] py-[var(--5xl)] text-right lg:px-[var(--page-gutter-lg)]">
        <h1 className="text-3xl font-black text-[var(--text-title)]">درباره ما</h1>
        <p className="text-base leading-relaxed text-[var(--text-body)]">
          ایران پلازا بستری برای معرفی و جستجوی کسب‌وکارهای محلی است. هدف ما
          دیده‌شدن بهتر کسب‌وکارها و پیدا کردن سریع‌تر خدمات برای کاربران است.
        </p>
      </article>
    </SiteLayout>
  )
}

function ContactPage() {
  return (
    <SiteLayout>
      <nav className="px-[var(--page-gutter)] pt-[var(--lg)] lg:px-[var(--page-gutter-lg)]">
        <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: "تماس با ما" }]} />
      </nav>
      <article className="mx-auto max-w-3xl space-y-[var(--2xl)] px-[var(--page-gutter)] py-[var(--5xl)] text-right lg:px-[var(--page-gutter-lg)]">
        <h1 className="text-3xl font-black text-[var(--text-title)]">تماس با ما</h1>
        <p className="text-base leading-relaxed text-[var(--text-body)]">
          پاسخ پرسش‌های مربوط به ثبت کسب‌وکار و استفاده از ایران پلازا را در بخش سوالات متداول ببینید.
        </p>
        <p className="text-lg font-bold text-[var(--text-title)]">
          <Link to="/faq" className="text-primary-700 underline">سوالات متداول</Link>
        </p>
      </article>
    </SiteLayout>
  )
}

export { FaqPage, TermsPage, AboutPage, ContactPage }
