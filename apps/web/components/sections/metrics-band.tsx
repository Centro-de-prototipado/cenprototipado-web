import { DecorIcon } from "@/components/ui/decor-icon"
import { Reveal, CountUp } from "@/components/ui/reveal"
import type { Metric } from "@/lib/notion/metrics"

export function MetricsBand({ metrics }: { metrics: Metric[] }) {
  if (metrics.length === 0) return null

  return (
    <section className="relative overflow-hidden border-b bg-card">
      {/* Grid overlay (dark only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden opacity-40 dark:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse at 80% 0%, black, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse at 80% 0%, black, transparent 75%)",
        }}
      />

      <div className="relative z-1 px-8 py-14 lg:px-16 lg:py-16">
        {/* Header */}
        <Reveal
          as="div"
          className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="text-[11px] font-semibold tracking-[0.24em] text-primary uppercase">
              Impacto
            </span>
            <h2
              className="mt-2 leading-[1.05] font-extrabold tracking-[-0.02em] text-foreground dark:text-white"
              style={{ fontSize: "clamp(22px, 3vw, 36px)", maxWidth: "18ch" }}
            >
              Resultados que se construyen, no se prometen.
            </h2>
          </div>
          <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
            Cifras del Centro a 2026 — proyectos, equipo y articulación con la
            red Aulas STEM de Caldas.
          </p>
        </Reveal>

        {/* Metrics grid */}
        <div
          className="grid border border-border dark:border-white/10"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          }}
        >
          {metrics.map((m, i) => (
            <Reveal
              as="div"
              index={i}
              key={m.key}
              className="group relative flex flex-col gap-1 border-r border-b border-border p-5 transition-colors hover:bg-muted/40 dark:border-white/8 dark:hover:bg-white/5"
              style={{ margin: "-1px -1px 0 0" }}
            >
              <DecorIcon
                className="size-2 stroke-foreground/20 dark:stroke-white/30"
                position="top-left"
              />
              <CountUp
                value={m.value}
                className="leading-none font-extrabold tracking-[-0.02em] text-foreground dark:text-white"
                style={{ fontSize: "clamp(30px, 3.5vw, 44px)" }}
              />
              <span className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                {m.label}
              </span>
              <span className="font-mono text-[11px] text-primary">
                {m.detail}
              </span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
