"use client"

import Link from "next/link"
import { UserIcon } from "lucide-react"
import { useConfigCuenta } from "../config"
import { useSesion } from "./use-sesion"
import { cn } from "./formulario"

/** Botón del encabezado: «Ingresar» o «Mi cuenta» según haya sesión. */
export function BotonCuenta({ className }: { className?: string }) {
  const { rutas } = useConfigCuenta()
  const conSesion = Boolean(useSesion())
  return (
    <Link
      href={conSesion ? rutas.cuenta : rutas.ingresar}
      className={cn(
        "inline-flex min-h-10 items-center gap-1.5 bg-primary px-3 font-semibold text-neutral-950 hover:bg-primary/85",
        className
      )}
    >
      <UserIcon className="size-4" aria-hidden="true" />
      {conSesion ? "Mi cuenta" : "Ingresar"}
    </Link>
  )
}
