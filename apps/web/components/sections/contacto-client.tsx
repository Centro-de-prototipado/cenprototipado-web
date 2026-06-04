"use client"

import { useState } from "react"
import Link from "next/link"
import { MailIcon, PhoneIcon, MapPinIcon, ClockIcon, ArrowRightIcon, GlobeIcon } from "lucide-react"

import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Button } from "@/components/ui/button"
import { allies, type FaqItem } from "@/lib/institutional-data"
import { cn } from "@/lib/utils"

const contact = {
  email: "cenprototipado_man@unal.edu.co",
  phone: "+57 (606) 887 9300",
  location: "Manizales, Museo Interactivo Samoga, segundo piso",
  hours: "Lun–Vie · 8:00 a.m. – 5:00 p.m.",
}

const queryTypes = ["Asesoría técnica", "Reserva de equipo", "Propuesta de proyecto", "Visita guiada", "Otro"]

export function ContactoClient({ faq }: { faq: FaqItem[] }) {
  const [sent, setSent] = useState(false)
  const [queryType, setQueryType] = useState("Asesoría técnica")

  return (
    <>
      {/* ── Hero split ── */}
      <section className="relative overflow-hidden border-b">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 opacity-40">
            <GridPattern className="size-full stroke-foreground/8" height={40} width={40} x={0} />
          </div>
          <div className="absolute -top-1/5 left-1/3 h-4/5 w-1/2 opacity-0 blur-[70px] dark:opacity-15"
            style={{ background: "radial-gradient(ellipse, var(--color-cyan-400), transparent 65%)" }} />
        </div>

        <div className="relative z-1 grid grid-cols-1 gap-8 px-8 py-16 lg:grid-cols-2 lg:items-center lg:px-14 lg:py-20">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit border bg-card px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              Contacto · Hablemos
            </span>
            <h1 className="m-0 max-w-[14ch] text-4xl font-extrabold leading-[0.98] tracking-[-0.03em] text-foreground lg:text-[clamp(36px,5vw,72px)]">
              ¿Tienes una idea o proyecto?
            </h1>
            <p className="m-0 max-w-[44ch] text-base leading-relaxed text-muted-foreground">
              Coordinamos asesoría técnica, talleres, reservas de equipo y proyectos colaborativos con la comunidad académica y aliados externos.
            </p>
          </div>

          {/* Contact info grid */}
          <div className="border bg-card">
            {[
              { Icon: MailIcon,   label: "Correo",   value: contact.email,    href: `mailto:${contact.email}` },
              { Icon: PhoneIcon,  label: "Teléfono", value: contact.phone,    href: `tel:${contact.phone.replace(/\s/g, "")}` },
              { Icon: MapPinIcon, label: "Sede",     value: contact.location, href: "#mapa" },
              { Icon: ClockIcon,  label: "Horario",  value: contact.hours,    href: "#" },
            ].map(({ Icon, label, value, href }, i) => (
              <a
                key={label}
                href={href}
                className="grid transition-colors hover:bg-muted/20"
                style={{
                  gridTemplateColumns: "48px 1fr",
                  borderBottom: i < 3 ? "1px solid var(--color-border)" : undefined,
                }}
              >
                <span className="flex h-13 w-12 items-center justify-center text-primary" style={{ borderRight: "1px solid var(--color-border)" }}>
                  <Icon className="size-4" />
                </span>
                <span className="px-4 py-2.5">
                  <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">{label}</span>
                  <span className="mt-0.5 block text-sm font-medium text-foreground">{value}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── Form + sidebar ── */}
      <section className="relative border-b px-8 py-14 lg:px-16 lg:py-16">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div className="grid grid-cols-1 border lg:grid-cols-[1.5fr_1fr]">
          {/* Form */}
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true) }}
            className="relative flex flex-col gap-5 p-8 lg:border-r lg:p-9"
          >
            <DecorIcon className="size-2" position="top-left" />
            <DecorIcon className="size-2" position="bottom-right" />

            <div>
              <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">Escríbenos</span>
              <h2 className="mt-2.5 text-2xl font-extrabold leading-[1.1] tracking-[-0.015em] text-foreground">
                Cuéntanos en qué podemos ayudarte.
              </h2>
            </div>

            {/* Query type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground">Tipo de consulta</label>
              <div className="flex flex-wrap gap-2">
                {queryTypes.map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setQueryType(t)}
                    className={cn(
                      "h-8 px-3 text-xs font-medium border transition-colors",
                      queryType === t
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-transparent text-foreground border-border hover:border-primary"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Nombre completo</label>
                <input className="border bg-muted/20 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="María Gómez" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Afiliación</label>
                <input className="border bg-muted/20 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="UNAL · Estudiante / Empresa…" />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Correo</label>
                <input type="email" className="border bg-muted/20 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="tu@correo.com" required />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">Teléfono (opcional)</label>
                <input className="border bg-muted/20 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="+57 300 000 0000" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-foreground">Mensaje</label>
              <textarea className="min-h-24 resize-y border bg-muted/20 px-3 py-2.5 text-sm text-foreground leading-relaxed outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" placeholder="Cuéntanos brevemente sobre tu proyecto, fechas, equipos o tecnologías de interés…" required />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input type="checkbox" required defaultChecked className="accent-primary" />
                Acepto el tratamiento de datos según la política UNAL.
              </label>
              <Button type="submit" size="lg">
                {sent ? "¡Mensaje enviado ✓" : "Enviar mensaje"} <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          </form>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6 bg-background p-7 lg:p-8">
            <div className="border bg-card p-5" style={{ boxShadow: "5px 5px 0 0 color-mix(in srgb, var(--color-border) 60%, transparent)" }}>
              <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                <span className="h-1.5 w-1.5 rounded-none bg-primary" />
                Tiempo de respuesta
              </span>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                Promedio <strong className="text-foreground">≤ 36 h hábiles</strong> por correo institucional. Reservas confirmadas en ≤ 2 días hábiles.
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">También puedes</span>
              <div className="mt-3.5 flex flex-col gap-2.5">
                <Link href="/tecnologias">
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="size-3.5" /> Reservar equipo directamente
                  </Button>
                </Link>
                <a href="https://unal.edu.co" target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full justify-start">
                    <GlobeIcon className="size-3.5" /> unal.edu.co
                  </Button>
                </a>
                <a href={`mailto:${contact.email}`}>
                  <Button variant="outline" className="w-full justify-start">
                    <MailIcon className="size-3.5" /> {contact.email}
                  </Button>
                </a>
              </div>
            </div>
          </aside>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── Mapa ── */}
      <section className="relative border-b px-8 py-14 lg:px-16 lg:py-16" id="mapa">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div className="mb-6">
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">Cómo llegar</span>
          <h2 className="mt-3.5 text-3xl font-extrabold leading-[1.05] tracking-[-0.015em] text-foreground">
            Museo Interactivo Samoga, segundo piso.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">Entrada por la portería principal del museo, Sede Manizales de la UNAL.</p>
        </div>

        <div className="grid grid-cols-1 border lg:grid-cols-[1.5fr_1fr]">
          {/* SVG Map */}
          <div className="relative min-h-80 overflow-hidden border-b lg:border-b-0 lg:border-r" style={{ background: "var(--color-muted)" }}>
            <MapSVG />
            {/* Pulse pin */}
            <div
              className="absolute"
              style={{ top: "48%", left: "56%", width: 18, height: 18, background: "var(--color-primary)", border: "3px solid var(--color-background)", boxShadow: "0 0 0 2px var(--color-primary)", animation: "pulse-pin 1.8s ease-out infinite" }}
            />
            <div
              className="absolute border bg-card text-xs"
              style={{ top: "52%", left: "58%", padding: "10px 12px", boxShadow: "3px 3px 0 0 color-mix(in srgb, var(--color-border) 60%, transparent)", minWidth: 180, zIndex: 2 }}
            >
              <p className="m-0 text-[9px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">Sede</p>
              <p className="m-0 mt-1 text-sm font-bold text-foreground">Centro de Prototipado</p>
              <p className="m-0 text-xs text-muted-foreground">Samoga · 2do piso</p>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5 bg-card p-7">
            {[
              { k: "Dirección",   v: "Museo Interactivo Samoga · 2do piso\nSede Manizales · Universidad Nacional\nManizales, Caldas — Colombia" },
              { k: "Coordenadas", v: "5.0594° N · 75.4905° W" },
              { k: "Transporte",  v: "Cable Aéreo · estación Cámbulos\nBuses ruta UNAL · paradero principal" },
            ].map((r) => (
              <div key={r.k}>
                <p className="m-0 mb-1.5 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">{r.k}</p>
                <p className="m-0 whitespace-pre-line text-sm leading-relaxed text-foreground">{r.v}</p>
              </div>
            ))}
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <a href="https://www.google.com/maps/search/?api=1&query=Museo+Interactivo+Samoga+Manizales" target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm">Google Maps <ArrowRightIcon data-icon="inline-end" /></Button>
              </a>
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                <Button variant="ghost" size="sm"><PhoneIcon className="size-3.5" /> Llamar</Button>
              </a>
            </div>
          </div>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── FAQ ── */}
      <FaqSection faq={faq} />

      {/* ── Aliados ── */}
      <section className="relative border-b px-8 py-14 lg:px-16 lg:py-16">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />
        <div className="mb-6 text-center">
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">Red de aliados</span>
          <h2 className="mt-3.5 text-2xl font-extrabold leading-[1.05] tracking-[-0.015em] text-foreground">Trabajamos en red.</h2>
        </div>
        <div className="grid border" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))" }}>
          {allies.map((a) => (
            <div key={a.label} className="flex min-h-28 flex-col items-center justify-center gap-1 p-5 text-center bg-card transition-colors hover:bg-card/60" style={{ borderRight: "1px solid var(--color-border)", borderBottom: "1px solid var(--color-border)" }}>
              <span className="text-sm font-bold tracking-[0.04em] text-foreground uppercase">{a.label}</span>
              <span className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">{a.sub}</span>
            </div>
          ))}
        </div>
        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      <style>{`
        @keyframes pulse-pin {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary) 70%, transparent); }
          50% { box-shadow: 0 0 0 6px transparent; }
        }
      `}</style>
    </>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  )
}

