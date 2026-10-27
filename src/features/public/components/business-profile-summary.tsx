"use client";

import Image from "next/image";
import type { BusinessControllerGetFullBySlug200 } from "@/design/api/generated/models/businessControllerGetFullBySlug200";
import { Breadcrumb } from "@/design/components/breadcrumb";
import { Scoring } from "@/design/components/scoring";
import { VipBadge } from "@/design/components/vip-badge";
import { Button } from "@/design/components/ui/button";
import { BusinessBrandVideo } from "@/features/public/components/business-profile-media";

const callIcon = "/design/icons/call.svg";
const convertCardIcon = "/design/icons/convert-card.svg";
const discountIcon = "/design/icons/discount-shape.svg";
const locationIcon = "/design/icons/location.svg";
const shareIcon = "/design/icons/share.svg";
const starIcon = "/design/icons/star.svg";

type BusinessProfileSummaryProps = {
  business: BusinessControllerGetFullBySlug200;
  logo: string;
  isVip: boolean;
  average: number;
  reviewCount: number;
  rating: number;
  onRatingChange: (rating: number) => void;
  onAddress: () => void;
  onContact: () => void;
  onShare: () => void;
};

function ProfileChip({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="inline-flex h-8 flex-row-reverse items-center gap-1 rounded-full border border-[var(--opacity-dark-16)] px-3 text-sm text-[var(--text-body)]">
      {label}
      <Image alt="" className="size-4" height={16} src={icon} width={16} />
    </span>
  );
}

function RatingChip({ average }: { average: number }) {
  const value = average > 0 ? average.toFixed(1) : "۰.۰";

  return (
    <span className="inline-flex h-8 flex-row-reverse items-center gap-1 rounded-full border border-[var(--opacity-dark-16)] px-3 text-base font-bold text-[var(--text-body)]">
      <span dir="ltr">{value}</span>
      <Image alt="" className="size-4" height={16} src={starIcon} width={16} />
    </span>
  );
}

function ProfileTags({ business, isVip }: Pick<BusinessProfileSummaryProps, "business" | "isVip">) {
  if (!isVip) return null;

  const hasDiscount = business.products.some((product) => product.isActive && product.discountPercent > 0);
  const hasInstallments = business.installmentPlan?.isActive === true;

  if (!hasDiscount && !hasInstallments) return null;

  return (
    <div className="flex flex-row-reverse flex-wrap gap-1">
      {hasDiscount && <ProfileChip label="تخفیف دار" icon={discountIcon} />}
      {hasInstallments && <ProfileChip label="شرایط اقساطی" icon={convertCardIcon} />}
    </div>
  );
}

function ProfileActions({ onAddress, onContact, compact = false }: Pick<BusinessProfileSummaryProps, "onAddress" | "onContact"> & { compact?: boolean }) {
  return (
    <div className={compact ? "flex w-full flex-row-reverse gap-2" : "flex flex-row-reverse gap-4"}>
      <Button size="lg" className={compact ? "min-w-0 flex-[1.25] flex-row-reverse gap-2 whitespace-nowrap px-4 text-sm" : "w-[200px] flex-row-reverse gap-2"} onClick={onContact}>
        تماس/ واتساپ
        <Image alt="" className="size-6" height={24} src={callIcon} width={24} />
      </Button>
      <Button variant="secondary" size="lg" className={compact ? "min-w-0 flex-1 flex-row-reverse gap-2 px-4 text-sm" : "flex-row-reverse gap-2"} onClick={onAddress}>
        آدرس
        <Image alt="" className="size-6" height={24} src={locationIcon} width={24} />
      </Button>
    </div>
  );
}

