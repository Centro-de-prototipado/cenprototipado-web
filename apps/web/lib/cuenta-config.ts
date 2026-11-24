import { SUPABASE_CLAVE_PUBLICA, SUPABASE_URL_PUBLICA, type ConfigCuenta } from "@cen/auth"
import { RED_STEAM_URL } from "@/lib/site-config"

// Cuenta única (Supabase Auth) compartida con la Red STEAM. Las variables NEXT_PUBLIC_SUPABASE_*
// son opcionales: si faltan se usa el proyecto «Red STEAM» (ver packages/auth/src/proyecto.ts).
export const configCuenta: ConfigCuenta = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_URL_PUBLICA,
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || SUPABASE_CLAVE_PUBLICA,
  sitio: "Centro de Prototipado",
  rutas: {
    ingresar: "/login",
    registro: "/registro",
    recuperar: "/recuperar",
    restablecer: "/restablecer",
    cuenta: "/cuenta",
    continuar: "/cuenta/continuar",
  },
  otroSitio: {
    nombre: "la Red STEAM",
    continuarUrl: `${RED_STEAM_URL}/auth/continuar`,
  },
}
