import Link from "next/link";
import { Building2, FileWarning } from "lucide-react";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

async function getCount(path: string, accessToken: string): Promise<number> {
  try {
    const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}${path}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return Array.isArray(data) ? data.length : 0;
  } catch {
    return 0;
  }
}

export default async function AdminDashboardPage() {
  const accessToken = await getAccessTokenCookie();

  const [pendingBusinesses, pendingDocuments] = accessToken
    ? await Promise.all([
        getCount("/api/businesses/admin/pending?skip=0&take=50", accessToken),
        getCount("/api/admin/documents/pending?skip=0&take=50", accessToken),
      ])
    : [0, 0];

  return (
    <div>
      <h1 className="text-lg font-bold text-neutral-900 mb-1">داشبورد</h1>
      <p className="text-sm text-neutral-500 mb-6">خلاصه‌ی وضعیت پلتفرم</p>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/admin/businesses/pending" className="border border-neutral-200 rounded-lg p-5 bg-white hover:border-emerald-300 transition-colors">
          <Building2 className="text-emerald-950 mb-2" size={22} />
          <p className="text-2xl font-bold text-neutral-900">{pendingBusinesses}</p>
          <p className="text-sm text-neutral-500 mt-1">کسب‌وکار در انتظار تایید</p>
        </Link>

        <Link href="/admin/businesses/pending" className="border border-neutral-200 rounded-lg p-5 bg-white hover:border-emerald-300 transition-colors">
          <FileWarning className="text-amber-600 mb-2" size={22} />
          <p className="text-2xl font-bold text-neutral-900">{pendingDocuments}</p>
          <p className="text-sm text-neutral-500 mt-1">مدرک در انتظار بررسی</p>
        </Link>
      </div>

      {/* <p className="text-xs text-neutral-400 mt-6">بخش‌های کیف پول، نقش‌ها و پلن‌ها هنوز در دست ساخت هستند.</p> */}
    </div>
  );
}