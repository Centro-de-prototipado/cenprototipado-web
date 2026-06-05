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
  }
}

export const getPortfolioProjects = async (): Promise<
  PortfolioProjectMeta[]
> => {
  "use cache"
  cacheTag("portafolio")
  cacheLife("max")

  const projects: PortfolioProjectMeta[] = []
  let cursor: string | undefined

  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCES.portafolio,
      filter: PUBLISHED,
      start_cursor: cursor,
    })
    for (const item of res.results) {
      if (isFullPage(item)) projects.push(mapMeta(item))
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return projects.sort((a, b) => Number(b.year) - Number(a.year))
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
