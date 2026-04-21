import { TechnologiesSection } from "@/components/sections/technologies-section"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { availableTechnologies } from "@/lib/institutional-data"

export const metadata = {
  title: "Tecnologías | Centro de Prototipado",
  description:
    "Explora el inventario de tecnologías del Centro de Prototipado: fabricación digital, realidad virtual, robótica, BIM y más.",
}

export default function TecnologiasPage() {
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
          className="pointer-events-none absolute top-0 right-0 size-80 translate-x-1/4 -translate-y-1/4 rounded-none bg-primary/8 blur-3xl"
        />

        <div className="relative mx-auto max-w-5xl">
          <p className="inline-flex w-fit items-center rounded-none border bg-card/80 px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase backdrop-blur">
            Equipamiento
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight font-black text-balance md:text-6xl lg:text-7xl">
            Tecnologías del Centro
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">
            Herramientas reales para construir, probar y mostrar prototipos.
            Hardware, software y experiencias de fabricación digital disponibles
            para estudiantes, docentes y comunidades.
          </p>

          {/* Quick inventory pill list */}
          <div className="mt-8 flex flex-wrap gap-2">
            {availableTechnologies.map((tech) => (
              <span
                key={tech}
                className="border bg-card/80 px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-[3px_3px_0_0_rgba(0,0,0,0.06)] backdrop-blur dark:shadow-[3px_3px_0_0_rgba(255,255,255,0.06)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      <TechnologiesSection />
    </>
  )
}
