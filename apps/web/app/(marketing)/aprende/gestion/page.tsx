import type { Metadata } from "next"
import { GestionCharlas } from "@/components/aprende/gestion-charlas"

export const metadata: Metadata = {
  title: "Gestión de Aprende",
  robots: { index: false },
}

export default function Pagina() {
  return (
    <>
      <section className="flex flex-col gap-4 border-b px-8 py-14 lg:px-16 lg:py-16">
        <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
          Privado · Coordinación del Centro
        </span>
        <h1 className="m-0 text-3xl leading-[1.05] font-extrabold tracking-[-0.015em] md:text-5xl">
          Charlas y certificados
        </h1>
        <p className="m-0 max-w-[52ch] text-base leading-relaxed text-muted-foreground">
          Registra las charlas y capacitaciones presenciales y marca quiénes
          asistieron. Cada asistente recibe su certificado en PDF y su insignia
          para LinkedIn.
        </p>
      </section>
      <section className="px-8 py-14 lg:px-16 lg:py-16">
        <GestionCharlas />
      </section>
    </>
  )
}
