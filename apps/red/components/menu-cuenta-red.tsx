"use client"

import Link from "next/link"
import { LayoutDashboardIcon, SchoolIcon, UserIcon } from "lucide-react"
import { MenuCuenta, claseOpcionMenu } from "@cen/auth"
import { ETIQUETA_ROL, useRoles } from "@/components/panel/use-roles"

/** Menú de perfil de la Red: además de lo común, los paneles según el rol de la persona. */
export function MenuCuentaRed() {
  const estado = useRoles()
  return (
    <MenuCuenta
      enlaces={(_, cerrar) => {
        if (estado.cargando || estado.userId === null) return null
        const rol = estado.esAdmin ? "admin" : estado.esCoordinador ? "coordinador" : estado.misAulas.length ? "gestor" : null
        return (
          <>
            <p className="m-0 px-3 pt-1 pb-2 text-xs text-muted-foreground">{rol ? ETIQUETA_ROL[rol] : "Participante"}</p>
            {estado.esCoordinador && (
              <Link href="/admin" onClick={cerrar} className={claseOpcionMenu}>
                <LayoutDashboardIcon className="size-4" aria-hidden="true" />
                Administración
              </Link>
            )}
            {(estado.esCoordinador || estado.misAulas.length > 0) && (
              <Link href="/mi-aula" onClick={cerrar} className={claseOpcionMenu}>
                <SchoolIcon className="size-4" aria-hidden="true" />
                {estado.esCoordinador ? "Aulas" : "Mi aula"}
              </Link>
            )}
            <Link href="/cuenta" onClick={cerrar} className={claseOpcionMenu}>
              <UserIcon className="size-4" aria-hidden="true" />
              Mi cuenta
            </Link>
          </>
        )
      }}
    />
  )
}
