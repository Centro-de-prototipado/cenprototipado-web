"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useConfigCuenta } from "../config"
import { destinoSeguro, urlConSesion, useSupabase } from "../cliente"
import { Aviso, PanelCuenta, enlace } from "./formulario"

/**
 * Paso de sesión entre los dos sitios (misma cuenta, dominios distintos). La misma ruta hace dos cosas:
 *
 * - `?token_hash=…` → RECIBIR: canjea el código de un solo uso que envió el otro sitio y abre una
 *   sesión nueva aquí. Luego va a `next`.
 * - `?redirect_to=…` → ENVIAR: el otro sitio pide entrar con la sesión de aquí. Si hay sesión, se
 *   genera un código (Edge Function `paso-de-sesion`) y se vuelve al otro sitio; si no, primero se
 *   inicia sesión aquí y luego se continúa.
 */
export function Continuar() {
  const { sitio, rutas, supabaseUrl, supabaseKey } = useConfigCuenta()
  const sb = useSupabase()
  const router = useRouter()
  const params = useSearchParams()
  const tokenHash = params.get("token_hash")
  const redirectTo = params.get("redirect_to")
  const siguiente = destinoSeguro(params.get("next"), "/")
  const [fallo, setFallo] = useState(false)
  const sinDatos = !tokenHash && !redirectTo

  useEffect(() => {
    if (tokenHash) {
      sb.auth
        .verifyOtp({ token_hash: tokenHash, type: "magiclink" })
        .then(({ error }) => {
          // Quitar el código de la barra de direcciones en cualquier caso.
          window.history.replaceState(null, "", window.location.pathname)
          if (error) setFallo(true)
          else router.replace(siguiente)
        })
      return
    }
    if (redirectTo) {
      sb.auth.getSession().then(async ({ data }) => {
        if (!data.session) {
          const volver = `${rutas.continuar}?redirect_to=${encodeURIComponent(redirectTo)}`
          router.replace(`${rutas.ingresar}?next=${encodeURIComponent(volver)}`)
          return
        }
        try {
          const url = await urlConSesion(
            sb,
            supabaseUrl,
            supabaseKey,
            redirectTo
          )
          if (url) window.location.replace(url)
          else setFallo(true)
        } catch {
          setFallo(true)
        }
      })
    }
  }, [
    sb,
    router,
    tokenHash,
    redirectTo,
    siguiente,
    rutas,
    supabaseUrl,
    supabaseKey,
  ])

  if (fallo || sinDatos) {
    return (
      <PanelCuenta sitio={sitio} titulo="No pudimos continuar">
        <Aviso tipo="error">
          El enlace para continuar con tu sesión venció, ya se usó o no es
          válido.
        </Aviso>
        <p className="mt-6 text-sm">
          <Link href={rutas.ingresar} className={enlace}>
            Ingresar con tu correo y contraseña
          </Link>
        </p>
      </PanelCuenta>
    )
  }

  return (
    <PanelCuenta
      sitio={sitio}
      titulo={tokenHash ? "Entrando…" : "Continuando…"}
    >
      <Aviso>
        {tokenHash
          ? `Estamos abriendo tu sesión en ${sitio}.`
          : "Te llevamos al otro sitio con tu sesión."}
      </Aviso>
    </PanelCuenta>
  )
}
