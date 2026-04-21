"use client"

import { useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

import { DecorIcon } from "@/components/ui/decor-icon"
import { buttonVariants } from "@/components/ui/button"
import type { PortfolioProjectMeta } from "@/lib/portfolio-types"
import { cn } from "@/lib/utils"

export function CasesCarousel({
  projects,
}: {
  projects: PortfolioProjectMeta[]
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  })

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <div className="relative">
      <div className="overflow-hidden px-6 py-6 md:px-8 md:py-8" ref={emblaRef}>
        <div className="-ml-4 flex">
          {projects.map((project) => (
            <div
              key={project.id}
              className="min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-end gap-2 border-t px-6 py-4 md:px-8">
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
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: PortfolioProjectMeta }) {
  return (
    <Link href={`/portafolio/${project.slug}`}>
      <article className="group relative overflow-hidden border bg-background transition-colors hover:bg-muted/10">
        {/* Image */}
        <div className="relative aspect-4/3 overflow-hidden border-b-2 border-border bg-muted">
          <Image
            alt={project.title}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
            src={project.image}
            width={800}
            height={600}
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

          <div className="absolute right-0 bottom-0 left-0 flex translate-y-1/2 items-center gap-2 px-4 opacity-0 transition-all group-hover:bottom-3 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="border-2 border-primary bg-background px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-foreground uppercase shadow-[2px_2px_0_0_var(--primary)]">
              {project.category}
            </span>
            {project.year && (
              <span className="border-2 border-border bg-background px-2.5 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase shadow-[2px_2px_0_0_var(--border)]">
                {project.year}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="relative p-5 md:p-6">
          <DecorIcon
            className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
            position="top-right"
          />
          <h3 className="text-base font-bold tracking-tight text-balance uppercase transition-colors group-hover:text-primary md:text-lg">
            {project.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground md:text-sm">
            {project.summary}
          </p>
          {project.techStack.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {project.techStack.slice(0, 3).map((tech) => (
                <span
                  key={tech}
                  className="border bg-background px-2 py-0.5 text-[10px] font-medium tracking-wider text-muted-foreground uppercase"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
          <DecorIcon
            className="size-2 opacity-0 transition-opacity group-hover:opacity-100"
            position="bottom-left"
          />
        </div>
      </article>
    </Link>
  )
}
