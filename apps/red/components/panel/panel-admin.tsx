"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowRightIcon, FolderKanbanIcon, SchoolIcon, UsersIcon } from "lucide-react"
import { useSupabase } from "@cen/auth"
import { tipo } from "@/components/ui/tipografia"
import { Cargando, SinAcceso } from "./marco-panel"
import { useRoles } from "./use-roles"

type Resumen = {
  aulas: number
  gestores: number
  aulas_sin_gestor: number
  proyectos_publicados: number
  proyectos_borrador: number
  invitaciones: number
}

/** Panel de administración: resumen de la red y accesos a cada gestión. */
export function PanelAdmin() {
  const estado = useRoles()
  if (estado.cargando) return <Cargando />
  if (estado.userId === null) return <SinAcceso motivo="sesion" volverA="/admin" />
  if (!estado.esCoordinador) return <SinAcceso motivo="permiso" volverA="/admin" />
  return <Contenido />
}

function Contenido() {
  const sb = useSupabase()
  const red = useMemo(() => sb.schema("red"), [sb])
  const [resumen, setResumen] = useState<Resumen | null>(null)
  const [sinGestor, setSinGestor] = useState<{ nombre: string; slug: string }[]>([])

  useEffect(() => {
    let vigente = true
    Promise.all([red.rpc("resumen_red"), red.from("aulas").select("id, nombre, slug").order("nombre"), red.rpc("listar_miembros")]).then(
      ([r, a, m]) => {
        if (!vigente) return
        setResumen(((r.data as Resumen[]) ?? [])[0] ?? null)
        const conGestor = new Set(((m.data as { rol: string; aula_id: string | null }[]) ?? []).filter((x) => x.rol === "gestor").map((x) => x.aula_id))
        setSinGestor(((a.data as { id: string; nombre: string; slug: string }[]) ?? []).filter((x) => !conGestor.has(x.id)))
      }
    )
    return () => {
      vigente = false
    }
  }, [red])

  if (!resumen) return <Cargando />

  const cifras = [
    { valor: resumen.aulas, texto: "aulas activas" },
    { valor: resumen.gestores, texto: "gestores" },
    { valor: resumen.proyectos_publicados, texto: "proyectos publicados" },
    { valor: resumen.proyectos_borrador, texto: "proyectos en borrador" },
    { valor: resumen.invitaciones, texto: "invitaciones pendientes" },
  ]
  const accesos = [
    { href: "/coordinacion", icon: UsersIcon, titulo: "Roles", texto: "Asignar gestores, coordinadores y administradores." },
    { href: "/mi-aula", icon: SchoolIcon, titulo: "Aulas", texto: "Datos de contacto, proyectos e inventario de cada aula." },
    { href: "/proyectos", icon: FolderKanbanIcon, titulo: "Portafolio", texto: "Ver los proyectos publicados en la red." },
  ]

  return (
    <div className="flex flex-col gap-10">
      <dl className="grid grid-cols-2 border-t pt-6 sm:grid-cols-5">
        {cifras.map((c) => (
          <div key={c.texto} className="flex flex-col gap-0.5 pr-4 pb-3">
            <dt className="sr-only">{c.texto}</dt>
            <dd className={`m-0 ${tipo.cifra}`}>{c.valor}</dd>
            <dd className={`m-0 ${tipo.rotulo}`}>{c.texto}</dd>
          </div>
        ))}
      </dl>

      <ul className="grid gap-3 sm:grid-cols-3">
        {accesos.map(({ href, icon: Icon, titulo, texto }) => (
          <li key={href}>
            <Link href={href} className="iso-panel group flex h-full flex-col gap-1.5 p-5">
              <Icon className="size-5 text-link" aria-hidden="true" />
              <span className={`mt-2 ${tipo.h3}`}>{titulo}</span>
              <span className={tipo.textoTarjeta}>{texto}</span>
              <span className="text-link mt-auto inline-flex items-center gap-1 pt-2 text-xs font-semibold">
                Abrir <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <section aria-labelledby="sin-gestor-titulo">
        <h2 id="sin-gestor-titulo" className={tipo.h3}>
          Aulas sin gestor ({resumen.aulas_sin_gestor})
        </h2>
        <p className={`mt-1 ${tipo.textoTarjeta}`}>Asígnales un gestor en «Roles» para que puedan publicar proyectos y actualizar sus datos.</p>
        {sinGestor.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">Todas las aulas tienen gestor.</p>
        ) : (
          <ul className="mt-3 flex flex-wrap gap-2">
            {sinGestor.map((a) => (
              <li key={a.slug}>
                <Link href={`/aulas/${a.slug}`} className="inline-flex min-h-9 items-center border px-3 text-sm hover:bg-accent">
                  {a.nombre}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
