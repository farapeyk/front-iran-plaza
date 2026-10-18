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

const statuses = Object.keys(statusLabel) as ArticleStatus[];
const quickFilters: Array<{ label: string; status?: ArticleStatus }> = [
  { label: "همه مقاله‌ها" },
  { label: "پیش‌نویس‌ها", status: "DRAFT" },
  { label: "منتشرشده‌ها", status: "PUBLISHED" },
];

function readStatus(value?: string): ArticleStatus | undefined {
  return statuses.find(status => status === value);
}

function contentListHref({ page, status, query }: { page?: number; status?: ArticleStatus; query?: string }) {
  const search = new URLSearchParams();
  if (page && page > 1) search.set("page", String(page));
  if (status) search.set("status", status);
  if (query) search.set("q", query);
  const serialized = search.toString();
  return serialized ? `/content?${serialized}` : "/content";
}

export default async function ContentHome({ searchParams }: { searchParams: Promise<{ page?: string; status?: string; q?: string }> }) {
  const params = await searchParams;
  const token = await getAccessTokenCookie();
  const status = readStatus(params.status);
  const searchTerm = params.q?.trim() || undefined;
  const requestedPage = Number(params.page);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const query = new URLSearchParams({ page: String(page), limit: "20" });
  if (status) query.set("status", status);
  if (searchTerm) query.set("search", searchTerm);
  const result = await backendGet<ArticleListResponse>(`/api/content/articles?${query}`, token as string);
  const totalPages = Math.max(1, Math.ceil(result.total / Math.max(1, result.limit)));
  const currentPage = Math.min(totalPages, Math.max(1, result.page));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-neutral-900">مقاله‌ها</h1>
          <p className="mt-1 text-sm text-neutral-500">{result.total.toLocaleString("fa-IR")} مقاله</p>
        </div>
        <Link href="/content/articles/new" className="rounded-md bg-emerald-950 px-4 py-2 text-sm text-white">مقاله جدید</Link>
      </header>

      <section className="space-y-3 rounded-lg border bg-white p-4" aria-label="فیلتر مقاله‌ها">
        <nav className="flex flex-wrap gap-2" aria-label="فیلتر سریع وضعیت مقاله‌ها">
          {quickFilters.map(item => {
            const selected = item.status === status || (!item.status && !status);
            return (
              <Link
                key={item.label}
                href={contentListHref({ status: item.status, query: searchTerm })}
                aria-current={selected ? "page" : undefined}
                className={`rounded-full border px-4 py-2 text-sm font-bold transition-colors ${selected ? "border-emerald-900 bg-emerald-950 text-white" : "border-neutral-200 text-neutral-700 hover:border-emerald-700 hover:text-emerald-900"}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form className="flex flex-wrap gap-3">
          <input name="q" defaultValue={searchTerm} placeholder="جستجوی عنوان یا اسلاگ" aria-label="جستجوی مقاله" className="min-w-52 flex-1 rounded-md border px-3 py-2" />
          <select name="status" defaultValue={status ?? ""} aria-label="وضعیت گردش کار مقاله" className="rounded-md border px-3 py-2">
            <option value="">همه وضعیت‌ها</option>
            {Object.entries(statusLabel).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </select>
          <button className="rounded-md border px-4 py-2">اعمال فیلتر</button>
        </form>
      </section>

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full min-w-[760px] text-sm">
          <thead className="bg-neutral-50 text-neutral-500">
            <tr><th className="p-3 text-right">عنوان</th><th className="p-3 text-right">نویسنده</th><th className="p-3 text-right">دسته</th><th className="p-3 text-right">وضعیت</th><th className="p-3 text-right">آخرین تغییر</th></tr>
          </thead>
          <tbody>
            {result.data.map(article => (
              <tr key={article.id} className="border-t">
                <td className="p-3"><Link href={`/content/articles/${article.id}`} className="font-bold text-emerald-950 hover:underline">{article.title}</Link><div className="mt-1 text-xs text-neutral-400" dir="ltr">{article.slug}</div></td>
                <td className="p-3">{article.author.fullName || "بدون نام"}</td>
                <td className="p-3">{article.category?.name || "—"}</td>
                <td className="p-3"><span className="rounded-full bg-neutral-100 px-2 py-1">{statusLabel[article.status]}</span></td>
                <td className="p-3">{new Date(article.updatedAt).toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" })}</td>
              </tr>
            ))}
            {!result.data.length ? <tr><td colSpan={5} className="p-8 text-center text-neutral-500">مقاله‌ای با این فیلتر وجود ندارد.</td></tr> : null}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <nav className="flex items-center justify-center gap-3" aria-label="صفحه‌بندی مقاله‌های پنل محتوا">
          {currentPage > 1 ? (
            <Link href={contentListHref({ page: currentPage - 1, status, query: searchTerm })} className="rounded-md border bg-white px-4 py-2 text-sm">صفحه قبل</Link>
          ) : <span className="rounded-md border px-4 py-2 text-sm text-neutral-400" aria-disabled="true">صفحه قبل</span>}
          <span className="text-sm text-neutral-600">صفحه {currentPage.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}</span>
          {currentPage < totalPages ? (
            <Link href={contentListHref({ page: currentPage + 1, status, query: searchTerm })} className="rounded-md border bg-white px-4 py-2 text-sm">صفحه بعد</Link>
          ) : <span className="rounded-md border px-4 py-2 text-sm text-neutral-400" aria-disabled="true">صفحه بعد</span>}
        </nav>
      ) : null}
    </div>
  );
}
