"use client"

import { useCallback } from "react"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon, ArrowRightIcon } from "lucide-react"

import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { buttonVariants } from "@/components/ui/button"
import { technologySpotlights } from "@/lib/institutional-data"
import { cn } from "@/lib/utils"

export function FeatureSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="relative w-full border-b" id="tecnologias-resumen">
      <div className="relative px-12 py-16 md:px-16 md:py-20">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex w-fit items-center rounded-none border bg-card px-3 py-1 text-xs tracking-[0.24em] text-muted-foreground uppercase">
            Equipamiento
          </p>
          <h2 className="mt-4 text-3xl font-bold text-balance md:text-5xl lg:font-black">
            Tecnologías para construir, probar y mostrar.
          </h2>
          <p className="mt-4 text-sm text-balance text-muted-foreground md:text-base">
            Contamos con hardware, software y espacios para fabricación digital,
            experiencias inmersivas e ingeniería aplicada.
          </p>
        </div>
      </div>

      <div className="relative border-t">
        <div
          className="overflow-hidden px-6 py-6 md:px-8 md:py-8"
          ref={emblaRef}
        >
          <div className="-ml-4 flex">
            {technologySpotlights.map((tech) => (
              <div
                key={tech.title}
                className="min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
              >
                <TechCard tech={tech} />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation + CTA */}
        <div className="flex items-center justify-between border-t px-6 py-4 md:px-8">
          <p className="hidden text-xs text-muted-foreground md:block">
            Impresoras 3D · Cortadora CNC · Cortadora láser · Brazo robótico ·
            Gafas VR · Scanner 3D · Plotter · Microcontroladores
          </p>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={scrollPrev}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-9"
              )}
              aria-label="Anterior"
            >
              <ChevronLeftIcon className="size-4" />
            </button>
            <button
              onClick={scrollNext}
              className={cn(
                buttonVariants({ variant: "outline", size: "icon" }),
                "size-9"
              )}
              aria-label="Siguiente"
            >
              <ChevronRightIcon className="size-4" />
            </button>
            <Link
              className={cn(buttonVariants({ variant: "outline" }), "shrink-0")}
              href="/tecnologias"
            >
              Ver catálogo completo <ArrowRightIcon data-icon="inline-end" />
            </Link>
          </div>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </div>
    </section>
  )
}

function TechCard({ tech }: { tech: (typeof technologySpotlights)[number] }) {
  return (
    <div className="group relative overflow-hidden border bg-background px-6 py-8 transition-colors hover:bg-muted/30 md:px-8 md:py-10">
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="top-left"
      />
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="top-right"
      />

      <div className="pointer-events-none absolute top-0 left-1/2 -mt-2 -ml-20 size-full mask-[radial-gradient(farthest-side_at_top,white,transparent)]">
        <GridPattern
          className="absolute inset-0 size-full stroke-foreground/10"
          height={40}
          width={40}
          x={20}
        />
      </div>

      <p className="relative text-[10px] font-medium tracking-[0.2em] text-muted-foreground/70 uppercase">
        {tech.subtitle}
      </p>
      <h3 className="relative mt-2 text-sm font-semibold md:text-base">
        {tech.title}
      </h3>
      <p className="relative z-10 mt-2 text-xs font-light text-muted-foreground">
        {tech.description}
      </p>

      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="bottom-left"
      />
      <DecorIcon
        className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
        position="bottom-right"
      />
    </div>
  )
}
