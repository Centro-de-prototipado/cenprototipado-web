"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import type {
  PortfolioCategoryFilter,
  PortfolioProjectMeta,
} from "@/lib/portfolio-types"
import { cn } from "@/lib/utils"

type PortfolioShowcaseProps = {
  projects: PortfolioProjectMeta[]
  categories: PortfolioCategoryFilter[]
}

export function PortfolioShowcase({
  projects,
  categories,
}: PortfolioShowcaseProps) {
  const [activeCategory, setActiveCategory] =
    useState<PortfolioCategoryFilter>("Todos")

  const filteredProjects = useMemo(() => {
    if (activeCategory === "Todos") {
      return projects
    }

    return projects.filter((project) => project.category === activeCategory)
  }, [activeCategory, projects])

  return (
    <section className="relative w-full border-b">
      <div className="border-b px-12 py-8 md:px-16 md:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            {categories.map((category) => (
              <Button
                className="min-w-28"
                key={category}
                onClick={() => setActiveCategory(category)}
                variant={category === activeCategory ? "iso" : "iso-outline"}
              >
                {category}
              </Button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground md:text-right">
            Mostrando {filteredProjects.length} proyecto
            {filteredProjects.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="grid gap-4 p-4 md:p-6 lg:grid-cols-2">
        {filteredProjects.map((project) => (
          <PortfolioCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}

function PortfolioCard({ project }: { project: PortfolioProjectMeta }) {
  return (
    <article className="group iso-panel overflow-hidden transition-all">
      <Link href={`/portafolio/${project.slug}`}>
        <div className="relative h-64 overflow-hidden border-b-2 border-border">
          <Image
            alt={project.title}
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.05]"
            src={project.image}
            width={1400}
            height={900}
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />

          <div className="absolute right-3 bottom-0 left-3 flex translate-y-1/2 items-center justify-between gap-3 opacity-0 transition group-hover:-translate-y-3 group-hover:opacity-100">
            <span className="border-2 border-primary bg-background px-3 py-1 text-xs font-semibold text-foreground shadow-[2px_2px_0_0_var(--primary)]">
              {project.category}
            </span>
            <span className="border-2 border-primary bg-background px-3 py-1 text-xs font-bold text-foreground shadow-[2px_2px_0_0_var(--primary)]">
              ID {project.id}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 md:p-6">
          <h3 className="text-2xl font-black tracking-tight text-balance uppercase transition-colors group-hover:text-primary">
            {project.title}
          </h3>

          <div className="flex flex-wrap gap-2 pt-2">
            {project.techStack.map((item) => (
              <span
                className={cn(
                  "border-2 border-border px-3 py-1 text-[11px] font-bold tracking-widest uppercase",
                  "bg-background text-muted-foreground shadow-[2px_2px_0_0_var(--border)]"
                )}
                key={`${project.id}-${item}`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </article>
  )
}
