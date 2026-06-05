import Link from "next/link"
import { cn } from "@/lib/utils"
import { DecorIcon } from "@/components/ui/decor-icon"
import { Reveal } from "@/components/ui/reveal"
import { Button } from "@/components/ui/button"
import { HeroRobot } from "@/components/sections/hero-robot"
import type { Metric } from "@/lib/notion/metrics"
import { ArrowRightIcon, CalendarIcon, LayersIcon, BotIcon, PrinterIcon, GlassesIcon } from "lucide-react"

const capabilities = [
  { icon: PrinterIcon,  label: "Fabricación",  detail: "3D · CNC · Láser" },
  { icon: GlassesIcon,  label: "Inmersivo",    detail: "VR · AR · MR" },
  { icon: BotIcon,      label: "Robótica",     detail: "Brazos · Sensores" },
  { icon: LayersIcon,   label: "BIM · Twin",   detail: "Unity · Revit" },
]

export function HeroSection({ miniStats }: { miniStats: Metric[] }) {
  return (
    <section className="relative overflow-hidden border-b">
      {/* Background glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 opacity-20 dark:opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, color-mix(in srgb, var(--border) 80%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, var(--border) 80%, transparent) 1px, transparent 1px)",
            backgroundSize: "36px 36px",
            WebkitMaskImage: "radial-gradient(ellipse at top center, black, transparent 70%)",
            maskImage: "radial-gradient(ellipse at top center, black, transparent 70%)",
          }}
        />
        <div
          className="absolute -top-1/4 -right-1/4 h-full w-3/4 opacity-0 blur-[80px] dark:opacity-20"
          style={{ background: "radial-gradient(ellipse at center, var(--color-cyan-400), transparent 65%)" }}
        />
      </div>

      {/* Split layout */}
      <div className="relative z-1 grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Left: Copy */}
        <div className="flex flex-col gap-5 border-b px-8 py-14 lg:border-b-0 lg:border-r lg:px-14 lg:py-20">
          {/* Eyebrow */}
          <Reveal as="div" immediate index={0} className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-none bg-primary"
              style={{ animationDuration: "2s" }}
            />
            <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
              Centro de Prototipado · UNAL Manizales
            </span>
          </Reveal>

          {/* Title */}
          <Reveal
            as="h1"
            immediate
            index={1}
            className={cn(
              "m-0 max-w-xl font-extrabold text-balance text-foreground",
              "text-4xl leading-[0.98] tracking-[-0.03em]",
              "sm:text-5xl lg:text-[clamp(38px,5vw,72px)]"
            )}
          >
            Donde otros ven ideas,{" "}
            <span className="italic text-primary">aquí las convertimos</span>{" "}
            en prototipos.
          </Reveal>

          {/* Subtitle */}
          <Reveal
            as="p"
            immediate
            index={2}
            className="m-0 max-w-[44ch] text-base leading-relaxed text-muted-foreground lg:text-[clamp(15px,1.4vw,17px)]"
          >
            Fabricación digital, realidad inmersiva y robótica al servicio de
            estudiantes, docentes y comunidades. Un espacio abierto dentro del
            Museo Interactivo Samoga.
          </Reveal>

          {/* CTAs */}
          <Reveal as="div" immediate index={3} className="flex flex-wrap gap-3">
            <Link href="/centro">
              <Button size="lg">
                Explorar el Centro <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </Link>
            <Link href="/contacto">
              <Button variant="outline" size="lg">
                <CalendarIcon data-icon="inline-start" /> Reservar un equipo
              </Button>
            </Link>
          </Reveal>

          {/* Mini-stats */}
          <Reveal
            as="div"
            immediate
            index={4}
            className="mt-auto grid grid-cols-2 gap-0 border-t pt-6 sm:grid-cols-4"
            style={{ borderTop: "1px solid var(--color-border)" }}
          >
            {miniStats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5 pr-4 pb-3">
                <span
                  className="font-extrabold tracking-[-0.02em] text-foreground"
                  style={{
                    fontFamily: "var(--font-heading, var(--font-sans))",
                    fontSize: "clamp(22px, 2.6vw, 30px)",
                  }}
                >
                  {stat.value}
                </span>
                <span className="text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {stat.label}
                </span>
              </div>
            ))}
          </Reveal>
        </div>

        {/* Right: 3D media slot */}
        <Reveal
          as="div"
          immediate
          index={2}
          delay={0.1}
          className="relative flex items-stretch px-8 py-10 lg:px-10"
        >
          <HeroMediaFrame />
        </Reveal>
      </div>

      {/* Capability strip */}
      <div className="relative z-1 grid grid-cols-2 border-t bg-card lg:grid-cols-4">
        {capabilities.map((cap, i) => {
          const Icon = cap.icon
          return (
            <Reveal
              as="div"
              index={i}
              key={cap.label}
              className={cn(
                "flex items-center gap-3 px-5 py-4",
                i < capabilities.length - 1 && "border-r",
                i < 2 && "lg:border-b-0 border-b"
              )}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center border bg-background text-primary">
                <Icon className="size-4" />
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  {cap.label}
                </p>
                <p className="font-mono text-xs text-muted-foreground/70">
                  {cap.detail}
                </p>
              </div>
            </Reveal>
          )
        })}
      </div>

      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}

