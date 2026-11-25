import type { Metadata } from "next"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { GaleriaProyectos } from "@/components/proyectos/proyectos-publicos"
import { TituloEntrada } from "@/components/ui/animaciones"
import { Antetitulo, tipo } from "@/components/ui/tipografia"

export const metadata: Metadata = {
  title: "Proyectos",
  description: "Portafolio colaborativo de las aulas STEAM de Caldas: proyectos de robótica, impresión 3D, electrónica y más.",
}

export default function Pagina() {
  return (
    <div className="relative min-h-screen">
      <SiteHeader />
      <main id="contenido" className="relative mx-auto w-full max-w-6xl border-x bg-background/60">
        <section className={`flex flex-col gap-5 border-b ${tipo.seccion}`}>
          <Antetitulo pulso>Portafolio colaborativo</Antetitulo>
          <TituloEntrada texto="Proyectos de la red" acento="la red" className={tipo.h1} />
          <p className={tipo.entrada}>Lo que construyen estudiantes y docentes en las aulas STEAM de Caldas.</p>
        </section>
        <section className={tipo.seccion}>
          <GaleriaProyectos />
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
