import Link from "next/link"
import { ArrowRightIcon, BadgeCheckIcon, CalculatorIcon, MegaphoneIcon, SchoolIcon } from "lucide-react"
import { RedMap } from "@/components/red-map"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Contador, TituloAnimado, TituloEntrada } from "@/components/ui/animaciones"
import { DecorIcon } from "@/components/ui/decor-icon"
import { Antetitulo, tipo } from "@/components/ui/tipografia"
import { ETIQUETA_TIPO, getAulas, type Aula } from "@/lib/red-data"

const modulos = [
  { icon: CalculatorIcon, titulo: "Servicios y cotizador", texto: "Impresión 3D, corte láser y CNC en las aulas, con contacto por WhatsApp o correo." },
  { icon: BadgeCheckIcon, titulo: "Capacitaciones y certificados", texto: "Certificados PDF de horas de formación, verificables con código o QR." },
  { icon: MegaphoneIcon, titulo: "Convocatorias", texto: "Buscador de oportunidades de financiación para aulas, colegios y municipios." },
  { icon: SchoolIcon, titulo: "Montar un aula", texto: "Solicitud de reunión para que un municipio o colegio se sume a la red." },
]

function AulaItem({ aula }: { aula: Aula }) {
  return (
    <li>
      <Link href={`/aulas/${aula.slug}`} className="iso-panel group flex h-full flex-col gap-1.5 p-4">
        <span className={tipo.etiqueta}>
          {ETIQUETA_TIPO[aula.tipo]} · {aula.municipio.nombre}
        </span>
        <span className={tipo.h3}>{aula.nombre}</span>
        {aula.anio_dotacion && <span className={tipo.textoTarjeta}>Dotación {aula.anio_dotacion}</span>}
        <span className="text-link mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold">
          Ver aula <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
    </li>
  )
}

export default async function HomePage() {
  const aulas = await getAulas()
  const red = aulas.filter((a) => a.tipo !== "centro")
  const municipales = aulas.filter((a) => a.tipo === "municipal")
  const colegios = aulas.filter((a) => a.tipo === "colegio")

  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      <main id="contenido" className="relative mx-auto w-full max-w-6xl border-x bg-background/60">
        <section className="relative grid gap-10 border-b px-8 py-14 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:px-14 lg:py-20">
          <div className="flex flex-col gap-5">
            <Antetitulo pulso>Red de aulas STEAM · Caldas</Antetitulo>
            <TituloEntrada
              texto="Aulas STEAM conectadas en todo Caldas"
              acento="en todo Caldas"
              className={tipo.h1}
            />
            <p className={tipo.entrada}>
              El Centro de Prototipado de la UNAL en Manizales articula {red.length} aulas en municipios y colegios del departamento.
              Encuentra el aula más cercana, conoce sus equipos y sus servicios.
            </p>
          </div>
          <dl className="grid grid-cols-3 border-t pt-6">
            {[
              [red.length, "aulas en la red"],
              [municipales.length, "municipios"],
              [colegios.length, "colegios en Manizales"],
            ].map(([valor, texto]) => (
              <div key={texto} className="flex flex-col gap-0.5 pr-4 pb-3">
                <dt className="sr-only">{texto}</dt>
                <dd className={tipo.cifra}>
                  <Contador valor={valor} />
                </dd>
                <dd className={tipo.rotulo}>{texto}</dd>
              </div>
            ))}
          </dl>
          <DecorIcon position="bottom-left" />
          <DecorIcon position="bottom-right" />
        </section>

        <section id="mapa" aria-label="Mapa de la red" className="scroll-mt-24 border-b px-4 py-8 sm:px-8 lg:px-16">
          <RedMap aulas={aulas} />
        </section>

        <section id="aulas" aria-labelledby="aulas-titulo" className={`scroll-mt-24 border-b ${tipo.seccion}`}>
          <Antetitulo>Directorio</Antetitulo>
          <TituloAnimado id="aulas-titulo" texto="Aulas de la red" acento="red" className={tipo.h2} />
          <p className={tipo.bajada}>La misma información del mapa, en lista. Entra a cada aula para ver sus equipos y servicios.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {aulas.map((aula) => (
              <AulaItem key={aula.slug} aula={aula} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="modulos-titulo" className={tipo.seccion}>
          <Antetitulo>Próximas etapas</Antetitulo>
          <TituloAnimado id="modulos-titulo" texto="Lo que viene" acento="viene" className={tipo.h2} />
          <p className={tipo.bajada}>Módulos en construcción durante las próximas etapas del proyecto.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modulos.map(({ icon: Icon, titulo, texto }) => (
              <li key={titulo} className="iso-panel p-5">
                <Icon className="size-5 text-link" aria-hidden="true" />
                <p className={`mt-3 ${tipo.etiqueta}`}>En construcción</p>
                <p className={`mt-1.5 ${tipo.h3}`}>{titulo}</p>
                <p className={`mt-1.5 ${tipo.textoTarjeta}`}>{texto}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
