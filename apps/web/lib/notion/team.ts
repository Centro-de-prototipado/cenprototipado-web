import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import { unstable_cache } from "next/cache"

import { createPortraitDataUri, type TeamMember } from "@/lib/institutional-data"
import { DATA_SOURCES, notion } from "./client"
import { getNumber, getRichText, getTitle, getUrl } from "./map"

const mapTeamMember = (page: PageObjectResponse): TeamMember => {
  const p = page.properties
  const name = getTitle(p, "Nombre")
  return {
    name,
    role: getRichText(p, "Rol"),
    // Si no hay foto, se genera un avatar SVG como respaldo.
    portrait: getUrl(p, "Foto") || createPortraitDataUri(name, "#1f3b59", "#17324b"),
  }
}

const fetchTeam = async (): Promise<TeamMember[]> => {
  const items: { order: number; member: TeamMember }[] = []
  let cursor: string | undefined

  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCES.equipo,
      filter: { property: "Publicado", checkbox: { equals: true } },
      start_cursor: cursor,
    })
    for (const item of res.results) {
      if (isFullPage(item)) {
        items.push({
          order: getNumber(item.properties, "Orden") ?? 0,
          member: mapTeamMember(item),
        })
      }
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  return items.sort((a, b) => a.order - b.order).map((i) => i.member)
}

export const getTeamMembers = unstable_cache(fetchTeam, ["team-members"], {
  tags: ["equipo"],
})
