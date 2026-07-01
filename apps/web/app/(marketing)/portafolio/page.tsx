import type { Metadata } from "next"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { getPortfolioProjects, getPortfolioCategories } from "@/lib/notion/portfolio"
import { PortfolioShowcase } from "@/components/portfolio/portfolio-showcase"
import { Reveal } from "@/components/ui/reveal"

export const metadata: Metadata = {
  title: "Portafolio | Centro de Prototipado",
  description:
    "Proyectos desarrollados por el Centro de Prototipado: educación, industria y comunidad con metodologías de prototipado aplicado.",
}

export default async function PortafolioPage() {
  const [projects, categories] = await Promise.all([
    getPortfolioProjects(),
    getPortfolioCategories(),
  ])

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-40">
            <GridPattern className="size-full stroke-foreground/8" height={40} width={40} x={0} />
          </div>
          <div className="absolute -bottom-1/5 left-1/3 h-4/5 w-1/2 opacity-15 blur-[70px]"
            style={{ background: "radial-gradient(ellipse, var(--color-cyan-400), transparent 65%)" }} />
        </div>

        <div className="relative z-1 px-8 py-14 lg:px-16 lg:py-20">
          <Reveal as="span" immediate index={0} className="inline-flex w-fit border bg-card px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Casos del Centro · {projects.length} proyectos
          </Reveal>
          <Reveal as="h1" immediate index={1} className="mt-4 max-w-[14ch] text-4xl font-extrabold leading-[0.98] tracking-[-0.03em] text-foreground lg:text-[clamp(36px,5vw,72px)]">
            Portafolio de{" "}
            <span className="text-primary">proyectos</span>.
          </Reveal>
          <Reveal as="p" immediate index={2} className="mt-4 max-w-[50ch] text-base leading-relaxed text-muted-foreground">
            Casos donde estudiantes, semilleros, docentes y aliados aterrizaron ideas en prototipos funcionales.
          </Reveal>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      <PortfolioShowcase projects={projects} categories={categories} />
    </>
  )
}
