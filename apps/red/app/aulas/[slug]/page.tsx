import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, BoxesIcon, CalendarIcon, ChevronDownIcon, FolderKanbanIcon, MailIcon, MessageCircleIcon, WrenchIcon } from "lucide-react"
import { MunicipioMapa } from "@/components/municipio-mapa"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Contador, TituloAnimado, TituloEntrada } from "@/components/ui/animaciones"
import { ETIQUETA_TIPO, ORDEN_CATEGORIAS, getAula, getAulas, type Equipo } from "@/lib/red-data"

// Exportación estática: una página por aula, generada en el build con los datos de Supabase.
export const dynamicParams = false

export async function generateStaticParams() {
  const aulas = await getAulas()
  return aulas.map((a) => ({ slug: a.slug }))
}

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const aula = await getAula(slug)
  if (!aula) return {}
  return {
    title: aula.nombre,
    description: aula.descripcion ?? `${aula.nombre}, ${aula.municipio.nombre} (Caldas). Parte de la Red STEAM de Caldas.`,
  }
}

const ESTADO: Record<NonNullable<Equipo["estado"]>, { texto: string; clase: string }> = {
  funcional: { texto: "Funcional", clase: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  inconvenientes: { texto: "Con inconvenientes", clase: "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300" },
  danado: { texto: "Presenta daños", clase: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300" },
  no_funcional: { texto: "No funcional", clase: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300" },
}

const USO: Record<NonNullable<Equipo["frecuencia_uso"]>, string> = {
  diario: "Diario",
  semanal: "Semanal",
  mensual: "Mensual",
  ocasional: "Ocasional",
  no_se_usa: "No se usa",
}

function agrupar(equipos: Equipo[]) {
  const grupos = new Map<string, Equipo[]>()
  for (const e of equipos) grupos.set(e.categoria, [...(grupos.get(e.categoria) ?? []), e])
  return [...grupos.entries()]
    .map(([categoria, items]) => ({
      categoria,
      items: items.sort((a, b) => a.nombre.localeCompare(b.nombre, "es")),
      unidades: items.reduce((s, e) => s + e.cantidad, 0),
    }))
    .sort((a, b) => {
      const ia = ORDEN_CATEGORIAS.indexOf(a.categoria)
      const ib = ORDEN_CATEGORIAS.indexOf(b.categoria)
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib)
    })
}

/** Las categorías técnicas se muestran abiertas; mobiliario, cables y cómputo, plegadas. */
const PLEGADAS = new Set(["Mobiliario", "Energía y cables", "Cómputo", "Audiovisual y realidad virtual"])

export default async function AulaPage({ params }: Props) {
  const { slug } = await params
  const aula = await getAula(slug)
  if (!aula) notFound()

  const grupos = agrupar(aula.equipos)
  const unidades = aula.equipos.reduce((s, e) => s + e.cantidad, 0)
  const conEstado = aula.equipos.filter((e) => e.estado)
  const funcionales = conEstado.filter((e) => e.estado === "funcional").length
  const whatsapp = aula.whatsapp?.replace(/\D/g, "")

  return (
    <div className="relative min-h-screen">
      <SiteHeader />

      <main id="contenido" className="relative mx-auto w-full max-w-6xl border-x bg-background/60">
        <nav aria-label="Ruta" className="px-8 pt-8 text-sm text-muted-foreground lg:px-16">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-foreground">
                Red STEAM
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/#aulas" className="hover:text-foreground">
                Aulas
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-foreground">
              {aula.nombre}
            </li>
          </ol>
        </nav>

        {/* Encabezado del aula */}
        <section className="grid gap-8 border-b px-8 py-8 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:px-16 lg:pb-14">
          <div>
            <p className="font-mono text-sm tracking-[0.2em] text-link uppercase">
              {ETIQUETA_TIPO[aula.tipo]} · {aula.municipio.nombre}
            </p>
            <TituloEntrada texto={aula.nombre} className="mt-3 text-4xl leading-[0.98] font-extrabold tracking-[-0.03em] text-balance sm:text-5xl" />
            {aula.institucion && aula.tipo !== "centro" && <p className="mt-2 text-lg text-muted-foreground">{aula.institucion}</p>}
            {aula.descripcion && <p className="mt-5 max-w-prose text-lg text-muted-foreground">{aula.descripcion}</p>}

            <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { icon: BoxesIcon, valor: unidades || "—", texto: "unidades de equipo" },
                { icon: WrenchIcon, valor: aula.servicios.length || "—", texto: "servicios" },
                { icon: CalendarIcon, valor: aula.anio_dotacion ?? "—", texto: "año de dotación" },
                { icon: FolderKanbanIcon, valor: 0, texto: "proyectos publicados" },
              ].map(({ icon: Icon, valor, texto }) => (
                <div key={texto} className="border-l-4 border-primary bg-card p-3">
                  <dt className="sr-only">{texto}</dt>
                  <dd className="flex items-center gap-2 text-2xl font-extrabold">
                    <Icon className="size-5 text-link" aria-hidden="true" />
                    <Contador valor={valor} />
                  </dd>
                  <dd className="text-sm text-muted-foreground">{texto}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="space-y-4">
            <MunicipioMapa municipio={aula.municipio.nombre} colegio={aula.tipo === "colegio"} />
            <div className="iso-panel p-5">
              <h2 className="font-semibold">Contacto</h2>
              {whatsapp || aula.correo ? (
                <div className="mt-3 flex flex-col gap-2">
                  {aula.gestor_nombre && <p className="text-sm text-muted-foreground">Gestor: {aula.gestor_nombre}</p>}
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola, escribo desde la Red STEAM de Caldas sobre el ${aula.nombre}.`)}`}
                      className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#25d366] px-4 font-semibold text-neutral-950"
                    >
                      <MessageCircleIcon className="size-5" aria-hidden="true" /> Escribir por WhatsApp
                    </a>
                  )}
                  {aula.correo && (
                    <a href={`mailto:${aula.correo}`} className="inline-flex min-h-11 items-center justify-center gap-2 border px-4 font-medium hover:bg-accent">
                      <MailIcon className="size-5" aria-hidden="true" /> {aula.correo}
                    </a>
                  )}
                </div>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">
                  Los datos de contacto de esta aula se están actualizando. Mientras tanto, escribe al Centro de Prototipado.
                </p>
              )}
            </div>
          </aside>
        </section>

        {/* Servicios */}
        <section aria-labelledby="servicios-titulo" className="border-b px-8 py-12 lg:px-16">
          <TituloAnimado id="servicios-titulo" texto="Servicios" className="text-3xl font-bold tracking-tight" />
          <p className="mt-2 text-muted-foreground">
            Lo que el aula puede ofrecer con su dotación. Las tarifas las define cada aula: el precio se acuerda directamente con ella.
          </p>
          {aula.servicios.length ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {aula.servicios.map((s) => (
                <li key={s.id} className="iso-panel flex flex-col p-5">
                  <p className="text-lg font-semibold">{s.nombre}</p>
                  {s.descripcion && <p className="mt-1 text-sm text-muted-foreground">{s.descripcion}</p>}
                  <dl className="mt-4 space-y-1 text-sm">
                    {s.equipo_base && (
                      <div>
                        <dt className="inline font-mono text-[11px] tracking-widest text-muted-foreground uppercase">Equipo · </dt>
                        <dd className="inline">{s.equipo_base}</dd>
                      </div>
                    )}
                    {s.unidad_cobro && (
                      <div>
                        <dt className="inline font-mono text-[11px] tracking-widest text-muted-foreground uppercase">Cobro · </dt>
                        <dd className="inline">{s.unidad_cobro}</dd>
                      </div>
                    )}
                  </dl>
                  <p className="text-link mt-auto pt-4 text-sm font-semibold">
                    {s.tarifa_min != null
                      ? `Desde $${s.tarifa_min.toLocaleString("es-CO")}`
                      : "Precio a convenir con el aula"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-6 border border-dashed p-6 text-muted-foreground">Esta aula aún no tiene servicios registrados.</p>
          )}
        </section>

        {/* Equipos */}
        <section aria-labelledby="equipos-titulo" className="border-b px-8 py-12 lg:px-16">
          <TituloAnimado id="equipos-titulo" texto="Equipos" className="text-3xl font-bold tracking-tight" />
          <p className="mt-2 text-muted-foreground">
            {aula.equipos.length
              ? `${unidades} unidades en ${grupos.length} categorías, según el inventario de las aulas.`
              : "El inventario de esta aula se publicará pronto."}
            {conEstado.length > 0 && ` ${funcionales} de ${conEstado.length} registros con estado reportado funcionan bien.`}
          </p>

          <div className="mt-6 space-y-3">
            {grupos.map((g) => (
              <details key={g.categoria} open={!PLEGADAS.has(g.categoria)} className="group iso-panel">
                <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-5 py-3 [&::-webkit-details-marker]:hidden">
                  <span className="font-semibold">{g.categoria}</span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {g.unidades} {g.unidades === 1 ? "unidad" : "unidades"}
                  </span>
                  <ChevronDownIcon className="ml-auto size-5 transition-transform group-open:rotate-180" aria-hidden="true" />
                </summary>
                <div className="overflow-x-auto border-t">
                  <table className="w-full text-left text-sm">
                    <caption className="sr-only">Equipos de la categoría {g.categoria}</caption>
                    <thead className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                      <tr>
                        <th scope="col" className="px-5 py-2 font-normal">
                          Equipo
                        </th>
                        <th scope="col" className="px-3 py-2 text-right font-normal">
                          Cant.
                        </th>
                        <th scope="col" className="px-3 py-2 font-normal">
                          Estado
                        </th>
                        <th scope="col" className="px-5 py-2 font-normal">
                          Uso
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.items.map((e) => (
                        <tr key={e.id} className="border-t align-top">
                          <td className="px-5 py-3">
                            <span className="font-medium">{e.nombre}</span>
                            {e.catalogo?.descripcion && (
                              <span className="mt-1 line-clamp-2 text-xs text-muted-foreground">{e.catalogo.descripcion}</span>
                            )}
                            {e.tipo_dano && <span className="mt-1 block text-xs text-amber-700 dark:text-amber-300">{e.tipo_dano}</span>}
                          </td>
                          <td className="px-3 py-3 text-right font-mono">{e.cantidad}</td>
                          <td className="px-3 py-3">
                            {e.estado ? (
                              <span className={`inline-block border px-2 py-0.5 text-xs whitespace-nowrap ${ESTADO[e.estado].clase}`}>
                                {ESTADO[e.estado].texto}
                              </span>
                            ) : (
                              <span className="text-xs text-muted-foreground">Sin reporte</span>
                            )}
                          </td>
                          <td className="px-5 py-3 text-xs whitespace-nowrap">
                            {e.frecuencia_uso ? USO[e.frecuencia_uso] : <span className="text-muted-foreground">—</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Proyectos */}
        <section aria-labelledby="proyectos-titulo" className="px-8 py-12 lg:px-16">
          <TituloAnimado id="proyectos-titulo" texto="Proyectos" className="text-3xl font-bold tracking-tight" />
          <p className="mt-6 border border-dashed p-6 text-muted-foreground">
            Esta aula todavía no ha publicado proyectos. El portafolio colaborativo llega con el inicio de sesión de la plataforma.
          </p>
        </section>

        <Link href="/#aulas" className="text-link inline-flex items-center gap-2 font-medium">
          <ArrowLeftIcon className="size-4" aria-hidden="true" /> Volver a todas las aulas
        </Link>
      </main>

      <SiteFooter />
    </div>
  )
}
