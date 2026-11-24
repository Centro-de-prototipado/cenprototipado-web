"use client"

import { useEffect, useState, type FormEvent, type ReactNode } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowUpRightIcon, LogOutIcon } from "lucide-react"
import { useConfigCuenta } from "../config"
import { mensajeError, urlConSesion, useSupabase } from "../cliente"
import { useSesion } from "./use-sesion"
import {
  Aviso,
  BotonPrincipal,
  BotonSecundario,
  Campo,
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
  const [guardando, setGuardando] = useState(false)
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

  async function guardarNombre(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!sesion) return
    const nuevo = nombre.trim()
    if (nuevo.length < 3)
      return setAviso({ tipo: "error", texto: "Escribe tu nombre completo." })
    setGuardando(true)
    const { error } = await sb
      .from("perfiles")
      .update({ nombre: nuevo })
      .eq("id", sesion.user.id)
    setGuardando(false)
    setAviso(
      error
        ? { tipo: "error", texto: mensajeError(error) }
        : { tipo: "exito", texto: "Nombre actualizado." }
    )
  }

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
    await sb.auth.signOut()
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

        <form onSubmit={guardarNombre} className="space-y-3">
          <Campo
            id="nombre"
            etiqueta="Nombre"
            autoComplete="name"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
          <BotonPrincipal type="submit" disabled={guardando} className="w-auto">
            {guardando ? "Guardando…" : "Guardar nombre"}
          </BotonPrincipal>
        </form>

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
