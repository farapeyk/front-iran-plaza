import Link from "next/link";
import { BookOpenText, FolderTree, ImageIcon, Plus, Search } from "lucide-react";
import { backendGet } from "@/lib/api/backend-get";
import { getAccessTokenCookie } from "@/lib/auth/cookies";
import type { ArticleListResponse, ArticleStatus, ContentCategory } from "@/features/content/types";

const statusLabel: Record<ArticleStatus, string> = {
  DRAFT: "پیش‌نویس", IN_REVIEW: "ارسال‌شده", CHANGES_REQUESTED: "نیاز به اصلاح",
  APPROVED: "تأییدشده", PUBLISHED: "منتشرشده", ARCHIVED: "بایگانی‌شده",
};
const statusTone: Record<ArticleStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700", IN_REVIEW: "bg-sky-50 text-sky-700",
  CHANGES_REQUESTED: "bg-amber-50 text-amber-700", APPROVED: "bg-indigo-50 text-indigo-700",
  PUBLISHED: "bg-emerald-50 text-emerald-700", ARCHIVED: "bg-stone-100 text-stone-600",
};
const statuses = Object.keys(statusLabel) as ArticleStatus[];
type SearchParams = { page?: string; status?: string; q?: string; category?: string; sort?: string; mine?: string };

function readStatus(value?: string): ArticleStatus | undefined { return statuses.find(status => status === value); }
function listHref(current: SearchParams, update: Partial<SearchParams>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...current, ...update })) if (value) search.set(key, value);
  const serialized = search.toString();
  return serialized ? `/content?${serialized}` : "/content";
}

