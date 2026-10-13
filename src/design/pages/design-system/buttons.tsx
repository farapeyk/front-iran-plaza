"use client"

import { Button } from "@/design/components/ui/button"
import { DsShell } from "@/design/pages/design-system/index"

const families = [
  { name: "1. Primary", variants: ["default", "outline", "light", "ghost"] as const },
  { name: "2. Secondary", variants: ["secondary"] as const },
  { name: "3. Neutral", variants: ["neutral"] as const },
  { name: "4. Black", variants: ["black"] as const },
  { name: "5. White", variants: ["white", "white-fill"] as const, dark: true },
  { name: "6. Success", variants: ["success"] as const },
  { name: "7. Danger", variants: ["destructive"] as const },
  { name: "8. Warning", variants: ["warning"] as const },
  { name: "9. Soft / Info", variants: ["soft"] as const },
] as const

function DesignButtonsPage() {
  return (
    <DsShell title="💠 Buttons" figma="4846:37295">
      <p className="text-right text-sm text-[var(--text-body)]">
        ۹ خانواده رنگ + ۴ سایز ثابت (۴۰ / ۴۸ / ۵۲ / ۵۶)
      </p>

      <section className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
        <h2 className="text-right text-lg font-bold text-[var(--text-title)]">Size</h2>
        <div className="flex flex-wrap items-center justify-start gap-[var(--md)]">
          <Button size="sm">Small</Button>
          <Button size="default">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">XLarge</Button>
        </div>
      </section>

      {families.map((family) => (
        <section
          key={family.name}
          className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] p-[var(--2xl)]"
          style={{
            background:
              "dark" in family && family.dark
                ? "var(--primary-950)"
                : "var(--color-white)",
          }}
        >
          <h2
            className="text-right text-lg font-bold"
            style={{
              color:
                "dark" in family && family.dark
                  ? "var(--color-white)"
                  : "var(--text-title)",
            }}
          >
            {family.name}
          </h2>
          <div className="flex flex-wrap items-center justify-start gap-[var(--md)]">
            {family.variants.map((v) => (
              <Button key={v} variant={v}>
                {v}
              </Button>
            ))}
            <Button variant={family.variants[0]} disabled>
              Disable
            </Button>
          </div>
        </section>
      ))}
    </DsShell>
  )
}

export { DesignButtonsPage }
