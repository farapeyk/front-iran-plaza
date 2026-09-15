import { redirect } from "next/navigation";
import { FileText, Phone, MapPin, Images, Share2, Wrench, Package, Info, Clock, CreditCard, ListChecks } from "lucide-react";
import { getMyBusiness } from "@/features/business/lib/get-my-business";
import { DashboardMenuItem } from "@/features/dashboard/components/dashboard-menu-item";

export default async function BusinessProfilePage() {
  const business = await getMyBusiness();

  if (!business) {
    redirect("/dashboard/business/new");
  }

  return (
    <div className="min-h-screen bg-[#FBF1E8]" dir="rtl">
      <div className="max-w-md mx-auto pt-6 pb-10">
        <div className="px-4 mb-4">
          <h1 className="text-lg font-bold text-neutral-900">{business.name}</h1>
          <p className="text-sm text-neutral-500 mt-0.5">پروفایل کسب‌وکار</p>
        </div>

        <nav>
          <DashboardMenuItem title="نام، بیوگرافی و لوگو" subtitle="نام برای نمایش عمومی و کد بیوگرافی کسب‌وکار" icon={FileText} href="/dashboard/business/profile/basic" />
          <DashboardMenuItem title="تماس و واتساپ" subtitle="شماره تماس‌ها و واتساپ" icon={Phone} href="/dashboard/business/profile/contact" />
          <DashboardMenuItem title="امکانات" subtitle="پذیرش حضوری، بیرون‌بر و..." icon={ListChecks} href="/dashboard/business/profile/features" />
          <DashboardMenuItem title="آدرس و لوکیشن" subtitle="آدرس روی نقشه و شعبه‌ها" icon={MapPin} href="/dashboard/business/profile/address" />
          <DashboardMenuItem title="گالری تصاویر و ویدیو" subtitle="عکس‌ها و یک ویدیوی معرفی" icon={Images} href="/dashboard/business/profile/gallery" />
          <DashboardMenuItem title="شبکه‌های اجتماعی" subtitle="اینستاگرام، تلگرام و..." icon={Share2} href="/dashboard/business/profile/social" />
          <DashboardMenuItem title="خدمات" subtitle="لیست خدمات کسب‌وکار" icon={Wrench} href="/dashboard/business/profile/services" />
          <DashboardMenuItem title="محصولات" subtitle="دسته‌بندی و لیست محصولات" icon={Package} href="/dashboard/business/profile/products" />
          <DashboardMenuItem title="درباره ما" subtitle="متن کامل معرفی کسب‌وکار" icon={Info} href="/dashboard/business/profile/about" />
          <DashboardMenuItem title="ساعات کاری" subtitle="ساعت کاری هر روز هفته" icon={Clock} href="/dashboard/business/profile/hours" />
          <DashboardMenuItem title="شرایط اقساط" subtitle="پیش‌پرداخت، سود و بازه‌ی اقساط" icon={CreditCard} href="/dashboard/business/profile/installment" />
        </nav>
      </div>
    </div>
  );
}