"use client";

import { ArrowLeft, Box, Building2, CheckCircle2, CreditCard, Eye, Image as ImageIcon, MapPin, MessageCircle, Phone, Share2, ShieldAlert } from "lucide-react";
import { DashboardAccountLayout } from "@/design/components/dashboard-account-layout";
import { Button } from "@/design/components/ui/button";
import { Link } from "@/design/navigation";
import type { BusinessControllerGetMine200Item } from "@/design/api/generated/models/businessControllerGetMine200Item";

const metricDefinitions = [
  { title: "بازدید پروفایل", keys: ["BUSINESS_VIEW", "PAGE_VIEW"], icon: Eye },
  { title: "کلیک تماس", keys: ["PHONE_CLICK", "CONTACT_CLICK"], icon: Phone },
  { title: "کلیک واتساپ", keys: ["WHATSAPP_CLICK"], icon: MessageCircle },
  { title: "اشتراک‌گذاری", keys: ["SHARE_CLICK"], icon: Share2 },
] as const;

function statusPresentation(status: BusinessControllerGetMine200Item["status"]) {
  switch (status) {
    case "APPROVED": return { label: "تأیید شده و فعال", className: "border-emerald-200 bg-emerald-50 text-emerald-900", icon: CheckCircle2 };
    case "REJECTED": return { label: "نیازمند اصلاح", className: "border-rose-200 bg-rose-50 text-rose-900", icon: ShieldAlert };
    case "SUSPENDED": return { label: "تعلیق شده", className: "border-rose-200 bg-rose-50 text-rose-900", icon: ShieldAlert };
    default: return { label: "در انتظار بررسی", className: "border-amber-200 bg-amber-50 text-amber-950", icon: Building2 };
  }
}

