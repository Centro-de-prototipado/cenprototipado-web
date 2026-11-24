import { Suspense, type ReactNode } from "react"
import { MarcoDividido } from "@cen/auth"
import { MarcaRed, PanelRed } from "@/components/cuenta/panel-red"

/**
 * Marco de las páginas de cuenta de la Red: mismo diseño del login del Centro, en espejo
 * (formulario a la izquierda, panel con el mapa de Caldas a la derecha).
 */
export function PaginaCuenta({ children }: { children: ReactNode }) {
  return (
    <MarcoDividido panel={<PanelRed />} formulario="izquierda" logoMovil={<MarcaRed />}>
      <Suspense>{children}</Suspense>
    </MarcoDividido>
  )
}
