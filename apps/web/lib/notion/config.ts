import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import { cacheLife, cacheTag } from "next/cache"

import { DATA_SOURCES, notion } from "./client"
import { getRichText } from "./map"

// Devuelve la configuración indexada por `Clave` (correo, teléfono, sede,
// horario, misión, visión…). Fuente única para evitar duplicar estos datos
// hardcodeados en varios componentes.
export const getConfig = async (): Promise<Record<string, string>> => {
  "use cache"
  cacheTag("configuracion")
  cacheLife("max")

  const entries: [string, string][] = []
  let cursor: string | undefined

  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCES.configuracion,
      filter: { property: "Publicado", checkbox: { equals: true } },
      start_cursor: cursor,
    })
    for (const item of res.results) {
      if (isFullPage(item)) entries.push(mapConfigEntry(item))
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return Object.fromEntries(entries)
}

const mapConfigEntry = (page: PageObjectResponse): [string, string] => {
  const p = page.properties
  return [getRichText(p, "Clave"), getRichText(p, "Valor")]
}
