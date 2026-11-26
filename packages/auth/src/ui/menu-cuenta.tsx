"use client"

import { useEffect, useId, useRef, useState, type ReactNode } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowUpRightIcon, ChevronDownIcon, LogOutIcon, UserIcon } from "lucide-react"
import { useConfigCuenta } from "../config"
import { mensajeError, urlConSesion, useSupabase } from "../cliente"
import { useSesion } from "./use-sesion"
import { cn } from "./formulario"

/** Clase de cada opción del menú (las apps la usan para sus propios enlaces). */
export const claseOpcionMenu =
  "flex min-h-10 w-full items-center gap-2 px-3 text-left text-sm font-medium hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"

/**
 * Perfil en el encabezado. Sin sesión: botón «Ingresar». Con sesión: nombre de la persona;
 * al hacer clic abre un menú con sus accesos (`enlaces`, propios de cada app), el paso de
 * sesión al otro sitio y «Cerrar sesión».
 */
export function MenuCuenta({
  enlaces,
  botonIngresar,
  className,
}: {
  enlaces?: (userId: string, cerrar: () => void) => ReactNode
  /** Botón «Ingresar» propio del sitio; si no se da, se usa uno con el color principal. */
  botonIngresar?: ReactNode
  className?: string
}) {
  const { rutas, otroSitio, supabaseUrl, supabaseKey } = useConfigCuenta()
  const sb = useSupabase()
  const router = useRouter()
  const sesion = useSesion()
  const [nombre, setNombre] = useState<{ id: string; valor: string } | null>(null)
  const [abierto, setAbierto] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const contenedor = useRef<HTMLDivElement>(null)
  const boton = useRef<HTMLButtonElement>(null)
  const idMenu = useId()
  const userId = sesion?.user.id

  useEffect(() => {
    if (!userId) return
    let vigente = true
    sb.from("perfiles")
      .select("nombre")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (vigente) setNombre({ id: userId, valor: data?.nombre ?? "" })
      })
    return () => {
      vigente = false
    }
  }, [sb, userId])

  // Cierra al hacer clic fuera o con Escape (y devuelve el foco al botón).
  useEffect(() => {
    if (!abierto) return
    const fuera = (e: MouseEvent) => {
      if (!contenedor.current?.contains(e.target as Node)) setAbierto(false)
    }
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAbierto(false)
        boton.current?.focus()
      }
    }
    document.addEventListener("mousedown", fuera)
    document.addEventListener("keydown", tecla)
    return () => {
      document.removeEventListener("mousedown", fuera)
      document.removeEventListener("keydown", tecla)
    }
  }, [abierto])

  if (sesion === undefined) return <span className={cn("inline-block h-9 w-28", className)} aria-hidden="true" />

  if (!sesion)
    return (
      botonIngresar ?? (
        <Link
          href={rutas.ingresar}
          className={cn("inline-flex h-9 items-center gap-1.5 bg-primary px-3 text-sm font-medium text-neutral-950 hover:bg-primary/85", className)}
        >
          <UserIcon className="size-4" aria-hidden="true" />
          Ingresar
        </Link>
      )
    )

  const completo = (nombre?.id === sesion.user.id && nombre.valor) || sesion.user.email || "Mi cuenta"
  const primero = completo.split(/[\s@]/)[0]
  const inicial = primero.charAt(0).toUpperCase()
  const cerrar = () => setAbierto(false)

  async function irAlOtroSitio() {
    if (!otroSitio) return
    try {
      const url = await urlConSesion(sb, supabaseUrl, supabaseKey, otroSitio.continuarUrl)
      if (url) window.location.href = url
    } catch (e) {
      setError(mensajeError(e))
    }
  }

  async function salir() {
    cerrar()
    await sb.auth.signOut({ scope: "global" })
    router.replace("/")
    router.refresh()
  }

  return (
    <div ref={contenedor} className={cn("relative", className)}>
      <button
        ref={boton}
        type="button"
        aria-expanded={abierto}
        aria-controls={idMenu}
        onClick={() => setAbierto((v) => !v)}
        className="inline-flex h-9 items-center gap-2 border border-border bg-background pr-2 pl-1 text-sm font-medium hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        <span aria-hidden="true" className="grid size-7 place-items-center bg-primary text-xs font-bold text-neutral-950">
          {inicial}
        </span>
        <span className="max-w-32 truncate">{primero}</span>
        <span className="sr-only">: menú de tu cuenta</span>
        <ChevronDownIcon className={cn("size-4 transition-transform", abierto && "rotate-180")} aria-hidden="true" />
      </button>

      {abierto && (
        <div id={idMenu} className="absolute top-full right-0 z-50 mt-2 w-72 border bg-card shadow-lg">
          <div className="border-b px-3 py-3">
            <p className="m-0 truncate text-sm font-semibold">{completo}</p>
            <p className="m-0 truncate text-xs text-muted-foreground">{sesion.user.email}</p>
          </div>
          <div className="flex flex-col py-1">
            {enlaces?.(sesion.user.id, cerrar)}
            {otroSitio && (
              <button type="button" onClick={irAlOtroSitio} className={claseOpcionMenu}>
                <ArrowUpRightIcon className="size-4" aria-hidden="true" />
                Ir a {otroSitio.nombre} con mi sesión
              </button>
            )}
            {error && (
              <p role="alert" className="m-0 px-3 py-2 text-xs text-destructive-foreground">
                {error}
              </p>
            )}
          </div>
          <div className="border-t py-1">
            <button type="button" onClick={salir} className={claseOpcionMenu}>
              <LogOutIcon className="size-4" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
