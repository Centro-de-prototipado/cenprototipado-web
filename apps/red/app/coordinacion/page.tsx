import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { EncabezadoPanel } from "@/components/panel/marco-panel"
import { PanelCoordinacion } from "@/components/panel/panel-coordinacion"
import { tipo } from "@/components/ui/tipografia"

export const metadata: Metadata = { title: "Coordinación de la red", robots: { index: false } }

export default function Pagina() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main id="contenido" className="relative mx-auto w-full max-w-6xl border-x bg-background/60">
        <section className={`border-b ${tipo.seccion}`}>
          <EncabezadoPanel
            antetitulo="Privado · Coordinación"
            titulo="Roles de la red"
            descripcion="Asigna gestores a cada aula y, si eres administrador, coordinadores de la red."
          />
        </section>
        <section className={tipo.seccion}>
          <PanelCoordinacion />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
