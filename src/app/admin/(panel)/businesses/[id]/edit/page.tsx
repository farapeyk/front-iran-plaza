import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/get-current-user';
import { getAccessTokenCookie } from '@/lib/auth/cookies';
import { backendGet, BackendError } from '@/lib/api/backend-get';
import { getAdminBusinessDetail } from '@/features/admin/lib/get-business-detail';
import type { BusinessCategoryOption } from '@/features/business/lib/category-options';
import { BasicInfoForm } from '@/features/business/components/profile/basic-info-form';
import { ContactForm } from '@/features/business/components/profile/contact-form';
import { PrimaryAddressForm } from '@/features/business/components/profile/primary-address-form';
import { BranchesManager } from '@/features/business/components/profile/branches-manager';
import { FeaturesManager } from '@/features/business/components/profile/features-manager';
import { GalleryManager } from '@/features/business/components/profile/gallery-manager';
import { SocialMediaForm } from '@/features/business/components/profile/social-media-form';
import { ServicesManager } from '@/features/business/components/profile/services-manager';
import { ProductsManager } from '@/features/business/components/profile/products-manager';
import { AboutForm } from '@/features/business/components/profile/about-form';
import { WorkingHoursForm } from '@/features/business/components/profile/working-hours-form';
import { InstallmentForm } from '@/features/business/components/profile/installment-form';
import { AdminBusinessCityForm } from '@/features/admin/components/business-city-form';

export default async function AdminBusinessEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [user, token] = await Promise.all([getCurrentUser(), getAccessTokenCookie()]);
  if (!user || !token) redirect('/admin/login');
  if (!['ADMIN', 'SUPER_ADMIN'].includes(user.userType)) redirect('/dashboard');
  const detail = await getAdminBusinessDetail(id, token).catch(error => {
    if (error instanceof BackendError && error.status === 404) notFound();
    throw error;
  });
  const categories = await backendGet<BusinessCategoryOption[]>('/api/categories', token);
  const { business: b, unavailable } = detail;
  function section(title: string, children: React.ReactNode, resource?: string) {
    return <details className="rounded-lg border bg-white p-5" open={title === 'اطلاعات اصلی و لوگو'}>
      <summary className="cursor-pointer text-lg font-bold">{title}</summary>
      <div className="mt-5">{resource && unavailable.includes(resource)
        ? <p role="alert">دریافت اطلاعات این بخش انجام نشد؛ صفحه را دوباره بارگذاری کنید.</p>
        : children}</div>
    </details>;
  }
  return <div className="plaza-design space-y-5" dir="rtl">
    <header className="space-y-2"><h1 className="text-xl font-bold">تکمیل و ویرایش {b.name}</h1>
      <p className="text-sm">هر بخش را جداگانه ذخیره کنید. اطلاعات با دسترسی مدیر برای همین کسب‌وکار ثبت می‌شود.</p>
      <Link className="inline-block underline" href={`/admin/businesses/${id}`}>بازگشت به جزئیات و مدیریت وضعیت</Link>
    </header>
    {section('اطلاعات اصلی و لوگو', <BasicInfoForm businessId={id} initialName={b.name} initialBio={b.description ?? ''} initialLogoId={b.logoId ?? null} categories={categories} initialCategoryIds={b.categories?.map(c => c.categoryId) ?? []} />)}
    {section('راه‌های تماس', <ContactForm businessId={id} initialPhone={b.phone} initialPhone2={b.phone2 ?? ''} initialWhatsapp={b.whatsapp ?? ''} />)}
    {section('شهر، آدرس و نقشه', <div className="space-y-6"><AdminBusinessCityForm businessId={id} initialCity={b.city ?? ''} /><PrimaryAddressForm businessId={id} initialAddress={b.address ?? ''} initialLatitude={b.latitude ?? null} initialLongitude={b.longitude ?? null} /></div>)}
    {section('شعبه‌ها', <BranchesManager businessId={id} initialBranches={b.branches ?? []} />, 'branches')}
    {section('امکانات', <FeaturesManager businessId={id} initialFeatures={b.features ?? []} />, 'features')}
    {section('گالری و ویدیوی معرفی', <GalleryManager businessId={id} initialImages={b.gallery ?? []} initialIntroVideoId={b.introVideoId ?? null} />, 'gallery')}
    {section('شبکه‌های اجتماعی و وب‌سایت', <SocialMediaForm businessId={id} initialSocial={b.socialMedia ?? null} />)}
    {section('خدمات', <ServicesManager businessId={id} initialServices={b.services ?? []} />, 'services')}
    {section('دسته‌ها و محصولات', unavailable.includes('product-categories') ? <p role="alert">دریافت دسته‌های محصول انجام نشد؛ صفحه را دوباره بارگذاری کنید.</p> : <ProductsManager businessId={id} initialCategories={b.productCategories ?? []} initialProducts={b.products ?? []} showProductPageLink={false} />, 'products')}
    {section('درباره کسب‌وکار', <AboutForm businessId={id} initialAboutText={b.aboutText ?? ''} />)}
    {section('ساعات کاری', <WorkingHoursForm businessId={id} initialEntries={b.workingHours ?? []} />, 'working-hours')}
    {section('شرایط اقساط', <InstallmentForm businessId={id} initialPlan={b.installmentPlan ?? null} />, 'installment-plan')}
    <Link className="inline-flex rounded-md bg-emerald-950 px-5 py-3 text-white" href={`/admin/businesses/${id}`}>پایان و بازگشت به جزئیات کسب‌وکار</Link>
  </div>;
}
