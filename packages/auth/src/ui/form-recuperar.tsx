"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useConfigCuenta } from "../config"
import { mensajeError, useSupabase } from "../cliente"
import { Aviso, BotonPrincipal, Campo, PanelCuenta, enlace } from "./formulario"

export function FormRecuperar() {
  const { sitio, rutas } = useConfigCuenta()
  const sb = useSupabase()
  const [error, setError] = useState<string | null>(null)
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const correo = String(new FormData(e.currentTarget).get("correo")).trim()
    if (!/^\S+@\S+\.\S+$/.test(correo))
      return setError(
        "Escribe un correo válido, por ejemplo nombre@dominio.com."
      )
    setEnviando(true)
    setError(null)
    const { error } = await sb.auth.resetPasswordForEmail(correo, {
      redirectTo: `${window.location.origin}${rutas.restablecer}`,
    })
    setEnviando(false)
    if (error) return setError(mensajeError(error))
    // Siempre el mismo mensaje: no se revela si el correo tiene cuenta.
    setEnviado(true)
  }

  return (
    <PanelCuenta
      sitio={sitio}
      titulo="Recuperar contraseña"
      descripcion="Te enviaremos un enlace para crear una contraseña nueva."
    >
      {enviado ? (
        <Aviso tipo="exito">
          Si ese correo tiene una cuenta, te llegará un enlace en unos minutos.
          El enlace vence en una hora. Revisa también la carpeta de spam.
        </Aviso>
      ) : (
        <form onSubmit={enviar} className="space-y-4" noValidate>
          {error && <Aviso tipo="error">{error}</Aviso>}
          <Campo
            id="correo"
            etiqueta="Correo electrónico"
            type="email"
            autoComplete="email"
            required
          />
          <BotonPrincipal type="submit" disabled={enviando}>
            {enviando ? "Enviando…" : "Enviar enlace"}
          </BotonPrincipal>
        </form>
      )}
      <p className="mt-6 text-sm">
        <Link href={rutas.ingresar} className={enlace}>
          Volver a ingresar
        </Link>
      </p>
    </PanelCuenta>
  )
}
