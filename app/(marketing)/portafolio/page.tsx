import { PortfolioShowcase } from "@/components/portfolio/portfolio-showcase"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import {
  getPortfolioProjects,
  getPortfolioCategories,
} from "@/lib/portfolio-data"

export const metadata = {
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
      <section className="relative overflow-hidden border-b px-12 py-20 md:px-16 md:py-28">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div className="pointer-events-none absolute inset-0 opacity-30">
          <GridPattern
            className="absolute inset-0 size-full stroke-foreground/15"
            height={40}
            width={40}
            x={0}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 left-0 size-80 -translate-x-1/4 translate-y-1/4 rounded-none bg-primary/8 blur-3xl"
        />

        <div className="relative mx-auto max-w-5xl">
          <p className="inline-flex w-fit items-center rounded-none border bg-card/80 px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase backdrop-blur">
            Proyectos reales
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight font-black text-balance md:text-6xl lg:text-7xl">
            Portafolio
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">
            Casos de educación, industria y comunidad desarrollados con
            metodologías de prototipado, validación y mejora continua.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { value: `${projects.length}`, label: "proyectos en total" },
              {
                value: `${categories.length - 1}`,
                label: "líneas de impacto",
              },
              {
                value: projects.filter((p) => p.featured).length.toString(),
                label: "proyectos destacados",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="border bg-card/80 px-4 py-3 shadow-[4px_4px_0_0_rgba(0,0,0,0.06)] backdrop-blur dark:shadow-[4px_4px_0_0_rgba(255,255,255,0.06)]"
              >
                <span className="text-xl font-black">{s.value}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      <PortfolioShowcase projects={projects} categories={categories} />
    </>
  )
}
