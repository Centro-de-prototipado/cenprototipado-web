"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useConfigCuenta } from "../config"
import { mensajeError, useSupabase } from "../cliente"
import { Aviso, BotonPrincipal, Campo, PanelCuenta, enlace } from "./formulario"

/**
 * Llega desde el enlace del correo de recuperación. Supabase lee el enlace (detectSessionInUrl)
 * y abre una sesión temporal de recuperación; con ella se fija la contraseña nueva.
 */
export function FormRestablecer() {
  const { sitio, rutas } = useConfigCuenta()
  const sb = useSupabase()
  const router = useRouter()
  const [listo, setListo] = useState<boolean | null>(null)
  const [errores, setErrores] = useState<{
    contrasena?: string
    confirmar?: string
  }>({})
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    const { data } = sb.auth.onAuthStateChange((evento, sesion) => {
      if (evento === "PASSWORD_RECOVERY" || sesion) setListo(true)
    })
    // Si el enlace ya se procesó o no es válido, decidir tras un momento.
    const t = setTimeout(async () => {
      const { data: s } = await sb.auth.getSession()
      setListo((actual) => actual ?? Boolean(s.session))
    }, 1500)
    return () => {
      clearTimeout(t)
      data.subscription.unsubscribe()
    }
  }, [sb])

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    const contrasena = String(datos.get("contrasena"))
    const confirmar = String(datos.get("confirmar"))
    const nuevos: typeof errores = {}
    if (contrasena.length < 8)
      nuevos.contrasena = "La contraseña debe tener al menos 8 caracteres."
    if (confirmar !== contrasena)
      nuevos.confirmar = "Las contraseñas no coinciden."
    setErrores(nuevos)
    if (Object.keys(nuevos).length) return
    setEnviando(true)
    setError(null)
    const { error } = await sb.auth.updateUser({ password: contrasena })
    setEnviando(false)
    if (error) return setError(mensajeError(error))
    router.replace(`${rutas.cuenta}?contrasena=1`)
  }

  if (listo === null) {
    return (
      <PanelCuenta sitio={sitio} titulo="Nueva contraseña">
        <Aviso>Comprobando el enlace…</Aviso>
      </PanelCuenta>
    )
  }

  if (!listo) {
    return (
      <PanelCuenta sitio={sitio} titulo="Enlace no válido">
        <Aviso tipo="error">
          El enlace venció o ya se usó. Pide uno nuevo.
        </Aviso>
        <p className="mt-6 text-sm">
          <Link href={rutas.recuperar} className={enlace}>
            Pedir otro enlace
          </Link>
        </p>
      </PanelCuenta>
    )
  }

  return (
    <PanelCuenta
      sitio={sitio}
      titulo="Nueva contraseña"
      descripcion="Escribe tu nueva contraseña. Servirá en el sitio del Centro y en la Red STEAM."
    >
      <form onSubmit={enviar} className="space-y-4" noValidate>
        {error && <Aviso tipo="error">{error}</Aviso>}
        <Campo
          id="contrasena"
          etiqueta="Nueva contraseña"
          type="password"
          autoComplete="new-password"
          required
          error={errores.contrasena}
          ayuda="Mínimo 8 caracteres."
        />
        <Campo
          id="confirmar"
          etiqueta="Confirmar contraseña"
          type="password"
          autoComplete="new-password"
          required
          error={errores.confirmar}
        />
        <BotonPrincipal type="submit" disabled={enviando}>
          {enviando ? "Guardando…" : "Guardar contraseña"}
        </BotonPrincipal>
      </form>
    </PanelCuenta>
  )
}
