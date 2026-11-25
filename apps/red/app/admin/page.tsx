import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { EncabezadoPanel } from "@/components/panel/marco-panel"
import { PanelAdmin } from "@/components/panel/panel-admin"
import { tipo } from "@/components/ui/tipografia"

export const metadata: Metadata = { title: "Administración", robots: { index: false } }

export default function Pagina() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main id="contenido" className="relative mx-auto w-full max-w-6xl border-x bg-background/60">
        <section className={`border-b ${tipo.seccion}`}>
          <EncabezadoPanel
            antetitulo="Privado · Coordinación"
            titulo="Administración de la red"
            descripcion="Resumen de la red y acceso a roles, aulas y portafolio."
          />
        </section>
        <section className={tipo.seccion}>
          <PanelAdmin />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
