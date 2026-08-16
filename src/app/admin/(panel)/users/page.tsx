import Link from "next/link";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import type { AdminUserListResponse } from "@/features/admin/types/user";

const USER_TYPE_LABEL: Record<string, string> = {
  CUSTOMER: "مشتری",
  BUSINESS_OWNER: "صاحب کسب‌وکار",
  ADMIN: "ادمین",
  SUPER_ADMIN: "مدیر ارشد",
};

const LIMIT = 20;

async function getUsers(params: URLSearchParams, accessToken: string): Promise<AdminUserListResponse> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/admin/users?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return { data: [], total: 0, page: 1, limit: LIMIT };
  return res.json();
}

interface PageProps {
  searchParams: Promise<{ search?: string; userType?: string; isSuspended?: string; page?: string }>;
}

export default async function AdminUsersPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;

  const query = new URLSearchParams();
  if (sp.search) query.set("search", sp.search);
  if (sp.userType) query.set("userType", sp.userType);
  if (sp.isSuspended) query.set("isSuspended", sp.isSuspended);
  query.set("page", String(page));
  query.set("limit", String(LIMIT));

  const accessToken = await getAccessTokenCookie();
  const result = accessToken ? await getUsers(query, accessToken) : { data: [], total: 0, page: 1, limit: LIMIT };

  const totalPages = Math.max(1, Math.ceil(result.total / LIMIT));

  function pageHref(p: number) {
    const q = new URLSearchParams(query);
    q.set("page", String(p));
    return `/admin/users?${q.toString()}`;
  }

  return (
    <div>
      <h1 className="text-lg font-bold text-neutral-900 mb-1">مدیریت کاربران</h1>
      <p className="text-sm text-neutral-500 mb-6">{result.total} کاربر</p>

      <form method="get" className="flex flex-wrap gap-2 mb-5">
        <input
          type="text"
          name="search"
          defaultValue={sp.search}
          placeholder="جستجو بر اساس شماره، نام یا کد ملی"
          className="h-9 rounded-md border border-input px-3 text-sm flex-1 min-w-[220px]"
        />
        <select name="userType" defaultValue={sp.userType ?? ""} className="h-9 rounded-md border border-input px-3 text-sm">
          <option value="">همه نوع‌ها</option>
          {Object.entries(USER_TYPE_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select name="isSuspended" defaultValue={sp.isSuspended ?? ""} className="h-9 rounded-md border border-input px-3 text-sm">
          <option value="">همه وضعیت‌ها</option>
          <option value="false">فعال</option>
          <option value="true">تعلیق‌شده</option>
        </select>
        <button type="submit" className="h-9 px-4 rounded-md bg-emerald-950 text-white text-sm">
          اعمال فیلتر
        </button>
      </form>

      {result.data.length === 0 ? (
        <p className="text-sm text-neutral-500">کاربری پیدا نشد.</p>
      ) : (
        <div className="border border-neutral-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="text-right px-4 py-2 font-medium">نام</th>
                <th className="text-right px-4 py-2 font-medium">موبایل</th>
                <th className="text-right px-4 py-2 font-medium">نوع</th>
                <th className="text-right px-4 py-2 font-medium">وضعیت</th>
              </tr>
            </thead>
            <tbody>
              {result.data.map((u) => (
                <tr key={u.id} className="border-t border-neutral-100 hover:bg-neutral-50">
                  <td className="px-4 py-2.5">
                    <Link href={`/admin/users/${u.id}`} className="font-medium text-neutral-900 hover:underline">
                      {u.fullName ?? "بدون نام"}
                    </Link>
                  </td>
                  <td className="px-4 py-2.5 text-neutral-600" dir="ltr">
                    {u.phone}
                  </td>
                  <td className="px-4 py-2.5 text-neutral-600">{USER_TYPE_LABEL[u.userType] ?? u.userType}</td>
                  <td className="px-4 py-2.5">
                    {u.isSuspended ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-600">تعلیق‌شده</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">فعال</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={pageHref(p)}
              className={[
                "w-8 h-8 flex items-center justify-center rounded-md text-sm",
                p === page ? "bg-emerald-950 text-white" : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50",
              ].join(" ")}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}