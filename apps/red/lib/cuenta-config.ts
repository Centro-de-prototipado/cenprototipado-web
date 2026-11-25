import { SUPABASE_CLAVE_PUBLICA, SUPABASE_URL_PUBLICA, type ConfigCuenta } from "@cen/auth"
import { CENTRO_URL } from "@/lib/site-config"

// Cuenta única (Supabase Auth) compartida con el sitio del Centro.
// El paso de sesión hacia el Centro está activo (el Centro ya publicó /cuenta/continuar).
// Se puede apagar con NEXT_PUBLIC_CENTRO_SSO=0.
export const configCuenta: ConfigCuenta = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL_PUBLICA,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || SUPABASE_CLAVE_PUBLICA,
  sitio: "Red STEAM",
  rutas: {
    ingresar: "/ingresar",
    registro: "/registro",
    recuperar: "/recuperar",
    restablecer: "/restablecer",
    cuenta: "/cuenta",
    continuar: "/auth/continuar",
  },
  otroSitio:
    process.env.NEXT_PUBLIC_CENTRO_SSO !== "0"
      ? { nombre: "el sitio del Centro", continuarUrl: `${CENTRO_URL}/cuenta/continuar` }
      : undefined,
}
