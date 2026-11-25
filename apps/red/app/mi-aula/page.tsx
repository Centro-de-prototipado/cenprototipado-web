import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { EncabezadoPanel } from "@/components/panel/marco-panel"
import { PanelGestor } from "@/components/panel/panel-gestor"
import { tipo } from "@/components/ui/tipografia"

export const metadata: Metadata = { title: "Mi aula", robots: { index: false } }

export default function Pagina() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main id="contenido" className="relative mx-auto w-full max-w-6xl border-x bg-background/60">
        <section className={`border-b ${tipo.seccion}`}>
          <EncabezadoPanel
            antetitulo="Privado · Gestor de aula"
            titulo="Mi aula"
            descripcion="Actualiza los datos de tu aula, publica sus proyectos y consulta su inventario."
          />
        </section>
        <section className={tipo.seccion}>
          <PanelGestor />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
