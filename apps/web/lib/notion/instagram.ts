import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import { cacheLife, cacheTag } from "next/cache"

import type { InstagramPost } from "@/lib/institutional-data"
import { DATA_SOURCES, notion } from "./client"
import { getNumber, getSelect, getTitle, getUrl } from "./map"

const mapPost = (page: PageObjectResponse): InstagramPost | null => {
  const p = page.properties
  const url = getUrl(p, "URL del post")
  const image = getUrl(p, "Imagen")
  // Sin enlace o sin imagen sincronizada la tarjeta no tiene nada que mostrar
  // ni a dónde llevar: se descarta en vez de renderizar un hueco.
  if (!url || !image) return null
  return {
    caption: getTitle(p, "Caption"),
    url,
    image,
    type: getSelect(p, "Tipo") === "Reel" ? "reel" : "post",
  }
}

export const getInstagramPosts = async (): Promise<InstagramPost[]> => {
  "use cache"
  cacheTag("instagram")
  cacheLife("max")

  const items: { order: number; post: InstagramPost }[] = []
  let cursor: string | undefined

  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCES.instagram,
      filter: { property: "Publicado", checkbox: { equals: true } },
      start_cursor: cursor,
    })
    for (const item of res.results) {
      if (!isFullPage(item)) continue
      const post = mapPost(item)
      if (post) {
        items.push({
          order: getNumber(item.properties, "Orden") ?? 0,
          post,
        })
      }
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return items.sort((a, b) => a.order - b.order).map((i) => i.post)
}
