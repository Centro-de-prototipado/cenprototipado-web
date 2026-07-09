import { NextResponse, type NextRequest } from "next/server"

import { cleanupOrphanImages } from "@/lib/cloudinary/cleanup"

// La limpieza lista y borra assets en Cloudinary: amplía el límite de ejecución.
export const maxDuration = 60

// Borra de Cloudinary las imágenes huérfanas (las que ya no referencia ninguna página
// de Notion en portafolio/equipo/tecnologías).
//
//   POST/GET /api/cloudinary/cleanup?secret=…[&dryRun=1]
//
// El secreto también se acepta vía header `x-revalidate-secret`.
// Se expone GET para poder dispararlo desde un botón "Abrir enlace" en Notion.
// Con ?dryRun=1 solo reporta qué borraría, sin borrar nada.
const handle = async (request: NextRequest) => {
  const secret =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret")

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json(
      { cleaned: false, message: "Secreto inválido" },
      { status: 401 }
    )
  }

  const dryRun = ["1", "true"].includes(
    request.nextUrl.searchParams.get("dryRun") ?? ""
  )

  try {
    const result = await cleanupOrphanImages(dryRun)
    return NextResponse.json({ cleaned: true, ...result, now: Date.now() })
  } catch (err) {
    return NextResponse.json(
      { cleaned: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}

export const POST = handle
export const GET = handle
