import { backendGet } from '@/lib/api/backend-get';
import Link from "next/link";
import { Building2, FileWarning } from "lucide-react";
import { getAccessTokenCookie } from "@/lib/auth/cookies";

async function getCount(path: string, token: string): Promise<number> {
  const data = await backendGet<{ total: number } | unknown[]>(path, token);
  if (Array.isArray(data)) return data.length;
  if (!Number.isSafeInteger(data.total) || data.total < 0) throw new Error('پاسخ شمارش معتبر نیست.');
  return data.total;
}

export default async function AdminDashboardPage() {
  const accessToken = await getAccessTokenCookie();

  const [pendingBusinesses, pendingDocuments] = accessToken
    ? await Promise.all([
        getCount("/api/businesses/admin?status=PENDING&skip=0&take=1", accessToken),
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
          <p className="text-2xl font-bold text-neutral-900">{pendingDocuments >= 50 ? '۵۰+' : pendingDocuments}</p>
          <p className="text-sm text-neutral-500 mt-1">مدرک در انتظار بررسی (اولین ۵۰ مورد)</p>
        </Link>
      </div>

      {/* <p className="text-xs text-neutral-400 mt-6">بخش‌های کیف پول، نقش‌ها و پلن‌ها هنوز در دست ساخت هستند.</p> */}
    </div>
  );
}