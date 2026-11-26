"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpRightIcon, LogOutIcon } from "lucide-react"
import { useConfigCuenta } from "../config"
import { mensajeError, urlConSesion, useSupabase } from "../cliente"
import { useSesion } from "./use-sesion"
import {
  Aviso,
  BotonSecundario,
  PanelCuenta,
} from "./formulario"

/**
 * Datos comunes de la cuenta (nombre, correo, cerrar sesión, ir al otro sitio).
 * Cada app puede añadir su propia sección (p. ej. los roles de la Red) con `children`.
 */
export function MiCuenta({
  children,
}: {
  children?: (userId: string) => ReactNode
}) {
  const { sitio, rutas, otroSitio, supabaseUrl, supabaseKey } =
    useConfigCuenta()
  const sb = useSupabase()
  const router = useRouter()
  const sesion = useSesion()
  const params = useSearchParams()
  const [nombre, setNombre] = useState("")
  const [aviso, setAviso] = useState<{
    tipo: "exito" | "error"
    texto: string
  } | null>(() =>
    params.get("bienvenida")
      ? {
          tipo: "exito",
          texto: "¡Tu cuenta quedó confirmada! Ya puedes usar la plataforma.",
        }
      : params.get("contrasena")
        ? { tipo: "exito", texto: "Tu contraseña se actualizó." }
        : null
  )
  const [saliendo, setSaliendo] = useState(false)

  useEffect(() => {
    if (sesion === null)
      router.replace(
        `${rutas.ingresar}?next=${encodeURIComponent(rutas.cuenta)}`
      )
    if (!sesion) return
    sb.from("perfiles")
      .select("nombre")
      .eq("id", sesion.user.id)
      .maybeSingle()
      .then(({ data }) => setNombre(data?.nombre ?? ""))
  }, [sesion, sb, router, rutas])

  async function irAlOtroSitio() {
    if (!otroSitio) return
    try {
      const url = await urlConSesion(
        sb,
        supabaseUrl,
        supabaseKey,
        otroSitio.continuarUrl
      )
      if (url) window.location.href = url
    } catch (error) {
      setAviso({ tipo: "error", texto: mensajeError(error) })
    }
  }

  async function salir() {
    setSaliendo(true)
    await sb.auth.signOut({ scope: "global" })
    router.replace("/")
  }

  if (!sesion) {
    return (
      <PanelCuenta sitio={sitio} titulo="Mi cuenta">
        <Aviso>Cargando tu cuenta…</Aviso>
      </PanelCuenta>
    )
  }

  return (
    <PanelCuenta
      sitio={sitio}
      titulo="Mi cuenta"
      descripcion={sesion.user.email}
    >
      <div className="space-y-6">
        {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}

        <div className="space-y-1">
          <p className="text-sm font-semibold">Nombre</p>
          <p className="text-base">{nombre || "Sin nombre"}</p>
        </div>

        {children?.(sesion.user.id)}

        <div className="flex flex-col gap-2">
          {otroSitio && (
            <BotonSecundario type="button" onClick={irAlOtroSitio}>
              Ir a {otroSitio.nombre} con mi sesión{" "}
              <ArrowUpRightIcon className="size-4" aria-hidden="true" />
            </BotonSecundario>
          )}
          <BotonSecundario type="button" onClick={salir} disabled={saliendo}>
            <LogOutIcon className="size-4" aria-hidden="true" />{" "}
            {saliendo ? "Cerrando…" : "Cerrar sesión"}
          </BotonSecundario>
        </div>
      </div>
    </PanelCuenta>
  )
}
