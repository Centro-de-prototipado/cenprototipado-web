import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { DecorIcon } from "@/components/ui/decor-icon"
import { cn } from "@/lib/utils"

const previewHighlights = [
  {
    label: "Liderazgo territorial",
    value: "Caldas y Manizales",
  },
  {
    label: "Trabajo articulado",
    value: "Aulas STEM + Centro",
  },
  {
    label: "Enfoque",
    value: "Innovacion aplicada",
  },
]

export function InstitutionalPreviewSection() {
  return (
    <section className="relative w-full border-b" id="quienes-somos">
      <div className="relative overflow-hidden px-6 py-14 md:px-12 md:py-18 lg:px-16 lg:py-20">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div className="pointer-events-none absolute inset-0 opacity-70">
          <div className="absolute inset-y-0 left-1/2 hidden w-full max-w-6xl -translate-x-1/2 md:block">
            <div className="absolute inset-y-0 left-0 w-px bg-border/70" />
            <div className="absolute inset-y-0 left-8 w-px bg-border/35" />
            <div className="absolute inset-y-0 right-0 w-px bg-border/70" />
            <div className="absolute inset-y-0 right-8 w-px bg-border/35" />
          </div>
          <div className="absolute -top-10 right-6 size-44 rounded-none-none bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-8 left-0 size-48 rounded-none-none bg-foreground/5 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-6xl gap-10 lg:grid-cols-1">
          <div className={cn("space-y-6")}>
            <p className="inline-flex w-fit items-center rounded-none-none border bg-card/80 px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase backdrop-blur">
              Quienes somos
            </p>
            <div className="max-w-4xl space-y-4">
              <h2 className="text-3xl font-bold text-balance md:text-5xl lg:text-6xl lg:font-black">
                Un centro para idear, prototipar y mostrar tecnologia con una
                estetica clara y directa.
              </h2>
              <p className="max-w-2xl text-sm text-balance text-muted-foreground md:text-base">
                El Centro de Prototipado trabaja con Aulas STEM, fabricacion
                digital y experiencias inmersivas para convertir ideas en
                soluciones reales con impacto educativo, social y empresarial.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {previewHighlights.map((highlight) => (
                <article
                  key={highlight.label}
                  className={cn(
                    "border bg-card/80 p-4 shadow-[8px_8px_0_0_rgba(0,0,0,0.08)] backdrop-blur",
                    "dark:shadow-[8px_8px_0_0_rgba(255,255,255,0.08)]"
                  )}
                >
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">
                    {highlight.label}
                  </p>
                  <p className="mt-2 text-sm font-medium text-pretty">
                    {highlight.value}
                  </p>
                </article>
              ))}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "w-full sm:w-auto"
                )}
                href="/institucional"
              >
                Ver pagina institucional
              </Link>
              <Link
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "w-full sm:w-auto"
                )}
                href="/tecnologias"
              >
                Explorar tecnologias
              </Link>
            </div>
          </div>
        </div>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
