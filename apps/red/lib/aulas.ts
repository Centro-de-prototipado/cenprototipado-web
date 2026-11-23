// Datos iniciales de la Red, tomados del inventario «Inventario equipos aulas
// STEM Manizales_Caldas.xlsx». Las coordenadas son las de la cabecera de cada
// municipio (aproximadas); la ubicación exacta de cada aula se cargará después
// desde la base de datos (schema `red` en Supabase).

export type TipoAula = "centro" | "municipal" | "colegio"

export type Aula = {
  slug: string
  nombre: string
  municipio: string
  tipo: TipoAula
  dotacion: number | null
  /** [longitud, latitud] aproximadas */
  coordenadas: [number, number]
}

const MANIZALES: [number, number] = [-75.517, 5.07]

export const centro: Aula = {
  slug: "centro-de-prototipado",
  nombre: "Centro de Prototipado UNAL",
  municipio: "Manizales",
  tipo: "centro",
  dotacion: null,
  coordenadas: MANIZALES,
}

export const aulasMunicipales: Aula[] = [
  { slug: "aguadas", nombre: "Aula STEAM Aguadas", municipio: "Aguadas", tipo: "municipal", dotacion: 2025, coordenadas: [-75.457, 5.611] },
  { slug: "belalcazar", nombre: "Aula STEAM Belalcázar", municipio: "Belalcázar", tipo: "municipal", dotacion: 2026, coordenadas: [-75.812, 4.993] },
  { slug: "la-dorada", nombre: "Aula STEAM La Dorada", municipio: "La Dorada", tipo: "municipal", dotacion: 2024, coordenadas: [-74.663, 5.454] },
  { slug: "marmato", nombre: "Aula STEAM Marmato", municipio: "Marmato", tipo: "municipal", dotacion: 2024, coordenadas: [-75.6, 5.474] },
  { slug: "marquetalia", nombre: "Aula STEAM Marquetalia", municipio: "Marquetalia", tipo: "municipal", dotacion: 2025, coordenadas: [-75.054, 5.297] },
  { slug: "neira", nombre: "Aula STEAM Neira", municipio: "Neira", tipo: "municipal", dotacion: 2024, coordenadas: [-75.519, 5.166] },
  { slug: "pacora", nombre: "Aula STEAM Pácora", municipio: "Pácora", tipo: "municipal", dotacion: 2024, coordenadas: [-75.459, 5.527] },
  { slug: "palestina", nombre: "Aula STEAM Palestina", municipio: "Palestina", tipo: "municipal", dotacion: 2025, coordenadas: [-75.624, 5.018] },
  { slug: "san-jose", nombre: "Aula STEAM San José", municipio: "San José", tipo: "municipal", dotacion: 2025, coordenadas: [-75.79, 5.083] },
  { slug: "victoria", nombre: "Aula STEAM Victoria", municipio: "Victoria", tipo: "municipal", dotacion: 2025, coordenadas: [-74.912, 5.318] },
  { slug: "villamaria", nombre: "Aula STEAM Villamaría", municipio: "Villamaría", tipo: "municipal", dotacion: 2024, coordenadas: [-75.514, 5.045] },
]

const colegios: Array<[string, string, number]> = [
  ["ie-estambul", "IE Estambul", 2025],
  ["ie-instituto-malabar", "IE Instituto Malabar", 2025],
  ["ie-instituto-manizales", "IE Instituto Manizales", 2024],
  ["ie-instituto-tecnico-francisco-jose-de-caldas", "IE Instituto Técnico Francisco José de Caldas", 2025],
  ["ie-instituto-universitario-de-caldas", "IE Instituto Universitario de Caldas", 2024],
  ["ie-la-asuncion", "IE La Asunción", 2024],
  ["ie-la-linda", "IE La Linda", 2024],
  ["ie-leonardo-da-vinci", "IE Leonardo Da Vinci", 2025],
  ["ie-marco-fidel-suarez", "IE Marco Fidel Suárez", 2025],
  ["ie-rural-la-trinidad", "IE Rural La Trinidad", 2025],
  ["ie-rural-maria-goretti", "IE Rural María Goretti", 2024],
  ["ie-san-pio-x", "IE San Pío X", 2025],
  ["ie-san-sebastian", "IE San Sebastián", 2025],
]

export const aulasColegio: Aula[] = colegios.map(([slug, nombre, dotacion]) => ({
  slug,
  nombre,
  municipio: "Manizales",
  tipo: "colegio",
  dotacion,
  coordenadas: MANIZALES,
}))

export const todasLasAulas: Aula[] = [...aulasMunicipales, ...aulasColegio]
