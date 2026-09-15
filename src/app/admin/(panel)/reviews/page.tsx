import { getAccessTokenCookie } from "@/lib/auth/cookies";
import { ReviewRow, type AdminReviewItem } from "@/features/admin/components/review-row";

interface AdminReviewListResponse {
  data: AdminReviewItem[];
  total: number;
}

async function getReviews(status: string, accessToken: string): Promise<AdminReviewListResponse> {
  const res = await fetch(`${process.env.BACKEND_INTERNAL_URL}/api/admin/reviews?status=${status}&page=1&limit=50`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) return { data: [], total: 0 };
  return res.json();
}

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminReviewsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const status = sp.status ?? "PENDING";
  const accessToken = await getAccessTokenCookie();
  const result = accessToken ? await getReviews(status, accessToken) : { data: [], total: 0 };

  const TABS = [
    { value: "PENDING", label: "در انتظار" },
    { value: "APPROVED", label: "تایید‌شده" },
    { value: "REJECTED", label: "رد‌شده" },
  ];

  return (
    <div dir="rtl">
      <h1 className="text-lg font-bold text-neutral-900 mb-1">نظرات</h1>
      <p className="text-sm text-neutral-500 mb-4">{result.total} مورد</p>

      <div className="flex gap-2 mb-5">
        {TABS.map((t) => (
                        <a
                            key={t.value}
                            href={`/admin/reviews?status=${t.value}`}
                            className={[
                            "text-sm px-4 py-1.5 rounded-full",
                            status === t.value ? "bg-emerald-950 text-white" : "border border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                            ].join(" ")}
                        >
                            {t.label}
                        </a>
                                    ))}
      </div>

      {result.data.length === 0 ? (
        <p className="text-sm text-neutral-500">موردی وجود ندارد.</p>
      ) : (
        <div className="space-y-3">
          {result.data.map((r) => (
            <ReviewRow key={r.id} review={r} />
          ))}
        </div>
      )}
    </div>
  );
}