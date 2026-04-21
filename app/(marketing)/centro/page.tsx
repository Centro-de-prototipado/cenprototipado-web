import { InstitutionalSection } from "@/components/sections/institutional-section"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"

export const metadata = {
  title: "Centro de Prototipado | Quiénes somos",
  description:
    "Conoce la misión, visión, equipo y articulación STEM del Centro de Prototipado de la Universidad Nacional sede Manizales.",
}

export default function CentroPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b px-12 py-20 md:px-16 md:py-28">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        {/* Background grid */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <GridPattern
            className="absolute inset-0 size-full stroke-foreground/10"
            height={40}
            width={40}
            x={0}
          />
        </div>

        {/* Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-none bg-primary/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          <p className="inline-flex w-fit items-center rounded-none border bg-card/80 px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase backdrop-blur">
            Institucional · DIMA · UNAL Manizales
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight font-black text-balance md:text-6xl lg:text-7xl">
            Centro de Prototipado
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground md:text-base">
            Un espacio de innovación abierto donde estudiantes, docentes y
            comunidades convierten ideas en soluciones reales mediante
            fabricación digital y tecnologías emergentes.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { value: "+10", label: "Tecnologías" },
              { value: "12+", label: "Proyectos" },
              { value: "10", label: "Personas en el equipo" },
              { value: "2", label: "Municipios impactados" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border bg-card/80 p-4 shadow-[6px_6px_0_0_rgba(0,0,0,0.07)] backdrop-blur dark:shadow-[6px_6px_0_0_rgba(255,255,255,0.07)]"
              >
                <p className="text-2xl font-black text-foreground">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      <InstitutionalSection />
    </>
  )
}