function HeroMediaFrame() {
  return (
    <figure
      className="relative flex flex-1 flex-col overflow-hidden border bg-card"
      style={{
        minHeight: 420,
        boxShadow: "8px 8px 0 0 color-mix(in srgb, var(--color-border) 60%, transparent)",
      }}
    >
      <DecorIcon className="size-2" position="top-left" />
      <DecorIcon className="size-2" position="top-right" />
      <DecorIcon className="size-2" position="bottom-left" />
      <DecorIcon className="size-2" position="bottom-right" />

      {/* Grid overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          WebkitMaskImage: "radial-gradient(circle at center 56%, black 0%, transparent 78%)",
          maskImage: "radial-gradient(circle at center 56%, black 0%, transparent 78%)",
        }}
      />

      {/* Topbar */}
      <div className="relative z-10 flex items-center justify-between border-b bg-card/80 px-4 py-3 backdrop-blur-sm">
        <span className="font-mono text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
          P.R.O.T.O · UNIDAD 01
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-primary">
          <span
            className="size-1.5 rounded-full bg-primary"
            style={{ animation: "proto-blink 1.6s ease-in-out infinite" }}
          />
          LIVE
        </span>
      </div>

      {/* Robot stage */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden">
        {/* Radial spotlight behind the robot — gently breathes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-[120%] -translate-x-1/2 -translate-y-1/2 opacity-70 dark:opacity-90"
          style={{
            background:
              "radial-gradient(circle at center, color-mix(in srgb, var(--color-primary) 22%, transparent) 0%, transparent 55%)",
            animation: "proto-glow 5s ease-in-out infinite",
          }}
        />

        {/* Rotating radar sweep */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50 md:size-80 dark:opacity-70"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, color-mix(in srgb, var(--color-primary) 38%, transparent) 38deg, transparent 75deg)",
            WebkitMaskImage: "radial-gradient(circle at center, black 30%, transparent 72%)",
            maskImage: "radial-gradient(circle at center, black 30%, transparent 72%)",
            animation: "proto-sweep 4.5s linear infinite",
          }}
        />

        {/* Concentric targeting reticle */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 opacity-40 md:size-80"
          style={{ animation: "proto-spin 36s linear infinite" }}
        >
          <div className="absolute inset-0 rounded-full border border-dashed border-primary/40" />
          <div className="absolute inset-[14%] rounded-full border border-primary/25" />
          {/* tick marks */}
          <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-primary/50" />
          <span className="absolute left-1/2 bottom-0 h-3 w-px -translate-x-1/2 bg-primary/50" />
          <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-primary/50" />
          <span className="absolute top-1/2 right-0 h-px w-3 -translate-y-1/2 bg-primary/50" />
        </div>

        {/* Counter-rotating inner ring with orbiting node */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 size-52 -translate-x-1/2 -translate-y-1/2 opacity-50 md:size-56"
          style={{ animation: "proto-spin-rev 22s linear infinite" }}
        >
          <div className="absolute inset-0 rounded-full border border-primary/20" />
          <span
            className="absolute left-1/2 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary"
            style={{ boxShadow: "0 0 8px color-mix(in srgb, var(--color-primary) 80%, transparent)" }}
          />
        </div>

        {/* Floating particles drifting upward */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {[
            { left: "18%", delay: "0s", dur: "6.5s", size: 3 },
            { left: "32%", delay: "2.1s", dur: "7.8s", size: 2 },
            { left: "54%", delay: "1.2s", dur: "6.9s", size: 2 },
            { left: "68%", delay: "3.4s", dur: "8.4s", size: 3 },
            { left: "82%", delay: "0.7s", dur: "7.2s", size: 2 },
          ].map((p, i) => (
            <span
              key={i}
              className="absolute bottom-0 rounded-full bg-primary/70"
              style={{
                left: p.left,
                height: p.size,
                width: p.size,
                boxShadow: "0 0 6px color-mix(in srgb, var(--color-primary) 70%, transparent)",
                animation: `proto-float ${p.dur} ease-in-out ${p.delay} infinite`,
              }}
            />
          ))}
        </div>

        {/* Crosshair guides */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-primary/15 to-transparent" />
          <span className="absolute top-1/2 left-0 h-px w-full -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
        </div>

        {/* Corner HUD brackets */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-5 z-10 md:inset-7">
          <span className="absolute left-0 top-0 size-4 border-l border-t border-primary/50" />
          <span className="absolute right-0 top-0 size-4 border-r border-t border-primary/50" />
          <span className="absolute left-0 bottom-0 size-4 border-l border-b border-primary/50" />
          <span className="absolute right-0 bottom-0 size-4 border-r border-b border-primary/50" />
        </div>

        {/* Animated scan line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-6 z-10 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, color-mix(in srgb, var(--color-primary) 80%, transparent), transparent)",
            boxShadow: "0 0 8px color-mix(in srgb, var(--color-primary) 60%, transparent)",
            animation: "proto-scan 4.5s ease-in-out infinite",
          }}
        />

        {/* Robot */}
        <HeroRobot className="relative z-20 h-64 w-full max-w-sm md:h-80 md:max-w-md" />

        {/* Pedestal glow under the robot */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-6 left-1/2 z-10 h-10 w-44 -translate-x-1/2 rounded-[50%] opacity-70"
          style={{
            background:
              "radial-gradient(ellipse at center, color-mix(in srgb, var(--color-primary) 30%, transparent), transparent 70%)",
            filter: "blur(6px)",
          }}
        />

        {/* Telemetry annotations */}
        <div className="absolute left-4 top-4 z-20 flex flex-col gap-1.5">
          <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground/70">SCAN · ACTIVE</span>
          <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground/70">ROT · 30°/s</span>
        </div>
        <div className="absolute right-4 top-4 z-20 flex flex-col items-end gap-1.5">
          <span className="font-mono text-[9px] tracking-[0.12em] text-primary/80">● TRACKING</span>
          <span className="font-mono text-[9px] tracking-[0.12em] text-muted-foreground/70">GLB · 3D</span>
        </div>

        {/* Side ruler ticks */}
        <div aria-hidden="true" className="absolute right-4 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <span
              key={i}
              className="h-px bg-muted-foreground/40"
              style={{ width: i === 3 ? 12 : 6 }}
            />
          ))}
        </div>
      </div>

      {/* Coordinates bar */}
      <figcaption className="relative z-10 flex items-center justify-between border-t bg-card/80 px-4 py-2.5 backdrop-blur-sm">
        <span className="font-mono text-[10px] text-muted-foreground/60">5.06° N</span>
        <span className="font-mono text-[10px] text-muted-foreground/60">SAMOGA · P2</span>
        <span className="font-mono text-[10px] text-muted-foreground/60">75.49° W</span>
      </figcaption>

      <style>{`
        @keyframes proto-scan {
          0%   { top: 12%; opacity: 0; }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { top: 88%; opacity: 0; }
        }
        @keyframes proto-spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes proto-spin-rev {
          from { transform: translate(-50%, -50%) rotate(360deg); }
          to   { transform: translate(-50%, -50%) rotate(0deg); }
        }
        @keyframes proto-sweep {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes proto-blink {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
        @keyframes proto-glow {
          0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
          50%      { opacity: 0.95; transform: translate(-50%, -50%) scale(1.08); }
        }
        @keyframes proto-float {
          0%   { transform: translateY(0); opacity: 0; }
          12%  { opacity: 1; }
          80%  { opacity: 0.8; }
          100% { transform: translateY(-220px); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="proto-scan"], [style*="proto-spin"], [style*="proto-blink"],
          [style*="proto-sweep"], [style*="proto-glow"], [style*="proto-float"] { animation: none !important; }
        }
      `}</style>
    </figure>
  )
}
