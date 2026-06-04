import Link from "next/link"
import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/ui/reveal"
import { ArrowRightIcon } from "lucide-react"

export function CallToAction() {
  return (
    <section className="relative flex w-full flex-col items-center justify-center overflow-hidden border-b px-8 py-20 text-center md:py-28 lg:px-16">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      {/* Grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-50"
      >
        <GridPattern
          className="size-full stroke-border"
          height={36}
          width={36}
          x={0}
        />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-background) 0%, transparent), var(--color-background) 70%)",
        }}
      />

      {/* Content */}
      <Reveal
        as="div"
        className="relative z-1 flex max-w-2xl flex-col items-center gap-5"
      >
        <span className="inline-flex items-center gap-2 border bg-card px-3 py-1.5 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
          Descubre el Centro de Prototipado
        </span>

        <h2 className="m-0 font-extrabold leading-[1.05] tracking-[-0.02em] text-balance text-foreground text-3xl md:text-5xl lg:text-[clamp(28px,4.5vw,56px)]">
          Un espacio para explorar, aprender y crear sin límites.
        </h2>

        <p className="m-0 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
          Tecnologías que convierten ideas en soluciones reales — para
          estudiantes, docentes, comunidades y aliados.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/centro">
            <Button size="lg">
              Conoce el Centro <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </Link>
          <Link href="/portafolio">
            <Button variant="outline" size="lg">
              Ver portafolio
            </Button>
          </Link>
        </div>
      </Reveal>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
