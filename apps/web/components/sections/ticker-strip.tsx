import { Reveal } from "@/components/ui/reveal"
import type { Technology } from "@/lib/institutional-data"

export function TickerStrip({ technologies }: { technologies: Technology[] }) {
  if (technologies.length === 0) return null

  const names = technologies.map((t) => t.title)
  const items = [...names, ...names]
  return (
    <Reveal
      as="div"
      className="relative overflow-hidden border-b bg-muted/40 dark:bg-card"
      style={{ padding: "10px 0" }}
      aria-hidden="true"
    >
      <div
        className="flex gap-10 whitespace-nowrap"
        style={{
          width: "max-content",
          animation: "ticker 55s linear infinite",
        }}
      >
        {items.map((tech, i) => (
          <span
            key={i}
            className="inline-flex shrink-0 items-center gap-2.5 font-mono text-xs tracking-[0.06em] text-muted-foreground"
          >
            <span className="text-primary font-bold">+</span>
            {tech}
          </span>
        ))}
      </div>
      <style>{`@keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </Reveal>
  )
}
