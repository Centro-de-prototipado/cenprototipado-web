import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { DecorIcon } from "@/components/ui/decor-icon"
import { cn } from "@/lib/utils"
import { ArrowRightIcon } from "lucide-react"

const stats = [
  { value: "+10", label: "Tecnologías disponibles" },
  { value: "9+", label: "Proyectos desarrollados" },
  { value: "Manizales · Caldas", label: "Impacto territorial" },
  { value: "UNAL Manizales", label: "Sede institucional" },
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
          <div className="absolute -top-10 right-6 size-44 rounded-none bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-8 left-0 size-48 rounded-none bg-foreground/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl space-y-8">
          <div className="space-y-4">
            <p className="inline-flex w-fit items-center rounded-none border bg-card/80 px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase backdrop-blur">
              Quiénes somos
            </p>
            <h2 className="max-w-4xl text-3xl font-bold text-balance md:text-5xl lg:text-6xl lg:font-black">
              Un espacio donde las ideas se convierten en prototipos reales.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 text-sm text-muted-foreground md:text-base">
              <p>
                El Centro de Prototipado es un espacio diseñado para fomentar la
                innovación, el aprendizaje práctico y el desarrollo de
                soluciones tecnológicas. Aquí, estudiantes, docentes y
                comunidades pueden transformar ideas en prototipos reales
                utilizando herramientas de fabricación digital y tecnologías
                emergentes.
              </p>
              <p>
                Nuestro objetivo es fortalecer la creatividad, la
                experimentación y el pensamiento innovador a través del uso de
                tecnologías que permiten diseñar, fabricar y probar nuevas
                ideas.
              </p>
              <p>
                Además, apoyamos los procesos educativos de las{" "}
                <strong className="font-medium text-foreground">
                  Aulas STEM del municipio de Manizales y del departamento de
                  Caldas
                </strong>
                , contribuyendo al fortalecimiento del aprendizaje en ciencia,
                tecnología, ingeniería y matemáticas mediante experiencias
                prácticas e innovadoras.
              </p>
              <p className="text-xs text-muted-foreground/70">
                Dirección de Investigación y Extensión – DIMA · Centro de
                Prototipado · Sede Manizales
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 self-start">
              {stats.map((stat) => (
                <article
                  key={stat.label}
                  className={cn(
                    "border bg-card/80 p-4 shadow-[8px_8px_0_0_rgba(0,0,0,0.08)] backdrop-blur",
                    "dark:shadow-[8px_8px_0_0_rgba(255,255,255,0.08)]"
                  )}
                >
                  <p className="text-lg font-bold text-foreground md:text-xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.label}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
              href="/centro"
            >
              Conocer el Centro <ArrowRightIcon data-icon="inline-end" />
            </Link>
            <Link
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "w-full sm:w-auto"
              )}
              href="/tecnologias"
            >
              Ver tecnologías
            </Link>
          </div>
        </div>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
