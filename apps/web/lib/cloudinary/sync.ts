import { createHash } from "node:crypto"

import { isFullPage } from "@notionhq/client"
import type { PageObjectResponse } from "@notionhq/client"
import {
  v2 as cloudinary,
  type UploadApiOptions,
  type UploadApiResponse,
} from "cloudinary"

import { fetchInstagramMedia } from "@/lib/instagram/media"
import { DATA_SOURCES, notion } from "@/lib/notion/client"
import { getFiles, getTitle, getUrl } from "@/lib/notion/map"

let configured = false
export const ensureConfig = () => {
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

// Sube un buffer a Cloudinary vía stream (las callbacks se envuelven en una promesa).
const uploadBuffer = (
  buffer: Buffer,
  options: UploadApiOptions
): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (err, result) => {
        if (err) reject(err)
        else if (result) resolve(result)
        else reject(new Error("Cloudinary no devolvió resultado"))
      })
      .end(buffer)
  })

// Cloudinary rechaza con un objeto plano (no un Error), que String() convertiría en
// "[object Object]"; se extrae el mensaje real de sus formas conocidas.
const errMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message
  if (err && typeof err === "object") {
    const e = err as { message?: unknown; error?: { message?: unknown } }
    if (typeof e.message === "string") return e.message
    if (e.error && typeof e.error.message === "string") return e.error.message
    try {
      return JSON.stringify(err)
    } catch {
      // objeto no serializable
    }
  }
  return String(err)
}

type SyncConfig = {
  // Data source de Notion a recorrer.
  dataSourceId: string
  // Carpeta destino en Cloudinary.
  folder: string
  // Propiedad título usada solo para reportar en el resultado.
  titleProp: string
  // Propiedad "files" donde el editor sube la imagen en Notion.
  sourceProp: string
  // Propiedad "url" donde se escribe la secure_url permanente de Cloudinary.
  destProp: string
}

// Recorre un data source: por cada página con un archivo en `sourceProp` cuyo token aún
// no está en la URL de `destProp`, lo sube a Cloudinary (Cloudinary descarga la URL de
// Notion directamente) y escribe la secure_url permanente en `destProp`.
const syncImages = async (config: SyncConfig): Promise<SyncResult> => {
  ensureConfig()
  const result: SyncResult = { synced: [], skipped: 0, errors: [] }

  const pages: PageObjectResponse[] = []
  let cursor: string | undefined
  do {
    const res = await notion.dataSources.query({
      data_source_id: config.dataSourceId,
      start_cursor: cursor,
    })
    for (const item of res.results) if (isFullPage(item)) pages.push(item)
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  for (const page of pages) {
    const title = getTitle(page.properties, config.titleProp) || page.id
    const source = getFiles(page.properties, config.sourceProp)[0]
    if (!source) {
      result.skipped++
      continue
    }

    const token = fileToken(source)
    if (getUrl(page.properties, config.destProp).includes(token)) {
      result.skipped++
      continue
    }

    try {
      // Se descarga el archivo con la URL exacta de Notion (S3 prefirmado): pasársela a
      // Cloudinary para que la baje él re-codifica la query y rompe la firma → 403.
      const res = await fetch(source)
      if (!res.ok) {
        throw new Error(
          `No se pudo descargar el archivo de Notion (HTTP ${res.status})`
        )
      }
      const buffer = Buffer.from(await res.arrayBuffer())
      const uploaded = await uploadBuffer(buffer, {
        folder: config.folder,
        public_id: `${page.id.replace(/-/g, "")}_${token}`,
        overwrite: true,
        resource_type: "image",
      })
      await notion.pages.update({
        page_id: page.id,
        properties: { [config.destProp]: { url: uploaded.secure_url } },
      })
      result.synced.push({ title, url: uploaded.secure_url })
    } catch (err) {
      result.errors.push({ title, error: errMessage(err) })
    }
  }

  return result
}

export const syncPortfolioImages = (): Promise<SyncResult> =>
  syncImages({
    dataSourceId: DATA_SOURCES.portafolio,
    folder: "cenprototipado/portafolio",
    titleProp: "Título",
    sourceProp: "Imagen (subir aquí)",
    destProp: "Imagen",
  })

export const syncTeamImages = (): Promise<SyncResult> =>
  syncImages({
    dataSourceId: DATA_SOURCES.equipo,
    folder: "cenprototipado/equipo",
    titleProp: "Nombre",
    sourceProp: "Foto (subir aquí)",
    destProp: "Foto",
  })

export const syncTechnologyImages = (): Promise<SyncResult> =>
  syncImages({
    dataSourceId: DATA_SOURCES.tecnologias,
    folder: "cenprototipado/tecnologias",
    titleProp: "Título",
    sourceProp: "Imagen (subir aquí)",
    destProp: "Imagen",
  })

// Instagram no sigue el patrón de las demás bases: el editor solo pega la URL
// del post y aquí se resuelve la portada desde los datos públicos y se rehospeda
// en Cloudinary, porque las URLs del CDN de Instagram van firmadas y caducan.
// El video no se descarga: lo sirve el embed oficial al abrir el reel.
//
// Solo se procesan las filas sin `Imagen`, para no reprocesar en cada
// revalidación ni pisar una portada que el editor haya puesto a mano.
export const syncInstagramMedia = async (): Promise<SyncResult> => {
  ensureConfig()
  const result: SyncResult = { synced: [], skipped: 0, errors: [] }

  const pages: PageObjectResponse[] = []
  let cursor: string | undefined
  do {
    const res = await notion.dataSources.query({
      data_source_id: DATA_SOURCES.instagram,
      start_cursor: cursor,
    })
    for (const item of res.results) if (isFullPage(item)) pages.push(item)
    cursor = res.has_more ? (res.next_cursor ?? undefined) : undefined
  } while (cursor)

  for (const page of pages) {
    const props = page.properties
    const permalink = getUrl(props, "URL del post")
    const title = getTitle(props, "Caption") || permalink || page.id

    if (!permalink) {
      result.skipped++
      continue
    }
    if (getUrl(props, "Imagen")) {
      result.skipped++
      continue
    }

    try {
      const media = await fetchInstagramMedia(permalink)
      if (!media) {
        throw new Error("no se pudieron leer los datos públicos del post")
      }

      const cover = await uploadCover(
        media.cover,
        `ig_${page.id.replace(/-/g, "")}`
      )
      await notion.pages.update({
        page_id: page.id,
        properties: { Imagen: { url: cover } },
      })
      result.synced.push({ title, url: cover })
    } catch (err) {
      result.errors.push({ title, error: errMessage(err) })
    }
  }

  return result
}

// Descarga la portada del CDN de Instagram y la sube a Cloudinary. Solo la
// portada: el video lo sirve el propio embed de Instagram, no se rehospeda.
const uploadCover = async (src: string, publicId: string): Promise<string> => {
  const res = await fetch(src, {
    headers: { Referer: "https://www.instagram.com/" },
  })
  if (!res.ok) {
    throw new Error(`no se pudo descargar la portada (HTTP ${res.status})`)
  }
  const buffer = Buffer.from(await res.arrayBuffer())
  const uploaded = await uploadBuffer(buffer, {
    folder: "cenprototipado/instagram",
    public_id: publicId,
    overwrite: true,
    resource_type: "image",
  })
  return uploaded.secure_url
}
