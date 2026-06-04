import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import { unstable_cache } from "next/cache"

import type { Technology } from "@/lib/institutional-data"
import { DATA_SOURCES, notion } from "./client"
import {
  getMultilineList,
  getNumber,
  getRichText,
  getSelect,
  getTitle,
} from "./map"

const mapTechnology = (page: PageObjectResponse): Technology => {
  const p = page.properties
  return {
    title: getTitle(p, "Título"),
    subtitle: getRichText(p, "Subtítulo"),
    description: getRichText(p, "Descripción"),
    applications: getMultilineList(p, "Aplicaciones"),
    status: getSelect(p, "Estado") === "Reservada" ? "reservada" : "disponible",
    units: getNumber(p, "Unidades") ?? 0,
    category: getSelect(p, "Categoría"),
  }
}

const fetchTechnologies = async (): Promise<Technology[]> => {
  const items: { order: number; tech: Technology }[] = []
  let cursor: string | undefined

  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCES.tecnologias,
      filter: { property: "Publicado", checkbox: { equals: true } },
      start_cursor: cursor,
    })
    for (const item of res.results) {
      if (isFullPage(item)) {
        items.push({
          order: getNumber(item.properties, "Orden") ?? 0,
          tech: mapTechnology(item),
        })
      }
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return items.sort((a, b) => a.order - b.order).map((i) => i.tech)
}

export const getTechnologies = unstable_cache(
  fetchTechnologies,
  ["technologies"],
  { tags: ["tecnologias"] }
)
