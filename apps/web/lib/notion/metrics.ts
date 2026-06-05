import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import { cacheLife, cacheTag } from "next/cache"

import { DATA_SOURCES, notion } from "./client"
import { getNumber, getRichText, getTitle } from "./map"

export type Metric = {
  key: string
  label: string
  value: string
  detail: string
}

const mapMetric = (page: PageObjectResponse): { order: number; metric: Metric } => {
  const p = page.properties
  return {
    order: getNumber(p, "Orden") ?? 0,
    metric: {
      key: getRichText(p, "Clave"),
      label: getTitle(p, "Etiqueta"),
      value: getRichText(p, "Valor"),
      detail: getRichText(p, "Detalle"),
    },
  }
}

// Devuelve las métricas indexadas por `Clave` para que cada sección elija
// las que necesita por clave (los valores viven en Notion, no hardcodeados).
export const getMetrics = async (): Promise<Record<string, Metric>> => {
  "use cache"
  cacheTag("metricas")
  cacheLife("max")

  const items: { order: number; metric: Metric }[] = []
  let cursor: string | undefined

  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCES.metricas,
      filter: { property: "Publicado", checkbox: { equals: true } },
      start_cursor: cursor,
    })
    for (const item of res.results) {
      if (isFullPage(item)) items.push(mapMetric(item))
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return Object.fromEntries(
    items
      .sort((a, b) => a.order - b.order)
      .map(({ metric }) => [metric.key, metric])
  )
}

// Selecciona métricas por clave en el orden dado (omite las que no existan).
export const pickMetrics = (
  metrics: Record<string, Metric>,
  keys: string[]
): Metric[] => keys.map((k) => metrics[k]).filter(Boolean)