export default async function ContentHome({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const token = await getAccessTokenCookie();
  const status = readStatus(params.status);
  const searchTerm = params.q?.trim() || undefined;
  const requestedPage = Number(params.page);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;
  const query = new URLSearchParams({ page: String(page), limit: "20", sort: ["oldest", "title"].includes(params.sort || "") ? params.sort! : "newest" });
  if (status) query.set("status", status);
  if (searchTerm) query.set("search", searchTerm);
  if (params.category) query.set("categoryId", params.category);
  if (params.mine === "true") query.set("mine", "true");
  const [result, categories] = await Promise.all([
    backendGet<ArticleListResponse>(`/api/content/articles?${query}`, token as string),
    backendGet<ContentCategory[]>("/api/content/categories", token as string),
  ]);
  const totalPages = Math.max(1, Math.ceil(result.total / Math.max(1, result.limit)));
  const currentPage = Math.min(totalPages, Math.max(1, result.page));

  return <div className="space-y-6">
    <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div><h1 className="text-2xl font-black text-slate-950">مدیریت محتوا</h1><p className="mt-2 text-sm leading-6 text-slate-500">مقاله‌ها را جست‌وجو، فیلتر، ویرایش و در چرخهٔ تحریریه منتشر کنید.</p></div>
        <div className="flex flex-wrap gap-2">
          <Link href="/content/categories" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold"><FolderTree className="size-4" />دسته‌ها و برچسب‌ها</Link>
          <Link href="/content/media" className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold"><ImageIcon className="size-4" />کتابخانه رسانه</Link>
          <Link href="/content/articles/new" className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm"><Plus className="size-4" />مقاله جدید</Link>
        </div>
      </div>
    </header>

    <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm" aria-label="فیلتر مقاله‌ها">
      <nav className="flex flex-wrap gap-2" aria-label="وضعیت مقاله">
        <Link href={listHref(params, { status: undefined, page: undefined })} aria-current={!status ? "page" : undefined} className={`rounded-xl px-4 py-2 text-sm font-bold ${!status ? "bg-emerald-700 text-white" : "border border-slate-300 text-slate-700"}`}>همه</Link>
        {statuses.map(value => <Link key={value} href={listHref(params, { status: value, page: undefined })} aria-current={status === value ? "page" : undefined} className={`rounded-xl px-4 py-2 text-sm font-bold ${status === value ? "bg-emerald-700 text-white" : "border border-slate-300 text-slate-700"}`}>{statusLabel[value]}</Link>)}
      </nav>
      <form className="grid gap-3 lg:grid-cols-[minmax(240px,1fr)_240px_200px_auto_auto]">
        <label className="relative"><Search className="pointer-events-none absolute end-3 top-3 size-4 text-slate-400" /><input name="q" defaultValue={searchTerm} placeholder="جست‌وجو در عنوان یا نشانی مقاله" className="w-full rounded-xl border border-slate-300 py-2.5 pe-10 ps-3 outline-none focus:border-emerald-700" /></label>
        <select name="category" defaultValue={params.category || ""} className="rounded-xl border border-slate-300 px-3 py-2.5"><option value="">همه دسته‌ها</option>{categories.filter(item => item.isActive).map(item => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <select name="sort" defaultValue={params.sort || "newest"} className="rounded-xl border border-slate-300 px-3 py-2.5"><option value="newest">جدیدترین ویرایش</option><option value="oldest">قدیمی‌ترین ویرایش</option><option value="title">مرتب‌سازی عنوان</option></select>
        <label className="flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-bold"><input type="checkbox" name="mine" value="true" defaultChecked={params.mine === "true"} className="size-4 accent-emerald-700" />مقالات من</label>
        {status ? <input type="hidden" name="status" value={status} /> : null}<button className="rounded-xl border border-slate-900 px-4 py-2.5 text-sm font-bold">اعمال فیلتر</button>
      </form>
    </section>

    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h2 className="flex items-center gap-2 font-black"><BookOpenText className="size-5 text-emerald-700" />{result.total.toLocaleString("fa-IR")} مقاله</h2><span className="text-sm text-slate-500">صفحه {currentPage.toLocaleString("fa-IR")} از {totalPages.toLocaleString("fa-IR")}</span></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[980px] text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-4 text-right">عنوان</th><th className="p-4 text-right">وضعیت</th><th className="p-4 text-right">دسته</th><th className="p-4 text-right">اسکیما</th><th className="p-4 text-right">نویسنده</th><th className="p-4 text-center">بازخورد</th><th className="p-4 text-right">آخرین به‌روزرسانی</th><th className="p-4 text-left">عملیات</th></tr></thead><tbody>{result.data.map(article => <tr key={article.id} className="border-t border-slate-100 align-middle hover:bg-slate-50/70"><td className="max-w-[360px] p-4"><Link href={`/content/articles/${article.id}`} className="font-black leading-7 text-slate-900 hover:text-emerald-700">{article.title}</Link><div className="mt-1 truncate text-xs text-slate-400" dir="ltr">/{article.slug}/</div>{article.tags?.length ? <div className="mt-2 flex flex-wrap gap-1">{article.tags.slice(0, 3).map(tag => <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600">{tag}</span>)}</div> : null}</td><td className="p-4"><span className={`rounded-full px-2.5 py-1 text-xs font-bold ${statusTone[article.status]}`}>{statusLabel[article.status]}</span>{article.isFeatured ? <span className="mt-2 block text-xs font-bold text-amber-700">انتخاب سردبیر</span> : null}</td><td className="p-4 text-slate-700">{article.category?.name || "—"}</td><td className="p-4"><span className="rounded-full border border-slate-200 px-2 py-1 text-xs">{article.schemaType === "LISTING" ? "Article + ItemList" : "Article"}</span></td><td className="p-4">{article.author.fullName || "بدون نام"}</td><td className="p-4 text-center font-bold">{(article._count?.feedback || 0).toLocaleString("fa-IR")}</td><td className="p-4 text-slate-600">{new Date(article.updatedAt).toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" })}<span className="mt-1 block text-xs text-slate-400">{(article._count?.revisions || article.revision).toLocaleString("fa-IR")} نسخه</span></td><td className="p-4 text-left"><Link href={`/content/articles/${article.id}`} className="inline-flex rounded-xl border border-slate-300 px-4 py-2 font-bold hover:border-emerald-600 hover:text-emerald-700">ویرایش</Link></td></tr>)}</tbody></table></div>
      {!result.data.length ? <div className="p-12 text-center text-slate-500">مقاله‌ای با این فیلتر پیدا نشد.</div> : null}
    </section>

    {totalPages > 1 ? <nav className="flex items-center justify-center gap-3" aria-label="صفحه‌بندی مقاله‌ها">{currentPage > 1 ? <Link href={listHref(params, { page: String(currentPage - 1) })} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">صفحه قبل</Link> : <span className="rounded-xl border px-4 py-2 text-sm text-slate-400">صفحه قبل</span>}<span className="text-sm text-slate-600">{currentPage.toLocaleString("fa-IR")} / {totalPages.toLocaleString("fa-IR")}</span>{currentPage < totalPages ? <Link href={listHref(params, { page: String(currentPage + 1) })} className="rounded-xl border bg-white px-4 py-2 text-sm font-bold">صفحه بعد</Link> : <span className="rounded-xl border px-4 py-2 text-sm text-slate-400">صفحه بعد</span>}</nav> : null}
  </div>;
}
