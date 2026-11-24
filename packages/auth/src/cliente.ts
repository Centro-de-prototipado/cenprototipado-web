"use client"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"
import { useConfigCuenta } from "./config"

// Un cliente por navegador. La sesión se guarda en el navegador de cada sitio; la seguridad
// de los datos la ponen las políticas RLS de Supabase.
let cliente: SupabaseClient | null = null

export function obtenerCliente(url: string, clave: string) {
  if (!cliente) {
    cliente = createClient(url, clave, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "implicit",
      },
    })
  }
  return cliente
}

export function useSupabase() {
  const { supabaseUrl, supabaseKey } = useConfigCuenta()
  return obtenerCliente(supabaseUrl, supabaseKey)
}

/** Devuelve solo rutas internas del propio sitio (evita redirecciones abiertas). */
export function destinoSeguro(valor: string | null, porDefecto: string) {
  return valor && valor.startsWith("/") && !valor.startsWith("//")
    ? valor
    : porDefecto
}

/**
 * Pide a la Edge Function `paso-de-sesion` un código de un solo uso para entrar al otro sitio
 * con la misma cuenta. El otro sitio lo canjea y obtiene una sesión propia e independiente.
 */
export async function urlConSesion(
  sb: SupabaseClient,
  supabaseUrl: string,
  clave: string,
  destino: string
) {
  const { data } = await sb.auth.getSession()
  const token = data.session?.access_token
  if (!token) return null
  const res = await fetch(`${supabaseUrl}/functions/v1/paso-de-sesion`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      apikey: clave,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ redirect_to: destino }),
  })
  if (!res.ok) throw new Error("No se pudo pasar la sesión al otro sitio.")
  const { url } = (await res.json()) as { url: string }
  return url
}

const MENSAJES: Record<string, string> = {
  "Invalid login credentials": "Correo o contraseña incorrectos.",
  "Email not confirmed":
    "Aún no confirmas tu correo. Revisa tu bandeja de entrada (y la de spam).",
  "User already registered":
    "Ya existe una cuenta con ese correo. Inicia sesión o recupera tu contraseña.",
  "New password should be different from the old password.":
    "La nueva contraseña debe ser distinta de la anterior.",
  "Email rate limit exceeded":
    "Se enviaron demasiados correos. Espera unos minutos e inténtalo de nuevo.",
}

export function mensajeError(error: unknown) {
  const texto =
    error instanceof Error
      ? error.message
      : typeof error === "object" && error && "message" in error
        ? String(error.message)
        : String(error)
  return (
    MENSAJES[texto] ?? "Algo salió mal. Inténtalo de nuevo en unos minutos."
  )
}
