import Link from "next/link";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import type { ArticleListResponse, ArticleStatus } from "@/features/content/types";

const statusLabel: Record<ArticleStatus, string> = {
  DRAFT: "پیش‌نویس",
  IN_REVIEW: "در انتظار بازبینی",
  CHANGES_REQUESTED: "نیازمند اصلاح",
  APPROVED: "تأییدشده",
  PUBLISHED: "منتشرشده",
  ARCHIVED: "بایگانی‌شده",
};

export default async function ContentHome({ searchParams }: { searchParams: Promise<{ page?: string; status?: ArticleStatus; q?: string }> }) {
  const params = await searchParams;
  const token = await getAccessTokenCookie();
  const query = new URLSearchParams({ page: params.page ?? "1", limit: "20" });
  if (params.status) query.set("status", params.status);
  if (params.q) query.set("search", params.q);
  const result = await backendGet<ArticleListResponse>(`/api/content/articles?${query}`, token as string);
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-black text-neutral-900">مقاله‌ها</h1><p className="mt-1 text-sm text-neutral-500">{result.total.toLocaleString("fa-IR")} مقاله</p></div><Link href="/content/articles/new" className="rounded-md bg-emerald-950 px-4 py-2 text-sm text-white">مقاله جدید</Link></header>
      <form className="flex flex-wrap gap-3 rounded-lg border bg-white p-4">
        <input name="q" defaultValue={params.q} placeholder="جستجوی عنوان یا اسلاگ" className="min-w-52 flex-1 rounded-md border px-3 py-2" />
        <select name="status" defaultValue={params.status ?? ""} className="rounded-md border px-3 py-2"><option value="">همه وضعیت‌ها</option>{Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        <button className="rounded-md border px-4 py-2">فیلتر</button>
      </form>
      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[760px] text-sm"><thead className="bg-neutral-50 text-neutral-500"><tr><th className="p-3 text-right">عنوان</th><th className="p-3 text-right">نویسنده</th><th className="p-3 text-right">دسته</th><th className="p-3 text-right">وضعیت</th><th className="p-3 text-right">آخرین تغییر</th></tr></thead><tbody>
          {result.data.map(article => <tr key={article.id} className="border-t"><td className="p-3"><Link href={`/content/articles/${article.id}`} className="font-bold text-emerald-950 hover:underline">{article.title}</Link><div className="mt-1 text-xs text-neutral-400" dir="ltr">{article.slug}</div></td><td className="p-3">{article.author.fullName || "بدون نام"}</td><td className="p-3">{article.category?.name || "—"}</td><td className="p-3"><span className="rounded-full bg-neutral-100 px-2 py-1">{statusLabel[article.status]}</span></td><td className="p-3">{new Date(article.updatedAt).toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" })}</td></tr>)}
          {!result.data.length ? <tr><td colSpan={5} className="p-8 text-center text-neutral-500">مقاله‌ای وجود ندارد.</td></tr> : null}
        </tbody></table>
      </div>
    </div>
  );
}
