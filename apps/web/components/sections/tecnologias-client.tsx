"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRightIcon,
  CalendarIcon,
  PhoneIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PrinterIcon,
  GlassesIcon,
  BotIcon,
  CpuIcon,
  ScanIcon,
  LayersIcon,
} from "lucide-react"

import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Button } from "@/components/ui/button"
import { technologies, faq } from "@/lib/institutional-data"
import { cn } from "@/lib/utils"

const categories = [
  { id: "Todas", Icon: LayersIcon, desc: "Ver inventario completo" },
  { id: "Fabricación", Icon: PrinterIcon, desc: "3D FDM, resina, CNC, láser" },
  { id: "Inmersivo", Icon: GlassesIcon, desc: "VR, AR, MR, HoloLens" },
  { id: "Robótica", Icon: BotIcon, desc: "Brazo industrial, soldadura" },
  { id: "Electrónica", Icon: CpuIcon, desc: "Microcontroladores, sensores" },
  { id: "Digitalización", Icon: ScanIcon, desc: "Plotter, scanner 3D" },
]

export function TecnologiasClient() {
  const [filter, setFilter] = useState("Todas")

  const filtered =
    filter === "Todas"
      ? technologies
      : technologies.filter((t) => t.category === filter)

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <div className="absolute inset-0 opacity-40">
            <GridPattern
              className="size-full stroke-foreground/8"
              height={40}
              width={40}
              x={0}
            />
          </div>
          <div
            className="absolute top-0 right-0 h-full w-1/2 opacity-0 blur-[70px] dark:opacity-15"
            style={{
              background:
                "radial-gradient(ellipse at top right, var(--color-cyan-400), transparent 65%)",
            }}
          />
        </div>

        {/* Copy */}
        <div className="flex flex-col gap-5 border-b px-8 py-16 lg:border-r lg:border-b-0 lg:px-14 lg:py-20">
          <span className="inline-flex w-fit border bg-card px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Equipamiento · {filtered.length} tecnologías
          </span>
          <h1 className="m-0 text-4xl leading-[0.98] font-extrabold tracking-[-0.03em] text-balance text-foreground lg:text-[clamp(36px,5vw,72px)]">
            Tecnologías para{" "}
            <span className="text-primary">construir, probar</span> y mostrar.
          </h1>
          <p className="m-0 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
            Hardware, software y experiencias de fabricación digital al servicio
            de estudiantes, docentes, semilleros y aliados. Desde impresoras 3D
            hasta realidad virtual.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/contacto">
              <Button size="lg">
                Reservar un equipo <CalendarIcon data-icon="inline-end" />
              </Button>
            </Link>
            <Link href="/contacto">
              <Button variant="outline" size="lg">
                <PhoneIcon data-icon="inline-start" /> Pedir asesoría
              </Button>
            </Link>
          </div>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── Tech grid ── */}
      <section className="relative border-b px-8 py-14 lg:px-16 lg:py-16">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />
        <div className="mb-6 flex items-center justify-between gap-3">
          <span className="font-mono text-xs text-muted-foreground">
            {String(filtered.length).padStart(2, "0")} /{" "}
            {String(technologies.length).padStart(2, "0")} tecnologías
          </span>
          {filter !== "Todas" && (
            <button
              onClick={() => setFilter("Todas")}
              className="text-[11px] text-primary hover:underline"
            >
              Ver todas
            </button>
          )}
        </div>
        <div
          className="grid border"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          }}
        >
          {filtered.map((t) => (
            <TechCardDetail key={t.title} t={t} />
          ))}
        </div>
        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── Reserve CTA ── */}
      <section className="relative overflow-hidden border-b bg-muted/30">
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
        <div className="relative z-1 grid grid-cols-1 gap-8 px-8 py-16 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:px-16">
          <div>
            <span className="text-[11px] font-semibold tracking-[0.24em] text-primary uppercase">
              Reservar
            </span>
            <h2
              className="mt-2.5 leading-[1.05] font-extrabold tracking-[-0.02em] text-foreground dark:text-white"
              style={{ fontSize: "clamp(26px,3.6vw,46px)" }}
            >
              Agenda tu sesión en el Centro.
            </h2>
            <p className="mt-3.5 max-w-md text-sm leading-relaxed text-muted-foreground">
              Sin costo para la comunidad UNAL. Confirmación en máximo 2 días
              hábiles.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 border bg-card p-4 dark:border-white/15 dark:bg-white/6">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border text-primary dark:border-white/20">
                <CalendarIcon className="size-4" />
              </div>
              <div>
                <p className="m-0 text-[10px] font-semibold text-muted-foreground uppercase">
                  Respuesta
                </p>
                <p className="m-0 mt-1 text-sm font-semibold text-foreground dark:text-white">
                  ≤ 2 días hábiles
                </p>
              </div>
            </div>
            <Link href="/contacto">
              <Button size="lg" className="w-full">
                Reservar ahora <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </Link>
            <Link href="/contacto">
              <Button variant="outline" size="lg" className="w-full">
                Prefiero escribir primero{" "}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />
    </>
  )
}

