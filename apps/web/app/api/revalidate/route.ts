import { revalidateTag } from "next/cache"
import { NextResponse, type NextRequest } from "next/server"

// Tags de caché de los contenidos gestionados desde Notion.
const TAGS = ["portafolio", "tecnologias", "equipo", "faq", "metricas"] as const

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

  for (const tag of tags) revalidateTag(tag, "max")

  return NextResponse.json({ revalidated: true, tags, now: Date.now() })
}
