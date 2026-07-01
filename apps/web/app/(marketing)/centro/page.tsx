import Image from "next/image"
import Link from "next/link"
import {
  ArrowRightIcon,
  CalendarIcon,
  ZapIcon,
  GlobeIcon,
  UsersIcon,
} from "lucide-react"
import type { Metadata } from "next"

import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Reveal } from "@/components/ui/reveal"
import { Button } from "@/components/ui/button"

import type { TeamMember } from "@/lib/institutional-data"
import { getTeamMembers } from "@/lib/notion/team"
import { getMetrics, pickMetrics, type Metric } from "@/lib/notion/metrics"
import { TeamCarousel } from "@/components/sections/team-carousel"

export const metadata: Metadata = {
  title: "Centro de Prototipado | Quiénes somos",
  description:
    "Conoce la misión, visión, equipo y articulación STEM del Centro de Prototipado de la Universidad Nacional sede Manizales.",
}

const stemPoints = [
  "Uso de tecnologías emergentes en procesos educativos.",
  "Proyectos interdisciplinarios entre estudiantes, docentes e investigadores.",
  "Creación de prototipos y soluciones aplicadas a distintas áreas del conocimiento.",
  "Integración de metodologías STEM y STEAM en enseñanza y aprendizaje.",
]

export default async function CentroPage() {
  const [teamMembers, metrics] = await Promise.all([
    getTeamMembers(),
    getMetrics(),
  ])
  return (
    <>
      <CentroHero
        stats={pickMetrics(metrics, [
          "tecnologias",
          "proyectos",
          "equipo",
          "aulas-stem",
        ])}
      />
      <MisionVision />
      <TeamSection members={teamMembers} />
      <StemSection
        stats={pickMetrics(metrics, [
          "instituciones-aliadas",
          "municipios",
        ])}
      />
      <CentroCta />
    </>
  )
}

