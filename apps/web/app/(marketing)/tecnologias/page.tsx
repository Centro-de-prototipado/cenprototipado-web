import type { Metadata } from "next"
import { TecnologiasClient } from "@/components/sections/tecnologias-client"
import { getTechnologies } from "@/lib/notion/technologies"
import { getFaq } from "@/lib/notion/faq"

export const metadata: Metadata = {
  title: "Tecnologías | Centro de Prototipado",
  description:
    "Explora el inventario de tecnologías del Centro de Prototipado: fabricación digital, realidad virtual, robótica, BIM y más.",
}

export default async function TecnologiasPage() {
  const [technologies, faq] = await Promise.all([
    getTechnologies(),
    getFaq("Tecnologías"),
  ])
  return <TecnologiasClient technologies={technologies} faq={faq} />
}
