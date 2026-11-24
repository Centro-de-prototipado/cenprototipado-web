"use client"

import { createContext, useContext, type ReactNode } from "react"

/**
 * Configuración de la cuenta para cada app. Las dos apps (Centro y Red) usan el mismo
 * proyecto de Supabase: la cuenta es una sola; cada sitio tiene su propia sesión.
 */
export type ConfigCuenta = {
  supabaseUrl: string
  supabaseKey: string
  /** Nombre del sitio actual, p. ej. «Red STEAM» o «Centro de Prototipado». */
  sitio: string
  /** Rutas internas de este sitio. */
  rutas: {
    ingresar: string
    registro: string
    recuperar: string
    restablecer: string
    cuenta: string
    /** Recibe y emite el paso de sesión entre sitios. */
    continuar: string
  }
  /**
   * El otro sitio con la misma cuenta. `continuarUrl` es la URL absoluta de su ruta de
   * paso de sesión. Sin este dato, el paso de sesión entre sitios queda desactivado.
   */
  otroSitio?: { nombre: string; continuarUrl: string }
}

const Contexto = createContext<ConfigCuenta | null>(null)

export function CuentaProvider({
  config,
  children,
}: {
  config: ConfigCuenta
  children: ReactNode
}) {
  return <Contexto.Provider value={config}>{children}</Contexto.Provider>
}

export function useConfigCuenta() {
  const config = useContext(Contexto)
  if (!config) throw new Error("Falta <CuentaProvider> de @cen/auth.")
  return config
}
