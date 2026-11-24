// Edge Function `paso-de-sesion` (desplegada en el proyecto Supabase «Red STEAM», verify_jwt = false).
//
// Paso de sesión entre el sitio del Centro y la Red STEAM (cuenta única, dominios distintos).
// Un sitio donde la persona ya inició sesión llama a esta función con su token de acceso y la
// dirección de destino. La función comprueba el token, genera un código de un solo uso (enlace
// mágico, sin enviar correo) y devuelve la URL de destino con ese código. El otro sitio lo canjea
// con verifyOtp y obtiene una sesión NUEVA e independiente: no se comparte el token de renovación,
// así que renovar en un sitio no cierra la sesión en el otro.
//
// La autenticación la hace la propia función (auth.getUser), por eso verify_jwt = false.
// Orígenes permitidos: variable SSO_ALLOWED_ORIGINS (separados por coma) o los de abajo.
import { createClient } from "npm:@supabase/supabase-js@2"

const ORIGENES = (Deno.env.get("SSO_ALLOWED_ORIGINS") ??
  "https://red-steam-caldas.pages.dev,https://cenprototipado.vercel.app,http://localhost:3000,http://localhost:3001")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean)

function cors(origin: string | null) {
  const permitido = origin && ORIGENES.includes(origin) ? origin : ORIGENES[0]
  return {
    "Access-Control-Allow-Origin": permitido,
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    Vary: "Origin",
  }
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors(origin), "Content-Type": "application/json" } })
}

Deno.serve(async (req) => {
  const origin = req.headers.get("Origin")
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) })
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405, origin)

  const token = req.headers.get("Authorization")?.replace(/^Bearer\s+/i, "")
  if (!token) return json({ error: "Falta la sesión" }, 401, origin)

  let destino: URL
  try {
    const { redirect_to } = await req.json()
    destino = new URL(String(redirect_to))
  } catch {
    return json({ error: "Destino inválido" }, 400, origin)
  }
  if (!ORIGENES.includes(destino.origin)) return json({ error: "Destino no permitido" }, 400, origin)

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  const { data: usuario, error: errUsuario } = await admin.auth.getUser(token)
  if (errUsuario || !usuario.user?.email) return json({ error: "Sesión inválida" }, 401, origin)

  const { data: enlace, error: errEnlace } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: usuario.user.email,
  })
  if (errEnlace || !enlace.properties?.hashed_token) return json({ error: "No se pudo crear el código" }, 500, origin)

  destino.searchParams.set("token_hash", enlace.properties.hashed_token)
  destino.searchParams.set("type", "magiclink")
  return json({ url: destino.toString() }, 200, origin)
})
