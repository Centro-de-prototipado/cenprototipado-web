import type { ConfigCuenta } from "@cen/auth"
import { RED_STEAM_URL } from "@/lib/site-config"

// Cuenta única (Supabase Auth) compartida con la Red STEAM. Requiere en Vercel:
// NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (proyecto «Red STEAM»).
export const configCuenta: ConfigCuenta = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
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
