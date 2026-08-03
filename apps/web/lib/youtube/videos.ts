import { cacheLife, cacheTag } from "next/cache"

import type { YouTubePlaylist, YouTubeVideo } from "@/lib/institutional-data"
import { YOUTUBE_CHANNEL_ID, isConfigured, ytFetch } from "./client"

// Tope de videos traídos del canal. La API pagina de 50 en 50; dos páginas
// bastan de sobra para la página /aprende y mantienen el coste de cuota
// en unas pocas unidades por refresco (el límite diario es de 10.000).
const MAX_VIDEOS = 100
const PAGE_SIZE = 50

type ChannelsResponse = {
  items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[]
}

type PlaylistItemsResponse = {
  items?: {
    snippet?: {
      title?: string
      description?: string
      publishedAt?: string
      resourceId?: { videoId?: string }
    }
  }[]
  nextPageToken?: string
}

type PlaylistsResponse = {
  items?: { id?: string; snippet?: { title?: string } }[]
}

// Los videos borrados o privados siguen apareciendo en el playlist con este
// título fijo y sin miniatura utilizable: hay que filtrarlos.
const UNAVAILABLE = new Set(["Deleted video", "Private video"])

// Playlist de subidas del canal: contiene todos los videos públicos, del más
// reciente al más antiguo.
const getUploadsPlaylistId = async (): Promise<string | null> => {
  const res = await ytFetch<ChannelsResponse>("channels", {
    part: "contentDetails",
    id: YOUTUBE_CHANNEL_ID,
  })
  return res?.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null
}

// Recorre un playlist completo (hasta MAX_VIDEOS) siguiendo los page tokens.
const listPlaylistItems = async (
  playlistId: string
): Promise<NonNullable<PlaylistItemsResponse["items"]>> => {
  const items: NonNullable<PlaylistItemsResponse["items"]> = []
  let pageToken: string | undefined

  do {
    const res = await ytFetch<PlaylistItemsResponse>("playlistItems", {
      part: "snippet",
      playlistId,
      maxResults: String(PAGE_SIZE),
      ...(pageToken ? { pageToken } : {}),
    })
    if (!res) break
    items.push(...(res.items ?? []))
    pageToken = res.nextPageToken
  } while (pageToken && items.length < MAX_VIDEOS)

  return items.slice(0, MAX_VIDEOS)
}

const toVideo = (
  item: NonNullable<PlaylistItemsResponse["items"]>[number]
): YouTubeVideo | null => {
  const id = item.snippet?.resourceId?.videoId
  const title = item.snippet?.title ?? ""
  if (!id || !title || UNAVAILABLE.has(title)) return null
  return {
    id,
    title,
    description: item.snippet?.description ?? "",
    publishedAt: item.snippet?.publishedAt ?? "",
    playlistIds: [],
  }
}

export type Tutorials = {
  videos: YouTubeVideo[]
  playlists: YouTubePlaylist[]
}

// Videos del canal + playlists públicas que sirven de categorías. Se devuelven
// juntos porque la página los necesita a la vez y así comparten entrada de caché.
//
// Sin YOUTUBE_API_KEY / YOUTUBE_CHANNEL_ID devuelve listas vacías y la página
// muestra su estado vacío, así que el sitio compila y funciona sin credenciales.
export const getTutorials = async (): Promise<Tutorials> => {
  "use cache"
  cacheTag("tutoriales")
  cacheLife("hours")

  if (!isConfigured()) return { videos: [], playlists: [] }

  const uploadsId = await getUploadsPlaylistId()
  if (!uploadsId) return { videos: [], playlists: [] }

  const videos = (await listPlaylistItems(uploadsId))
    .map(toVideo)
    .filter((v): v is YouTubeVideo => v !== null)

  if (videos.length === 0) return { videos: [], playlists: [] }

  const byId = new Map(videos.map((v) => [v.id, v]))

  // Cada playlist pública del canal es una categoría. Se resuelve la pertenencia
  // recorriendo sus items y anotando el playlist en cada video ya conocido.
  const channelPlaylists = await ytFetch<PlaylistsResponse>("playlists", {
    part: "snippet",
    channelId: YOUTUBE_CHANNEL_ID,
    maxResults: String(PAGE_SIZE),
  })

  const playlists: YouTubePlaylist[] = []
  for (const p of channelPlaylists?.items ?? []) {
    const id = p.id
    const title = p.snippet?.title
    if (!id || !title) continue

    let count = 0
    for (const item of await listPlaylistItems(id)) {
      const video = byId.get(item.snippet?.resourceId?.videoId ?? "")
      if (!video) continue
      video.playlistIds.push(id)
      count++
    }
    // Playlist vacía (o que solo contiene videos ajenos al canal): no aporta
    // un filtro útil, se omite.
    if (count > 0) playlists.push({ id, title, count })
  }

  return { videos, playlists }
}
