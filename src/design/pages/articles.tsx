"use client"

import { articles, type ArticleCardData } from "@/design/data/articles"
import { useMemo, useState } from "react"
import { Link, useParams } from "@/design/navigation"
import { SiteLayout } from "@/design/components/site-layout"
import { RegistrationBanner } from "@/design/components/registration-banner"
import { NewMembers } from "@/design/components/new-members"
import { Breadcrumb } from "@/design/components/breadcrumb"
import { TableOfContent } from "@/design/components/table-of-content"
import { CopyLinkButton } from "@/design/components/copy-link-button"
import { BusinessListCard } from "@/design/components/business-list-card"
import { AdsPosition } from "@/design/components/ads-position"
import {
  ArticleCard as DsArticleCard,
  type ArticleCardVariant,
} from "@/design/components/article-card"
import { Button } from "@/design/components/ui/button"
import { buttonVariants } from "@/design/components/ui/button-variants"
import { cn } from "@/design/lib/utils"
import {
  restaurantArticleBody,
  restaurantArticleBusinesses,
} from "@/design/data/article-restaurants"
const searchIcon = "/design/icons/search-dark.svg"
const starIcon = "/design/icons/star.svg"
const userIcon = "/design/icons/user.svg"
const clockIcon = "/design/icons/clock.svg"
const shareIcon = "/design/icons/share.svg"
const addIcon = "/design/icons/add.svg"
const lampIcon = "/design/icons/lamp-charge.svg"
const arrowLeft = "/design/icons/arrow-left.svg"
const linkIcon = "/design/icons/link.svg"


const categories = [
  "همه مقالات",
  "معرفی",
  "راهنما",
  "بازاریابی",
  "پروفایل",
]

function ArticleCard({
  article,
  className,
  layout = "grid",
  variant,
  titleTone,
}: {
  article: ArticleCardData
  className?: string
  layout?: "grid" | "row" | "featured"
  variant?: ArticleCardVariant
  titleTone?: "default" | "primary"
}) {
  const resolved: ArticleCardVariant =
    variant ??
    (layout === "row"
      ? "category"
      : layout === "featured"
        ? "variant3"
        : "slider")

  return (
    <DsArticleCard
      article={article}
      className={className}
      variant={resolved}
      titleTone={titleTone}
    />
  )
}

function ArticlesPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("همه مقالات")

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const matchCat =
        category === "همه مقالات" || a.category === category
      const q = query.trim()
      const matchQ =
        !q || a.title.includes(q) || a.excerpt.includes(q)
      return matchCat && matchQ
    })
  }, [query, category])

  const featured = filtered[0] ?? articles[0]
  const rest = filtered.slice(1)
  /** Desktop inserts the registration banner after two rows (6 cards), or after the last card. */
  const desktopBannerAfter = Math.min(6, filtered.length) - 1

  return (
    <SiteLayout>
      <section className="mx-auto w-full max-w-[1440px] space-y-[var(--5xl)] px-[var(--page-gutter)] py-[var(--5xl)] lg:px-[var(--8xl)]">
        <header className="mx-auto flex max-w-[1200px] flex-col items-center gap-[var(--2xl)] text-center">
          <div className="w-full max-w-[345px] space-y-[var(--sm)] lg:max-w-none">
            <p className="font-bold text-primary-500">مقالات ایران پلازا</p>
            <h1 className="text-[length:var(--text-h1)] font-black text-[var(--text-title)]">
              آگاهی برای انتخاب بهتر
            </h1>
            <p className="text-base leading-relaxed text-[var(--text-body)] lg:mx-auto lg:max-w-4xl">
              در این بخش مقاله‌هایی با موضوعات متنوع می‌خوانید؛ از مشاغل و
              کسب‌وکارها تا آموزش و تجربه، برای آگاهی بیشتر و انتخابی آگاهانه‌تر.
            </p>
          </div>
          <label className="flex h-14 w-full max-w-[345px] items-center gap-[var(--md)] rounded-full border border-[var(--border-default)] bg-[var(--surface)] px-[var(--lg)]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی مقاله"
              className="h-full min-w-0 flex-1 bg-transparent text-start text-base outline-none placeholder:text-[var(--input-placeholder)]"
            />
            <img alt="" className="size-6" height={24} src={searchIcon} width={24} />
          </label>
        </header>

        <div className="-mx-[var(--page-gutter)] flex gap-2 overflow-x-auto px-[var(--page-gutter)] pb-1 [scrollbar-width:none] lg:mx-0 lg:flex-wrap lg:justify-center lg:overflow-visible lg:px-0">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                buttonVariants({
                  variant: category === c ? "default" : "outline",
                  size: "sm",
                }),
                "shrink-0",
                category !== c &&
                  "border-[var(--border-default)] text-[var(--text-title)]"
              )}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Mobile: featured + horizontal rows */}
        <div className="mx-auto flex w-full max-w-[345px] flex-col gap-[var(--2xl)] lg:hidden">
          <ArticleCard
            article={featured}
            layout="featured"
            className="w-full max-w-none"
          />
          {rest.map((a, i) => (
            <div key={a.id} className="contents">
              <ArticleCard article={a} layout="row" className="w-full max-w-none" />
              {i === 3 ? <RegistrationBanner className="w-full" /> : null}
            </div>
          ))}
        </div>

        {/* Desktop: 3-column variant3 grid (Figma Business Category - desktop) */}
        <div className="mx-auto hidden w-full max-w-[1200px] flex-col gap-8 lg:flex">
          <div className="grid grid-cols-3 gap-8">
            {filtered.map((a, i) => (
              <div key={a.id} className="contents">
                <ArticleCard
                  article={a}
                  layout="featured"
                  className="w-full max-w-none"
                />
                {i === desktopBannerAfter ? (
                  <div className="col-span-3">
                    <RegistrationBanner className="w-full" />
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="gap-2 border-[var(--border-default)]">
            <img alt="" className="size-6" height={24} src={addIcon} width={24} />
            مشاهده بیشتر
          </Button>
        </div>

        <div className="space-y-[var(--lg)]">
          <h2 className="text-center text-2xl font-black text-[var(--text-title)] lg:text-start lg:text-[length:var(--text-h1)]">
            محبوب ترین ها
          </h2>
          <div className="flex gap-[var(--md)] overflow-x-auto pb-2 [scrollbar-width:none] lg:justify-center">
            {articles.slice(0, 4).map((a) => (
              <ArticleCard key={`pop-${a.id}`} article={a} />
            ))}
          </div>
        </div>
      </section>

      <NewMembers />
    </SiteLayout>
  )
}

function ArticleMeta({
  article,
  className,
}: {
  article: ArticleCardData
  className?: string
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 text-base text-[var(--text-body)] lg:flex-row lg:flex-wrap lg:items-center lg:justify-start lg:gap-6 lg:text-lg",
        className
      )}
    >
      {/* Figma RTL: rating → date → read time → author (right → left) */}
      {article.rating != null && (
        <div className="flex items-center justify-start gap-2">
          <img alt="" className="size-6" height={24} src={starIcon} width={24} />
          <p>
            <span className="font-bold text-[var(--text-title)]">
              {article.rating}
            </span>{" "}
            <span className="text-[var(--text-subtitle)]">
              ({article.ratingCount})
            </span>
          </p>
        </div>
      )}
      <div className="flex items-center justify-start gap-2">
        <img alt="" className="size-6" height={24} src={clockIcon} width={24} />
        <span>{article.date}</span>
      </div>
      <div className="flex items-center justify-start gap-2">
        <img alt="" className="size-6" height={24} src={clockIcon} width={24} />
        <span>زمان مطالعه: {article.readMinutes ?? 5} دقیقه</span>
      </div>
      <div className="flex items-center justify-start gap-2">
        <img alt="" className="size-6" height={24} src={userIcon} width={24} />
        <span>نویسنده: {article.author ?? "تیم ایران پلازا"}</span>
      </div>
    </div>
  )
}

function ArticleShareActions({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap justify-start gap-2", className)}>
      {/* Figma: share (Neutral) then copy — share on the right of the pair */}
      <Button
        variant="outline"
        size="sm"
        className="gap-2 border-[var(--border-default)] text-[var(--text-title)]"
      >
        <img alt="" className="size-6" height={24} src={shareIcon} width={24} />
        اشتراک گذاری
      </Button>
      <CopyLinkButton />
    </div>
  )
}

function ArticleSidebar() {
  return (
    <aside
      data-slot="article-sidebar"
      className="hidden w-[345px] shrink-0 flex-col gap-[var(--lg)] pt-[var(--5xl)] lg:sticky lg:top-24 lg:flex"
    >
      <RegistrationBanner variant="sidebar" className="w-full" />
      <div className="space-y-1">
        <p className="text-start text-base font-bold text-[var(--danger)]">Ads</p>
        <div className="flex flex-col gap-4">
          <AdsPosition variant="list-desktop" />
          <AdsPosition variant="list-desktop" />
          <AdsPosition variant="list-desktop" />
        </div>
      </div>
    </aside>
  )
}

const prose =
  "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است. چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می‌باشد."

function ArticleProse({ article }: { article: ArticleCardData }) {
  const related = articles.find((a) => a.id !== article.id) ?? articles[0]

  return (
    <div id="body" className="space-y-[var(--5xl)]">
      {[0, 1].map((i) => (
        <section key={i} className="space-y-[var(--md)] text-start">
          <h2 className="text-xl font-bold text-[var(--text-title)]">
            لورم اپیسوم متن خانگی
          </h2>
          <p className="text-base leading-relaxed text-[var(--text-body)] md:text-lg">
            {prose}
          </p>
        </section>
      ))}

      <div className="aspect-[775/484] overflow-hidden rounded-[var(--radius-xs)]">
        <img alt="" className="size-full object-cover" src={article.image} />
      </div>

      {[2, 3, 4].map((i) => (
        <section key={i} className="space-y-[var(--md)] text-start">
          <h2 className="text-xl font-bold text-[var(--text-title)]">
            لورم اپیسوم متن خانگی
          </h2>
          <p className="text-base leading-relaxed text-[var(--text-body)] md:text-lg">
            {prose}
          </p>
        </section>
      ))}

      <div className="flex items-center gap-[var(--lg)] rounded-[var(--radius-xs)] bg-secondary-100 px-[var(--lg)] py-[var(--xl)]">
        <img alt="" className="size-6 shrink-0" height={24} src={lampIcon} width={24} />
        <p className="text-start text-base leading-relaxed text-[var(--text-title)]">
          این باکس برای نوشتن انواع نکته‌هایی هست که نویسنده می‌خواهد به مخاطب برساند.
        </p>
      </div>

      <Link
        to={`/articles/${related.id}`}
        className="flex items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] p-2"
      >
        <img
          alt=""
          className="size-[88px] shrink-0 rounded-[var(--radius-xs)] object-cover"
          height={88}
          src={related.image}
          width={88}
        />
        <span className="min-w-0 flex-1 text-start text-lg font-bold text-[var(--text-title)]">
          این کارت یک نوع مقاله است برای لینک کردن مقالات دیگر در این مقاله
        </span>
        <img alt="" className="size-4 shrink-0" height={16} src={arrowLeft} width={16} />
      </Link>

      <Link
        to="/faq"
        className="flex items-center gap-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] px-[var(--lg)] py-[var(--xl)]"
      >
        <img alt="" className="size-8 shrink-0" height={32} src={linkIcon} width={32} />
        <span className="min-w-0 flex-1 text-start text-lg font-bold text-[var(--text-title)]">
          این یک کارت برای لینک کردن صفحات دیگر در این مقاله است
        </span>
        <img alt="" className="size-4 shrink-0" height={16} src={arrowLeft} width={16} />
      </Link>
    </div>
  )
}

function ArticlePage() {
  const { id } = useParams()
  const article = articles.find((a) => a.id === id) ?? articles[0]
  const isRestaurantList = article.id === "1"
  const businesses = isRestaurantList
    ? restaurantArticleBusinesses
    : restaurantArticleBusinesses.slice(0, 4)
  const body = restaurantArticleBody

  const tocItems = isRestaurantList
    ? [
        { label: "مقدمه", href: "#intro" },
        { label: body.sectionTitle, href: "#list" },
        { label: "جمع‌بندی", href: "#summary" },
      ]
    : [
        { label: "مقدمه", href: "#intro" },
        { label: "لورم اپیسوم متن خانگی", href: "#body" },
        { label: "جمع‌بندی", href: "#summary" },
      ]

  return (
    <SiteLayout>
      <div className="mx-auto w-full max-w-[1440px] px-[var(--page-gutter)] py-[var(--5xl)] lg:px-[var(--8xl)] lg:pb-[var(--9xl)]">
        <Breadcrumb
          items={[
            { label: "خانه", to: "/" },
            { label: "مقالات", to: "/articles" },
            { label: article.category },
          ]}
        />

        <header className="mt-[var(--5xl)] flex flex-col gap-[var(--lg)] lg:flex-row lg:items-start lg:justify-between lg:gap-4">
          <div className="min-w-0 flex-1 space-y-4 text-start">
            <h1 className="text-[length:var(--text-h1)] font-black leading-tight text-[var(--text-title)]">
              {article.title}
            </h1>
            <ArticleMeta article={article} />
          </div>
          <ArticleShareActions className="lg:mb-1 lg:shrink-0" />
        </header>

        {/* Mobile-only promo + hero before the two-column body */}
        <div className="mt-[var(--5xl)] space-y-[var(--2xl)] lg:hidden">
          <RegistrationBanner variant="sidebar" />
          <div className="aspect-[16/9] overflow-hidden rounded-[var(--radius-xs)]">
            <img alt="" className="size-full object-cover" src={article.image} />
          </div>
          <TableOfContent className="w-full" defaultOpen items={tocItems} />
        </div>

        <div className="mt-[var(--5xl)] flex flex-col gap-[var(--5xl)] lg:mt-[var(--5xl)] lg:flex-row lg:justify-center lg:gap-20">
          <div className="mx-auto w-full min-w-0 max-w-[775px] space-y-[var(--5xl)] lg:mx-0 lg:flex-1">
            {/* Desktop hero + TOC */}
            <div className="hidden space-y-[var(--2xl)] lg:block">
              <div className="aspect-[16/9] overflow-hidden rounded-[var(--radius-xs)]">
                <img
                  alt=""
                  className="size-full object-cover"
                  src={article.image}
                />
              </div>
              <TableOfContent className="w-full" defaultOpen items={tocItems} />
            </div>

            <section id="intro" className="space-y-[var(--lg)] text-start">
              <h2 className="text-xl font-bold text-[var(--text-title)]">مقدمه</h2>
              <p className="text-base leading-relaxed text-[var(--text-body)] md:text-lg">
                {isRestaurantList ? body.intro : article.excerpt}
              </p>
            </section>

            {/* Mobile ads after intro (Figma mobile) */}
            <div className="space-y-[var(--sm)] lg:hidden">
              <p className="text-start text-base font-bold text-[var(--danger)]">
                Ads
              </p>
              <AdsPosition variant="list-mobile" className="max-w-none" />
              <AdsPosition variant="banner-mobile" className="max-w-none" />
            </div>

            {isRestaurantList ? (
              <section id="list" className="space-y-[var(--lg)]">
                <h2 className="text-start text-xl font-bold text-[var(--text-title)] lg:text-2xl">
                  {body.sectionTitle}
                </h2>
                <p className="text-start text-base leading-relaxed text-[var(--text-body)] md:text-lg">
                  {body.sectionBody}
                </p>
                <div className="space-y-[var(--md)]">
                  {businesses.map((b) => (
                    <div key={b.id} className="space-y-2">
                      <BusinessListCard
                        business={b}
                        layout="desktop"
                        className="hidden max-w-none lg:flex"
                      />
                      <BusinessListCard
                        business={b}
                        layout="mobile"
                        className="max-w-none lg:hidden"
                      />
                      {b.description ? (
                        <p className="text-start text-sm leading-relaxed text-[var(--text-body)] lg:text-base">
                          {b.description}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
                <div className="rounded-[var(--radius-xs)] border border-[var(--opacity-dark-16)] bg-secondary-50 p-[var(--lg)] text-start">
                  <p className="text-base font-bold text-[var(--text-title)]">نکته</p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-body)] lg:text-base">
                    {body.tip}
                  </p>
                </div>
              </section>
            ) : (
              <ArticleProse article={article} />
            )}

            <section id="summary" className="space-y-[var(--lg)] text-start">
              <h2 className="text-xl font-bold text-[var(--text-title)]">
                جمع‌بندی
              </h2>
              <p className="text-base leading-relaxed text-[var(--text-body)] md:text-lg">
                {isRestaurantList ? body.summary : article.excerpt}
              </p>
            </section>

            <section className="rounded-[var(--radius-xs)] bg-secondary-100 px-[var(--2xl)] py-[var(--3xl)] text-center">
              <p className="text-lg font-bold text-[var(--text-title)]">
                به این مطلب امتیاز دهید
              </p>
              <div className="mt-[var(--lg)] flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <img
                    key={i}
                    alt=""
                    className="size-8"
                    height={32}
                    src={starIcon}
                    width={32}
                  />
                ))}
              </div>
            </section>

            <section className="space-y-[var(--lg)]">
              <h2 className="text-center text-2xl font-black text-[var(--text-title)]">
                لیست های برتر
              </h2>
              <div className="flex gap-[var(--md)] overflow-x-auto pb-2 [scrollbar-width:none]">
                {articles
                  .filter((a) => a.id !== article.id)
                  .map((a) => (
                    <ArticleCard key={a.id} article={a} />
                  ))}
              </div>
            </section>

            <section className="space-y-[var(--lg)]">
              <h2 className="text-center text-2xl font-black text-[var(--text-title)]">
                نظرات کاربران
              </h2>
              <div className="flex h-14 items-center gap-2 rounded-[var(--radius-xs)] border border-[var(--input-border)] bg-[var(--surface)] px-[var(--lg)]">
                <input
                  placeholder="نظر خود را بنویسید..."
                  className="h-full min-w-0 flex-1 bg-transparent text-start text-base outline-none placeholder:text-[var(--input-placeholder)]"
                />
                <Button size="sm">ارسال</Button>
              </div>
              {[
                {
                  name: "سجاد",
                  text: "لیست خیلی کاربردی بود، چند تا از این رستوران‌ها رو امتحان کردم.",
                },
                {
                  name: "مینا",
                  text: "کاش آدرس‌ها رو روی نقشه هم نشون می‌دادید.",
                },
              ].map((c) => (
                <div
                  key={c.name}
                  className="flex items-start gap-[var(--lg)] border-b border-[var(--opacity-dark-8)] pb-[var(--2xl)] text-start"
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-700">
                    <img
                      alt=""
                      className="size-4 brightness-0 invert"
                      height={16}
                      src={userIcon}
                      width={16}
                    />
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    <p className="font-bold text-[var(--text-title)]">{c.name}</p>
                    <p className="text-sm leading-relaxed text-[var(--text-body)] lg:text-base">
                      {c.text}
                    </p>
                  </div>
                </div>
              ))}
            </section>

            <div className="text-center lg:hidden">
              <Link to="/articles" className="font-bold text-primary-500">
                بازگشت به مقالات
              </Link>
            </div>
          </div>

          <ArticleSidebar />
        </div>
      </div>
    </SiteLayout>
  )
}

export { ArticlesPage, ArticlePage, ArticleCard }
