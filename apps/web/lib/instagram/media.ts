// Lee los datos públicos de un post de Instagram a partir de su permalink.
//
// Instagram sirve un muro de login a peticiones normales, pero entrega el JSON
// del post a los rastreadores (es lo que alimenta las previsualizaciones de
// enlaces). Se pide con un User-Agent de crawler y se extrae del HTML.
//
// Es una fuente no documentada y puede cambiar de forma sin aviso: por eso todo
// devuelve `null` ante cualquier imprevisto y quien llama conserva los valores
// que ya tuviera guardados en vez de borrarlos.

const CRAWLER_UA =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"

export type InstagramMedia = {
  caption: string
  cover: string
}

// Acepta /p/<code>/ y /reel/<code>/, con o sin el usuario en la ruta.
export const shortcodeFromUrl = (url: string): string | null =>
  /instagram\.com\/(?:[^/]+\/)?(?:p|reel|tv)\/([A-Za-z0-9_-]+)/.exec(
    url
  )?.[1] ?? null

// URL del embed oficial, que reproduce el reel dentro del sitio. Verificado que
// renderiza sin sesión iniciada; devuelve null si la URL no trae shortcode.
export const embedUrlFromPost = (url: string): string | null => {
  const shortcode = shortcodeFromUrl(url)
  return shortcode ? `https://www.instagram.com/reel/${shortcode}/embed/` : null
}

// Desescapa un literal JSON tal cual aparece embebido en el HTML.
const unquote = (raw: string): string => {
  try {
    return JSON.parse(`"${raw}"`)
  } catch {
    return ""
  }
}

export const fetchInstagramMedia = async (
  permalink: string
): Promise<InstagramMedia | null> => {
  const shortcode = shortcodeFromUrl(permalink)
  if (!shortcode) return null

  let html: string
  try {
    const res = await fetch(`https://www.instagram.com/p/${shortcode}/`, {
      headers: { "User-Agent": CRAWLER_UA },
    })
    if (!res.ok) {
      console.error(`[instagram] ${shortcode} respondió HTTP ${res.status}`)
      return null
    }
    html = await res.text()
  } catch (err) {
    console.error(`[instagram] ${shortcode} falló la descarga:`, err)
    return null
  }

  // El código aparece varias veces: primero en el timeline de posts
  // relacionados del mismo perfil y al final en el nodo del propio media. Las
  // primeras llevan al caption del post equivocado, de ahí que se use la última.
  const nodeStart = html.lastIndexOf(`"code":"${shortcode}"`)
  if (nodeStart === -1) {
    console.error(`[instagram] ${shortcode}: nodo del post no encontrado`)
    return null
  }
  const node = html.slice(nodeStart, nodeStart + 30000)

  const caption =
    /"caption":\{[^{}]*?"text":("(?:[^"\\]|\\.)*")/.exec(node)?.[1] ?? ""
  const cover = /"display_uri":"((?:[^"\\]|\\.)*)"/.exec(node)?.[1] ?? ""

  if (!cover) {
    console.error(`[instagram] ${shortcode}: sin portada en el nodo`)
    return null
  }

  return {
    caption: caption ? unquote(caption.slice(1, -1)) : "",
    cover: unquote(cover),
  }
}
