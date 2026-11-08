"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Building2, Clock3, Heart, MapPin, Search, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { DashboardAccountLayout } from "@/design/components/dashboard-account-layout";
import { BusinessSlider } from "@/design/components/business-slider";
import type { BusinessCardData } from "@/design/components/business-card";
import { Button } from "@/design/components/ui/button";
import { Link } from "@/design/navigation";
import { businessCard } from "@/design/api/business";
import { decodeBusinesses } from "@/design/api/catalog";
import { businessControllerListPublic, favoriteControllerGetMine } from "@/design/api/generated/browser";
import { readRecentBusinesses } from "@/design/lib/recent-businesses";
import { readCustomerDashboardCache, writeCustomerDashboardCache } from "@/design/lib/customer-dashboard-cache";
import { useDesignBusiness, useDesignUser } from "@/design/provider";

type FavoriteItem = Awaited<ReturnType<typeof favoriteControllerGetMine>>[number];

function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  href,
}: {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  href: string;
}) {
  return (
    <Link to={href} className="group rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-4 transition-colors hover:border-primary-300 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-[var(--text-body)]">{title}</span>
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-700">
          <Icon aria-hidden className="size-5" />
        </span>
      </div>
      <strong className="mt-3 block text-2xl font-black text-[var(--text-title)]">{value}</strong>
      <span className="mt-1 block text-xs text-[var(--text-muted)]">{description}</span>
    </Link>
  );
}

