"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeftIcon, ExternalLinkIcon, FolderKanbanIcon } from "lucide-react"
import { useSupabase } from "@cen/auth"
import { AREAS, COLUMNAS_PROYECTO, type Area, type Proyecto } from "@/lib/proyectos"
import { Antetitulo, tipo } from "@/components/ui/tipografia"
import { TarjetaProyecto } from "./tarjeta-proyecto"

function usePublicados(aulaId?: string) {
  const sb = useSupabase()
  const [proyectos, setProyectos] = useState<Proyecto[] | null>(null)
  useEffect(() => {
    let vigente = true
    let consulta = sb.schema("red").from("proyectos").select(COLUMNAS_PROYECTO).eq("publicado", true)
    if (aulaId) consulta = consulta.eq("aula_id", aulaId)
    consulta.order("created_at", { ascending: false }).then(({ data }) => {
      if (vigente) setProyectos((data as unknown as Proyecto[]) ?? [])
    })
    return () => {
      vigente = false
    }
  }, [sb, aulaId])
  return proyectos
}

/** Proyectos publicados de un aula (página pública del aula). */
export function ProyectosAula({ aulaId }: { aulaId: string }) {
  const proyectos = usePublicados(aulaId)
  if (proyectos === null) return <p className="mt-6 text-sm text-muted-foreground">Cargando proyectos…</p>
  if (proyectos.length === 0)
    return <p className="mt-6 border border-dashed p-6 text-muted-foreground">Esta aula todavía no ha publicado proyectos.</p>
  return (
    <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {proyectos.map((p) => (
        <TarjetaProyecto key={p.id} proyecto={p} mostrarAula={false} />
      ))}
    </ul>
  )
}

/** Galería de toda la red, con filtro por área. */
export function GaleriaProyectos() {
  const proyectos = usePublicados()
  const [area, setArea] = useState<Area | "todas">("todas")
  const areas = useMemo(() => [...new Set((proyectos ?? []).map((p) => p.area))], [proyectos])
  const visibles = (proyectos ?? []).filter((p) => area === "todas" || p.area === area)

  if (proyectos === null) return <p className="text-sm text-muted-foreground">Cargando proyectos…</p>
  if (proyectos.length === 0)
    return (
      <p className="border border-dashed p-6 text-muted-foreground">
        Aún no hay proyectos publicados. Los gestores de cada aula los publican desde «Mi aula».
      </p>
    )
  return (
    <div className="flex flex-col gap-6">
      {areas.length > 1 && (
        <fieldset className="flex flex-wrap gap-2">
          <legend className="sr-only">Filtrar por área</legend>
          {(["todas", ...areas] as const).map((a) => (
            <button
              key={a}
              type="button"
              aria-pressed={area === a}
              onClick={() => setArea(a)}
              className="min-h-10 border px-3 text-sm font-medium hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none aria-pressed:border-primary aria-pressed:bg-primary aria-pressed:text-neutral-950"
            >
              {a === "todas" ? "Todas" : AREAS[a]}
            </button>
          ))}
        </fieldset>
      )}
      <p role="status" className="m-0 text-sm text-muted-foreground">
        {visibles.length} {visibles.length === 1 ? "proyecto" : "proyectos"}
      </p>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visibles.map((p) => (
          <TarjetaProyecto key={p.id} proyecto={p} />
        ))}
      </ul>
    </div>
  )
}

/** Página de un proyecto: /proyecto?id=… */
export function DetalleProyecto() {
  const id = useSearchParams().get("id")
  const sb = useSupabase()
  const [estado, setEstado] = useState<{ id: string; proyecto: Proyecto | null } | null>(null)

  useEffect(() => {
    if (!id) return
    let vigente = true
    sb.schema("red")
      .from("proyectos")
      .select(COLUMNAS_PROYECTO)
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        if (vigente) setEstado({ id, proyecto: (data as unknown as Proyecto) ?? null })
      })
    return () => {
      vigente = false
    }
  }, [sb, id])

  const titulo = estado?.proyecto?.titulo
  useEffect(() => {
    if (titulo) document.title = `${titulo} | Red STEAM Caldas`
  }, [titulo])

  if (!id || (estado && estado.id === id && !estado.proyecto))
    return (
      <div className="flex flex-col gap-3">
        <p className="m-0 font-bold">No encontramos este proyecto.</p>
        <p className="m-0 text-sm text-muted-foreground">Puede que el aula lo haya ocultado o que el enlace esté incompleto.</p>
        <Link href="/proyectos" className="text-link w-fit text-sm font-semibold underline">
          Ver todos los proyectos
        </Link>
      </div>
    )
  if (!estado || estado.id !== id) return <p className="text-sm text-muted-foreground">Cargando proyecto…</p>
  const p = estado.proyecto!

  return (
    <article className="flex flex-col gap-8">
      <Link href="/proyectos" className="inline-flex w-fit items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeftIcon className="size-4" aria-hidden="true" /> Todos los proyectos
      </Link>
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
        <div className="flex flex-col gap-5">
          <Antetitulo pulso>
            {AREAS[p.area]}
            {p.anio ? ` · ${p.anio}` : ""}
          </Antetitulo>
          <h1 className={tipo.h1}>{p.titulo}</h1>
          <p className={tipo.entrada}>{p.resumen}</p>
          {!p.publicado && (
            <p className="m-0 w-fit border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-sm">
              Borrador: solo lo ven el gestor del aula y la coordinación.
            </p>
          )}
        </div>
        {p.portada_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.portada_url} alt="" className="aspect-video w-full border object-cover" />
        ) : (
          <div aria-hidden="true" className="grid aspect-video place-items-center border border-cyan-950 bg-[#0b1726] text-cyan-400/60">
            <FolderKanbanIcon className="size-14" />
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          {p.descripcion ? (
            <div className="max-w-prose text-base leading-relaxed whitespace-pre-line">{p.descripcion}</div>
          ) : (
            <p className="text-muted-foreground">El aula no agregó una descripción más larga.</p>
          )}
        </div>
        <dl className="iso-panel flex h-fit flex-col gap-4 p-5 text-sm">
          {p.aula && (
            <div>
              <dt className={tipo.etiqueta}>Aula</dt>
              <dd className="m-0 mt-1">
                <Link href={`/aulas/${p.aula.slug}`} className="text-link font-semibold underline">
                  {p.aula.nombre}
                </Link>
                {p.aula.municipio && <span className="text-muted-foreground"> · {p.aula.municipio.nombre}</span>}
              </dd>
            </div>
          )}
          {p.participantes && (
            <div>
              <dt className={tipo.etiqueta}>Participantes</dt>
              <dd className="m-0 mt-1 whitespace-pre-line">{p.participantes}</dd>
            </div>
          )}
          {p.enlace && (
            <div>
              <dt className={tipo.etiqueta}>Más información</dt>
              <dd className="m-0 mt-1">
                <a href={p.enlace} target="_blank" rel="noopener noreferrer" className="text-link inline-flex items-center gap-1 font-semibold underline">
                  Abrir enlace <ExternalLinkIcon className="size-4" aria-hidden="true" />
                  <span className="sr-only">(se abre en otra pestaña)</span>
                </a>
              </dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  )
}
