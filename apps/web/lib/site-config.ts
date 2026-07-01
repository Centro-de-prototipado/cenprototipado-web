// Fuente única de verdad para nombre/descripción/URL del sitio, usada en
// metadata (layout, sitemap, robots, OG image). Cambia SITE_URL vía la env
// var cuando el sitio tenga dominio propio.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://cenprototipado.vercel.app"

export const SITE_NAME = "Centro de Prototipado"

export const SITE_DESCRIPTION =
  "Centro de Prototipado de la Universidad Nacional de Colombia, sede Manizales — fabricación digital, realidad inmersiva y robótica al servicio de estudiantes, docentes y comunidades. Sede: Museo Interactivo Samoga."
