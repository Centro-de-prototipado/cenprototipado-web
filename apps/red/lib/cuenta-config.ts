import { SUPABASE_CLAVE_PUBLICA, SUPABASE_URL_PUBLICA, type ConfigCuenta } from "@cen/auth"
import { CENTRO_URL } from "@/lib/site-config"

// Cuenta única (Supabase Auth) compartida con el sitio del Centro.
// El paso de sesión hacia el Centro se activa con NEXT_PUBLIC_CENTRO_SSO=1 cuando ese sitio
// tenga desplegadas sus páginas de cuenta.
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
    process.env.NEXT_PUBLIC_CENTRO_SSO === "1"
      ? { nombre: "el sitio del Centro", continuarUrl: `${CENTRO_URL}/cuenta/continuar` }
      : undefined,
}
