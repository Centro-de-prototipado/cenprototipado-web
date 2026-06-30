import type { Metadata } from "next"
import Image from "next/image"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { getPortfolioProjects, getPortfolioCategories } from "@/lib/notion/portfolio"
import { PortfolioShowcase } from "@/components/portfolio/portfolio-showcase"
import { Reveal } from "@/components/ui/reveal"

export const metadata: Metadata = {
  title: "Portafolio | Centro de Prototipado",
  description:
    "Proyectos desarrollados por el Centro de Prototipado: educación, industria y comunidad con metodologías de prototipado aplicado.",
}

export default async function PortafolioPage() {
  const [projects, categories] = await Promise.all([
    getPortfolioProjects(),
    getPortfolioCategories(),
  ])

  const featured = projects.filter((p) => p.featured).slice(0, 4)

  return (
    <>
      {/* ── Hero con mosaic ── */}
      <section className="relative overflow-hidden border-b">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-40">
            <GridPattern className="size-full stroke-foreground/8" height={40} width={40} x={0} />
          </div>
          <div className="absolute -bottom-1/5 left-1/3 h-4/5 w-1/2 opacity-15 blur-[70px]"
            style={{ background: "radial-gradient(ellipse, var(--color-cyan-400), transparent 65%)" }} />
        </div>

        <div className="relative z-1 px-8 pt-14 pb-0 lg:px-16 lg:pt-20">
          <Reveal as="span" immediate index={0} className="inline-flex w-fit border bg-card px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Casos del Centro · {projects.length} proyectos
          </Reveal>
          <Reveal as="h1" immediate index={1} className="mt-4 max-w-[14ch] text-4xl font-extrabold leading-[0.98] tracking-[-0.03em] text-foreground lg:text-[clamp(36px,5vw,72px)]">
            Portafolio de{" "}
            <span className="text-primary">proyectos</span>.
          </Reveal>
          <Reveal as="p" immediate index={2} className="mt-4 max-w-[50ch] text-base leading-relaxed text-muted-foreground">
            Casos donde estudiantes, semilleros, docentes y aliados aterrizaron ideas en prototipos funcionales.
          </Reveal>
        </div>

        {/* Featured mosaic strip */}
        {featured.length > 0 && (
          <div
            className="relative mt-10 border-t"
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              height: 220,
            }}
          >
            {featured.slice(0, 3).map((p, i) => (
              <Reveal
                as="figure"
                key={p.id}
                index={i}
                className="group relative m-0 overflow-hidden bg-black"
                style={{ borderRight: i < 2 ? "1px solid var(--color-border)" : undefined }}
              >
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 820px) 100vw, 33vw"
                />
                <div aria-hidden="true" className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent 50%)" }} />
                <figcaption className="absolute bottom-3 left-4 right-4 z-1 flex flex-col gap-1">
                  <span className="inline-flex w-fit border px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-white uppercase" style={{ borderColor: "rgba(255,255,255,0.3)" }}>
                    {p.categories.join(" · ")}
                  </span>
                  <span className="text-sm font-bold leading-tight text-white">{p.title}</span>
                </figcaption>
              </Reveal>
            ))}
          </div>
        )}

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      <PortfolioShowcase projects={projects} categories={categories} />
    </>
  )
}