export function BusinessDashboardLivePage({
  business,
  analytics,
  analyticsAvailable,
}: {
  business: BusinessControllerGetMine200Item;
  analytics: Record<string, number>;
  analyticsAvailable: boolean;
}) {
  const status = statusPresentation(business.status);
  const StatusIcon = status.icon;
  const format = (value: number | undefined) => analyticsAvailable ? (value ?? 0).toLocaleString("fa-IR") : "—";
  const isVipActive = business.planType === "VIP" && !!business.planExpiryDate && new Date(business.planExpiryDate) > new Date();

  return (
    <DashboardAccountLayout
      title="داشبورد کسب‌وکار"
      headerAction={<Link to="/dashboard"><Button variant="outline">بازگشت به پنل مشتری</Button></Link>}
    >
      <div className="space-y-8 sm:space-y-10">
        <section className={`flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-xs)] border p-4 sm:p-5 ${status.className}`} aria-labelledby="business-status-title">
          <div className="flex min-w-0 items-start gap-3">
            <StatusIcon aria-hidden className="mt-0.5 size-5 shrink-0" />
            <div className="min-w-0">
              <h2 id="business-status-title" className="truncate text-lg font-black">{business.name}</h2>
              <p className="mt-1 text-sm">{status.label}{business.status === "APPROVED" ? ` · اشتراک ${isVipActive ? "VIP" : "رایگان"}` : ""}</p>
              {business.status === "REJECTED" && business.rejectionReason && <p className="mt-2 text-sm leading-7">دلیل نیاز به اصلاح: {business.rejectionReason}</p>}
              {business.status === "SUSPENDED" && business.suspendedReason && <p className="mt-2 text-sm leading-7">دلیل تعلیق: {business.suspendedReason}</p>}
              {business.status === "PENDING" && <p className="mt-2 text-sm leading-7">پس از بررسی، وضعیت کسب‌وکار از همین صفحه قابل پیگیری است.</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to={`/businesses/${encodeURIComponent(business.slug)}`}><Button variant="outline" className="border-current bg-white/70">نمایش پروفایل عمومی</Button></Link>
            {business.onboardingStep < 11 && <Link to="/dashboard/business/profile"><Button>ادامهٔ تکمیل پروفایل</Button></Link>}
          </div>
        </section>

        <section aria-labelledby="business-metrics-title">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 id="business-metrics-title" className="text-lg font-black text-[var(--text-title)]">عملکرد پروفایل</h2>
            <span className="text-xs text-[var(--text-muted)]">آمار تجمیعی ثبت‌شده برای کسب‌وکار</span>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {metricDefinitions.map(({ title, keys, icon: Icon }) => {
              const value = keys.map((key) => analytics[key]).find((count) => typeof count === "number");
              return (
                <article key={title} className="rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3"><span className="text-sm text-[var(--text-body)]">{title}</span><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700"><Icon aria-hidden className="size-5" /></span></div>
                  <strong className="mt-3 block text-2xl font-black text-[var(--text-title)]">{format(value)}</strong>
                  {!analyticsAvailable && <span className="mt-1 block text-xs text-[var(--text-muted)]">دریافت آمار موقتاً ممکن نیست</span>}
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3"><h2 className="text-lg font-black text-[var(--text-title)]">مدیریت کسب‌وکار</h2><Building2 aria-hidden className="size-5 text-primary-700" /></div>
            <p className="mt-2 text-sm leading-7 text-[var(--text-body)]">اطلاعات عمومی، راه‌های ارتباطی، شعب و محتوای پروفایل را از مسیرهای فعلی مدیریت کن.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link to="/dashboard/business/profile/basic" className="flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] p-4 text-sm font-bold text-[var(--text-title)] hover:border-primary-300">ویرایش اطلاعات پایه <ArrowLeft aria-hidden className="size-4 shrink-0" /></Link>
              <Link to="/dashboard/business/profile/address" className="flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] p-4 text-sm font-bold text-[var(--text-title)] hover:border-primary-300">آدرس و مدیریت شعب <MapPin aria-hidden className="size-4 shrink-0" /></Link>
              <Link to="/dashboard/business/profile/products" className="flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] p-4 text-sm font-bold text-[var(--text-title)] hover:border-primary-300">محصولات <Box aria-hidden className="size-4 shrink-0" /></Link>
              <Link to="/dashboard/business/profile/services" className="flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] p-4 text-sm font-bold text-[var(--text-title)] hover:border-primary-300">خدمات <Building2 aria-hidden className="size-4 shrink-0" /></Link>
              <Link to="/dashboard/business/profile/gallery" className="flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] p-4 text-sm font-bold text-[var(--text-title)] hover:border-primary-300">گالری تصاویر و ویدیو <ImageIcon aria-hidden className="size-4 shrink-0" /></Link>
              <Link to="/dashboard/subscription" className="flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] p-4 text-sm font-bold text-[var(--text-title)] hover:border-primary-300">اشتراک و امکانات <CreditCard aria-hidden className="size-4 shrink-0" /></Link>
            </div>
          </div>

          <div className="rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-5 sm:p-6">
            <h2 className="text-lg font-black text-[var(--text-title)]">وضعیت و قدم بعدی</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--text-body)]">
              <p className="flex items-start gap-2"><CheckCircle2 aria-hidden className="mt-1 size-4 shrink-0 text-primary-700" />وضعیت انتشار: {status.label}</p>
              <p className="flex items-start gap-2"><CreditCard aria-hidden className="mt-1 size-4 shrink-0 text-primary-700" />پلن فعلی: {isVipActive ? "VIP" : "رایگان"}</p>
              {business.onboardingStep < 11 ? <p>اطلاعات پروفایل را کامل کن تا روند ثبت ادامه پیدا کند.</p> : <p>اطلاعات کسب‌وکار را به‌روز نگه دار تا مشتری‌ها راه‌های تماس و خدماتت را ببینند.</p>}
            </div>
            <Link to="/dashboard/business/profile" className="mt-5 inline-flex"><Button variant="outline">رفتن به مدیریت پروفایل</Button></Link>
          </div>
        </section>
      </div>
    </DashboardAccountLayout>
  );
}
