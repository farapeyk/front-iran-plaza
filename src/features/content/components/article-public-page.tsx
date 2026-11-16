import { SiteLayout } from "@/design/components/site-layout";
import { Breadcrumb } from "@/design/components/breadcrumb";
import { TableOfContent } from "@/design/components/table-of-content";
import { RegistrationBanner } from "@/design/components/registration-banner";
import { ArticleCard } from "@/design/components/article-card";
import Image from "next/image";
import Link from "next/link";
import { ArticleFeedbackForm } from "@/features/content/components/article-feedback-form";
import { RichTextRenderer } from "@/features/content/components/rich-text-renderer";
import { articlePath } from "@/features/content/lib/public-paths";
import { displayArticleExcerpt, withoutDuplicateLeadingExcerpt, withoutLegacyArticleWidgets } from "@/features/content/lib/article-content";
import type { ArticleBanner, ArticleBlock, PublicArticle, PublicArticleListItem } from "@/features/content/types";
import { buildArticleStructuredData } from "@/features/seo/article-seo";
import { JsonLd } from "@/features/seo/json-ld";
import { ArticleBusinessList } from "@/features/content/components/article-business-list";

const fileUrl = (id: string) => `/api/backend/files/${encodeURIComponent(id)}`;

function TextBlock({ block }: { block: ArticleBlock }) {
  if (block.type === "heading") {
    if (block.level === 4) return <h4 id={block.id} className="scroll-mt-24 text-lg font-bold text-[var(--text-title)]">{block.text}</h4>;
    if (block.level === 3) return <h3 id={block.id} className="scroll-mt-24 text-xl font-bold text-[var(--text-title)]">{block.text}</h3>;
    return <h2 id={block.id} className="scroll-mt-24 text-2xl font-black text-[var(--text-title)]">{block.text}</h2>;
  }
  if (block.type === "quote") return <blockquote className="border-s-4 border-primary-500 bg-primary-50 p-5 text-lg leading-loose">{block.richText ? <RichTextRenderer document={block.richText} /> : block.text}</blockquote>;
  if (block.type === "callout") return <aside className="rounded-[var(--radius-xs)] bg-secondary-100 p-5 leading-loose text-[var(--text-title)]">{block.richText ? <RichTextRenderer document={block.richText} /> : block.text}</aside>;
  if (block.richText) return <RichTextRenderer document={block.richText} />;
  return <p className="whitespace-pre-line text-base leading-loose text-[var(--text-body)] md:text-lg">{block.text}</p>;
}

function ArticleBannerView({ banner, compact = false }: { banner: ArticleBanner; compact?: boolean }) {
  if (!compact && banner.displayMode === "FULL") {
    return <a href={banner.targetUrl} target="_blank" rel="sponsored noopener noreferrer" aria-label={banner.title} className="block overflow-hidden rounded-[var(--radius-xs)] border bg-neutral-50"><Image unoptimized width={banner.image?.width || 1200} height={banner.image?.height || 675} sizes="(min-width: 1024px) 760px, 100vw" src={fileUrl(banner.imageId)} alt={banner.altText} className="h-auto w-full" /></a>;
  }
  if (!compact) {
    return <a href={banner.targetUrl} target="_blank" rel="sponsored noopener noreferrer" aria-label={banner.title} className="relative block aspect-[16/9] overflow-hidden rounded-[var(--radius-xs)] border bg-neutral-50"><Image unoptimized fill sizes="(min-width: 1024px) 760px, 100vw" src={fileUrl(banner.imageId)} alt={banner.altText} className="object-cover" /></a>;
  }
  return <a href={banner.targetUrl} target="_blank" rel="sponsored noopener noreferrer" aria-label={banner.title} className="block h-[86px] w-full overflow-hidden rounded-[var(--radius-xs)] border bg-neutral-50 lg:h-auto"><Image unoptimized width={banner.image?.width || 560} height={banner.image?.height || 420} sizes="(min-width: 1024px) 280px, 345px" src={fileUrl(banner.imageId)} alt={banner.altText} className="h-full w-full object-cover object-top lg:h-auto lg:max-h-72 lg:object-contain lg:object-center" /></a>;
}

function ArticleSidebarContent({ banners }: { banners: ArticleBanner[] }) {
  return <><RegistrationBanner variant="sidebar" className="h-[86px]" />{banners.map(banner => <ArticleBannerView key={banner.id} banner={banner} compact />)}</>;
}

