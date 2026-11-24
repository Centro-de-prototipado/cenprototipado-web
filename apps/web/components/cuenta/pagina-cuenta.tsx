"use client"

import { Suspense, type ReactNode } from "react"
import { CuentaProvider, MarcoDividido } from "@cen/auth"
import { configCuenta } from "@/lib/cuenta-config"
import { Logo } from "@/components/shared/logo"
import { PanelCentro } from "@/components/cuenta/panel-centro"

/**
 * Marco de todas las páginas de cuenta del Centro (login, registro, recuperación, mi cuenta…):
 * panel de marca a la izquierda y formulario a la derecha.
 */
export function PaginaCuenta({ children }: { children: ReactNode }) {
  return (
    <CuentaProvider config={configCuenta}>
      <MarcoDividido
        panel={<PanelCentro />}
        formulario="derecha"
        logoMovil={<Logo className="h-20" />}
      >
        <Suspense>{children}</Suspense>
      </MarcoDividido>
    </CuentaProvider>
  )
}
