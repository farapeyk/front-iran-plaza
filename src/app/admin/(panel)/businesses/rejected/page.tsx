// src/app/admin/(panel)/businesses/rejected/page.tsx
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { PendingBusinessRow } from "@/features/admin/components/pending-business-row";

interface BusinessListItem {
  id: string;
  name: string;
  phone: string;
  status: string;
  address: string | null;
  createdAt: string;
}

async function getRejectedBusinesses(accessToken: string): Promise<BusinessListItem[]> {
  try {
    // دریافت لیست کسب‌وکارها (فرض بر این است که اندپوینت admin همه را برمی‌گرداند)
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/admin?skip=0&take=100`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });

    if (!res.ok) return [];
    
    const data = await res.json();
    const allBusinesses: BusinessListItem[] = Array.isArray(data) ? data : (data.data ?? []);
    
    // فیلتر کردن فقط کسب‌وکارهای رد شده
    return allBusinesses.filter(b => b.status === "REJECTED");
  } catch (error) {
    console.error("Failed to fetch rejected businesses:", error);
    return [];
  }
}

export default async function RejectedBusinessesPage() {
  const accessToken = await getAccessTokenCookie();
  const businesses = accessToken ? await getRejectedBusinesses(accessToken) : [];

  return (
    <div dir="rtl">
      <h1 className="text-lg font-bold text-neutral-900 mb-1">کسب‌وکارهای رد شده</h1>
      <p className="text-sm text-neutral-500 mb-6">{businesses.length} مورد یافت شد</p>

      {businesses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
          <p className="text-sm text-neutral-500">هیچ کسب‌وکار رد شده‌ای وجود ندارد.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {businesses.map((b) => (
            <PendingBusinessRow 
              key={b.id} 
              id={b.id} 
              name={b.name} 
              phone={b.phone} 
              address={b.address} 
              createdAt={b.createdAt} 
            />
          ))}
        </div>
      )}
    </div>
  );
}