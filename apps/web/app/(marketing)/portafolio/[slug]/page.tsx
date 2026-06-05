import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon, BuildingIcon } from "lucide-react"
import type { Metadata } from "next"

import { DecorIcon } from "@/components/ui/decor-icon"
import { Reveal } from "@/components/ui/reveal"
import { Markdown } from "@/components/ui/markdown"
import { Button, buttonVariants } from "@/components/ui/button"
import { getPortfolioProjectBySlug, getPortfolioProjects, getPortfolioSlugs } from "@/lib/notion/portfolio"
import { cn } from "@/lib/utils"

export async function generateStaticParams() {
  const slugs = await getPortfolioSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = await getPortfolioProjectBySlug(slug)
  if (!project) return {}
  return { title: `${project.title} | Portafolio`, description: project.summary }
}

const processSteps = [
  { n: "01", t: "Diagnóstico",       d: "Entendimiento del reto con el equipo." },
  { n: "02", t: "Conceptualización", d: "Maquetación, definición de stack, alcance." },
  { n: "03", t: "Fabricación",       d: "Implementación con las tecnologías del Centro." },
  { n: "04", t: "Validación",        d: "Pruebas, ajustes y entrega de resultados." },
]

export default async function PortfolioProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const [project, allProjects] = await Promise.all([
    getPortfolioProjectBySlug(slug),
    getPortfolioProjects(),
  ])

  if (!project) notFound()

  const related = allProjects
    .filter((p) => p.categories.some((c) => project.categories.includes(c)) && p.slug !== project.slug)
    .slice(0, 3)

  return (
    <>
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center justify-between border-b bg-card px-8 py-3 lg:px-16">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <span className="opacity-40">/</span>
          <Link href="/portafolio" className="hover:text-foreground transition-colors">Portafolio</Link>
          <span className="opacity-40">/</span>
          <span className="font-medium text-foreground">{project.title}</span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{project.year}</span>
      </nav>

      {/* ── Hero image full-bleed ── */}
      <section className="relative overflow-hidden border-b">
        <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "21/8", minHeight: 280 }}>
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)" }}
          />
          <Reveal immediate className="absolute bottom-8 left-8 right-1/2 lg:left-16">
            <div className="mb-3 flex flex-wrap gap-2">
              <span className="border-2 border-primary bg-card/90 px-2.5 py-0.5 text-[10px] font-bold tracking-[0.14em] uppercase" style={{ boxShadow: "2px 2px 0 0 var(--color-primary)" }}>
                {project.categories.join(" · ")}
              </span>
              {project.featured && (
                <span className="border-2 border-border bg-card/90 px-2.5 py-0.5 text-[10px] font-bold" style={{ boxShadow: "2px 2px 0 0 var(--color-border)" }}>★ Destacado</span>
              )}
              <span className="border-2 border-border bg-card/90 px-2.5 py-0.5 text-[10px] font-bold" style={{ boxShadow: "2px 2px 0 0 var(--color-border)" }}>
                {project.year}
              </span>
            </div>
            <h1 className="m-0 font-extrabold leading-[1.05] tracking-[-0.025em] text-white text-balance" style={{ fontSize: "clamp(28px, 4.5vw, 56px)" }}>
              {project.title}
            </h1>
            <p className="mt-3 max-w-[48ch] text-base leading-relaxed text-white/75">{project.summary}</p>
          </Reveal>
        </div>
      </section>

      {/* ── Meta bar ── */}
      <section className="border-b bg-card">
        <div className="flex flex-wrap items-center justify-between gap-4 px-8 py-4 lg:px-16">
          {/*<div className="flex flex-wrap items-center gap-3">
            {project.techStack.map((t) => (
              <span key={t} className="border px-2 py-0.5 font-mono text-[10px] text-muted-foreground">{t}</span>
            ))}
          </div>*/}
          <Link href="/contacto">
            <Button>Replicar este proyecto <ArrowRightIcon data-icon="inline-end" /></Button>
          </Link>
        </div>
      </section>

      {/* ── Reto / Solución / Resultados ── */}
      <section className="relative border-b">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />
        <div className="grid grid-cols-1 md:grid-cols-3">
          {[
            { label: "Reto",       body: project.challenge, list: null },
            { label: "Solución",   body: project.solution,  list: null },
            { label: "Resultados", body: null, list: project.outcomes },
          ].map((s, i) => (
            <Reveal
              as="article"
              key={s.label}
              index={i}
              className="relative flex flex-col gap-3 p-8 transition-colors hover:bg-muted/20 lg:p-10"
              style={{ borderRight: i < 2 ? "1px solid var(--color-border)" : undefined, borderBottom: "none" }}
            >
              <DecorIcon className="size-2" position="top-left" />
              <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">{s.label}</span>
              {s.body && (
                <p className="m-0 text-base font-semibold leading-snug tracking-[-0.005em] text-foreground">{s.body}</p>
              )}
              {s.list && (
                <ul className="m-0 list-none p-0 flex flex-col gap-2">
                  {s.list.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 shrink-0 text-primary">→</span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── Contenido extendido (cuerpo markdown de Notion) ── */}
      {project.content.trim() && (
        <section className="relative border-b px-8 py-12 lg:px-16">
          <DecorIcon className="size-3" position="top-left" />
          <DecorIcon className="size-3" position="top-right" />
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Detalle
          </span>
          <div className="mt-4">
            <Markdown>{project.content}</Markdown>
          </div>
          <DecorIcon className="size-3" position="bottom-left" />
          <DecorIcon className="size-3" position="bottom-right" />
        </section>
      )}

      {/* ── Proceso ── */}
      <section className="relative border-b px-8 py-12 lg:px-16">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />
        <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">Proceso</span>
        <h2 className="mt-2.5 mb-8 text-2xl font-extrabold leading-[1.05] tracking-[-0.015em] text-foreground">
          Cómo se construyó el prototipo.
        </h2>
        <ol className="grid list-none grid-cols-2 border p-0 m-0 md:grid-cols-4">
          {processSteps.map((step, i) => (
            <li
              key={step.n}
              className="flex flex-col gap-2.5 bg-card p-6 transition-colors hover:bg-muted/20"
              style={{ borderRight: i < 3 ? "1px solid var(--color-border)" : undefined }}
            >
              <span className="font-extrabold text-2xl tracking-[-0.02em] text-primary">{step.n}</span>
              <p className="m-0 text-sm font-bold text-foreground">{step.t}</p>
              <p className="m-0 text-xs leading-relaxed text-muted-foreground">{step.d}</p>
            </li>
          ))}
        </ol>
        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── Relacionados ── */}
      {related.length > 0 && (
        <section className="relative border-b px-8 py-12 lg:px-16">
          <DecorIcon className="size-3" position="top-left" />
          <DecorIcon className="size-3" position="top-right" />
          <div className="mb-6 flex items-center justify-between">
            <h3 className="m-0 text-xl font-extrabold tracking-[-0.015em] text-foreground">Proyectos relacionados</h3>
            <Link href="/portafolio" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>
              Ver todos <ArrowRightIcon className="size-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/portafolio/${r.slug}`}
                className="group relative flex flex-col overflow-hidden border bg-card transition-colors hover:bg-card/80"
              >
                <div className="relative overflow-hidden bg-black" style={{ aspectRatio: "4/3" }}>
                  <Image src={r.image} alt={r.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="33vw" />
                  <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent 50%)" }} />
                </div>
                <div className="flex flex-col gap-1.5 p-5">
                  <span className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">{r.categories.join(" · ")} · {r.year}</span>
                  <h4 className="m-0 text-sm font-bold text-foreground transition-colors group-hover:text-primary">{r.title}</h4>
                </div>
              </Link>
            ))}
          </div>
          <DecorIcon className="size-3" position="bottom-left" />
          <DecorIcon className="size-3" position="bottom-right" />
        </section>
      )}

      {/* ── Back CTA ── */}
      <div className="flex items-center justify-between border-b bg-card px-8 py-5 lg:px-16">
        <Link href="/portafolio" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}>
          <ArrowLeftIcon className="size-4" /> Volver al portafolio
        </Link>
        <Link href="/contacto">
          <Button variant="outline" size="sm">¿Hablamos? <ArrowRightIcon data-icon="inline-end" /></Button>
        </Link>
      </div>
    </>
  )
}