function MapSVG() {
  return (
    <svg viewBox="0 0 800 450" className="block h-full w-full" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="mg" width="32" height="32" patternUnits="userSpaceOnUse">
          <path d="M32 0L0 0 0 32" fill="none" stroke="var(--color-border)" strokeWidth="1"/>
        </pattern>
        <pattern id="mh" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="12" stroke="var(--color-border)" strokeWidth="1"/>
        </pattern>
      </defs>
      <rect width="800" height="450" fill="var(--color-muted)"/>
      <rect width="800" height="450" fill="url(#mg)"/>
      <g fill="none" stroke="var(--color-border)" strokeWidth="1.2" opacity="0.7">
        <path d="M-20 200 Q100 170 250 190 T520 220 T820 200"/>
        <path d="M-20 240 Q120 210 280 235 T540 270 T820 250"/>
        <path d="M-20 280 Q140 260 310 280 T580 310 T820 300"/>
      </g>
      <path d="M0 370 C200 350 320 410 500 380 S720 350 800 360" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
      <rect x="370" y="150" width="120" height="80" fill="url(#mh)" stroke="var(--color-border)" strokeWidth="1" opacity="0.6"/>
      <rect x="190" y="110" width="75" height="48" fill="url(#mh)" stroke="var(--color-border)" strokeWidth="1" opacity="0.4"/>
      <g stroke="var(--color-border)" fill="none" strokeWidth="1.4">
        <line x1="0" y1="195" x2="800" y2="215"/>
        <line x1="110" y1="0" x2="360" y2="450"/>
        <line x1="505" y1="0" x2="655" y2="450"/>
      </g>
      <g fill="var(--color-muted-foreground)" fontSize="9" letterSpacing="1">
        <text x="190" y="128" fontFamily="monospace">SAMOGA</text>
        <text x="382" y="168" fontFamily="monospace">SEDE UNAL</text>
        <text x="42" y="185" fontFamily="monospace">CL 30</text>
        <text x="630" y="54" textAnchor="end" fontFamily="monospace">N ↑</text>
      </g>
    </svg>
  )
}

function FaqSection({ faq }: { faq: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  return (
    <section className="relative border-b px-8 py-14 lg:px-16 lg:py-16" id="faq">
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">FAQ</span>
          <h2 className="mt-3.5 text-3xl font-extrabold leading-[1.05] tracking-[-0.015em] text-foreground">Preguntas frecuentes.</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">Todo lo que sueles preguntarte antes de contactarnos.</p>
        </div>
        <div className="border bg-card">
          {faq.map((f, i) => (
            <div key={i} className="border-b last:border-b-0">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/20">
                <span className="text-sm font-semibold text-foreground">{f.q}</span>
                <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center border text-lg leading-none transition-transform", openIdx === i ? "rotate-45 bg-primary text-primary-foreground border-primary" : "")}>+</span>
              </button>
              {openIdx === i && <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
