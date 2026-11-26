import { createClient } from "@supabase/supabase-js"
import {
  SUPABASE_CLAVE_PUBLICA,
  SUPABASE_URL_PUBLICA,
} from "@cen/auth/proyecto"
import { SITE_NAME, SITE_URL } from "@/lib/site-config"

// Credenciales propias del Centro (insignia + certificado PDF + verificación pública).
// Esquema `aprende` del proyecto Supabase «Red STEAM».

export type Credencial = {
  codigo: string
  nombre: string
  tipo: "charla" | "curso"
  titulo: string
  horas: number
  fecha: string
  emitida_at: string
  revocada: boolean
}

export const EMISOR = `${SITE_NAME} · Universidad Nacional de Colombia, sede Manizales`
export const EMISOR_LINKEDIN = "Centro de Prototipado UNAL Manizales"

export const urlVerificacion = (codigo: string) =>
  `${SITE_URL}/verificar/${codigo}`
export const urlCertificadoPdf = (codigo: string) => `/certificado/${codigo}`

/** Botón oficial de LinkedIn «Agregar al perfil» (addtoprofile.linkedin.com). */
export function urlLinkedIn(
  c: Pick<Credencial, "codigo" | "titulo" | "fecha">
) {
  const [anio, mes] = c.fecha.split("-")
  const p = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: c.titulo,
    organizationName: EMISOR_LINKEDIN,
    issueYear: anio,
    issueMonth: String(Number(mes)),
    certUrl: urlVerificacion(c.codigo),
    certId: c.codigo,
  })
  return `https://www.linkedin.com/profile/add?${p.toString()}`
}

const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]
/** «20 de noviembre de 2026» sin depender de la zona horaria. */
export function fechaLarga(iso: string) {
  const [a, m, d] = iso.slice(0, 10).split("-").map(Number)
  return `${d} de ${MESES[m - 1]} de ${a}`
}

export const horasTexto = (h: number) =>
  `${Number(h).toLocaleString("es-CO")} ${Number(h) === 1 ? "hora" : "horas"}`

/** Consulta pública por código (servidor; no expone correo ni id de la persona). */
export async function verificarCredencial(
  codigo: string
): Promise<Credencial | null> {
  if (!/^[A-Za-z0-9-]{6,20}$/.test(codigo)) return null
  const sb = createClient(SUPABASE_URL_PUBLICA, SUPABASE_CLAVE_PUBLICA, {
    db: { schema: "aprende" },
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const { data, error } = await sb.rpc("verificar", { p_codigo: codigo })
  if (error)
    throw new Error(`No se pudo verificar el certificado: ${error.message}`)
  const fila = (data as Credencial[] | null)?.[0]
  return fila ?? null
}
