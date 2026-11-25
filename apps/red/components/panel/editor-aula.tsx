"use client"

import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Aviso, BotonPrincipal, Campo, mensajeError, useSupabase } from "@cen/auth"
import { tipo } from "@/components/ui/tipografia"
import type { AulaCorta } from "./use-roles"

type Datos = { descripcion: string; direccion: string; gestor_nombre: string; whatsapp: string; correo: string }
const VACIO: Datos = { descripcion: "", direccion: "", gestor_nombre: "", whatsapp: "", correo: "" }

/** Datos públicos del aula que puede editar su gestor o la coordinación. */
export function EditorAula({ aula }: { aula: AulaCorta }) {
  const sb = useSupabase()
  const red = useMemo(() => sb.schema("red"), [sb])
  const [datos, setDatos] = useState<Datos | null>(null)
  const [errores, setErrores] = useState<Partial<Record<keyof Datos, string>>>({})
  const [aviso, setAviso] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    let vigente = true
    red
      .from("aulas")
      .select("descripcion, direccion, gestor_nombre, whatsapp, correo")
      .eq("id", aula.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!vigente) return
        const d = (data ?? {}) as Partial<Record<keyof Datos, string | null>>
        setDatos({
          descripcion: d.descripcion ?? "",
          direccion: d.direccion ?? "",
          gestor_nombre: d.gestor_nombre ?? "",
          whatsapp: d.whatsapp ?? "",
          correo: d.correo ?? "",
        })
      })
    return () => {
      vigente = false
    }
  }, [red, aula.id])

  const actual = datos ?? VACIO
  const cambiar = (campo: keyof Datos, valor: string) => setDatos((d) => ({ ...(d ?? VACIO), [campo]: valor }))

  async function guardar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const nuevos: typeof errores = {}
    if (actual.whatsapp && !/^\+?[0-9 ]{7,20}$/.test(actual.whatsapp.trim()))
      nuevos.whatsapp = "Escribe solo números, con indicativo. Por ejemplo +57 300 000 0000."
    if (actual.correo && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(actual.correo.trim())) nuevos.correo = "Escribe un correo válido."
    if (actual.descripcion.length > 1000) nuevos.descripcion = "La descripción admite hasta 1000 caracteres."
    setErrores(nuevos)
    if (Object.keys(nuevos).length) {
      document.getElementById(`a-${Object.keys(nuevos)[0]}`)?.focus()
      return
    }
    setGuardando(true)
    const limpio = (v: string) => v.trim() || null
    const { error } = await red
      .from("aulas")
      .update({
        descripcion: limpio(actual.descripcion),
        direccion: limpio(actual.direccion),
        gestor_nombre: limpio(actual.gestor_nombre),
        whatsapp: limpio(actual.whatsapp),
        correo: limpio(actual.correo)?.toLowerCase() ?? null,
      })
      .eq("id", aula.id)
    setGuardando(false)
    setAviso(error ? { tipo: "error", texto: mensajeError(error) } : { tipo: "exito", texto: "Datos del aula guardados." })
  }

  return (
    <section aria-labelledby="datos-titulo" className="flex flex-col gap-4">
      <div>
        <h2 id="datos-titulo" className={tipo.h3}>
          Datos del aula
        </h2>
        <p className={`mt-1 ${tipo.textoTarjeta}`}>El contacto se actualiza al momento en la página pública del aula.</p>
      </div>
      {datos === null ? (
        <p className="text-sm text-muted-foreground">Cargando…</p>
      ) : (
        <form onSubmit={guardar} noValidate className="iso-panel grid gap-4 p-5 sm:grid-cols-2">
          <Campo id="a-gestor_nombre" etiqueta="Nombre del gestor" value={actual.gestor_nombre} onChange={(e) => cambiar("gestor_nombre", e.target.value)} />
          <Campo
            id="a-whatsapp"
            etiqueta="WhatsApp del aula"
            type="tel"
            inputMode="tel"
            placeholder="+57 300 000 0000"
            value={actual.whatsapp}
            onChange={(e) => cambiar("whatsapp", e.target.value)}
            error={errores.whatsapp}
          />
          <Campo
            id="a-correo"
            etiqueta="Correo del aula"
            type="email"
            spellCheck={false}
            value={actual.correo}
            onChange={(e) => cambiar("correo", e.target.value)}
            error={errores.correo}
          />
          <Campo id="a-direccion" etiqueta="Dirección" value={actual.direccion} onChange={(e) => cambiar("direccion", e.target.value)} />
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="a-descripcion" className="block text-sm font-semibold">
              Descripción
            </label>
            <textarea
              id="a-descripcion"
              rows={3}
              maxLength={1000}
              value={actual.descripcion}
              onChange={(e) => cambiar("descripcion", e.target.value)}
              aria-describedby="a-descripcion-ayuda"
              className="block w-full border border-input bg-background px-3 py-2 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            />
            <p id="a-descripcion-ayuda" className={errores.descripcion ? "text-sm text-destructive-foreground" : "text-xs text-muted-foreground"}>
              {errores.descripcion ?? "La descripción se actualiza en la página pública con la próxima publicación del sitio."}
            </p>
          </div>
          {aviso && (
            <div className="sm:col-span-2">
              <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>
            </div>
          )}
          <div className="sm:col-span-2">
            <BotonPrincipal type="submit" disabled={guardando} className="w-auto">
              {guardando ? "Guardando…" : "Guardar datos"}
            </BotonPrincipal>
          </div>
        </form>
      )}
    </section>
  )
}