/* ── Hero split ── */
function CentroHero({ stats }: { stats: Metric[] }) {
  return (
    <section className="relative overflow-hidden border-b">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />

      {/* bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
      >
        <div className="absolute inset-0 opacity-50">
          <GridPattern
            className="absolute inset-0 size-full stroke-foreground/8"
            height={40}
            width={40}
            x={0}
          />
        </div>
        <div
          className="absolute -top-1/5 right-0 h-4/5 w-1/2 opacity-0 blur-[70px] dark:opacity-15"
          style={{
            background:
              "radial-gradient(ellipse at top right, var(--color-cyan-400), transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Left: copy */}
        <div className="flex flex-col gap-5 border-b px-8 py-16 lg:border-r lg:border-b-0 lg:px-14 lg:py-20">
          <Reveal as="span" immediate index={0} className="inline-flex w-fit border bg-card px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Institucional · DIMA · UNAL Manizales
          </Reveal>
          <Reveal as="h1" immediate index={1} className="m-0 text-4xl leading-[0.98] font-extrabold tracking-[-0.03em] text-balance text-foreground lg:text-[clamp(36px,5vw,72px)]">
            El Centro de <span className="text-primary">Prototipado</span>.
          </Reveal>
          <Reveal as="p" immediate index={2} className="m-0 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
            Un espacio de innovación abierto donde estudiantes, docentes y
            comunidades convierten ideas en soluciones reales mediante
            fabricación digital y tecnologías emergentes. Sede: Museo
            Interactivo Samoga, Manizales.
          </Reveal>
          <div className="flex flex-wrap gap-3">
            <Link href="/tecnologias">
              <Button size="lg">
                Ver tecnologías <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </Link>
            <Link href="/contacto">
              <Button variant="outline" size="lg">
                <CalendarIcon data-icon="inline-start" /> Reservar
              </Button>
            </Link>
          </div>
        </div>

        {/* Right: photo grid + stats */}
        <div className="flex flex-col">
          {/* Photo grid */}
          <div
            className="grid"
            style={{
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "260px 180px",
            }}
          >
            {/* Main photo: spans 2 rows */}
            <figure
              className="relative m-0 overflow-hidden bg-black"
              style={{
                gridRow: "span 2",
                borderRight: "1px solid var(--color-border)",
              }}
            >
              <Image
                src="/impresoras.jpeg"
                alt="Granja de impresoras 3D"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="25vw"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.65), transparent 55%)",
                }}
              />
              <figcaption className="absolute bottom-3 left-3 flex flex-col gap-1">
                <span
                  className="font-mono text-[10px] tracking-[0.16em] uppercase"
                  style={{ color: "#3dbbd4" }}
                >
                  Fabricación
                </span>
                <span className="text-xs font-bold text-white">
                  Impresoras 3D FDM
                </span>
              </figcaption>
            </figure>
            {/* Top-right */}
            <figure
              className="relative m-0 overflow-hidden border-b bg-black"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <Image
                src="/brazo.jpeg"
                alt="Brazo robótico"
                fill
                className="object-cover"
                sizes="25vw"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.65), transparent 55%)",
                }}
              />
              <figcaption className="absolute bottom-3 left-3 flex flex-col gap-1">
                <span
                  className="font-mono text-[10px] tracking-[0.16em] uppercase"
                  style={{ color: "#3dbbd4" }}
                >
                  Robótica
                </span>
                <span className="text-xs font-bold text-white">
                  Brazo de soldadura
                </span>
              </figcaption>
            </figure>
            {/* Bottom-right */}
            <figure className="relative m-0 overflow-hidden bg-black">
              <Image
                src="/taller.jpg"
                alt="Talleres abiertos"
                fill
                className="object-cover"
                sizes="25vw"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(0,0,0,0.65), transparent 55%)",
                }}
              />
              <figcaption className="absolute bottom-3 left-3 flex flex-col gap-1">
                <span
                  className="font-mono text-[10px] tracking-[0.16em] uppercase"
                  style={{ color: "#3dbbd4" }}
                >
                  Formación
                </span>
                <span className="text-xs font-bold text-white">
                  Taller abierto
                </span>
              </figcaption>
            </figure>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-4 border-t bg-card">
            {stats.map((s, i) => (
              <Reveal
                as="div"
                key={s.key}
                index={i}
                className="flex flex-col gap-1 p-4"
                style={{
                  borderRight:
                    i < stats.length - 1
                      ? "1px solid var(--color-border)"
                      : undefined,
                }}
              >
                <span className="text-xl font-extrabold tracking-[-0.02em] text-foreground">
                  {s.value}
                </span>
                <span className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                  {s.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}

/* ── Misión / Visión / Para quién ── */
function MisionVision() {
  const cards = [
    {
      Icon: ZapIcon,
      eyebrow: "Misión",
      h3: "Democratizar el acceso a tecnologías de fabricación digital y promover la innovación.",
      p: "Mediante el aprendizaje práctico, la experimentación y la colaboración interdisciplinaria con estudiantes, docentes y comunidades.",
    },
    {
      Icon: GlobeIcon,
      eyebrow: "Visión",
      h3: "Ser un referente en innovación y fabricación digital en el territorio.",
      p: "Reconocido por impulsar proyectos tecnológicos y facilitar el acceso a herramientas y conocimientos para transformar ideas en soluciones con impacto educativo, social y empresarial.",
    },
    {
      Icon: UsersIcon,
      eyebrow: "Para quién",
      h3: "Estudiantes, docentes, semilleros, colegios y aliados de la industria.",
      p: "El acceso es abierto para la comunidad UNAL Manizales. Empresas y organizaciones pueden vincularse mediante convenios y programas de extensión.",

    },
  ]

  return (
    <section className="relative border-b">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />
      <div className="grid grid-cols-1 md:grid-cols-3">
        {cards.map(({ Icon, eyebrow, h3, p }, i) => (
          <Reveal
            as="article"
            key={eyebrow}
            index={i}
            className="relative flex flex-col gap-3.5 p-8 transition-colors hover:bg-muted/20 lg:p-10"
            style={{
              borderRight: i < 2 ? "1px solid var(--color-border)" : undefined,
            }}
          >
            <div className="flex h-11 w-11 items-center justify-center border bg-background text-primary">
              <Icon className="size-5" />
            </div>
            <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              {eyebrow}
            </span>
            <h3 className="m-0 text-lg leading-[1.2] font-bold tracking-[-0.01em] text-foreground lg:text-xl">
              {h3}
            </h3>
            <p className="m-0 text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          </Reveal>
        ))}
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}

/* ── Team ── */
function TeamSection({ members }: { members: TeamMember[] }) {
  return (
    <section
      className="relative overflow-hidden border-b bg-muted/30 px-8 py-16 lg:px-16 lg:py-20"
      id="equipo"
    >
      {/* Grid overlay (dark only) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden opacity-40 dark:block"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          WebkitMaskImage:
            "radial-gradient(ellipse at 80% 0%, black, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse at 80% 0%, black, transparent 75%)",
        }}
      />
      <div className="relative z-1">
        <Reveal as="div" className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.24em] text-primary uppercase">
              Equipo
            </span>
            <h2 className="mt-2.5 text-2xl leading-[1.05] font-extrabold tracking-[-0.02em] text-foreground md:text-3xl dark:text-white">
              Las personas detrás del Centro.
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              Equipo interdisciplinario que lidera innovación, formación y
              acompañamiento técnico.
            </p>
          </div>
        </Reveal>

        {/* Scroll carousel */}
        <TeamCarousel members={members} />
      </div>
    </section>
  )
}

/* ── STEM Articulation ── */
function StemSection({ stats }: { stats: Metric[] }) {
  return (
    <section
      className="relative border-b px-8 py-16 lg:px-16 lg:py-20"
      id="articulacion-stem"
    >
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.3fr]">
        <Reveal as="div">
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Articulación
          </span>
          <h2 className="mt-3.5 text-3xl leading-[1.1] font-extrabold tracking-[-0.015em] text-foreground">
            Trabajo articulado con las Aulas STEM.
          </h2>
          <p className="mt-3.5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Las Aulas STEM y el Centro de Prototipado trabajan de manera
            articulada para fortalecer formación, investigación e innovación.
            Esta colaboración genera ecosistemas que conectan educación,
            tecnología y desarrollo de soluciones.
          </p>
          <div className="mt-6 grid grid-cols-2 border bg-card">
            {stats.map((s, i) => (
              <div
                key={s.key}
                className="p-5"
                style={{
                  borderRight:
                    i < stats.length - 1
                      ? "1px solid var(--color-border)"
                      : undefined,
                }}
              >
                <p className="m-0 text-3xl font-extrabold tracking-[-0.02em] text-primary">
                  {s.value}
                </p>
                <p className="m-0 mt-1.5 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        <ul className="m-0 list-none border bg-card p-0">
          {stemPoints.map((point, i) => (
            <Reveal
              as="li"
              key={i}
              index={i}
              className="grid grid-cols-[52px_1fr] items-start gap-3.5 p-5"
              style={{
                borderBottom:
                  i < stemPoints.length - 1
                    ? "1px solid var(--color-border)"
                    : undefined,
              }}
            >
              <span className="text-2xl font-extrabold tracking-[-0.02em] text-primary">
                0{i + 1}
              </span>
              <p className="m-0 text-sm leading-relaxed text-foreground">
                {point}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}

/* ── CTA ── */
function CentroCta() {
  return (
    <section className="relative flex flex-col items-center justify-center overflow-hidden border-b px-8 py-20 text-center lg:px-16">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-40"
      >
        <GridPattern
          className="size-full stroke-foreground/8"
          height={36}
          width={36}
          x={0}
        />
      </div>
      <Reveal as="div" className="relative z-1 flex max-w-2xl flex-col items-center gap-5">
        <span className="inline-flex border bg-card px-3 py-1.5 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
          ¿Listo para crear?
        </span>
        <h2 className="m-0 text-3xl leading-[1.05] font-extrabold tracking-[-0.02em] text-balance text-foreground md:text-5xl">
          Agenda tu primera sesión o escríbenos hoy.
        </h2>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/contacto">
            <Button size="lg">
              Reservar un equipo <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </Link>
          <Link href="/contacto">
            <Button variant="outline" size="lg">
              Contactar al Centro
            </Button>
          </Link>
        </div>
      </Reveal>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