function TechCardDetail({ t }: { t: (typeof technologies)[number] }) {
  const [open, setOpen] = useState(false)
  return (
    <article
      className="relative flex flex-col overflow-hidden border-r border-b bg-card transition-colors hover:bg-card/80"
      style={{ margin: "-1px -1px 0 0" }}
    >
      <DecorIcon className="size-2" position="top-left" />
      <div className="flex flex-1 flex-col gap-2.5 p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 items-center justify-center border bg-background text-primary">
            <PrinterIcon className="size-4" />
          </div>
          <span
            className="font-mono text-[10px] tracking-[0.06em]"
            style={{
              color:
                t.status === "disponible"
                  ? "var(--color-primary)"
                  : "var(--color-muted-foreground)",
            }}
          >
            {t.status === "disponible" ? "● Disponible" : "○ En uso"}
          </span>
        </div>
        <p className="m-0 text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {t.subtitle}
        </p>
        <h3 className="m-0 text-base font-bold text-foreground">{t.title}</h3>
        <p className="m-0 flex-1 text-xs leading-relaxed text-muted-foreground">
          {t.description}
        </p>
      </div>
      {open && (
        <div className="border-t bg-muted/20 px-6 py-4">
          <p className="mb-2.5 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Aplicaciones
          </p>
          <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {t.applications.map((a) => (
              <li
                key={a}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <span className="shrink-0 text-primary">→</span>
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="flex items-center justify-between border-t px-6 py-3">
        <span className="font-mono text-[11px] text-muted-foreground/70">
          {t.category} · {t.units} u.
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-1 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
          >
            {open ? "Menos" : "Aplicaciones"}
            {open ? (
              <ChevronDownIcon className="size-3" />
            ) : (
              <ChevronRightIcon className="size-3" />
            )}
          </button>
          <Link href="/contacto">
            <Button size="sm">Reservar</Button>
          </Link>
        </div>
      </div>
    </article>
  )
}

function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section className="relative border-b px-8 py-16 lg:px-16 lg:py-20">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Preguntas frecuentes
          </span>
          <h2 className="mt-3.5 text-3xl leading-[1.05] font-extrabold tracking-[-0.015em] text-foreground">
            Antes de reservar.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Todo lo que sueles preguntarte. Si no está aquí, escríbenos.
          </p>
          <Link href="/contacto" className="mt-5 inline-block">
            <Button variant="outline" size="sm">
              Más preguntas <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </Link>
        </div>
        <div className="border bg-card">
          {faq.slice(0, 5).map((f, i) => (
            <div key={i} className="border-b last:border-b-0">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/20"
              >
                <span className="text-sm font-semibold text-foreground">
                  {f.q}
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center border text-lg leading-none transition-transform",
                    openIdx === i
                      ? "rotate-45 border-primary bg-primary text-primary-foreground"
                      : ""
                  )}
                >
                  +
                </span>
              </button>
              {openIdx === i && (
                <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
