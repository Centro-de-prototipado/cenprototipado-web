"use client"

import { useEffect, useState } from "react"
import { useSesion, useSupabase } from "@cen/auth"

export type RolRed = "gestor" | "coordinador" | "admin"
export type AulaCorta = { id: string; nombre: string; slug: string }
export type MiRol = { rol: RolRed; aula: AulaCorta | null }

export const ETIQUETA_ROL: Record<RolRed, string> = {
  gestor: "Gestor de aula",
  coordinador: "Coordinación de la red",
  admin: "Administración",
}

type Estado =
  | { cargando: true }
  | { cargando: false; userId: null }
  | {
      cargando: false
      userId: string
      roles: MiRol[]
      esCoordinador: boolean
      esAdmin: boolean
      /** Aulas que gestiona la persona (como gestor). */
      misAulas: AulaCorta[]
    }

/** Sesión y roles de la persona en la Red (tabla red.miembros). */
export function useRoles(): Estado {
  const sb = useSupabase()
  const sesion = useSesion()
  const userId = sesion?.user.id
  const [roles, setRoles] = useState<{ para: string; lista: MiRol[] } | null>(null)

  useEffect(() => {
    if (!userId) return
    let vigente = true
    sb.schema("red")
      .from("miembros")
      .select("rol, aula:aulas(id, nombre, slug)")
      .eq("user_id", userId)
      .then(({ data }) => {
        if (vigente) setRoles({ para: userId, lista: (data as unknown as MiRol[]) ?? [] })
      })
    return () => {
      vigente = false
    }
  }, [sb, userId])

  if (sesion === undefined) return { cargando: true }
  if (sesion === null) return { cargando: false, userId: null }
  if (!roles || roles.para !== sesion.user.id) return { cargando: true }
  const lista = roles.lista
  return {
    cargando: false,
    userId: sesion.user.id,
    roles: lista,
    esAdmin: lista.some((r) => r.rol === "admin"),
    esCoordinador: lista.some((r) => r.rol === "admin" || r.rol === "coordinador"),
    misAulas: lista.filter((r) => r.rol === "gestor" && r.aula).map((r) => r.aula!),
  }
}
