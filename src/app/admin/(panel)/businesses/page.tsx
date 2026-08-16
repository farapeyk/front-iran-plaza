import { getAccessTokenCookie } from "@/lib/auth/cookies";
import Link from "next/link";
import { Building2, ChevronLeft } from "lucide-react";

// تایپ‌های اولیه برای لیست کسب‌وکارها
interface BusinessListItem {
  id: string;
  name: string;
  phone: string;
  status: string; // PENDING | APPROVED | REJECTED | SUSPENDED
  createdAt: string;
}

// دیکشنری برای نمایش وضعیت به فارسی و رنگ مناسب
const STATUS_MAP: Record<string, { label: string; className: string }> = {
  PENDING: { label: "در انتظار", className: "bg-amber-50 text-amber-600" },
  APPROVED: { label: "تایید شده", className: "bg-emerald-50 text-emerald-700" },
  REJECTED: { label: "رد شده", className: "bg-red-50 text-red-600" },
  SUSPENDED: { label: "معلق", className: "bg-neutral-100 text-neutral-600" },
};

async function getAllBusinesses(accessToken: string): Promise<BusinessListItem[]> {
  try {
    // اصلاح مسیر: استفاده از /api/businesses/admin
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/admin?skip=0&take=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      
      const errorText = await res.text();
      
      return [];
    }

    const data = await res.json();
   

    // هندل کردن هم حالت آرایه مستقیم و هم حالت دیتای تو در تو
    if (Array.isArray(data)) return data;
    if (data && Array.isArray(data.data)) return data.data;
    
    return [];
  } catch (error) {
   
    return [];
  }
}

export default async function AllBusinessesPage() {
  const accessToken = await getAccessTokenCookie();
  const businesses = accessToken ? await getAllBusinesses(accessToken) : [];

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-neutral-900">تمام کسب‌وکارها</h1>
          <p className="text-sm text-neutral-500 mt-1">{businesses.length} مورد یافت شد</p>
        </div>
      </div>

      {businesses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
          <Building2 className="mx-auto text-neutral-300 mb-3" size={32} />
          <p className="text-sm text-neutral-500">هیچ کسب‌وکاری ثبت نشده است.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {businesses.map((business) => {
            const status = STATUS_MAP[business.status] || STATUS_MAP.PENDING;
            return (
              <Link
                key={business.id}
                href={`/admin/businesses/${business.id}`}
                className="block bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-400 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-neutral-900 truncate">{business.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-neutral-500" dir="ltr">
                      {business.phone}
                    </p>
                  </div>
                  <ChevronLeft className="text-neutral-400 shrink-0" size={20} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}