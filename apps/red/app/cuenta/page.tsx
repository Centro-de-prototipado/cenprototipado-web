import type { Metadata } from "next"
import { Suspense } from "react"
import { CuentaRed } from "@/components/cuenta-red"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false } }

export default function Pagina() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader />
      <main id="contenido" className="relative flex-1">
        <Suspense>
          <CuentaRed />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
