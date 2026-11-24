"use client"

import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { useSupabase } from "../cliente"

/** Sesión actual: `undefined` mientras se lee, `null` si no hay. */
export function useSesion() {
  const sb = useSupabase()
  const [sesion, setSesion] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => setSesion(data.session))
    const { data } = sb.auth.onAuthStateChange((_evento, nueva) =>
      setSesion(nueva)
    )
    return () => data.subscription.unsubscribe()
  }, [sb])

  return sesion
}
