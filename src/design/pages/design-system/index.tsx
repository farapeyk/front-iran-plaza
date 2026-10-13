"use client"

import { Link } from "@/design/navigation"
import { SiteLayout } from "@/design/components/site-layout"
import { cn } from "@/design/lib/utils"
import { componentGroups, productPages } from "@/design/data/site-index"

/** Maps 1:1 to Figma design-system pages in Iran-Plazza-Master */
const designSystemPages = [
  {
    to: "/design-system/tokens",
    figma: "0:1",
    title: "Design Tokens",
    emoji: "🧩",
    desc: "رنگ، فاصله، radius، تایپوگرافی و متغیرهای معنایی",
  },
  {
    to: "/design-system/buttons",
    figma: "4846:37295",
    title: "Buttons",
    emoji: "💠",
    desc: "واریانت‌ها و سایزهای دکمه از صفحه Buttons",
  },
  {
    to: "/design-system/icons",
    figma: "4845:2120",
    title: "Icons",
    emoji: "💠",
    desc: "آیکن‌های سیستم (outline / filled)",
  },
  {
    to: "/design-system/components",
    figma: "7395:35852",
    title: "Design System Components",
    emoji: "💠",
    desc: "Input، Accordion، Switch، Checkbox، Tab، Modal و …",
  },
  {
    to: "/design-system/iran-plaza",
    figma: "5156:951",
    title: "Iran Plaza Components",
    emoji: "💠",
    desc: "Header، Footer، Business Search، Category، VIP، Banner و …",
  },
] as const

function DsShell({
  title,
  figma,
  children,
}: {
  title: string
  figma: string
  children: React.ReactNode
}) {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl space-y-[var(--5xl)] px-[var(--page-gutter)] py-[var(--5xl)] lg:px-[var(--page-gutter-lg)]">
        <header className="space-y-[var(--lg)] text-right">
          <Link
            to="/design-system"
            className="text-sm font-bold text-primary-500"
          >
            → بازگشت به فهرست دیزاین‌سیستم
          </Link>
          <h1 className="text-[length:var(--text-h1)] font-black text-[var(--text-title)]">
            {title}
          </h1>
          <p className="text-sm text-[var(--text-body)]">
            Figma node: <code className="font-mono">{figma}</code>
          </p>
        </header>
        {children}
      </div>
    </SiteLayout>
  )
}

function DesignSystemIndexPage() {
  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl space-y-[var(--5xl)] px-[var(--page-gutter)] py-[var(--5xl)] lg:px-[var(--page-gutter-lg)]">
        <header className="space-y-[var(--md)] text-right">
          <p className="text-sm font-bold text-primary-500">Figma → Code</p>
          <h1 className="text-[length:var(--text-h1)] font-black text-[var(--text-title)]">
            سیستم طراحی ایران پلازا
          </h1>
          <p className="text-[length:var(--text-body-5)] text-[var(--text-body)]">
            مطابق صفحات Figma — نه یک صفحهٔ ترکیبی دستی. هر بخش زیر فایل Master
            جدا شده است.
          </p>
        </header>

        <div className="grid gap-[var(--lg)] sm:grid-cols-2">
          {designSystemPages.map((p) => (
            <Link
              key={p.to}
              to={p.to}
              className={cn(
                "rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)] text-right transition-colors hover:border-primary-300"
              )}
            >
              <p className="text-sm text-[var(--text-body)]">
                {p.emoji} {p.figma}
              </p>
              <h2 className="mt-[var(--sm)] text-xl font-black text-[var(--text-title)]">
                {p.title}
              </h2>
              <p className="mt-[var(--sm)] text-sm text-[var(--text-body)]">{p.desc}</p>
            </Link>
          ))}
        </div>

        <section className="space-y-[var(--lg)]">
          <h2 className="text-right text-2xl font-black text-[var(--text-title)]">
            صفحات
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {productPages.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="flex flex-col gap-0.5 rounded-[var(--radius-xs)] border border-[var(--border-default)] px-[var(--lg)] py-[var(--md)] text-start hover:border-primary-300"
                >
                  <span className="font-bold text-[var(--text-title)]">{item.title}</span>
                  <span className="font-mono text-xs text-[var(--text-body)]" dir="ltr">
                    {item.to}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-[var(--3xl)]">
          <h2 className="text-right text-2xl font-black text-[var(--text-title)]">
            کامپوننت‌ها
          </h2>
          {componentGroups.map((group) => (
            <div key={group.title} className="space-y-[var(--md)]">
              <h3 className="text-right text-lg font-bold text-[var(--text-title)]">
                {group.title}
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => (
                  <li key={item.file}>
                    <Link
                      to={item.to}
                      className="flex flex-col gap-0.5 rounded-[var(--radius-xs)] border border-[var(--border-default)] px-[var(--lg)] py-[var(--md)] text-start hover:border-primary-300"
                    >
                      <span className="font-bold text-[var(--text-title)]">{item.title}</span>
                      <span className="font-mono text-xs text-[var(--text-body)]" dir="ltr">
                        {item.file.replace("src/components/", "")}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      </div>
    </SiteLayout>
  )
}

export { DesignSystemIndexPage, DsShell }
