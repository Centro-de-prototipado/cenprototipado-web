import type { ReactNode } from "react"
import Link from "next/link"
import { ChevronLeftIcon } from "lucide-react"
import { cn } from "./formulario"

/**
 * Pantalla dividida de las páginas de cuenta (diseño del login del Centro):
 * un panel de marca y el formulario. El Centro pone el formulario a la derecha;
 * la Red, a la izquierda (espejo). En celular solo se ve el formulario.
 */
export function MarcoDividido({
  panel,
  formulario = "derecha",
  logoMovil,
  children,
}: {
  /** Panel de marca (logo, cita, gráfico). */
  panel: ReactNode
  /** Lado del formulario en pantallas grandes. */
  formulario?: "derecha" | "izquierda"
  /** Logo que se muestra arriba del formulario en celular. */
  logoMovil?: ReactNode
  children: ReactNode
}) {
  const izquierda = formulario === "izquierda"
  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      <div
        className={cn(
          "relative hidden h-full flex-col overflow-hidden p-10 lg:flex",
          izquierda ? "order-2 border-l" : "border-r"
        )}
      >
        {panel}
      </div>
      <div
        className={cn(
          "relative flex min-h-screen flex-col justify-center overflow-y-auto bg-background/60 px-8 py-20",
          izquierda && "order-1"
        )}
      >
        <Link
          href="/"
          className="absolute top-7 left-5 inline-flex min-h-10 items-center gap-1 px-3 text-sm font-medium hover:bg-accent"
        >
          <ChevronLeftIcon className="size-4" aria-hidden="true" /> Inicio
        </Link>
        {logoMovil && (
          <div className="mb-6 flex justify-center lg:hidden">{logoMovil}</div>
        )}
        {children}
      </div>
    </main>
  )
}
