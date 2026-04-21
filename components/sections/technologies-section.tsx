import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { SectionCarousel } from "@/components/ui/section-carousel"
import { cn } from "@/lib/utils"
import {
  availableTechnologies,
  technologySpotlights,
} from "@/lib/institutional-data"
import {
  CpuIcon,
  Layers3Icon,
  ScanSearchIcon,
  SparklesIcon,
  SquareStackIcon,
} from "lucide-react"

const techMeta = [
  {
    title: "Fabricacion digital",
    description: "Impresion, corte y escaneo para validar ideas rapido.",
    icon: CpuIcon,
  },
  {
    title: "Prototipos inmersivos",
    description: "Realidad virtual y mixta para ensenar, simular y evaluar.",
    icon: SparklesIcon,
  },
  {
    title: "Ingenieria visual",
    description: "Modelado, BIM y captura digital para proyectos tecnicos.",
    icon: ScanSearchIcon,
  },
  {
    title: "Aprendizaje aplicado",
    description: "Recursos para equipos, aulas y comunidades que construyen.",
    icon: Layers3Icon,
  },
]

export function TechnologiesSection() {
  return (
    <section className="relative w-full border-b" id="tecnologias">
      <div className="relative overflow-hidden px-6 py-14 md:px-12 md:py-18 lg:px-16 lg:py-20">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div className="pointer-events-none absolute inset-0 opacity-75">
          <div className="absolute inset-y-0 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 md:block">
            <div className="absolute inset-y-0 left-0 w-px bg-border/70" />
            <div className="absolute inset-y-0 left-8 w-px bg-border/35" />
            <div className="absolute inset-y-0 right-0 w-px bg-border/70" />
            <div className="absolute inset-y-0 right-8 w-px bg-border/35" />
          </div>
          <div className="rounded-none-none absolute top-0 -right-12 size-56 bg-primary/12 blur-3xl" />
          <div className="rounded-none-none absolute bottom-0 left-0 size-64 bg-foreground/5 blur-3xl" />
        </div>

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8">
          <div className="space-y-5">
            <p className="rounded-none-none inline-flex w-fit border bg-card/80 px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase backdrop-blur">
              Tecnologias del centro
            </p>
            <h2 className="max-w-2xl text-3xl font-bold text-balance md:text-5xl lg:text-6xl lg:font-black">
              Herramientas reales para construir, probar y mostrar prototipos.
            </h2>
            <p className="max-w-xl text-sm text-balance text-muted-foreground md:text-base">
              Reemplazamos el bloque de features por un mapa concreto de
              capacidades del Centro de Prototipado: hardware, software y
              experiencias que ya están en uso.
            </p>
            <Link
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full sm:w-auto"
              )}
              href="/tecnologias"
            >
              Ver pagina completa
            </Link>
          </div>

          <SectionCarousel title="Capas funcionales del centro">
            {techMeta.map((item) => (
              <article
                className="group relative min-w-[16rem] snap-start overflow-hidden border bg-background p-5 md:min-w-[18rem]"
                key={item.title}
              >
                <div className="absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100">
                  <GridPattern
                    className="absolute inset-0 size-full stroke-foreground/12"
                    height={32}
                    width={32}
                    x={16}
                  />
                </div>
                <div className="relative flex items-center gap-3">
                  <div className="border bg-card p-2">
                    <item.icon className="size-5 text-foreground/80" />
                  </div>
                  <h3 className="text-base font-medium">{item.title}</h3>
                </div>
                <p className="relative mt-4 text-sm text-muted-foreground">
                  {item.description}
                </p>
                <div className="relative mt-5 h-1 w-full bg-foreground/10">
                  <div className="h-full w-2/3 bg-foreground/40" />
                </div>
                <DecorIcon
                  className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
                  position="bottom-right"
                />
              </article>
            ))}
          </SectionCarousel>
        </div>
      </div>

      <div className="border-t">
        <div className="px-6 py-6 md:px-12 md:py-8 lg:px-16">
          <SectionCarousel title="Tecnologias destacadas">
            {technologySpotlights.slice(0, 4).map((technology) => (
              <article
                className="relative min-w-[20rem] snap-start overflow-hidden border bg-card px-6 py-8 md:min-w-[24rem]"
                key={technology.title}
              >
                <DecorIcon className="size-2" position="top-left" />
                <DecorIcon className="size-2" position="top-right" />
                <div className="pointer-events-none absolute inset-0 opacity-50">
                  <GridPattern
                    className="absolute inset-0 size-full stroke-foreground/15"
                    height={40}
                    width={40}
                    x={20}
                  />
                </div>
                <p className="relative text-xs tracking-[0.24em] text-muted-foreground uppercase">
                  {technology.subtitle}
                </p>
                <h3 className="relative mt-3 text-lg font-semibold text-balance">
                  {technology.title}
                </h3>
                <p className="relative mt-3 text-sm text-muted-foreground">
                  {technology.description}
                </p>
                <div className="relative mt-5 flex flex-wrap gap-2">
                  {technology.applications.slice(0, 3).map((application) => (
                    <span
                      className="border bg-background px-2.5 py-1 text-[11px] text-muted-foreground"
                      key={`${technology.title}-${application}`}
                    >
                      {application}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </SectionCarousel>
        </div>
      </div>

      <div className="border-t px-6 py-8 md:px-12 lg:px-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-muted-foreground">
            Inventario base del centro: {availableTechnologies.join(" · ")}
          </p>
          <Link
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "justify-start px-0 lg:justify-center"
            )}
            href="/tecnologias"
          >
            <span className="inline-flex items-center gap-2">
              <SquareStackIcon className="size-4" />
              Explorar todo el catalogo
            </span>
          </Link>
        </div>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
