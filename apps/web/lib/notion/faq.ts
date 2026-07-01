import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import { cacheLife, cacheTag } from "next/cache"

import type { FaqItem } from "@/lib/institutional-data"
import { DATA_SOURCES, notion } from "./client"
import { getNumber, getRichText, getSelect, getTitle } from "./map"

const mapFaq = (page: PageObjectResponse): FaqItem => {
  const p = page.properties
  return { q: getTitle(p, "Pregunta"), a: getRichText(p, "Respuesta") }
}

// Preguntas sin `Categoría` asignada se tratan como "General" — así el
// contenido existente sin categorizar sigue apareciendo en todas partes.
const GENERAL = "General"

// Sin `category`, devuelve todas las preguntas publicadas (comportamiento de
// `/contacto`). Con `category`, filtra a esa categoría + "General".
export const getFaq = async (category?: string): Promise<FaqItem[]> => {
  "use cache"
  cacheTag("faq")
  cacheLife("max")

  const items: { order: number; faq: FaqItem; category: string }[] = []
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
          category: getSelect(item.properties, "Categoría") || GENERAL,
        })
      }
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  const filtered = category
    ? items.filter((i) => i.category === category || i.category === GENERAL)
    : items

  return filtered.sort((a, b) => a.order - b.order).map((i) => i.faq)
}
