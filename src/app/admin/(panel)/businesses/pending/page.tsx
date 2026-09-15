// src/app/admin/(panel)/businesses/pending/page.tsx
import Link from "next/link"; // ✅ اضافه شد
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { PendingBusinessRow } from "@/features/admin/components/pending-business-row";

interface PendingBusiness {
  id: string;
  name: string;
  phone: string;
  address: string | null;
  createdAt: string;
}

async function getPendingBusinesses(accessToken: string): Promise<PendingBusiness[]> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/businesses/admin/pending?skip=0&take=50`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function PendingBusinessesPage() {
  const accessToken = await getAccessTokenCookie();
  const businesses = accessToken ? await getPendingBusinesses(accessToken) : [];

  return (
    <div dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-neutral-900">کسب‌وکارهای در انتظار تایید</h1>
          <p className="text-sm text-neutral-500 mt-1">{businesses.length} مورد در صف بررسی</p>
        </div>
        {/* ✅ دکمه ثبت دستی اضافه شد */}
        <Link href="/admin/businesses/new" className="text-sm px-4 py-2 rounded-md bg-emerald-950 text-white hover:bg-emerald-900 transition-colors">
          + ثبت حضوری/تلفنی
        </Link>
      </div>

      {businesses.length === 0 ? (
        <p className="text-sm text-neutral-500">موردی برای بررسی وجود ندارد.</p>
      ) : (
        <div className="space-y-3">
          {businesses.map((b) => (
            <PendingBusinessRow key={b.id} id={b.id} name={b.name} phone={b.phone} address={b.address} createdAt={b.createdAt} />
          ))}
        </div>
      )}
    </div>
  );
}