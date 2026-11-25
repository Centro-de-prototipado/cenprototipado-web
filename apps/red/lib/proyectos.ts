// Portafolio colaborativo (tabla red.proyectos). Se lee desde el navegador para que un
// proyecto aparezca en cuanto el gestor lo publica, sin volver a compilar el sitio.

export const AREAS = {
  robotica: "Robótica",
  impresion_3d: "Impresión 3D",
  electronica: "Electrónica",
  programacion: "Programación",
  realidad_virtual: "Realidad virtual",
  diseno: "Diseño",
  ciencias: "Ciencias",
  otra: "Otra",
} as const

export type Area = keyof typeof AREAS

export type Proyecto = {
  id: string
  aula_id: string
  titulo: string
  resumen: string
  descripcion: string | null
  area: Area
  anio: number | null
  participantes: string | null
  enlace: string | null
  portada_url: string | null
  publicado: boolean
  created_at: string
  updated_at: string
  aula?: { nombre: string; slug: string; municipio: { nombre: string } | null } | null
}

export const COLUMNAS_PROYECTO =
  "id, aula_id, titulo, resumen, descripcion, area, anio, participantes, enlace, portada_url, publicado, created_at, updated_at, aula:aulas(nombre, slug, municipio:municipios(nombre))"

/** Dirección de la página pública de un proyecto. */
export const urlProyecto = (id: string) => `/proyecto?id=${id}`
