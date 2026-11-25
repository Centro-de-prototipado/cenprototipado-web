import { createClient } from "@supabase/supabase-js"

// Lectura de datos públicos de la Red (schema `red` en Supabase). Se usa en el
// build (exportación estática): las páginas se generan con los datos del momento.
// Cuando se llene `packages/db`, este cliente pasa a vivir allí.

export type TipoAula = "centro" | "municipal" | "colegio"

export type Aula = {
  id: string
  slug: string
  nombre: string
  tipo: TipoAula
  institucion: string | null
  anio_dotacion: number | null
  descripcion: string | null
  direccion: string | null
  gestor_nombre: string | null
  whatsapp: string | null
  correo: string | null
  foto_url: string | null
  /** Coordenadas de la sede (null si aún no se conocen). */
  lat: number | null
  lon: number | null
  /** true si lat/lon son del barrio o la vereda y no de la sede exacta. */
  ubicacion_aproximada: boolean
  municipio: { codigo: string; nombre: string }
}

export type Servicio = {
  id: number
  nombre: string
  descripcion: string | null
  equipo_base: string | null
  unidad_cobro: string | null
  tarifa_min: number | null
  tarifa_max: number | null
}

// El inventario de equipos (red.equipos) es privado: solo lo ven el gestor del aula y la
// coordinación con sesión iniciada. Las páginas públicas muestran solo los servicios.
export type AulaDetalle = Aula & { servicios: Servicio[] }

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver apps/red/.env.example).")
  }
  return createClient(url, key, { db: { schema: "red" }, auth: { persistSession: false } })
}

const AULA_COLS =
  "id, slug, nombre, tipo, institucion, anio_dotacion, descripcion, direccion, gestor_nombre, whatsapp, correo, foto_url, lat, lon, ubicacion_aproximada, municipio:municipios!inner(codigo, nombre)"

const ORDEN_TIPO: Record<TipoAula, number> = { centro: 0, municipal: 1, colegio: 2 }

export async function getAulas(): Promise<Aula[]> {
  const { data, error } = await client().from("aulas").select(AULA_COLS).order("nombre")
  if (error) throw new Error(`No se pudieron leer las aulas: ${error.message}`)
  return (data as unknown as Aula[]).sort((a, b) => ORDEN_TIPO[a.tipo] - ORDEN_TIPO[b.tipo] || a.nombre.localeCompare(b.nombre, "es"))
}

export async function getAula(slug: string): Promise<AulaDetalle | null> {
  const { data, error } = await client()
    .from("aulas")
    .select(
      `${AULA_COLS}, servicios(id, nombre, descripcion, equipo_base, unidad_cobro, tarifa_min, tarifa_max)`
    )
    .eq("slug", slug)
    .maybeSingle()
  if (error) throw new Error(`No se pudo leer el aula ${slug}: ${error.message}`)
  return data as unknown as AulaDetalle | null
}

export const ETIQUETA_TIPO: Record<TipoAula, string> = {
  centro: "Nodo central",
  municipal: "Aula municipal",
  colegio: "Aula de colegio",
}
