"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { SearchIcon, GridIcon, ListIcon, ArrowRightIcon } from "lucide-react"

import { DecorIcon } from "@/components/ui/decor-icon"
import { Reveal } from "@/components/ui/reveal"
import type { PortfolioCategoryFilter, PortfolioProjectMeta } from "@/lib/portfolio-types"
import { cn } from "@/lib/utils"

type Props = {
  projects: PortfolioProjectMeta[]
  categories: PortfolioCategoryFilter[]
}

export function PortfolioShowcase({ projects, categories }: Props) {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategoryFilter>("Todos")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    return projects
      .filter((p) => activeCategory === "Todos" || p.categories.includes(activeCategory))
      .filter((p) => !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.summary.toLowerCase().includes(query.toLowerCase()))
  }, [projects, activeCategory, query])

  return (
    <>
      {/* Sticky controls */}
      <div
        className="sticky top-16 z-20 border-b backdrop-blur-md"
        style={{ background: "color-mix(in srgb, var(--color-background) 92%, transparent)" }}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 px-8 py-3 lg:px-16">
          {/* Category filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "h-7 px-3 text-xs font-medium border transition-colors",
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-transparent text-muted-foreground border-border hover:border-primary hover:text-primary"
                )}
              >
                {cat}
                <span className="ml-1.5 font-mono text-[10px] opacity-55">
                  {cat === "Todos" ? projects.length : projects.filter((p) => p.categories.includes(cat)).length}
                </span>
              </button>
            ))}
          </div>

          {/* Search + view toggle + count */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar…"
                className="h-8 w-40 border bg-muted/20 pl-8 pr-3 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary"
              />
            </div>
            <div className="flex border">
              <button
                onClick={() => setView("grid")}
                className={cn("flex h-8 w-8 items-center justify-center transition-colors", view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
                aria-label="Vista grid"
              >
                <GridIcon className="size-3.5" />
              </button>
              <button
                onClick={() => setView("list")}
                className={cn("flex h-8 w-8 items-center justify-center transition-colors", view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
                aria-label="Vista lista"
              >
                <ListIcon className="size-3.5" />
              </button>
            </div>
            <span className="font-mono text-[11px] text-muted-foreground whitespace-nowrap">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <section className="flex flex-col items-center justify-center gap-3 px-8 py-20 text-center">
          <p className="text-muted-foreground">Sin resultados para tu búsqueda.</p>
          <button onClick={() => { setQuery(""); setActiveCategory("Todos") }} className="text-xs text-primary hover:underline">
            Limpiar filtros
          </button>
        </section>
      ) : view === "grid" ? (
        <GridView projects={filtered} />
      ) : (
        <ListView projects={filtered} />
      )}
    </>
  )
}

function GridView({ projects }: { projects: PortfolioProjectMeta[] }) {
  return (
    <section className="border-b px-8 py-12 lg:px-16">
      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(290px, 1fr))" }}>
        {projects.map((p, i) => (
          <ProjectCard key={p.id} project={p} index={i} />
        ))}
      </div>
    </section>
  )
}

function ListView({ projects }: { projects: PortfolioProjectMeta[] }) {
  return (
    <section className="border-b px-8 py-8 lg:px-16">
      <div className="border bg-card">
        {projects.map((p, i) => (
          <Reveal as="div" key={p.id} index={i}>
            <Link
              href={`/portafolio/${p.slug}`}
              className="group grid items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/20"
              style={{
                gridTemplateColumns: "80px minmax(0,1.6fr) minmax(0,1fr) auto",
                borderBottom: i < projects.length - 1 ? "1px solid var(--color-border)" : undefined,
              }}
            >
              <div className="relative h-16 w-20 overflow-hidden bg-black">
                <Image src={p.image} alt={p.title} fill className="object-cover" sizes="80px" />
              </div>
              <div>
                <p className="m-0 text-sm font-bold text-foreground group-hover:text-primary transition-colors">{p.title}</p>
                <p className="m-0 mt-1 text-xs text-muted-foreground line-clamp-1">{p.summary}</p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="border px-2 py-0.5 text-[10px] text-muted-foreground">{p.categories.join(" · ")}</span>
                <span className="border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{p.year}</span>
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground" />
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project, index }: { project: PortfolioProjectMeta; index: number }) {
  return (
    <Reveal as="article" index={index} className="group relative flex flex-col overflow-hidden border bg-card transition-colors hover:bg-card/80 hover:border-border/80">
      <DecorIcon className="size-2 opacity-0 transition-opacity group-hover:opacity-100" position="top-left" />
      <DecorIcon className="size-2 opacity-0 transition-opacity group-hover:opacity-100" position="bottom-right" />

      <Link href={`/portafolio/${project.slug}`}>
        {/* Image */}
        <div className="relative overflow-hidden border-b bg-black" style={{ aspectRatio: "4/3" }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent 55%)" }} />
          {/* Tags on hover */}
          <div className="absolute bottom-3 left-3.5 flex gap-1.5 opacity-0 translate-y-2 transition-all group-hover:opacity-100 group-hover:translate-y-0">
            <span className="border-2 border-primary bg-card px-2 py-0.5 text-[10px] font-bold uppercase" style={{ boxShadow: "2px 2px 0 0 var(--color-primary)" }}>
              {project.categories.join(" · ")}
            </span>
            {project.featured && (
              <span className="border-2 border-border bg-card px-2 py-0.5 text-[10px] font-bold" style={{ boxShadow: "2px 2px 0 0 var(--color-border)" }}>★</span>
            )}
            <span className="border-2 border-border bg-card px-2 py-0.5 text-[10px] font-bold" style={{ boxShadow: "2px 2px 0 0 var(--color-border)" }}>
              {project.year}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-2 p-5">

          <div className="flex items-center justify-between gap-2">
            <h3 className="m-0 text-base font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
              {project.title}
            </h3>
            <span className="font-mono text-[10px] text-muted-foreground">{project.year}</span>
          </div>

          <p className="m-0 text-xs leading-relaxed text-muted-foreground line-clamp-2">{project.summary}</p>
          {/*<div className="mt-1 flex flex-wrap gap-1.5">
            {project.techStack.slice(0, 3).map((t) => (
              <span key={t} className="border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{t}</span>
            ))}
          </div>*/}
        </div>
      </Link>
    </Reveal>
  )
}