function SectionEmpty({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[var(--radius-xs)] border border-dashed border-[var(--opacity-dark-16)] bg-[var(--surface)] px-5 py-8 text-center text-sm leading-7 text-[var(--text-body)]">{children}</div>;
}

function favoriteCardData(item: FavoriteItem): BusinessCardData {
  return {
    id: item.id,
    name: item.name,
    description: "",
    location: "",
    image: item.logoId ? `/api/backend/files/${encodeURIComponent(item.logoId)}` : "/design/icons/briefcase.svg",
    vip: false,
    href: `/businesses/${encodeURIComponent(item.slug)}`,
  };
}

export function CustomerDashboardLivePage({
  needsRegistration = false,
  canWriteContent = false,
}: {
  needsRegistration?: boolean;
  canWriteContent?: boolean;
}) {
  const user = useDesignUser();
  const business = useDesignBusiness();
  const [recent, setRecent] = useState<BusinessCardData[]>([]);
  const [favorites, setFavorites] = useState<BusinessCardData[]>([]);
  const [latest, setLatest] = useState<BusinessCardData[]>([]);
  const [latestTotal, setLatestTotal] = useState<number | null>(null);
  const [featured, setFeatured] = useState<BusinessCardData[]>([]);
  const [featuredTotal, setFeaturedTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [businessError, setBusinessError] = useState("");
  const [featuredError, setFeaturedError] = useState("");
  const [favoriteError, setFavoriteError] = useState("");

  useEffect(() => {
    if (!user?.id) {
      const resetFrame = window.requestAnimationFrame(() => {
        setRecent([]);
        setFavorites([]);
        setLatest([]);
        setFeatured([]);
        setLoading(false);
      });
      return () => window.cancelAnimationFrame(resetFrame);
    }

    const controller = new AbortController();
    const loadFrame = window.requestAnimationFrame(() => {
      try {
        setRecent(readRecentBusinesses(user.id, window.localStorage));
      } catch {
        setRecent([]);
      }
      const cachedFavorites = readCustomerDashboardCache(user.id, "favorites", window.sessionStorage);
      const cachedLatest = readCustomerDashboardCache(user.id, "latest", window.sessionStorage);
      const cachedFeatured = readCustomerDashboardCache(user.id, "featured", window.sessionStorage);
      setFavorites(cachedFavorites ?? []);
      setLatest(cachedLatest ?? []);
      setLatestTotal(null);
      setFeatured(cachedFeatured ?? []);
      setFeaturedTotal(null);
      setLoading(!cachedFavorites && !cachedLatest && !cachedFeatured);
      setBusinessError("");
      setFeaturedError("");
      setFavoriteError("");

      Promise.allSettled([
        businessControllerListPublic({ page: 1, limit: 8 }, { signal: controller.signal }),
        businessControllerListPublic({ page: 1, limit: 8, vipOnly: true }, { signal: controller.signal }),
        favoriteControllerGetMine({ signal: controller.signal }),
      ]).then(([latestResult, featuredResult, favoriteResult]) => {
      if (controller.signal.aborted) return;
      if (latestResult.status === "fulfilled") {
        try {
          const items = decodeBusinesses(latestResult.value.data).map(businessCard);
          setLatest(items);
          writeCustomerDashboardCache(user.id, "latest", items, window.sessionStorage);
          setLatestTotal(latestResult.value.total);
        } catch {
          if (!cachedLatest) setBusinessError("دریافت کسب‌وکارها انجام نشد. دوباره تلاش کنید.");
        }
      } else {
        if (!cachedLatest) setBusinessError("دریافت کسب‌وکارها انجام نشد. دوباره تلاش کنید.");
      }
      if (featuredResult.status === "fulfilled") {
        try {
          const items = decodeBusinesses(featuredResult.value.data).map(businessCard);
          setFeatured(items);
          writeCustomerDashboardCache(user.id, "featured", items, window.sessionStorage);
          setFeaturedTotal(featuredResult.value.total);
        } catch {
          if (!cachedFeatured) setFeaturedError("دریافت کسب‌وکارهای ویژه انجام نشد.");
        }
      } else {
        if (!cachedFeatured) setFeaturedError("دریافت کسب‌وکارهای ویژه انجام نشد.");
      }
      if (favoriteResult.status === "fulfilled") {
        const items = favoriteResult.value.map(favoriteCardData);
        setFavorites(items);
        writeCustomerDashboardCache(user.id, "favorites", items, window.sessionStorage);
      } else {
        if (!cachedFavorites) setFavoriteError("دریافت علاقه‌مندی‌ها انجام نشد.");
      }
        setLoading(false);
      });
    });

    return () => {
      window.cancelAnimationFrame(loadFrame);
      controller.abort();
    };
  }, [user?.id]);

  const firstName = user?.fullName?.trim().split(/\s+/)[0];
  const number = (value: number | null) => value === null ? "—" : value.toLocaleString("fa-IR");

  return (
    <DashboardAccountLayout
      title="پنل مشتری"
      headerAction={business ? <Link to="/dashboard/business"><Button variant="outline">رفتن به پنل صاحب کسب‌وکار</Button></Link> : undefined}
    >
      <div className="space-y-9 sm:space-y-11">
        <section className="flex flex-wrap items-end justify-between gap-4" aria-labelledby="customer-dashboard-title">
          <div>
            <h2 id="customer-dashboard-title" className="text-2xl font-black text-[var(--text-title)]">{firstName ? `سلام ${firstName}، خوش اومدی` : "سلام، خوش اومدی"}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--text-body)]">کسب‌وکارهای موردعلاقه‌ات را پیدا کن و برای بعد نگه دار.</p>
          </div>
          <Link to="/businesses"><Button className="gap-2"><Search aria-hidden className="size-4" />جست‌وجوی کسب‌وکارها</Button></Link>
        </section>

        {needsRegistration && business && (
          <section className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-xs)] border border-amber-200 bg-amber-50 p-4 sm:p-5">
            <div><h3 className="font-bold text-[var(--text-title)]">ثبت کسب‌وکارت هنوز کامل نشده</h3><p className="mt-1 text-sm text-[var(--text-body)]">برای ادامهٔ بررسی، مدارک و اطلاعات باقی‌مانده را تکمیل کن.</p></div>
            <Link to="/dashboard/business/new"><Button variant="outline">ادامهٔ ثبت</Button></Link>
          </section>
        )}

        <section className="grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="خلاصه حساب">
          <MetricCard title="علاقه‌مندی‌ها" value={loading ? "…" : number(favoriteError ? null : favorites.length)} description="کسب‌وکارهای ذخیره‌شده" icon={Heart} href="/dashboard/favorites" />
          <MetricCard title="بازدیدهای اخیر" value={number(recent.length)} description="در همین مرورگر و حساب" icon={Clock3} href="/businesses" />
          <MetricCard title="کسب‌وکارهای ویژه" value={loading ? "…" : number(featuredTotal)} description="دارای اشتراک معتبر VIP" icon={Sparkles} href="/businesses?vipOnly=true" />
          <MetricCard title="کسب‌وکارها" value={loading ? "…" : number(latestTotal)} description="در فهرست عمومی" icon={Building2} href="/businesses" />
        </section>

        <section className="space-y-4" aria-labelledby="recent-businesses-title">
          <div className="flex items-center justify-between gap-3"><h2 id="recent-businesses-title" className="text-lg font-black text-[var(--text-title)]">بازدیدهای اخیر</h2><Link to="/businesses" className="flex items-center gap-1 text-sm font-bold text-primary-700">جست‌وجو <ArrowLeft aria-hidden className="size-4" /></Link></div>
          {recent.length ? <BusinessSlider items={recent} /> : <SectionEmpty>هنوز پروفایل کسب‌وکاری را باز نکرده‌ای. <Link to="/businesses" className="font-bold text-primary-700">از فهرست کسب‌وکارها شروع کن.</Link></SectionEmpty>}
        </section>

        <section className="space-y-4" aria-labelledby="favorites-title">
          <div className="flex items-center justify-between gap-3"><h2 id="favorites-title" className="text-lg font-black text-[var(--text-title)]">علاقه‌مندی‌های تو</h2><Link to="/dashboard/favorites" className="flex items-center gap-1 text-sm font-bold text-primary-700">مشاهده همه <ArrowLeft aria-hidden className="size-4" /></Link></div>
          {favoriteError ? <SectionEmpty>{favoriteError}</SectionEmpty> : favorites.length ? <BusinessSlider items={favorites.slice(0, 8)} /> : loading ? <SectionEmpty>در حال دریافت علاقه‌مندی‌ها…</SectionEmpty> : <SectionEmpty>هنوز کسب‌وکاری ذخیره نکرده‌ای. با زدن نشان قلب در پروفایل کسب‌وکار، آن را اینجا نگه دار.</SectionEmpty>}
        </section>

        <section className="space-y-4" aria-labelledby="featured-businesses-title">
          <div className="flex items-center justify-between gap-3"><h2 id="featured-businesses-title" className="text-lg font-black text-[var(--text-title)]">کسب‌وکارهای ویژه</h2><Link to="/businesses?vipOnly=true" className="flex items-center gap-1 text-sm font-bold text-primary-700">مشاهده همه <ArrowLeft aria-hidden className="size-4" /></Link></div>
          {featuredError ? <SectionEmpty>{featuredError}</SectionEmpty> : featured.length ? <BusinessSlider items={featured} /> : loading ? <SectionEmpty>در حال دریافت فهرست…</SectionEmpty> : <SectionEmpty>در حال حاضر کسب‌وکار ویژه‌ای برای نمایش پیدا نشد.</SectionEmpty>}
        </section>

        <section className="space-y-4" aria-labelledby="new-businesses-title">
          <div className="flex items-center justify-between gap-3"><h2 id="new-businesses-title" className="text-lg font-black text-[var(--text-title)]">کسب‌وکارهای ایران پلازا</h2><Link to="/businesses" className="flex items-center gap-1 text-sm font-bold text-primary-700">مشاهده همه <ArrowLeft aria-hidden className="size-4" /></Link></div>
          {businessError ? <SectionEmpty>{businessError}</SectionEmpty> : latest.length ? <BusinessSlider items={latest} /> : loading ? <SectionEmpty>در حال دریافت فهرست…</SectionEmpty> : <SectionEmpty>هنوز کسب‌وکاری برای نمایش ثبت نشده است.</SectionEmpty>}
        </section>

        <section className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-md)] bg-primary-900 p-5 text-white sm:p-7">
          <div className="flex items-start gap-3"><MapPin aria-hidden className="mt-1 size-5 shrink-0" /><div><h2 className="font-black">پیدا کردن کسب‌وکار نزدیک به تو</h2><p className="mt-1 text-sm leading-7 text-white/80">در جست‌وجو، شهر و محلهٔ موردنظرت را انتخاب کن.</p></div></div>
          <Link to="/businesses"><Button variant="outline" className="border-white bg-white text-primary-900 hover:bg-primary-50">انتخاب شهر و محله</Button></Link>
        </section>

        {canWriteContent && <Link to="/content" className="block rounded-[var(--radius-xs)] border border-[var(--opacity-dark-8)] bg-[var(--surface)] p-4 text-sm font-bold text-primary-700">مدیریت نوشته‌های ایران پلازا</Link>}
      </div>
    </DashboardAccountLayout>
  );
}
