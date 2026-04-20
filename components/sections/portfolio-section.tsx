import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { DecorIcon } from "@/components/ui/decor-icon"
import { SectionCarousel } from "@/components/ui/section-carousel"
import { getFeaturedPortfolioProjects } from "@/lib/portfolio-data"

export async function PortfolioSection() {
  const featuredPortfolioProjects = await getFeaturedPortfolioProjects()

  return (
    <section className="relative w-full border-b">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      <div className="border-b px-12 py-16 md:px-16 md:py-18">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 text-center">
          <p className="inline-flex rounded-none-none border bg-card px-3 py-1 text-xs tracking-wide text-muted-foreground uppercase">
            Proyectos reales en accion
          </p>
          <h2 className="max-w-4xl text-3xl font-bold text-balance md:text-5xl lg:text-6xl lg:font-black">
            Descubre como convertimos ideas en resultados medibles
          </h2>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            El portafolio del Centro integra casos de educacion, industria y
            comunidad con metodologias de prototipado, validacion y mejora
            continua.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs text-muted-foreground md:text-sm">
            <span className="rounded-none-none border bg-background px-3 py-1">
              6 proyectos activos
            </span>
            <span className="rounded-none-none border bg-background px-3 py-1">
              3 lineas de impacto
            </span>
            <span className="rounded-none-none border bg-background px-3 py-1">
              Contenido detallado por proyecto
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <SectionCarousel
          description="Carrusel de proyectos destacados con acceso directo a la ficha completa."
          title="Proyectos destacados"
        >
          {featuredPortfolioProjects.map((project, index) => (
            <Link href={`/portafolio/${project.slug}`} key={project.id}>
              <article className="group min-w-[20rem] snap-start overflow-hidden iso-panel md:min-w-[24rem]">
                <div
                  className="relative overflow-hidden border-b-2 border-border"
                  style={{ aspectRatio: "4 / 3" }}
                >
                  <Image
                    alt={project.title}
                    className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
                    src={project.image}
                    width={1200}
                    height={900}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute right-3 bottom-0 left-3 flex flex-wrap items-center gap-2 translate-y-1/2 opacity-0 transition group-hover:opacity-100 group-hover:-translate-y-3">
                    <span className="border-2 border-primary bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-[2px_2px_0_0_var(--primary)]">
                      {index === 0 ? "Destacado" : "Serie"}
                    </span>
                    <span className="border-2 border-primary bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-[2px_2px_0_0_var(--primary)]">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-5 flex items-center justify-between">
                  <h3 className="text-xl font-bold uppercase tracking-tight text-balance group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                </div>
              </article>
            </Link>
          ))}
        </SectionCarousel>
      </div>

      <div className="border-t px-12 py-10 md:px-16 md:py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 text-center md:flex-row md:justify-between md:text-left">
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Mira todos los proyectos, su proceso y resultados en la pagina
            completa del portafolio.
          </p>
          <Link href="/portafolio">
            <Button size="iso" variant="iso">Ver portafolio completo</Button>
          </Link>
        </div>
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
