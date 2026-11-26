"use client"

import { useEffect, useState } from "react"
import { useSesion, useSupabase } from "@cen/auth"

/**
 * ¿La persona con sesión es coordinación o administración? (roles de red.miembros, los
 * mismos de la Red STEAM). `undefined` mientras se averigua; `null` si no hay sesión.
 */
export function useCoordinacion():
  { userId: string; esCoordinador: boolean } | null | undefined {
  const sb = useSupabase()
  const sesion = useSesion()
  const userId = sesion?.user.id
  const [estado, setEstado] = useState<{ para: string; valor: boolean } | null>(
    null
  )

  useEffect(() => {
    if (!userId) return
    let vigente = true
    sb.schema("red")
      .rpc("es_coordinador")
      .then(({ data }) => {
        if (vigente) setEstado({ para: userId, valor: data === true })
      })
    return () => {
      vigente = false
    }
  }, [sb, userId])

  if (sesion === undefined) return undefined
  if (sesion === null) return null
  if (!estado || estado.para !== sesion.user.id) return undefined
  return { userId: sesion.user.id, esCoordinador: estado.valor }
}
