import type { Metadata } from "next"
import { FormRegistro } from "@cen/auth"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = { title: "Crear cuenta", robots: { index: false } }

export default function Pagina() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main id="contenido" className="relative flex-1">
        <FormRegistro />
      </main>
      <SiteFooter />
    </div>
  )
}
