"use client"

import Link from "next/link"
import { AwardIcon, LayoutDashboardIcon, UserIcon } from "lucide-react"
import { CuentaProvider, MenuCuenta, claseOpcionMenu } from "@cen/auth"
import { configCuenta } from "@/lib/cuenta-config"
import { Button } from "@/components/ui/button"
import { useCoordinacion } from "@/lib/aprende/use-coordinacion"

/**
 * Perfil en el encabezado del Centro: «Ingresar» sin sesión; con sesión, el nombre de la
 * persona y un menú con sus certificados, la gestión de Aprende (coordinación), Mi cuenta,
 * el paso a la Red STEAM y Cerrar sesión.
 */
export function MenuCuentaCentro({
  anchoCompleto = false,
}: {
  anchoCompleto?: boolean
}) {
  return (
    <CuentaProvider config={configCuenta}>
      <Menu anchoCompleto={anchoCompleto} />
    </CuentaProvider>
  )
}

function Menu({ anchoCompleto }: { anchoCompleto: boolean }) {
  const gestiona = useCoordinacion()?.esCoordinador === true
  return (
    <MenuCuenta
      className={anchoCompleto ? "flex-1" : undefined}
      botonIngresar={
        <Link href="/login" className={anchoCompleto ? "flex-1" : undefined}>
          <Button
            className={anchoCompleto ? "w-full" : undefined}
            variant="outline"
          >
            Ingresar
          </Button>
        </Link>
      }
      enlaces={(_, cerrar) => (
        <>
          <Link
            href="/cuenta#certificados"
            onClick={cerrar}
            className={claseOpcionMenu}
          >
            <AwardIcon className="size-4" aria-hidden="true" />
            Mis certificados
          </Link>
          {gestiona && (
            <Link
              href="/aprende/gestion"
              onClick={cerrar}
              className={claseOpcionMenu}
            >
              <LayoutDashboardIcon className="size-4" aria-hidden="true" />
              Gestión de Aprende
            </Link>
          )}
          <Link href="/cuenta" onClick={cerrar} className={claseOpcionMenu}>
            <UserIcon className="size-4" aria-hidden="true" />
            Mi cuenta
          </Link>
        </>
      )}
    />
  )
}
