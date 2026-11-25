"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { EyeIcon, EyeOffIcon, PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Aviso, BotonPrincipal, BotonSecundario, Campo, mensajeError, useSupabase } from "@cen/auth"
import { AREAS, COLUMNAS_PROYECTO, urlProyecto, type Area, type Proyecto } from "@/lib/proyectos"
import { tipo } from "@/components/ui/tipografia"
import type { AulaCorta } from "@/components/panel/use-roles"

type Borrador = {
  titulo: string
  resumen: string
  descripcion: string
  area: Area
  anio: string
  participantes: string
  enlace: string
  publicado: boolean
}

const VACIO: Borrador = { titulo: "", resumen: "", descripcion: "", area: "robotica", anio: String(new Date().getFullYear()), participantes: "", enlace: "", publicado: true }

const control =
  "block w-full border border-input bg-background px-3 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

function desdeProyecto(p: Proyecto): Borrador {
  return {
    titulo: p.titulo,
    resumen: p.resumen,
    descripcion: p.descripcion ?? "",
    area: p.area,
    anio: p.anio ? String(p.anio) : "",
    participantes: p.participantes ?? "",
    enlace: p.enlace ?? "",
    publicado: p.publicado,
  }
}

function validar(b: Borrador) {
  const e: Partial<Record<keyof Borrador, string>> = {}
  if (b.titulo.trim().length < 3) e.titulo = "Escribe un título de al menos 3 letras."
  if (b.resumen.trim().length < 10) e.resumen = "Escribe un resumen de al menos 10 caracteres."
  if (b.resumen.length > 280) e.resumen = "El resumen admite hasta 280 caracteres."
  if (b.anio && !/^(20[1-9]\d|2100)$/.test(b.anio)) e.anio = "Escribe un año de 4 cifras, por ejemplo 2026."
  if (b.enlace && !/^https?:\/\/\S+$/.test(b.enlace.trim())) e.enlace = "El enlace debe empezar por https://"
  return e
}

