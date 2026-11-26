"use client"

import { useEffect, useState } from "react"
import { isAuthSessionMissingError, type Session, type SupabaseClient } from "@supabase/supabase-js"
import { useSupabase } from "../cliente"

// Cada sitio guarda su propia sesión. «Cerrar sesión» las revoca todas en Supabase
// (scope global), pero el otro sitio no se entera solo: por eso, al abrir la página y al
// volver a la pestaña, se pregunta a Supabase si la sesión sigue viva. Si la cerraron en
// el otro sitio, se cierra también aquí. Varias partes de la página usan este hook, así
// que la consulta se comparte y se repite como mucho cada 30 s.
let ultimaVerificacion = 0
let enCurso: Promise<void> | null = null

function verificar(sb: SupabaseClient) {
  if (enCurso) return enCurso
  if (Date.now() - ultimaVerificacion < 30_000) return Promise.resolve()
  ultimaVerificacion = Date.now()
  enCurso = sb.auth
    .getUser()
    .then(async ({ error }) => {
      // Solo si Supabase dice que la sesión ya no existe; un fallo de red no cierra nada.
      if (error && isAuthSessionMissingError(error)) await sb.auth.signOut({ scope: "local" })
    })
    .finally(() => {
      enCurso = null
    })
  return enCurso
}

/** Sesión actual: `undefined` mientras se lee, `null` si no hay. */
export function useSesion() {
  const sb = useSupabase()
  const [sesion, setSesion] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setSesion(data.session)
      if (data.session) verificar(sb)
    })
    const { data } = sb.auth.onAuthStateChange((_evento, nueva) => setSesion(nueva))
    const alVolver = () => {
      if (document.visibilityState === "visible") verificar(sb)
    }
    document.addEventListener("visibilitychange", alVolver)
    return () => {
      data.subscription.unsubscribe()
      document.removeEventListener("visibilitychange", alVolver)
    }
  }, [sb])

  return sesion
}
