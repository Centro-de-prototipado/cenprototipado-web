"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRightIcon } from "lucide-react"
import { useSupabase } from "@cen/auth"
import { tipo } from "@/components/ui/tipografia"
import { GestionProyectos } from "@/components/proyectos/gestion-proyectos"
import { EditorAula } from "./editor-aula"
import { Cargando, SinAcceso } from "./marco-panel"
import { useRoles, type AulaCorta } from "./use-roles"

type Equipo = {
  id: number
  categoria: string
  nombre: string
  cantidad: number
  estado: "funcional" | "inconvenientes" | "danado" | "no_funcional" | null
  tipo_dano: string | null
}

const ESTADO: Record<NonNullable<Equipo["estado"]>, { texto: string; clase: string }> = {
  funcional: { texto: "Funcional", clase: "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  inconvenientes: { texto: "Con inconvenientes", clase: "border-amber-500/40 bg-amber-500/10 text-amber-800 dark:text-amber-300" },
  danado: { texto: "Presenta daños", clase: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300" },
  no_funcional: { texto: "No funcional", clase: "border-red-500/40 bg-red-500/10 text-red-700 dark:text-red-300" },
}

/** Panel privado del aula: lo ve su gestor; la coordinación puede elegir cualquier aula. */
export function PanelGestor() {
  const estado = useRoles()
  const sb = useSupabase()
  const [todas, setTodas] = useState<AulaCorta[]>([])
  const esCoordinador = !estado.cargando && estado.userId !== null && estado.esCoordinador

  useEffect(() => {
    if (!esCoordinador) return
    sb.schema("red")
      .from("aulas")
      .select("id, nombre, slug")
      .order("nombre")
      .then(({ data }) => setTodas((data as AulaCorta[]) ?? []))
  }, [sb, esCoordinador])

  if (estado.cargando) return <Cargando />
  if (estado.userId === null) return <SinAcceso motivo="sesion" volverA="/mi-aula" />
  const aulas = estado.esCoordinador ? todas : estado.misAulas
  if (!estado.esCoordinador && aulas.length === 0) return <SinAcceso motivo="permiso" volverA="/mi-aula" />
  if (aulas.length === 0) return <Cargando />
  return <Inventario aulas={aulas} />
}

function Inventario({ aulas }: { aulas: AulaCorta[] }) {
  const sb = useSupabase()
  const [aulaId, setAulaId] = useState(aulas[0].id)
  const [equipos, setEquipos] = useState<{ aula: string; lista: Equipo[] } | null>(null)
  const aula = aulas.find((a) => a.id === aulaId) ?? aulas[0]

  useEffect(() => {
    let vigente = true
    sb.schema("red")
      .from("equipos")
      .select("id, categoria, nombre, cantidad, estado, tipo_dano")
      .eq("aula_id", aula.id)
      .order("categoria")
      .order("nombre")
      .then(({ data }) => {
        if (vigente) setEquipos({ aula: aula.id, lista: (data as Equipo[]) ?? [] })
      })
    return () => {
      vigente = false
    }
  }, [sb, aula.id])

  const lista = equipos?.aula === aula.id ? equipos.lista : null
  const grupos = useMemo(() => {
    const mapa = new Map<string, Equipo[]>()
    for (const e of lista ?? []) mapa.set(e.categoria, [...(mapa.get(e.categoria) ?? []), e])
    return [...mapa.entries()]
  }, [lista])
  const unidades = (lista ?? []).reduce((s, e) => s + e.cantidad, 0)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end gap-4">
        {aulas.length > 1 ? (
          <div className="space-y-1.5">
            <label htmlFor="aula" className="block text-sm font-semibold">
              Aula
            </label>
            <select
              id="aula"
              value={aula.id}
              onChange={(e) => setAulaId(e.target.value)}
              className="block min-h-11 min-w-72 border border-input bg-background px-3 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {aulas.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="m-0 text-lg font-bold">{aula.nombre}</p>
        )}
        <Link href={`/aulas/${aula.slug}`} className="text-link inline-flex items-center gap-1 text-sm font-semibold underline">
          Ver página pública <ArrowUpRightIcon className="size-4" aria-hidden="true" />
        </Link>
      </div>

      <EditorAula key={`datos-${aula.id}`} aula={aula} />

      <div className="border-t pt-8">
        <GestionProyectos key={aula.id} aula={aula} />
      </div>

      <section aria-labelledby="inventario-titulo" className="border-t pt-8">
        <h2 id="inventario-titulo" className={tipo.h3}>
          Inventario de equipos
        </h2>
        <p className={`mt-1 ${tipo.textoTarjeta}`}>
          {lista === null
            ? "Cargando…"
            : lista.length
              ? `${unidades} unidades en ${grupos.length} categorías. Solo lo ven el gestor del aula y la coordinación.`
              : "Esta aula todavía no tiene equipos registrados."}
        </p>
        <div className="mt-4 space-y-3">
          {grupos.map(([categoria, items]) => (
            <details key={categoria} open className="iso-panel group">
              <summary className="flex min-h-12 cursor-pointer list-none items-center gap-3 px-5 py-3 [&::-webkit-details-marker]:hidden">
                <span className="font-semibold">{categoria}</span>
                <span className="text-xs text-muted-foreground">{items.reduce((s, e) => s + e.cantidad, 0)} unidades</span>
              </summary>
              <div className="overflow-x-auto border-t">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Equipos de la categoría {categoria}</caption>
                  <thead className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    <tr>
                      <th scope="col" className="px-5 py-2 font-semibold">
                        Equipo
                      </th>
                      <th scope="col" className="px-3 py-2 text-right font-semibold">
                        Cantidad
                      </th>
                      <th scope="col" className="px-5 py-2 font-semibold">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((e) => (
                      <tr key={e.id} className="border-t align-top">
                        <td className="px-5 py-3">
                          <span className="font-medium">{e.nombre}</span>
                          {e.tipo_dano && <span className="mt-1 block text-xs text-amber-700 dark:text-amber-300">{e.tipo_dano}</span>}
                        </td>
                        <td className="px-3 py-3 text-right tabular-nums">{e.cantidad}</td>
                        <td className="px-5 py-3">
                          {e.estado ? (
                            <span className={`inline-block border px-2 py-0.5 text-xs whitespace-nowrap ${ESTADO[e.estado].clase}`}>
                              {ESTADO[e.estado].texto}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Sin reporte</span>
                          )}
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
    </div>
  )
}
