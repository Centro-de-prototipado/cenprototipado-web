import { revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"

import {
  syncPortfolioImages,
  type SyncResult,
} from "@/lib/cloudinary/portfolio-images"

// La sincronización de imágenes descarga/sube archivos: amplía el límite de ejecución.
export const maxDuration = 60

// Tags de caché de los contenidos gestionados desde Notion.
const TAGS = [
  "portafolio",
  "tecnologias",
  "equipo",
  "faq",
  "metricas",
  "configuracion",
] as const

// Revalidación manual on-demand: POST /api/revalidate?secret=…[&tag=…]
// También acepta el secreto vía header `x-revalidate-secret`.
export async function POST(request: NextRequest) {
  const secret =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret")

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { revalidated: false, message: "Secreto inválido" },
      { status: 401 }
    )
  }

  const tagParam = request.nextUrl.searchParams.get("tag")
  const tags =
    tagParam && (TAGS as readonly string[]).includes(tagParam)
      ? [tagParam]
      : [...TAGS]

  // Al revalidar el Portafolio, primero sube a Cloudinary las imágenes recién subidas
  // en Notion y escribe sus URLs permanentes; luego se invalida la caché para releerlas.
  let imageSync: SyncResult | { error: string } | undefined
  if (tags.includes("portafolio")) {
    try {
      imageSync = await syncPortfolioImages()
    } catch (err) {
      imageSync = { error: err instanceof Error ? err.message : String(err) }
    }
  }

  for (const tag of tags) revalidateTag(tag, "max")

  return NextResponse.json({ revalidated: true, tags, imageSync, now: Date.now() })
}
