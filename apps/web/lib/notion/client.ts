import { Client } from "@notionhq/client"

// Cliente único de la API oficial de Notion (versión 2025-09-03, data sources).
// El token se inyecta vía NOTION_TOKEN (integración interna).
export const notion = new Client({ auth: process.env.NOTION_TOKEN })

export const DATA_SOURCES = {
  portafolio: process.env.NOTION_PORTFOLIO_DATA_SOURCE_ID ?? "",
  tecnologias: process.env.NOTION_TECNOLOGIAS_DATA_SOURCE_ID ?? "",
  equipo: process.env.NOTION_EQUIPO_DATA_SOURCE_ID ?? "",
  faq: process.env.NOTION_FAQ_DATA_SOURCE_ID ?? "",
} as const
