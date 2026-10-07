import Image from 'next/image';
import type { ReactNode } from 'react';
import type { AdminBusinessDetail } from '../lib/get-business-detail';
import { WEEKDAYS } from '@/features/business/types/business-profile';
import { BusinessLocationMap } from '@/features/public/components/business-location-map';

const fileUrl = (id: string) => '/api/backend/files/' + encodeURIComponent(id);
const number = (value: unknown) => value == null || !Number.isFinite(Number(value)) ? 'ثبت نشده' : Number(value).toLocaleString('fa-IR');

function Section({ title, failed, empty, children }: { title: string; failed?: boolean; empty?: boolean; children: ReactNode }) {
  return <section className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
    <h2 className="font-bold text-neutral-900">{title}</h2>
    {failed ? <p role="status" className="text-sm text-amber-800">دریافت این بخش انجام نشد؛ صفحه را دوباره بارگذاری کنید.</p>
      : empty ? <p className="text-sm text-neutral-500">اطلاعاتی ثبت نشده است.</p> : children}
  </section>;
}

export function BusinessProfileOverview({ business, unavailable }: { business: AdminBusinessDetail; unavailable: string[] }) {
  const gallery = business.gallery ?? [], features = business.features ?? [], services = business.services ?? [];
  const products = business.products ?? [], branches = business.branches ?? [], hours = business.workingHours ?? [];
  const social = Object.entries(business.socialMedia ?? {}).filter(([, value]) => typeof value === 'string' && value);
  const plan = business.installmentPlan;
  return <div className="space-y-5">
    <Section title="اطلاعات تماس و شبکه‌های اجتماعی">
      <dl className="grid sm:grid-cols-2 gap-3 text-sm">
        <div><dt className="text-neutral-500">شماره اصلی</dt><dd dir="ltr">{business.phone}</dd></div>
        <div><dt className="text-neutral-500">شماره دوم</dt><dd dir="ltr">{business.phone2 || 'ثبت نشده'}</dd></div>
        <div><dt className="text-neutral-500">واتساپ</dt><dd dir="ltr">{business.whatsapp || 'ثبت نشده'}</dd></div>
        <div><dt className="text-neutral-500">وب‌سایت</dt><dd className="break-all">{business.website || 'ثبت نشده'}</dd></div>
      </dl>
      {social.map(([key, value]) => <p key={key} className="text-sm break-all">{key}: <span dir="ltr">{value}</span></p>)}
    </Section>
    <Section title="درباره کسب‌وکار" empty={!business.aboutText}><p className="text-sm whitespace-pre-line">{business.aboutText}</p></Section>
    <Section title="امکانات" failed={unavailable.includes('features')} empty={!features.length}>
      <ul className="flex flex-wrap gap-2">{features.map(item => <li key={item.id} className="rounded-full bg-neutral-100 px-3 py-1 text-sm">{item.label}{item.isActive === false ? ' (غیرفعال)' : ''}</li>)}</ul>
    </Section>
    <Section title="آدرس و شعب" failed={unavailable.includes('branches')}>
      <p className="text-sm">{[business.city, business.neighborhood, business.address].filter(Boolean).join('، ') || 'آدرس ثبت نشده است.'}</p>
      {business.latitude != null && business.longitude != null && <BusinessLocationMap latitude={business.latitude} longitude={business.longitude} />}
      {branches.map(branch => <div key={branch.id} className="border-t pt-2 text-sm"><p className="font-medium">{branch.title}{branch.isPrimary ? ' (شعبه اصلی)' : ''}</p><p>{branch.address}</p>{branch.phone && <p dir="ltr">{branch.phone}</p>}</div>)}
    </Section>
    <Section title="گالری تصاویر" failed={unavailable.includes('gallery')} empty={!gallery.length}>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{gallery.map(image => <figure key={image.id}><Image unoptimized src={fileUrl(image.fileId)} width={320} height={240} alt={image.title || business.name} className="w-full aspect-video object-cover rounded-md" />{image.title && <figcaption className="text-xs mt-1">{image.title}</figcaption>}</figure>)}</div>
    </Section>
    <Section title="ویدیو و صوت معرفی" empty={!business.introVideoId && !business.aboutAudioId}>
      {business.introVideoId && <video controls preload="metadata" src={fileUrl(business.introVideoId)} aria-label="ویدیوی معرفی کسب‌وکار" className="w-full max-h-96" />}
      {business.aboutAudioId && <audio controls preload="metadata" src={fileUrl(business.aboutAudioId)} aria-label="صوت معرفی کسب‌وکار" className="w-full" />}
    </Section>
    <Section title="خدمات" failed={unavailable.includes('services')} empty={!services.length}>
      {services.map(service => <div key={service.id} className="border-b last:border-0 pb-2 text-sm space-y-1"><p className="font-medium">{service.name}{service.isActive === false ? ' (غیرفعال)' : ''}</p>{service.description && <p>{service.description}</p>}<p>قیمت: {number(service.priceFrom)} تا {number(service.priceTo)} تومان</p>{service.durationMin != null && <p>مدت: {number(service.durationMin)} دقیقه</p>}</div>)}
    </Section>
    <Section title="محصولات" failed={unavailable.includes('products')} empty={!products.length}>
      {unavailable.includes('product-categories') && <p role="status" className="text-sm text-amber-800">نام دسته‌های محصولات در دسترس نیست.</p>}
      {products.map(product => <div key={product.id} className="flex gap-3 border-b last:border-0 pb-3 text-sm">
        {product.imageId && <Image unoptimized width={80} height={80} src={fileUrl(product.imageId)} alt={product.name} className="w-20 h-20 object-cover rounded-md" />}
        <div className="space-y-1"><p className="font-medium">{product.name}{product.isActive === false ? ' (غیرفعال)' : ''}</p><p>{business.productCategories?.find(category => category.id === product.productCategoryId)?.name || 'بدون دسته‌بندی'}</p>{product.description && <p>{product.description}</p>}<p>قیمت: {number(product.price)} تومان — تخفیف: {number(product.discountPercent)}٪</p>{product.hasInstallment && <p>قابل پرداخت اقساطی</p>}</div>
      </div>)}
    </Section>
    <Section title="ساعات کاری" failed={unavailable.includes('working-hours')} empty={!hours.length}>
      {WEEKDAYS.map(day => { const entry = hours.find(item => item.weekday === day.value); return <div key={day.value} className="flex justify-between gap-3 text-sm"><span>{day.label}</span><span dir="ltr">{entry?.openTime1 ? `${entry.openTime1} - ${entry.closeTime1 ?? ''}` : 'تعطیل'}{entry?.isTwoShift && entry.openTime2 ? ` | ${entry.openTime2} - ${entry.closeTime2 ?? ''}` : ''}</span></div>; })}
    </Section>
    <Section title="شرایط اقساط" failed={unavailable.includes('installment-plan')} empty={!plan}>
      {plan && <div className="text-sm space-y-2"><p>وضعیت: {plan.isActive ? 'فعال' : 'غیرفعال'}</p><p>پیش‌پرداخت: {number(plan.minDownPaymentPercent)}٪</p><p>سود ماهانه: {number(plan.monthlyInterestPercent)}٪</p><p>بازه بازپرداخت: {plan.repaymentPeriodsMonths.map(month => number(month)).join('، ')} ماه</p>{plan.guaranteeNote && <p className="whitespace-pre-line">ضمانت: {plan.guaranteeNote}</p>}</div>}
    </Section>
  </div>;
}
