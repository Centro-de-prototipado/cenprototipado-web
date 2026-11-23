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
  municipio: { codigo: string; nombre: string }
}

export type Equipo = {
  id: number
  categoria: string
  nombre: string
  cantidad: number
  anio: number | null
  estado: "funcional" | "inconvenientes" | "danado" | "no_funcional" | null
  frecuencia_uso: "diario" | "semanal" | "mensual" | "ocasional" | "no_se_usa" | null
  tipo_dano: string | null
  catalogo: { descripcion: string | null } | null
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

export type AulaDetalle = Aula & { equipos: Equipo[]; servicios: Servicio[] }

function client() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) {
    throw new Error("Faltan NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (ver apps/red/.env.example).")
  }
  return createClient(url, key, { db: { schema: "red" }, auth: { persistSession: false } })
}

const AULA_COLS =
  "id, slug, nombre, tipo, institucion, anio_dotacion, descripcion, direccion, gestor_nombre, whatsapp, correo, foto_url, municipio:municipios!inner(codigo, nombre)"

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
      `${AULA_COLS}, equipos(id, categoria, nombre, cantidad, anio, estado, frecuencia_uso, tipo_dano, catalogo:equipos_catalogo(descripcion)), servicios(id, nombre, descripcion, equipo_base, unidad_cobro, tarifa_min, tarifa_max)`
    )
    .eq("slug", slug)
    .maybeSingle()
  if (error) throw new Error(`No se pudo leer el aula ${slug}: ${error.message}`)
  return data as unknown as AulaDetalle | null
}

/** Orden de presentación: primero lo que sirve para fabricar y enseñar. */
export const ORDEN_CATEGORIAS = [
  "Impresión 3D",
  "CNC y láser",
  "Escáner 3D",
  "Brazos robóticos",
  "Robótica educativa",
  "Electrónica y sensores",
  "Instrumentos de medida",
  "Soldadura",
  "Cómputo",
  "Audiovisual y realidad virtual",
  "Energía y cables",
  "Mobiliario",
]

export const ETIQUETA_TIPO: Record<TipoAula, string> = {
  centro: "Nodo central",
  municipal: "Aula municipal",
  colegio: "Aula de colegio",
}