/** Proyectos de un aula: lista con borradores y formulario para crear o editar. */
export function GestionProyectos({ aula }: { aula: AulaCorta }) {
  const sb = useSupabase()
  const red = useMemo(() => sb.schema("red"), [sb])
  const [proyectos, setProyectos] = useState<Proyecto[] | null>(null)
  const [editando, setEditando] = useState<"nuevo" | string | null>(null)
  const [borrador, setBorrador] = useState<Borrador>(VACIO)
  const [errores, setErrores] = useState<Partial<Record<keyof Borrador, string>>>({})
  const [aviso, setAviso] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null)
  const [guardando, setGuardando] = useState(false)

  const leer = useCallback(
    () => red.from("proyectos").select(COLUMNAS_PROYECTO).eq("aula_id", aula.id).order("created_at", { ascending: false }),
    [red, aula.id]
  )
  const recargar = useCallback(async () => {
    const { data } = await leer()
    setProyectos((data as unknown as Proyecto[]) ?? [])
  }, [leer])

  useEffect(() => {
    let vigente = true
    leer().then(({ data }) => {
      if (vigente) setProyectos((data as unknown as Proyecto[]) ?? [])
    })
    return () => {
      vigente = false
    }
  }, [leer])

  const cambiar = <K extends keyof Borrador>(campo: K, valor: Borrador[K]) => setBorrador((b) => ({ ...b, [campo]: valor }))

  function abrir(p?: Proyecto) {
    setEditando(p ? p.id : "nuevo")
    setBorrador(p ? desdeProyecto(p) : VACIO)
    setErrores({})
    setAviso(null)
  }

  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nuevos = validar(borrador)
    setErrores(nuevos)
    if (Object.keys(nuevos).length) {
      document.getElementById(`p-${Object.keys(nuevos)[0]}`)?.focus()
      return
    }
    const fila = {
      aula_id: aula.id,
      titulo: borrador.titulo.trim(),
      resumen: borrador.resumen.trim(),
      descripcion: borrador.descripcion.trim() || null,
      area: borrador.area,
      anio: borrador.anio ? Number(borrador.anio) : null,
      participantes: borrador.participantes.trim() || null,
      enlace: borrador.enlace.trim() || null,
      publicado: borrador.publicado,
    }
    setGuardando(true)
    const { error } =
      editando === "nuevo" ? await red.from("proyectos").insert(fila) : await red.from("proyectos").update(fila).eq("id", editando!)
    setGuardando(false)
    if (error) return setAviso({ tipo: "error", texto: mensajeError(error) })
    setAviso({ tipo: "exito", texto: borrador.publicado ? "Proyecto guardado y publicado." : "Proyecto guardado como borrador." })
    setEditando(null)
    recargar()
  }

  async function alternarPublicado(p: Proyecto) {
    const { error } = await red.from("proyectos").update({ publicado: !p.publicado }).eq("id", p.id)
    setAviso(
      error
        ? { tipo: "error", texto: mensajeError(error) }
        : { tipo: "exito", texto: p.publicado ? `«${p.titulo}» quedó oculto.` : `«${p.titulo}» quedó publicado.` }
    )
    recargar()
  }

  async function borrar(p: Proyecto) {
    if (!window.confirm(`¿Borrar el proyecto «${p.titulo}»? No se puede deshacer.`)) return
    const { error } = await red.from("proyectos").delete().eq("id", p.id)
    setAviso(error ? { tipo: "error", texto: mensajeError(error) } : { tipo: "exito", texto: `Se borró «${p.titulo}».` })
    recargar()
  }

  return (
    <section aria-labelledby="proyectos-titulo" className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="proyectos-titulo" className={tipo.h3}>
            Proyectos del aula
          </h2>
          <p className={`mt-1 ${tipo.textoTarjeta}`}>Los publicados se ven en la página del aula y en la galería de la red.</p>
        </div>
        {editando === null && (
          <BotonPrincipal type="button" onClick={() => abrir()} className="w-auto">
            <PlusIcon className="size-4" aria-hidden="true" /> Nuevo proyecto
          </BotonPrincipal>
        )}
      </div>

      {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}

      {editando !== null && (
        <form onSubmit={guardar} noValidate className="iso-panel flex flex-col gap-4 p-5" aria-label={editando === "nuevo" ? "Nuevo proyecto" : "Editar proyecto"}>
          <p className="m-0 font-bold">{editando === "nuevo" ? "Nuevo proyecto" : "Editar proyecto"}</p>
          <Campo id="p-titulo" etiqueta="Título" value={borrador.titulo} onChange={(e) => cambiar("titulo", e.target.value)} error={errores.titulo} maxLength={120} />
          <div className="space-y-1.5">
            <label htmlFor="p-resumen" className="block text-sm font-semibold">
              Resumen
            </label>
            <textarea
              id="p-resumen"
              rows={2}
              maxLength={280}
              value={borrador.resumen}
              onChange={(e) => cambiar("resumen", e.target.value)}
              aria-invalid={errores.resumen ? true : undefined}
              aria-describedby="p-resumen-ayuda"
              className={`${control} min-h-20 py-2`}
            />
            <p id="p-resumen-ayuda" className={errores.resumen ? "text-sm text-destructive-foreground" : "text-xs text-muted-foreground"}>
              {errores.resumen ?? `Una o dos frases. ${borrador.resumen.length}/280`}
            </p>
          </div>
          <div className="space-y-1.5">
            <label htmlFor="p-descripcion" className="block text-sm font-semibold">
              Descripción <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <textarea
              id="p-descripcion"
              rows={6}
              maxLength={5000}
              value={borrador.descripcion}
              onChange={(e) => cambiar("descripcion", e.target.value)}
              className={`${control} py-2`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="p-area" className="block text-sm font-semibold">
                Área
              </label>
              <select id="p-area" value={borrador.area} onChange={(e) => cambiar("area", e.target.value as Area)} className={`${control} min-h-11`}>
                {Object.entries(AREAS).map(([valor, texto]) => (
                  <option key={valor} value={valor}>
                    {texto}
                  </option>
                ))}
              </select>
            </div>
            <Campo id="p-anio" etiqueta="Año" inputMode="numeric" value={borrador.anio} onChange={(e) => cambiar("anio", e.target.value)} error={errores.anio} />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="p-participantes" className="block text-sm font-semibold">
              Participantes <span className="font-normal text-muted-foreground">(opcional)</span>
            </label>
            <textarea
              id="p-participantes"
              rows={2}
              maxLength={500}
              value={borrador.participantes}
              onChange={(e) => cambiar("participantes", e.target.value)}
              className={`${control} py-2`}
              aria-describedby="p-participantes-ayuda"
            />
            <p id="p-participantes-ayuda" className="text-xs text-muted-foreground">
              Por ejemplo: «Estudiantes de grado 10 con la docente Ana Pérez». Evita datos personales de menores.
            </p>
          </div>
          <Campo
            id="p-enlace"
            etiqueta="Enlace (opcional)"
            type="url"
            inputMode="url"
            placeholder="https://…"
            ayuda="Video, documento o carpeta con fotos del proyecto."
            value={borrador.enlace}
            onChange={(e) => cambiar("enlace", e.target.value)}
            error={errores.enlace}
          />
          <p className="m-0 border border-dashed p-3 text-xs text-muted-foreground">
            Subir fotos estará disponible cuando se active el almacenamiento de archivos. Mientras tanto, usa el enlace.
          </p>
          <label className="flex min-h-11 items-center gap-3 text-sm font-semibold">
            <input type="checkbox" checked={borrador.publicado} onChange={(e) => cambiar("publicado", e.target.checked)} className="size-5 accent-[var(--primary)]" />
            Publicar (si lo desmarcas queda como borrador)
          </label>
          <div className="flex flex-wrap gap-2">
            <BotonPrincipal type="submit" disabled={guardando} className="w-auto">
              {guardando ? "Guardando…" : "Guardar"}
            </BotonPrincipal>
            <BotonSecundario type="button" onClick={() => setEditando(null)} className="w-auto">
              Cancelar
            </BotonSecundario>
          </div>
        </form>
      )}

      {proyectos === null ? (
        <p className="text-sm text-muted-foreground">Cargando proyectos…</p>
      ) : proyectos.length === 0 ? (
        editando === null && <p className="border border-dashed p-5 text-sm text-muted-foreground">Esta aula todavía no tiene proyectos.</p>
      ) : (
        <ul className="divide-y border">
          {proyectos.map((p) => (
            <li key={p.id} className="flex flex-wrap items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <Link href={urlProyecto(p.id)} className="font-semibold hover:underline">
                  {p.titulo}
                </Link>
                <p className="m-0 text-xs text-muted-foreground">
                  {AREAS[p.area]}
                  {p.anio ? ` · ${p.anio}` : ""} ·{" "}
                  <span className={p.publicado ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}>
                    {p.publicado ? "Publicado" : "Borrador"}
                  </span>
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => abrir(p)} className="inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-semibold hover:bg-accent">
                  <PencilIcon className="size-4" aria-hidden="true" /> Editar<span className="sr-only"> «{p.titulo}»</span>
                </button>
                <button type="button" onClick={() => alternarPublicado(p)} className="inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-semibold hover:bg-accent">
                  {p.publicado ? <EyeOffIcon className="size-4" aria-hidden="true" /> : <EyeIcon className="size-4" aria-hidden="true" />}
                  {p.publicado ? "Ocultar" : "Publicar"}
                  <span className="sr-only"> «{p.titulo}»</span>
                </button>
                <button type="button" onClick={() => borrar(p)} className="inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-semibold hover:bg-red-500/10">
                  <Trash2Icon className="size-4" aria-hidden="true" /> Borrar<span className="sr-only"> «{p.titulo}»</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
