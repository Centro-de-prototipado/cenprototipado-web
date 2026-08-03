// Cliente mínimo de la YouTube Data API v3.
//
// La API key y el canal se leen de env vars **server-side** (nunca NEXT_PUBLIC_:
// una key en el bundle del navegador es abusable por cualquiera). Si falta
// cualquiera de las dos, `isConfigured` devuelve false y la capa de datos
// degrada a lista vacía en vez de romper el build o el render.

const API_BASE = "https://www.googleapis.com/youtube/v3"

export const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID ?? ""

export const isConfigured = (): boolean =>
  Boolean(process.env.YOUTUBE_API_KEY && YOUTUBE_CHANNEL_ID)

// URL pública del canal, para los enlaces "ver el canal completo".
export const channelUrl = (): string =>
  YOUTUBE_CHANNEL_ID
    ? `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}`
    : "https://www.youtube.com"

export const videoUrl = (videoId: string): string =>
  `https://www.youtube.com/watch?v=${videoId}`

// GET tipado contra la API. Devuelve null ante cualquier fallo (key inválida,
// cuota agotada, canal inexistente, red caída) tras dejar traza en el log del
// servidor: ninguna de estas situaciones debe tumbar la página /aprende.
export const ytFetch = async <T>(
  endpoint: string,
  params: Record<string, string>
): Promise<T | null> => {
  const apiKey = process.env.YOUTUBE_API_KEY
  if (!apiKey) return null

  const url = new URL(`${API_BASE}/${endpoint}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  url.searchParams.set("key", apiKey)

  try {
    const res = await fetch(url)
    if (!res.ok) {
      console.error(
        `[youtube] ${endpoint} respondió ${res.status}: ${await res.text()}`
      )
      return null
    }
    return (await res.json()) as T
  } catch (err) {
    console.error(`[youtube] ${endpoint} falló:`, err)
    return null
  }
}
