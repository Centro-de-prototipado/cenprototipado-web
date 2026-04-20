import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/header"
import { PortfolioShowcase } from "@/components/portfolio/portfolio-showcase"
import { DecorIcon } from "@/components/ui/decor-icon"
import {
  getPortfolioCategories,
  getPortfolioProjects,
} from "@/lib/portfolio-data"

export default async function PortfolioPage() {
  const [projects, categories] = await Promise.all([
    getPortfolioProjects(),
    getPortfolioCategories(),
  ])
  const featuredCount = projects.filter((project) => project.featured).length

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute inset-y-0 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 md:block">
          <div className="absolute inset-y-0 -left-4 w-px bg-border/80" />
          <div className="absolute inset-y-0 -left-8 w-px bg-border/40" />
          <div className="absolute inset-y-0 -right-4 w-px bg-border/80" />
          <div className="absolute inset-y-0 -right-8 w-px bg-border/40" />
        </div>
      </div>

      <div className="mx-auto">
        <Header />

        <main className="relative mx-auto w-full max-w-6xl bg-background/50">
          <div className="relative z-10 border-x min-h-screen">
            <section className="relative border-b px-12 py-16 md:px-16 md:py-20">
              <DecorIcon className="size-3" position="top-left" />
              <DecorIcon className="size-3" position="top-right" />

              <div className="mx-auto flex max-w-5xl flex-col gap-5 text-center">
                <p className="mx-auto inline-flex rounded-none-none border bg-card px-3 py-1 text-xs font-semibold tracking-widest text-muted-foreground uppercase">
                  Centro de prototipado
                </p>
                <h1 className="text-4xl font-bold text-balance md:text-6xl lg:font-black">
                  Portafolio completo de proyectos
                </h1>
                <p className="mx-auto max-w-3xl text-sm text-muted-foreground md:text-base">
                  Conoce cada iniciativa en detalle: reto, solucion, tecnologias
                  aplicadas y resultados medibles.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-muted-foreground md:text-sm">
                  <span className="rounded-none-none border bg-background px-3 py-1">
                    {projects.length} proyectos documentados
                  </span>
                  <span className="rounded-none-none border bg-background px-3 py-1">
                    {featuredCount} destacados
                  </span>
                  <span className="rounded-none-none border bg-background px-3 py-1">
                    {categories.length - 1} categorias de trabajo
                  </span>
                </div>
              </div>

              <DecorIcon className="size-3" position="bottom-left" />
              <DecorIcon className="size-3" position="bottom-right" />
            </section>

            <PortfolioShowcase categories={categories} projects={projects} />
          </div>
        </main>

        <div className="mt-20">
          <Footer />
        </div>
      </div>
    </>
  )
}
