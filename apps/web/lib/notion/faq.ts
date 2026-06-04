import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import { unstable_cache } from "next/cache"

import type { FaqItem } from "@/lib/institutional-data"
import { DATA_SOURCES, notion } from "./client"
import { getNumber, getRichText, getTitle } from "./map"

const mapFaq = (page: PageObjectResponse): FaqItem => {
  const p = page.properties
  return { q: getTitle(p, "Pregunta"), a: getRichText(p, "Respuesta") }
}

const fetchFaq = async (): Promise<FaqItem[]> => {
  const items: { order: number; faq: FaqItem }[] = []
  let cursor: string | undefined

  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCES.faq,
      filter: { property: "Publicado", checkbox: { equals: true } },
      start_cursor: cursor,
    })
    for (const item of res.results) {
      if (isFullPage(item)) {
        items.push({
          order: getNumber(item.properties, "Orden") ?? 0,
          faq: mapFaq(item),
        })
      }
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return items.sort((a, b) => a.order - b.order).map((i) => i.faq)
}

export const getFaq = unstable_cache(fetchFaq, ["faq"], { tags: ["faq"] })
