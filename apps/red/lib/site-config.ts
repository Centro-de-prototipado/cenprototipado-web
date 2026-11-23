// Direcciones de la Red STEAM y del sitio del Centro. Se cambian con variables
// de entorno en Cloudflare Pages cuando el proyecto tenga su dirección definitiva.
export const RED_URL =
  process.env.NEXT_PUBLIC_RED_STEAM_URL || "https://red-steam-caldas.pages.dev"

export const CENTRO_URL =
  process.env.NEXT_PUBLIC_CENTRO_URL || "https://cenprototipado.vercel.app"

export const SITE_NAME = "Red STEAM Caldas"

export const SITE_DESCRIPTION =
  "Red de aulas STEAM de Caldas articulada por el Centro de Prototipado de la Universidad Nacional de Colombia, sede Manizales: mapa de aulas, servicios, capacitaciones y convocatorias."
