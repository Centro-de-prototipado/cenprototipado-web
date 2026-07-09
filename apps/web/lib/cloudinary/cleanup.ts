import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import { v2 as cloudinary } from "cloudinary"

import { DATA_SOURCES, notion } from "@/lib/notion/client"
import { getUrl } from "@/lib/notion/map"
import { ensureConfig } from "./sync"

// Carpetas de Cloudinary a limpiar, con el data source de Notion y la propiedad "url"
// donde se guarda la imagen definitiva (la que está "en uso").
type Target = { folder: string; dataSourceId: string; destProp: string }

const TARGETS: Target[] = [
  { folder: "cenprototipado/portafolio", dataSourceId: DATA_SOURCES.portafolio, destProp: "Imagen" },
  { folder: "cenprototipado/equipo", dataSourceId: DATA_SOURCES.equipo, destProp: "Foto" },
  { folder: "cenprototipado/tecnologias", dataSourceId: DATA_SOURCES.tecnologias, destProp: "Imagen" },
]

export type CleanupFolderResult = {
  folder: string
  total: number
  inUse: number
  deleted: string[]
}

export type CleanupResult = {
  dryRun: boolean
  folders: CleanupFolderResult[]
  totalDeleted: number
}

// Extrae el public_id (incluida la carpeta) de una secure_url de Cloudinary.
// Formato: https://res.cloudinary.com/<cloud>/image/upload/v123/carpeta/public_id.ext
const publicIdFromUrl = (url: string): string | null => {
  const m = url.match(/\/upload\/(?:v\d+\/)?(.+?)\.[a-z0-9]+$/i)
  return m ? m[1] : null
}

// public_ids referenciados desde Notion (los que están en uso y NO deben borrarse).
const inUsePublicIds = async (
  dataSourceId: string,
  destProp: string
): Promise<Set<string>> => {
  const ids = new Set<string>()
  let cursor: string | undefined
  do {
    const res = await notion.dataSources.query({
      data_source_id: dataSourceId,
      start_cursor: cursor,
    })
    for (const item of res.results) {
      if (!isFullPage(item)) continue
      const id = publicIdFromUrl(getUrl((item as PageObjectResponse).properties, destProp))
      if (id) ids.add(id)
    }
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)
  return ids
}

// Lista todos los assets de una carpeta de Cloudinary (paginando).
const listFolder = async (folder: string): Promise<string[]> => {
  const ids: string[] = []
  let next: string | undefined
  do {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix: `${folder}/`,
      max_results: 500,
      next_cursor: next,
    })
    for (const r of res.resources) ids.push(r.public_id)
    next = res.next_cursor
  } while (next)
  return ids
}

// Borra de Cloudinary los assets huérfanos (no referenciados en Notion) de cada carpeta.
// Con dryRun=true solo reporta lo que borraría, sin borrar nada.
export const cleanupOrphanImages = async (
  dryRun = false
): Promise<CleanupResult> => {
  ensureConfig()
  const folders: CleanupFolderResult[] = []

  for (const target of TARGETS) {
    const used = await inUsePublicIds(target.dataSourceId, target.destProp)
    const assets = await listFolder(target.folder)
    const orphans = assets.filter((id) => !used.has(id))

    if (!dryRun) {
      // delete_resources acepta máximo 100 public_ids por llamada.
      for (let i = 0; i < orphans.length; i += 100) {
        await cloudinary.api.delete_resources(orphans.slice(i, i + 100))
      }
    }

    folders.push({
      folder: target.folder,
      total: assets.length,
      inUse: used.size,
      deleted: orphans,
    })
  }

  return {
    dryRun,
    folders,
    totalDeleted: folders.reduce((n, f) => n + f.deleted.length, 0),
  }
}
