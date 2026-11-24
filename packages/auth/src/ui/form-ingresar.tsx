"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useConfigCuenta } from "../config"
import { destinoSeguro, mensajeError, useSupabase } from "../cliente"
import {
  Aviso,
  BotonPrincipal,
  BotonSecundario,
  Campo,
  PanelCuenta,
  enlace,
} from "./formulario"

export function FormIngresar() {
  const { sitio, rutas, otroSitio } = useConfigCuenta()
  const sb = useSupabase()
  const router = useRouter()
  const siguiente = destinoSeguro(useSearchParams().get("next"), rutas.cuenta)
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    // Si ya hay sesión, no tiene sentido mostrar el formulario.
    sb.auth
      .getSession()
      .then(({ data }) => data.session && router.replace(siguiente))
  }, [sb, router, siguiente])

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const datos = new FormData(e.currentTarget)
    setEnviando(true)
    setError(null)
    const { error } = await sb.auth.signInWithPassword({
      email: String(datos.get("correo")).trim(),
      password: String(datos.get("contrasena")),
    })
    setEnviando(false)
    if (error) return setError(mensajeError(error))
    router.replace(siguiente)
  }

  function continuarConOtroSitio() {
    if (!otroSitio) return
    const vuelta = `${window.location.origin}${rutas.continuar}?next=${encodeURIComponent(siguiente)}`
    window.location.href = `${otroSitio.continuarUrl}?redirect_to=${encodeURIComponent(vuelta)}`
  }

  return (
    <PanelCuenta
      sitio={sitio}
      titulo="Ingresar"
      descripcion="Entra con tu cuenta del Centro de Prototipado y la Red STEAM."
    >
      <form onSubmit={enviar} className="space-y-4" noValidate>
        {error && <Aviso tipo="error">{error}</Aviso>}
        <Campo
          id="correo"
          etiqueta="Correo electrónico"
          type="email"
          autoComplete="email"
          required
        />
        <Campo
          id="contrasena"
          etiqueta="Contraseña"
          type="password"
          autoComplete="current-password"
          required
        />
        <div className="text-right text-sm">
          <Link href={rutas.recuperar} className={enlace}>
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
        <BotonPrincipal type="submit" disabled={enviando}>
          {enviando ? "Ingresando…" : "Ingresar"}
        </BotonPrincipal>
      </form>

      {otroSitio && (
        <BotonSecundario
          type="button"
          onClick={continuarConOtroSitio}
          className="mt-3"
        >
          Continuar con mi sesión de {otroSitio.nombre}
        </BotonSecundario>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        ¿No tienes cuenta?{" "}
        <Link href={rutas.registro} className={enlace}>
          Regístrate
        </Link>
      </p>
    </PanelCuenta>
  )
}
