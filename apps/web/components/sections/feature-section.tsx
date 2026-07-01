import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Reveal } from "@/components/ui/reveal"
import { buttonVariants } from "@/components/ui/button"
import type { Technology } from "@/lib/institutional-data"
import { cn } from "@/lib/utils"

export function FeatureSection({
  technologies,
}: {
  technologies: Technology[]
}) {
  if (technologies.length === 0) return null

  const shown = technologies.slice(0, 4)
  const extra = Math.max(technologies.length - shown.length, 0)

  return (
    <section className="relative w-full border-b" id="tecnologias-resumen">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      {/* Header */}
      <Reveal as="div" className="px-8 py-14 lg:px-16 lg:py-16">
        <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
          Tecnologías del centro
        </span>
        <h2 className="mt-3.5 max-w-2xl text-3xl font-extrabold leading-[1.05] tracking-[-0.015em] text-balance text-foreground md:text-5xl">
          Equipamiento real para construir, probar y mostrar.
        </h2>
      </Reveal>

      {/* Tech grid */}
      <div className="grid grid-cols-2 border-t md:grid-cols-4">
        {shown.map((tech, i) => (
          <TechCard key={tech.title} tech={tech} index={i} />
        ))}
      </div>

      {/* Footer row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t px-8 py-5 lg:px-16">
        <p className="text-xs text-muted-foreground">
          +{extra} tecnologías adicionales en el inventario.
        </p>
        <div className="flex gap-2">
          <Link
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}
            href="/contacto"
          >
            Reservar equipo
          </Link>
          <Link
            className={cn(buttonVariants({ size: "sm" }), "shrink-0")}
            href="/tecnologias"
          >
            Ver todas <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </div>
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}

function TechCard({
  tech,
  index,
}: {
  tech: Technology
  index: number
}) {
  return (
    <Reveal
      as="article"
      index={index}
      className={cn(
        "group relative flex flex-col gap-3 overflow-hidden border-r border-b bg-card p-6",
        "transition-colors hover:bg-card/80"
      )}
      style={{ margin: "-1px -1px 0 0" }}
    >
      <DecorIcon className="size-2 opacity-0 transition-opacity group-hover:opacity-100" position="top-left" />
      <DecorIcon className="size-2 opacity-0 transition-opacity group-hover:opacity-100" position="top-right" />

      {/* Grid pattern that appears on hover */}
      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full opacity-0 transition-opacity group-hover:opacity-100 mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
        <GridPattern
          className="absolute inset-0 size-full stroke-foreground/8"
          height={24}
          width={24}
          x={12}
        />
      </div>

      <p className="relative text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {tech.subtitle}
      </p>
      <h3 className="relative text-base font-bold text-foreground leading-tight">
        {tech.title}
      </h3>
      <p className="relative text-xs leading-relaxed text-muted-foreground flex-1">
        {tech.description}
      </p>

      <DecorIcon className="size-2 opacity-0 transition-opacity group-hover:opacity-100" position="bottom-left" />
      <DecorIcon className="size-2 opacity-0 transition-opacity group-hover:opacity-100" position="bottom-right" />
    </Reveal>
  )
}
