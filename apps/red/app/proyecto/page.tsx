import { Suspense } from "react"
import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { DetalleProyecto } from "@/components/proyectos/proyectos-publicos"
import { tipo } from "@/components/ui/tipografia"

// Página única para todos los proyectos (/proyecto?id=…): el contenido se lee en el
// navegador, así un proyecto nuevo se ve sin volver a compilar el sitio.
export const metadata: Metadata = { title: "Proyecto" }

export default function Pagina() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main id="contenido" className="relative mx-auto w-full max-w-6xl border-x bg-background/60">
        <section className={tipo.seccion}>
          <Suspense fallback={<p className="text-sm text-muted-foreground">Cargando proyecto…</p>}>
            <DetalleProyecto />
          </Suspense>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