export function BusinessProfileSummary({
  business,
  logo,
  isVip,
  average,
  reviewCount,
  rating,
  onRatingChange,
  onAddress,
  onContact,
  onShare,
}: BusinessProfileSummaryProps) {
  const breadcrumbCategories = business.categories
    .flatMap(({ category }) => (category.parent ? [category.parent, category] : [category]))
    .filter((category, index, all) => all.findIndex((item) => item.id === category.id) === index);
  const address = business.address ?? business.city;

  return (
    <>
      <section className="business-summary-mobile business-container lg:hidden">
        <article className="business-profile-card rounded-[var(--radius-xs)] border border-[var(--border-subtle)] bg-secondary-50 p-6">
          <div className="flex flex-row-reverse items-start justify-between gap-4">
            <div className="flex flex-row-reverse items-center gap-6 py-1">
              {isVip && <VipBadge />}
              <button type="button" aria-label="اشتراک‌گذاری" className="size-6" onClick={onShare}>
                <Image alt="" className="size-full" height={24} src={shareIcon} width={24} />
              </button>
            </div>
            <BusinessBrandVideo videoId={business.introVideoId} imageSrc={logo} name={business.name} size="small" layout="overlay" />
          </div>

          <div className="mt-5 space-y-1 text-right">
            <h1 className="text-xl font-bold text-[var(--text-title)]">{business.name}</h1>
            {business.description && <p className="text-sm leading-7 text-[var(--text-body)]">{business.description}</p>}
            <div className="flex flex-row-reverse items-start justify-start gap-1 text-sm leading-7 text-[var(--text-body)]">
              <span>{address}</span>
              <Image alt="" className="mt-1.5 size-4 shrink-0" height={16} src={locationIcon} width={16} />
            </div>
          </div>

          <div className="mt-5 flex flex-row-reverse flex-wrap items-center justify-between gap-2">
            <ProfileTags business={business} isVip={isVip} />
            <RatingChip average={average} />
          </div>

          <div className="mt-5">
            <ProfileActions compact onAddress={onAddress} onContact={onContact} />
          </div>
        </article>

        <Scoring
          orientation="vertical"
          className="business-summary-score mt-6 w-full bg-[var(--surface)] py-6"
          average={average}
          count={reviewCount}
          defaultValue={rating}
          onChange={onRatingChange}
        />
      </section>

      <div className="business-summary-desktop hidden lg:block">
        <div className="mx-auto flex max-w-[1440px] flex-row-reverse items-center justify-between gap-4 px-[var(--page-gutter-lg)] py-6">
          <div className="flex flex-row-reverse items-center gap-4">
            {isVip && <VipBadge />}
            <button type="button" aria-label="اشتراک‌گذاری" className="flex size-12 items-center justify-center rounded-full" onClick={onShare}>
              <Image alt="" className="size-6" height={24} src={shareIcon} width={24} />
            </button>
          </div>
          <Breadcrumb
            className="min-w-0 flex-1"
            items={[
              { label: "خانه", to: "/" },
              { label: "کسب‌وکارها", to: "/businesses" },
              ...breadcrumbCategories.map((category) => ({ label: category.name, to: `/businesses?categoryId=${encodeURIComponent(category.id)}` })),
              { label: business.name },
            ]}
          />
        </div>

        <section className="mx-auto max-w-[1440px] px-[var(--page-gutter-lg)] pb-[var(--5xl)] pt-[var(--space-16)]">
          <div className="flex flex-row-reverse items-end justify-between gap-[var(--5xl)]">
            <ProfileActions onAddress={onAddress} onContact={onContact} />

            <div className="flex min-w-0 flex-1 flex-row-reverse items-center justify-start gap-[var(--2xl)]">
              <div className="flex min-w-0 max-w-[659px] flex-1 flex-col items-start gap-[var(--lg)]">
                <div className="w-full space-y-[var(--sm)] text-right">
                  <h1 className="text-[length:var(--text-h1)] font-black leading-[1.4] text-[var(--text-title)]">{business.name}</h1>
                  {business.description && <p className="text-lg leading-relaxed text-[var(--text-body)]">{business.description}</p>}
                  <div className="flex flex-row-reverse items-start justify-end gap-1 text-lg leading-relaxed text-[var(--text-body)]">
                    <span>{address}</span>
                    <Image alt="" className="mt-1.5 size-4 shrink-0" height={16} src={locationIcon} width={16} />
                  </div>
                </div>
                <div className="flex flex-row-reverse flex-wrap items-center gap-[var(--sm)]">
                  <ProfileTags business={business} isVip={isVip} />
                  <RatingChip average={average} />
                </div>
              </div>
              <BusinessBrandVideo videoId={business.introVideoId} imageSrc={logo} name={business.name} size="large" layout="overlay" />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
