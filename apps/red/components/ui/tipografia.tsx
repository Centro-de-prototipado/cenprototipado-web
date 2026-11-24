import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

// Escala tipográfica del sitio del Centro (copiada de sus componentes) para que los dos
// sitios midan igual. Si el Centro cambia, se ajusta aquí.
export const tipo = {
  /** Título principal (hero del Centro): 36 → 48 → hasta 72 px. */
  h1: "m-0 max-w-xl text-4xl leading-[0.98] font-extrabold tracking-[-0.03em] text-balance text-foreground sm:text-5xl lg:text-[clamp(38px,5vw,72px)]",
  /** Texto bajo el título principal: 16 → 17 px. */
  entrada: "m-0 max-w-[44ch] text-base leading-relaxed text-muted-foreground lg:text-[clamp(15px,1.4vw,17px)]",
  /** Título de sección (TechHeading del Centro): 30 → 48 px. */
  h2: "mt-3.5 max-w-2xl text-3xl leading-[1.05] font-extrabold tracking-[-0.015em] text-balance text-foreground md:text-5xl",
  /** Texto bajo el título de sección. */
  bajada: "mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground",
  /** Antetítulo de tarjeta: 10 px. */
  etiqueta: "text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase",
  /** Título de tarjeta. */
  h3: "text-base leading-tight font-bold text-foreground",
  /** Texto de tarjeta. */
  textoTarjeta: "text-xs leading-relaxed text-muted-foreground",
  /** Cifra de los indicadores. */
  cifra: "font-extrabold tracking-[-0.02em] text-foreground text-[clamp(22px,2.6vw,30px)]",
  /** Rótulo de los indicadores. */
  rotulo: "text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase",
  /** Relleno de las secciones. */
  seccion: "px-8 py-14 lg:px-16 lg:py-16",
}

/** Antetítulo de 11 px en mayúsculas espaciadas; con `pulso`, el cuadrito cian del hero. */
export function Antetitulo({ children, pulso = false, className }: { children: ReactNode; pulso?: boolean; className?: string }) {
  return (
    <p className={cn("flex items-center gap-2 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase", className)}>
      {pulso && <span aria-hidden="true" className="size-1.5 animate-pulse bg-primary [animation-duration:2s]" />}
      {children}
    </p>
  )
}
