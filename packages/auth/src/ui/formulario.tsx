import type { ComponentProps, ReactNode } from "react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Piezas de formulario con el estilo del Centro: esquinas rectas, etiqueta visible,
// error en palabras (aria-invalid) y controles de 44 px.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function PanelCuenta({
  sitio,
  titulo,
  descripcion,
  children,
}: {
  sitio: string
  titulo: string
  descripcion?: ReactNode
  children: ReactNode
}) {
  // Mismo estilo de la pantalla de login del Centro: sin tarjeta, título y texto sobre el fondo.
  return (
    <div className="relative mx-auto w-full space-y-6 sm:w-sm">
      <div className="space-y-1">
        <p className="font-mono text-xs tracking-[0.2em] text-cyan-700 uppercase dark:text-cyan-400">
          Cuenta · {sitio}
        </p>
        <h1 className="text-2xl font-bold">{titulo}</h1>
        {descripcion && (
          <p className="text-base text-muted-foreground">{descripcion}</p>
        )}
      </div>
      <div>{children}</div>
      <p className="text-xs text-muted-foreground">
        Una sola cuenta para el sitio del Centro de Prototipado y la Red STEAM.
      </p>
    </div>
  )
}

export function Campo({
  id,
  etiqueta,
  error,
  ayuda,
  ...props
}: ComponentProps<"input"> & {
  id: string
  etiqueta: string
  error?: string
  ayuda?: string
}) {
  const descripcion = error ? `${id}-error` : ayuda ? `${id}-ayuda` : undefined
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold">
        {etiqueta}
      </label>
      <input
        id={id}
        name={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={descripcion}
        className={cn(
          "block min-h-11 w-full border bg-background px-3 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          error ? "border-destructive" : "border-input"
        )}
        {...props}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive-foreground">
          {error}
        </p>
      ) : (
        ayuda && (
          <p id={`${id}-ayuda`} className="text-xs text-muted-foreground">
            {ayuda}
          </p>
        )
      )}
    </div>
  )
}

export function BotonPrincipal({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center gap-2 border-2 border-primary bg-primary px-6 font-semibold text-neutral-950 shadow-[3px_3px_0_0_color-mix(in_oklch,var(--primary)_60%,black)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function BotonSecundario({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 w-full items-center justify-center gap-2 border px-4 text-sm font-medium hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none disabled:opacity-60",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export function Aviso({
  tipo = "info",
  children,
}: {
  tipo?: "info" | "error" | "exito"
  children: ReactNode
}) {
  const estilos = {
    info: "border-blue-500/40 bg-blue-500/10",
    error: "border-red-500/40 bg-red-500/10",
    exito: "border-emerald-500/40 bg-emerald-500/10",
  }
  return (
    <div
      role={tipo === "error" ? "alert" : "status"}
      aria-live="polite"
      className={cn("border p-3 text-sm", estilos[tipo])}
    >
      {children}
    </div>
  )
}

export const enlace =
  "font-semibold text-cyan-700 underline underline-offset-4 dark:text-cyan-400"
