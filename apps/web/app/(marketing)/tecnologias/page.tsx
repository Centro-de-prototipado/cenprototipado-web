import type { Metadata } from "next"
import { TecnologiasClient } from "@/components/sections/tecnologias-client"

export const metadata: Metadata = {
  title: "Tecnologías | Centro de Prototipado",
  description:
    "Explora el inventario de tecnologías del Centro de Prototipado: fabricación digital, realidad virtual, robótica, BIM y más.",
}

export default function TecnologiasPage() {
  return <TecnologiasClient />
}
