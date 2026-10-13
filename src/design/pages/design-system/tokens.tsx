"use client"

import { DsShell } from "@/design/pages/design-system/index"

const steps = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const
const bgSteps = [25, 50, 100, 200, 300, 400] as const
const opacitySteps = [0, 8, 16, 24, 32, 40, 48, 56, 64, 72, 80, 88] as const

function SwatchRow({
  title,
  prefix,
  scale = steps,
}: {
  title: string
  prefix: string
  scale?: readonly number[]
}) {
  return (
    <section className="space-y-[var(--md)]">
      <h2 className="text-lg font-bold text-[var(--text-title)]">{title}</h2>
      <div className="grid grid-cols-4 gap-[var(--sm)] sm:grid-cols-6 lg:grid-cols-12">
        {scale.map((step) => (
          <div key={step} className="space-y-[var(--xs)]">
            <div
              className="h-16 rounded-[var(--radius-xs)] border border-[var(--border-default)]"
              style={{ background: `var(--${prefix}-${step})` }}
            />
            <p className="text-center text-xs text-[var(--text-body)]">{step}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

const spaces = [
  ["--space-1 / --xs", "4px"],
  ["--space-2 / --sm", "8px"],
  ["--space-3 / --md", "12px"],
  ["--space-4 / --lg", "16px"],
  ["--space-5 / --xl", "20px"],
  ["--space-6 / --2xl", "24px"],
  ["--space-8 / --3xl", "32px"],
  ["--space-12 / --5xl", "48px"],
  ["--space-20 / --7xl", "80px"],
  ["--space-30 / --8xl", "120px"],
  ["--space-40 / --9xl", "160px"],
  ["--space-50 / --10xl", "200px"],
  ["--space-70 / --11xl", "280px"],
] as const

const strokes = [
  ["--stroke-xs", "1px"],
  ["--stroke-sm", "2px"],
  ["--stroke-md", "4px"],
  ["--stroke-lg", "6px"],
  ["--stroke-xl", "8px"],
  ["--stroke-2xl", "12px"],
  ["--stroke-3xl", "16px"],
  ["--stroke-4xl", "24px"],
] as const

const typeStyles = [
  ["Display 5", "--text-display-5", "font-bold"],
  ["Title 3", "--text-title-3", "font-bold"],
  ["Heading 2", "--text-h2", "font-bold"],
  ["Body 5", "--text-body-5", "font-normal"],
  ["Label 4", "--text-label-4", "font-bold"],
] as const

function DesignTokensPage() {
  return (
    <DsShell title="🧩 Design Tokens" figma="0:1">
      <p className="text-right text-sm text-[var(--text-body)]">
        ۷ فریم فیگما: Spacing · Colors Palette · Colors Design Token · Corner
        radius · Stroke width · Typography tokens · Typography styles
      </p>

      {/* 1 Spacing */}
      <section className="space-y-[var(--md)]">
        <h2 className="text-lg font-bold text-[var(--text-title)]">1. Spacing</h2>
        <div className="space-y-[var(--sm)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
          {spaces.map(([name, px]) => (
            <div key={name} className="flex items-center justify-start gap-[var(--lg)]">
              <span className="text-xs text-[var(--text-body)]">
                {name} · {px}
              </span>
              <div
                className="h-3 rounded-sm bg-primary-500"
                style={{ width: `var(${name.split(" ")[0]})` }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 2 Colors Palette */}
      <h2 className="text-xl font-bold text-[var(--text-title)]">2. Colors — Palette</h2>
      <SwatchRow title="Primary" prefix="primary" />
      <SwatchRow title="Secondary" prefix="secondary" />
      <SwatchRow title="Gray" prefix="gray" />
      <SwatchRow title="Green" prefix="green" />
      <SwatchRow title="Red" prefix="red" />
      <SwatchRow title="Yellow" prefix="yellow" />
      <SwatchRow title="Blue" prefix="blue" />
      <SwatchRow title="Background Light" prefix="bg-light" scale={bgSteps} />
      <SwatchRow title="Background Dark" prefix="bg-dark" scale={bgSteps} />

      <section className="space-y-[var(--md)]">
        <h2 className="text-lg font-bold text-[var(--text-title)]">Opacity Light</h2>
        <div className="grid grid-cols-4 gap-[var(--sm)] sm:grid-cols-6 lg:grid-cols-12 rounded-[var(--radius-xs)] bg-primary-950 p-[var(--lg)]">
          {opacitySteps.map((step) => (
            <div key={step} className="space-y-[var(--xs)]">
              <div
                className="h-12 rounded-[var(--radius-xs)]"
                style={{ background: `var(--opacity-light-${step})` }}
              />
              <p className="text-center text-[10px] text-[var(--opacity-light-64)]">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-[var(--md)]">
        <h2 className="text-lg font-bold text-[var(--text-title)]">Opacity Dark</h2>
        <div className="grid grid-cols-4 gap-[var(--sm)] sm:grid-cols-6 lg:grid-cols-12 rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--lg)]">
          {opacitySteps.map((step) => (
            <div key={step} className="space-y-[var(--xs)]">
              <div
                className="h-12 rounded-[var(--radius-xs)] border border-[var(--border-subtle)]"
                style={{ background: `var(--opacity-dark-${step})` }}
              />
              <p className="text-center text-[10px] text-[var(--text-body)]">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-[var(--md)]">
        <h2 className="text-lg font-bold text-[var(--text-title)]">Elevation shadows</h2>
        <div className="flex flex-wrap justify-start gap-[var(--2xl)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface-muted)] p-[var(--2xl)]">
          {(
            [
              ["sm", "var(--shadow-sm)"],
              ["md", "var(--shadow-md)"],
              ["lg", "var(--shadow-lg)"],
            ] as const
          ).map(([label, shadow]) => (
            <div
              key={label}
              className="flex size-24 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--surface)] text-sm font-bold text-[var(--text-title)]"
              style={{ boxShadow: shadow }}
            >
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* 3 Semantic */}
      <section className="space-y-[var(--md)]">
        <h2 className="text-lg font-bold text-[var(--text-title)]">
          3. Colors — Design Token (semantic)
        </h2>
        <div className="flex flex-wrap justify-start gap-[var(--sm)] text-sm">
          {[
            ["danger", "var(--danger)"],
            ["success", "var(--success)"],
            ["warning", "var(--warning)"],
            ["info", "var(--info)"],
            ["link", "var(--link)"],
            ["backdrop", "var(--backdrop)"],
          ].map(([label, bg]) => (
            <span
              key={label}
              className="rounded-[var(--radius-full)] px-3 py-1 text-[var(--text-light-title)]"
              style={{ background: bg }}
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* 4 Radius */}
      <section className="space-y-[var(--md)]">
        <h2 className="text-lg font-bold text-[var(--text-title)]">4. Corner radius</h2>
        <div className="flex flex-wrap justify-start gap-[var(--lg)]">
          {[
            ["--radius-xs", "4"],
            ["--radius-sm", "8"],
            ["--radius-md", "12"],
            ["--radius-lg", "16"],
            ["--radius-full", "full"],
          ].map(([v, label]) => (
            <div
              key={v}
              className="flex size-16 items-center justify-center border border-[var(--border-default)] bg-secondary-100 text-xs"
              style={{ borderRadius: `var(${v})` }}
            >
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* 5 Stroke */}
      <section className="space-y-[var(--md)]">
        <h2 className="text-lg font-bold text-[var(--text-title)]">5. Stroke width</h2>
        <div className="space-y-[var(--md)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)]">
          {strokes.map(([name, px]) => (
            <div key={name} className="flex items-center justify-start gap-[var(--lg)]">
              <span className="text-xs text-[var(--text-body)]">
                {name} · {px}
              </span>
              <div
                className="w-40 bg-primary-600"
                style={{ height: `var(${name})` }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 6–7 Typography */}
      <section className="space-y-[var(--md)]">
        <h2 className="text-lg font-bold text-[var(--text-title)]">
          6–7. Typography tokens / styles
        </h2>
        <div className="space-y-[var(--lg)] rounded-[var(--radius-xs)] border border-[var(--border-default)] bg-[var(--surface)] p-[var(--2xl)] text-right">
          {typeStyles.map(([label, size, weight]) => (
            <p
              key={label}
              className={`${weight} text-[var(--text-title)]`}
              style={{ fontSize: `var(${size})`, lineHeight: "var(--leading-normal)" }}
            >
              {label} — ایران پلازا
            </p>
          ))}
        </div>
      </section>
    </DsShell>
  )
}

export { DesignTokensPage }
