import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import { cacheLife, cacheTag } from "next/cache"

import type {
  PortfolioCategoryFilter,
  PortfolioProject,
  PortfolioProjectMeta,
} from "@/lib/portfolio-types"
import { DATA_SOURCES, notion } from "./client"
import {
  getCheckbox,
  getMultiSelect,
  getMultilineList,
  getNumber,
  getRichText,
  getTitle,
  getUrl,
} from "./map"

const PUBLISHED = { property: "Publicado", checkbox: { equals: true } } as const

const mapMeta = (page: PageObjectResponse): PortfolioProjectMeta => {
  const p = page.properties
  const partner = getRichText(p, "Aliado")
  const link = getUrl(p, "Enlace")
  return {
    id: page.id,
    slug: getRichText(p, "Slug"),
    title: getTitle(p, "Título"),
    categories: getMultiSelect(p, "Categoría"),
    year: String(getNumber(p, "Año") ?? ""),
    image: getUrl(p, "Imagen") || "/taller.jpg",
    summary: getRichText(p, "Resumen"),
    challenge: getRichText(p, "Reto"),
    solution: getRichText(p, "Solución"),
    techStack: getMultiSelect(p, "Tecnologías"),
    outcomes: getMultilineList(p, "Resultados"),
    featured: getCheckbox(p, "Destacado"),
    ...(partner ? { partner } : {}),
    ...(link ? { link } : {}),
  }
}

export const getPortfolioProjects = async (): Promise<
  PortfolioProjectMeta[]
> => {
  "use cache"
  cacheTag("portafolio")
  cacheLife("max")

  const items: { order: number | null; project: PortfolioProjectMeta }[] = []
  let cursor: string | undefined

  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCES.portafolio,
      filter: PUBLISHED,
      start_cursor: cursor,
    })
    for (const item of res.results) {
      if (isFullPage(item)) {
        items.push({
          order: getNumber(item.properties, "Orden"),
          project: mapMeta(item),
        })
      }
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  // `Orden` (curado a mano) manda cuando está presente; si no, se ordena por año.
  return items
    .sort((a, b) => {
      if (a.order !== null && b.order !== null) return a.order - b.order
      if (a.order !== null) return -1
      if (b.order !== null) return 1
      return Number(b.project.year) - Number(a.project.year)
    })
    .map((i) => i.project)
}

export const getPortfolioProjectBySlug = async (
  slug: string
): Promise<PortfolioProject | null> => {
  "use cache"
  cacheTag("portafolio")
  cacheLife("max")

  const res = await notion.dataSources.query({
    data_source_id: DATA_SOURCES.portafolio,
    filter: {
      and: [{ property: "Slug", rich_text: { equals: slug } }, PUBLISHED],
    },
    page_size: 1,
  })
  const item = res.results[0]
  if (!item || !isFullPage(item)) return null

  const { markdown } = await notion.pages.retrieveMarkdown({ page_id: item.id })
  return { ...mapMeta(item), content: markdown }
}

export const getFeaturedPortfolioProjects = async (): Promise<
  PortfolioProjectMeta[]
> => (await getPortfolioProjects()).filter((project) => project.featured)

export const getPortfolioCategories = async (): Promise<
  PortfolioCategoryFilter[]
> => {
  const projects = await getPortfolioProjects()
  const categories = new Set(projects.flatMap((project) => project.categories))
  return ["Todos", ...categories]
}

export const getPortfolioSlugs = async (): Promise<string[]> =>
  (await getPortfolioProjects()).map((project) => project.slug)
