import { Client } from "@notionhq/client"

// Cliente único de la API oficial de Notion (versión 2025-09-03, data sources).
// El token se inyecta vía NOTION_TOKEN (integración interna).
export const notion = new Client({ auth: process.env.NOTION_TOKEN })

// IDs de los data sources de Notion. No son secretos y son fijos para este workspace,
// así que se usan como valores por defecto (override vía env si alguna vez cambian).
// Solo NOTION_TOKEN (secreto) es imprescindible en el entorno de despliegue.
export const DATA_SOURCES = {
  portafolio:
    process.env.NOTION_PORTFOLIO_DATA_SOURCE_ID ||
    "2518f455-7332-40c4-b3c7-ee0905d2391e",
  tecnologias:
    process.env.NOTION_TECNOLOGIAS_DATA_SOURCE_ID ||
    "9616e1e9-cb5c-4908-8bd3-987384f5ff64",
  equipo:
    process.env.NOTION_EQUIPO_DATA_SOURCE_ID ||
    "4692245a-0dc7-41bd-89a1-09719cf6b8e5",
  faq:
    process.env.NOTION_FAQ_DATA_SOURCE_ID ||
    "a4fb64e7-3c81-4634-b6e3-4f3edbafef67",
  metricas:
    process.env.NOTION_METRICAS_DATA_SOURCE_ID ||
    "c2162ede-be64-4dce-8799-3f53ee7b0c63",
} as const
