import type { Metadata } from "next"
import { FormRecuperar } from "@cen/auth"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = { title: "Recuperar contraseña", robots: { index: false } }

export default function Pagina() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main id="contenido" className="relative flex-1">
        <FormRecuperar />
      </main>
      <SiteFooter />
    </div>
  )
}