function ArticleTableView({ block }: { block: ArticleBlock }) {
  const table = block.table;
  if (!table) return null;
  const headers = [...table.headers, ...(table.showContactColumn ? ["تماس"] : [])];
  return <div role="table" aria-label={headers.join("، ")} itemScope itemType="https://schema.org/Table" className="space-y-3 text-sm sm:space-y-0 sm:overflow-x-auto sm:rounded-[var(--radius-xs)] sm:border">
    <div role="rowgroup" className="hidden bg-neutral-50 sm:block">
      <div role="row" itemProp="hasPart" itemScope itemType="https://schema.org/TableRow" className="hidden sm:grid" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
        {headers.map((header, index) => <div key={index} role="columnheader" itemProp="hasPart" itemScope itemType="https://schema.org/TableCell" className={`px-4 py-3 text-start font-bold ${index ? "border-s" : ""}`}><span itemProp="text">{header}</span></div>)}
      </div>
    </div>
    <div role="rowgroup" className="contents">
      {table.rows.map((row, rowIndex) => {
        const values = [...row.cells, ...(table.showContactColumn ? [row.phone || ""] : [])];
        return <div key={rowIndex} role="row" itemProp="hasPart" itemScope itemType="https://schema.org/TableRow" className="block overflow-hidden rounded-[var(--radius-xs)] border bg-white sm:grid sm:rounded-none sm:border-0 sm:even:bg-neutral-50/60" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
          {values.map((value, index) => <div key={index} role="cell" itemProp="hasPart" itemScope itemType="https://schema.org/TableCell" aria-label={`${headers[index]}: ${value}`} className="flex min-w-0 items-start gap-3 border-t px-4 py-3 first:border-t-0 sm:border-s sm:first:border-s-0">
            <span className="shrink-0 font-bold text-neutral-600 sm:hidden">{headers[index]}</span>
            <span itemProp="text" className="min-w-0 break-words">{table.showContactColumn && index === values.length - 1 ? row.phone ? <a href={`tel:${row.phone.replace(/[^+\d]/g, "")}`} className="inline-flex rounded-full border border-emerald-700 px-3 py-1 font-medium text-emerald-800">{table.contactLabel || "تماس"}</a> : <span aria-label="شماره تماس ثبت نشده">—</span> : value}</span>
          </div>)}
        </div>;
      })}
    </div>
  </div>;
}
export function ArticlePublicPage({ article, relatedArticles = [], categoryPath, preview = false, editHref }: { article: PublicArticle; relatedArticles?: PublicArticleListItem[]; categoryPath?: string; preview?: boolean; editHref?: string }) {
  const cleanedBlocks = withoutLegacyArticleWidgets(article.bodyBlocks);
  const excerpt = displayArticleExcerpt(article.excerpt, cleanedBlocks);
  const bodyBlocks = withoutDuplicateLeadingExcerpt(excerpt, cleanedBlocks);
  const businessById = new Map(article.businesses.map(item => [item.business.id, item.business]));
  const tocItems = bodyBlocks
    .filter(block => block.type === "heading" && block.text)
    .map(block => ({ label: block.text as string, href: `#${block.id}` }));
  const published = new Date(article.publishedAt as string).toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" });
  const banners = article.banners ?? [];
  const topBanners = banners.filter(banner => banner.placement === "TOP");
  const sidebarBanners = banners.filter(banner => banner.placement === "SIDEBAR");
  const activeFaqs = article.faqs.filter(item => item.isActive !== false);

  return (
    <SiteLayout>
      {!preview ? <JsonLd data={buildArticleStructuredData(article, categoryPath)} /> : null}
      <main className="mx-auto w-full max-w-[1440px] px-[var(--page-gutter)] py-[var(--5xl)] lg:px-[var(--8xl)] lg:pb-[var(--9xl)]">
        {preview || editHref ? <div className={`mx-auto mb-5 flex max-w-[1120px] flex-wrap items-center justify-between gap-3 rounded-[var(--radius-xs)] border px-4 py-3 ${preview ? "border-amber-300 bg-amber-50 text-amber-950" : "border-emerald-200 bg-emerald-50 text-emerald-950"}`}><span className="text-sm font-bold">{preview ? "حالت پیش‌نمایش؛ این نسخه برای بازدیدکنندگان عمومی قابل مشاهده نیست." : "شما دسترسی تحریریه دارید."}</span>{editHref ? <Link href={editHref} className="rounded-lg bg-emerald-950 px-4 py-2 text-sm font-bold text-white">ویرایش این مقاله</Link> : null}</div> : null}
        <Breadcrumb items={[{ label: "خانه", to: "/" }, { label: article.category?.name || "مقالات", to: categoryPath || "/articles/" }, { label: article.title }]} />
        <header className="mx-auto mt-[var(--5xl)] max-w-[1000px] space-y-4 text-start">
          <h1 className="text-[length:var(--text-h1)] font-black leading-tight text-[var(--text-title)]">{article.title}</h1>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[var(--text-body)]">
            <span>نویسنده: {article.author.profileSlug ? <Link className="font-bold text-emerald-800 hover:underline" href={`/authors/${encodeURIComponent(article.author.profileSlug)}`}>{article.author.fullName || "تیم ایران پلازا"}</Link> : (article.author.fullName || "تیم ایران پلازا")}</span>
            <time dateTime={article.publishedAt as string}>{preview ? `آخرین ذخیره: ${published}` : published}</time>
            <span>زمان مطالعه: {article.readingTimeMin.toLocaleString("fa-IR")} دقیقه</span>
            {article.rating !== null ? <span>امتیاز {article.rating.toLocaleString("fa-IR", { maximumFractionDigits: 1 })} از ۵ ({article.ratingCount.toLocaleString("fa-IR")} رأی)</span> : null}
          </div>
        </header>

        <div className="mx-auto mt-[var(--5xl)] flex max-w-[1120px] flex-col gap-[var(--5xl)] lg:flex-row lg:items-start">
          <article className="min-w-0 flex-1 space-y-[var(--3xl)]">
            {topBanners.map(banner => <ArticleBannerView key={banner.id} banner={banner} />)}
            {article.coverImageId ? (
              <figure className="space-y-2">
                <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-xs)]"><Image fill sizes="(min-width: 1024px) 760px, 100vw" src={fileUrl(article.coverImageId)} alt={article.coverImageAlt || article.title} className="object-cover" /></div>
                {article.coverImageAlt ? <figcaption className="text-sm text-[var(--text-body)]">{article.coverImageAlt}</figcaption> : null}
              </figure>
            ) : null}
            {tocItems.length ? <TableOfContent items={tocItems} className="w-full" /> : null}
            <aside className="mx-auto w-full max-w-[345px] space-y-4 lg:hidden"><ArticleSidebarContent banners={sidebarBanners} /></aside>
            {article.keyTakeaways?.length ? <aside className="rounded-[var(--radius-xs)] border border-emerald-200 bg-emerald-50/70 p-5"><h2 className="font-black text-emerald-950">خلاصه سریع</h2><ul className="mt-3 list-disc space-y-2 pe-5 leading-7 text-emerald-950">{article.keyTakeaways.map(item => <li key={item}>{item}</li>)}</ul></aside> : null}
            <p className="whitespace-pre-line text-lg leading-loose text-[var(--text-body)]">{excerpt}</p>

            {bodyBlocks.map(block => {
              if (block.type === "image" && block.imageId) {
                return <figure key={block.id} className="space-y-2"><Image width={1200} height={675} sizes="(min-width: 1024px) 760px, 100vw" src={fileUrl(block.imageId)} alt={block.imageAlt || ""} className="h-auto w-full rounded-[var(--radius-xs)]" /><figcaption className="text-sm text-[var(--text-body)]">{block.imageAlt}</figcaption></figure>;
              }
              if (block.type === "business-list") {
                const businesses = (block.businessIds ?? []).map(id => businessById.get(id)).filter((item): item is NonNullable<typeof item> => Boolean(item));
                return <div key={block.id} id={block.id}><ArticleBusinessList businesses={businesses} title={block.listTitle} /></div>;
              }
              if (block.type === "table") return <ArticleTableView key={block.id} block={block} />;
              return <TextBlock key={block.id} block={block} />;
            })}

            {activeFaqs.length ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-black">پرسش‌های متداول</h2>
                {activeFaqs.map(item => <details key={item.id ?? item.question} className="rounded-[var(--radius-xs)] border bg-[var(--surface)] p-4"><summary className="cursor-pointer font-bold">{item.question}</summary><p className="mt-3 leading-loose text-[var(--text-body)]">{item.answer}</p></details>)}
              </section>
            ) : null}

            {!preview ? <ArticleFeedbackForm slug={article.slug} averageRating={article.rating} ratingCount={article.ratingCount} /> : null}
            {!preview && article.feedback.length ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-black">نظرات کاربران</h2>
                {article.feedback.map(item => <article key={item.id} className="rounded-[var(--radius-xs)] border-b p-4"><div className="flex justify-between gap-4"><strong>{item.user.fullName || "کاربر ایران پلازا"}</strong>{item.rating !== null ? <span>{item.rating.toLocaleString("fa-IR")} از ۵</span> : null}</div>{item.comment ? <p className="mt-2 leading-loose text-[var(--text-body)]">{item.comment}</p> : null}</article>)}
              </section>
            ) : null}

            {relatedArticles.length ? (
              <section className="space-y-4">
                <h2 className="text-2xl font-black">مقاله‌های پیشنهادی</h2>
                <div className="grid gap-5 md:grid-cols-3">
                  {relatedArticles.map(item => <ArticleCard key={item.id} variant="variant3" className="max-w-none" article={{ id: item.id, title: item.title, image: item.coverImageId ? fileUrl(item.coverImageId) : "/design/home/biz-3.webp", date: new Date(item.publishedAt).toLocaleDateString("fa-IR", { timeZone: "Asia/Tehran" }), href: articlePath(item.slug) }} />)}
                </div>
              </section>
            ) : null}
          </article>
          <aside className="hidden w-[280px] shrink-0 space-y-4 lg:sticky lg:top-24 lg:block"><ArticleSidebarContent banners={sidebarBanners} /></aside>
        </div>
      </main>
    </SiteLayout>
  );
}
