import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeftIcon, CalendarIcon, FolderKanbanIcon, MailIcon, MessageCircleIcon, WrenchIcon } from "lucide-react"
import { MunicipioMapa } from "@/components/municipio-mapa"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Contador, TituloAnimado, TituloEntrada } from "@/components/ui/animaciones"
import { Antetitulo, tipo } from "@/components/ui/tipografia"
import { ETIQUETA_TIPO, getAula, getAulas } from "@/lib/red-data"

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

export default async function AulaPage({ params }: Props) {
  const { slug } = await params
  const aula = await getAula(slug)
  if (!aula) notFound()

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
        <section className="grid gap-8 border-b px-8 py-8 lg:grid-cols-[1.4fr_1fr] lg:items-start lg:px-14 lg:pb-14">
          <div className="flex flex-col gap-5">
            <Antetitulo pulso>
              {ETIQUETA_TIPO[aula.tipo]} · {aula.municipio.nombre}
            </Antetitulo>
            <TituloEntrada texto={aula.nombre} className={tipo.h1} />
            {aula.institucion && aula.tipo !== "centro" && <p className="-mt-2 text-base font-semibold text-muted-foreground">{aula.institucion}</p>}
            {aula.descripcion && <p className={tipo.entrada}>{aula.descripcion}</p>}

            <dl className="grid grid-cols-3 border-t pt-6">
              {[
                { icon: WrenchIcon, valor: aula.servicios.length || "—", texto: "servicios" },
                { icon: CalendarIcon, valor: aula.anio_dotacion ?? "—", texto: "año de dotación" },
                { icon: FolderKanbanIcon, valor: 0, texto: "proyectos publicados" },
              ].map(({ icon: Icon, valor, texto }) => (
                <div key={texto} className="flex flex-col gap-0.5 pr-4 pb-3">
                  <dt className="sr-only">{texto}</dt>
                  <dd className={`flex items-center gap-2 ${tipo.cifra}`}>
                    <Icon className="size-5 text-link" aria-hidden="true" />
                    <Contador valor={valor} />
                  </dd>
                  <dd className={tipo.rotulo}>{texto}</dd>
                </div>
              ))}
            </dl>
          </div>

          <aside className="space-y-4">
            <MunicipioMapa aula={aula} />
            <div className="iso-panel p-5">
              <h2 className={tipo.h3}>Contacto</h2>
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
        <section aria-labelledby="servicios-titulo" className={`border-b ${tipo.seccion}`}>
          <Antetitulo>Qué ofrece</Antetitulo>
          <TituloAnimado id="servicios-titulo" texto="Servicios" className={tipo.h2} />
          <p className={tipo.bajada}>
            Lo que el aula puede ofrecer con su dotación. Las tarifas las define cada aula: el precio se acuerda directamente con ella.
          </p>
          {aula.servicios.length ? (
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {aula.servicios.map((s) => (
                <li key={s.id} className="iso-panel flex flex-col p-5">
                  <p className={tipo.h3}>{s.nombre}</p>
                  {s.descripcion && <p className={`mt-1.5 ${tipo.textoTarjeta}`}>{s.descripcion}</p>}
                  <dl className="mt-4 space-y-1 text-xs">
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
                  <p className="text-link mt-auto pt-4 text-xs font-semibold">
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

        {/* Proyectos */}
        <section aria-labelledby="proyectos-titulo" className={tipo.seccion}>
          <Antetitulo>Portafolio</Antetitulo>
          <TituloAnimado id="proyectos-titulo" texto="Proyectos" className={tipo.h2} />
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
