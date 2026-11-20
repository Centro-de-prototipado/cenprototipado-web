import { ArrowUpRightIcon, BadgeCheckIcon, CalculatorIcon, MegaphoneIcon, SchoolIcon } from "lucide-react"
import { RedMap } from "@/components/red-map"
import { aulasColegio, aulasMunicipales, centro, todasLasAulas, type Aula } from "@/lib/aulas"
import { CENTRO_URL } from "@/lib/site-config"

const modulos = [
  { icon: CalculatorIcon, titulo: "Servicios y cotizador", texto: "Impresión 3D, corte láser y CNC en las aulas, con contacto por WhatsApp o correo." },
  { icon: BadgeCheckIcon, titulo: "Capacitaciones y certificados", texto: "Certificados PDF de horas de formación, verificables con código o QR." },
  { icon: MegaphoneIcon, titulo: "Convocatorias", texto: "Buscador de oportunidades de financiación para aulas, colegios y municipios." },
  { icon: SchoolIcon, titulo: "Montar un aula", texto: "Solicitud de reunión para que un municipio o colegio se sume a la red." },
]

function AulaItem({ aula }: { aula: Aula }) {
  const etiqueta = aula.tipo === "centro" ? "Nodo central" : aula.tipo === "municipal" ? "Aula municipal" : "Aula de colegio"
  return (
    <li id={`aula-${aula.slug}`} className="iso-panel scroll-mt-24 p-4">
      <p className="font-mono text-xs tracking-widest text-link uppercase">
        {etiqueta} · {aula.municipio}
      </p>
      <p className="mt-1 text-lg font-semibold">{aula.nombre}</p>
      {aula.dotacion && <p className="text-sm text-muted-foreground">Dotación {aula.dotacion}</p>}
    </li>
  )
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4">
          <a href="#contenido" className="flex items-center gap-2 font-bold">
            <span aria-hidden="true" className="grid size-8 place-items-center bg-primary text-primary-foreground">
              R
            </span>
            <span className="leading-tight">
              Red STEAM <span className="block font-mono text-[11px] font-normal tracking-widest text-muted-foreground">CALDAS</span>
            </span>
          </a>
          <nav aria-label="Principal" className="ml-auto flex items-center gap-1 text-sm">
            <a href="#mapa" className="hidden px-3 py-2 hover:bg-accent sm:inline-block">
              Mapa
            </a>
            <a href="#aulas" className="hidden px-3 py-2 hover:bg-accent sm:inline-block">
              Aulas
            </a>
            <a
              href={CENTRO_URL}
              className="inline-flex min-h-10 items-center gap-1 border px-3 font-medium hover:bg-accent"
            >
              Centro de Prototipado <ArrowUpRightIcon className="size-4" aria-hidden="true" />
            </a>
          </nav>
        </div>
      </header>

      <main id="contenido" className="mx-auto max-w-6xl px-4 pb-24">
        <section className="grid gap-10 py-14 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <p className="font-mono text-sm tracking-[0.2em] text-link uppercase">Red de aulas STEAM de Caldas</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Aulas STEAM conectadas en todo Caldas</h1>
            <p className="mt-5 max-w-prose text-lg text-muted-foreground">
              El Centro de Prototipado de la UNAL en Manizales articula {todasLasAulas.length} aulas en municipios y colegios del
              departamento. Encuentra el aula más cercana, conoce sus equipos y sus proyectos.
            </p>
            <dl className="mt-8 grid grid-cols-3 gap-3">
              {[
                [todasLasAulas.length, "aulas en la red"],
                [aulasMunicipales.length, "municipios"],
                [aulasColegio.length, "colegios en Manizales"],
              ].map(([valor, texto]) => (
                <div key={texto} className="border-l-4 border-primary bg-card p-3">
                  <dt className="sr-only">{texto}</dt>
                  <dd className="text-3xl font-extrabold">{valor}</dd>
                  <dd className="text-sm text-muted-foreground">{texto}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div id="mapa" className="scroll-mt-24">
            <RedMap />
          </div>
        </section>

        <section id="aulas" aria-labelledby="aulas-titulo" className="scroll-mt-24 py-10">
          <h2 id="aulas-titulo" className="text-3xl font-bold">
            Aulas de la red
          </h2>
          <p className="mt-2 text-muted-foreground">La misma información del mapa, en lista.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AulaItem aula={centro} />
            {todasLasAulas.map((aula) => (
              <AulaItem key={aula.slug} aula={aula} />
            ))}
          </ul>
        </section>

        <section aria-labelledby="modulos-titulo" className="py-10">
          <h2 id="modulos-titulo" className="text-3xl font-bold">
            Lo que viene
          </h2>
          <p className="mt-2 text-muted-foreground">Módulos en construcción durante las próximas etapas del proyecto.</p>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {modulos.map(({ icon: Icon, titulo, texto }) => (
              <li key={titulo} className="iso-panel p-5">
                <Icon className="size-6 text-link" aria-hidden="true" />
                <p className="mt-3 font-semibold">{titulo}</p>
                <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
                <p className="mt-3 font-mono text-[11px] tracking-widest text-muted-foreground uppercase">En construcción</p>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="border-t bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-4 py-8 text-sm">
          <p className="font-semibold">Red STEAM Caldas</p>
          <p className="text-muted-foreground">Centro de Prototipado · Universidad Nacional de Colombia, sede Manizales</p>
          <a href={CENTRO_URL} className="text-link ml-auto underline">
            Sitio del Centro
          </a>
        </div>
      </footer>
    </div>
  )
}
