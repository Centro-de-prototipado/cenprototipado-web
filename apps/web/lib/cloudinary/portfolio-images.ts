import { createHash } from "node:crypto"

import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import { v2 as cloudinary } from "cloudinary"

import { DATA_SOURCES, notion } from "@/lib/notion/client"
import { getFiles, getTitle, getUrl } from "@/lib/notion/map"

// Carpeta destino en Cloudinary.
const CLOUD_FOLDER = "cenprototipado/portafolio"

let configured = false
const ensureConfig = () => {
  if (configured) return
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Faltan credenciales de Cloudinary (CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET)"
    )
  }
  cloudinary.config({ cloud_name, api_key, api_secret, secure: true })
  configured = true
}

// Token estable por archivo subido: hash del path (sin query) de la URL de Notion.
// El path contiene el UUID del archivo, que solo cambia cuando el editor sube otro archivo.
// Va embebido en el public_id de Cloudinary, así que sirve como marca de "ya sincronizado".
const fileToken = (fileUrl: string): string => {
  let path = fileUrl
  try {
    path = new URL(fileUrl).pathname
  } catch {
    // fileUrl no es una URL absoluta; se hashea tal cual.
  }
  return createHash("sha1").update(path).digest("hex").slice(0, 12)
}

export type SyncResult = {
  synced: { title: string; url: string }[]
  skipped: number
  errors: { title: string; error: string }[]
}

// Recorre el Portafolio: por cada página con un archivo en "Imagen (subir aquí)" cuyo
// token aún no está en la URL de "Imagen", lo sube a Cloudinary (Cloudinary descarga la
// URL de Notion directamente) y escribe la secure_url permanente en "Imagen".
export const syncPortfolioImages = async (): Promise<SyncResult> => {
  ensureConfig()
  const result: SyncResult = { synced: [], skipped: 0, errors: [] }

  const pages: PageObjectResponse[] = []
  let cursor: string | undefined
  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCES.portafolio,
      start_cursor: cursor,
    })
    for (const item of res.results) if (isFullPage(item)) pages.push(item)
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  for (const page of pages) {
    const title = getTitle(page.properties, "Título") || page.id
    const source = getFiles(page.properties, "Imagen (subir aquí)")[0]
    if (!source) {
      result.skipped++
      continue
    }

    const token = fileToken(source)
    if (getUrl(page.properties, "Imagen").includes(token)) {
      result.skipped++
      continue
    }

    try {
      const uploaded = await cloudinary.uploader.upload(source, {
        folder: CLOUD_FOLDER,
        public_id: `${page.id.replace(/-/g, "")}_${token}`,
        overwrite: true,
        resource_type: "image",
      })
      await notion.pages.update({
        page_id: page.id,
        properties: { Imagen: { url: uploaded.secure_url } },
      })
      result.synced.push({ title, url: uploaded.secure_url })
    } catch (err) {
      result.errors.push({
        title,
        error: err instanceof Error ? err.message : String(err),
      })
    }
  }

  return result
}
