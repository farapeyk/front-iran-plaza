import { SiteLayout } from "@/design/components/site-layout";
import { RegistrationBanner } from "@/design/components/registration-banner";
import { NewMembers } from "@/design/components/new-members";
import { ArticleCard } from "@/design/components/article-card";
import { Link } from "@/design/navigation";
import type { ContentCategory, PublicArticleListResponse } from "@/features/content/types";
import { articlePath, categoryPath } from "@/features/content/lib/public-paths";

const fallbackImage = "/design/home/biz-3.webp";
const imageUrl = (id: string | null) => id ? `/api/backend/files/${encodeURIComponent(id)}` : fallbackImage;

export function ArticlesLivePage({
  result,
  categories,
  query,
  category,
}: {
  result: PublicArticleListResponse;
  categories: ContentCategory[];
  query?: string;
  category?: string;
}) {
  const selectedCategory = category ? categories.find(item => item.slug === category) : undefined;
  const archivePath = selectedCategory ? categoryPath(selectedCategory, categories) ?? "/articles/" : "/articles/";
  return (
    <SiteLayout>
      <section className="mx-auto w-full max-w-[1440px] space-y-[var(--5xl)] px-[var(--page-gutter)] py-[var(--5xl)] lg:px-[var(--8xl)]">
        <header className="mx-auto flex max-w-[1200px] flex-col items-center gap-[var(--2xl)] text-center">
          <div className="space-y-[var(--sm)]">
            <p className="font-bold text-primary-500">{selectedCategory ? "دسته‌بندی مقالات" : "مقالات ایران پلازا"}</p>
            <h1 className="text-[length:var(--text-h1)] font-black text-[var(--text-title)]">{selectedCategory?.name || "آگاهی برای انتخاب بهتر"}</h1>
            <p className="mx-auto max-w-4xl text-base leading-relaxed text-[var(--text-body)]">
              {selectedCategory?.description || "راهنماها، تجربه‌ها و فهرست‌های کاربردی بر پایه کسب‌وکارهای ثبت‌شده در ایران پلازا."}
            </p>
          </div>
          <form action={archivePath} className="flex h-14 w-full max-w-[420px] items-center gap-[var(--md)] rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-[var(--lg)]">
            <input name="q" defaultValue={query} placeholder="جستجوی مقاله" className="h-full min-w-0 flex-1 bg-transparent text-start text-base outline-none placeholder:text-[var(--input-placeholder)]" />
            <button type="submit" className="font-bold text-primary-700">جستجو</button>
          </form>
        </header>

        <nav aria-label="دسته‌بندی مقاله‌ها" className="flex flex-wrap justify-center gap-2">
          <Link to={query ? `/articles/?q=${encodeURIComponent(query)}` : "/articles/"} className={`rounded-full border px-4 py-2 text-sm ${!category ? "bg-primary-700 text-white" : "bg-[var(--surface)]"}`}>همه مقالات</Link>
          {categories.map(item => {
            const path = categoryPath(item, categories);
            return path ? <Link key={item.id} to={`${path}${query ? `?q=${encodeURIComponent(query)}` : ""}`} className={`rounded-full border px-4 py-2 text-sm ${category === item.slug ? "bg-primary-700 text-white" : "bg-[var(--surface)]"}`}>{item.name}</Link> : null;
          })}
        </nav>

        {result.data.length ? (
          <div className="mx-auto grid w-full max-w-[1200px] gap-8 md:grid-cols-2 lg:grid-cols-3">
            {result.data.map(article => (
              <ArticleCard
                key={article.id}
                variant="variant3"
                className="max-w-none"
                article={{
                  id: article.id,
                  title: article.title,
                  image: imageUrl(article.coverImageId),
                  date: new Date(article.publishedAt).toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" }),
                  href: articlePath(article.slug),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="mx-auto max-w-xl rounded-[var(--radius-xs)] border bg-[var(--surface)] p-8 text-center">
            <h2 className="text-xl font-bold">مقاله‌ای پیدا نشد</h2>
            <p className="mt-2 text-[var(--text-body)]">عبارت جستجو یا دسته‌بندی را تغییر دهید.</p>
          </div>
        )}

        {result.total > result.data.length ? (
          <nav className="flex justify-center gap-2" aria-label="صفحه‌بندی">
            {Array.from({ length: Math.ceil(result.total / result.limit) }, (_, index) => index + 1).map(page => (
              <Link key={page} to={`${archivePath}?page=${page}${query ? `&q=${encodeURIComponent(query)}` : ""}`} className={`flex size-10 items-center justify-center rounded-full border ${page === result.page ? "bg-primary-700 text-white" : "bg-[var(--surface)]"}`}>{page.toLocaleString("fa-IR")}</Link>
            ))}
          </nav>
        ) : null}
      </section>
      <RegistrationBanner />
      <NewMembers />
    </SiteLayout>
  );
}
