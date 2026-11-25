"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import { UserMinusIcon, UserPlusIcon, XIcon } from "lucide-react"
import { Aviso, BotonPrincipal, Campo, mensajeError, useSupabase } from "@cen/auth"
import { tipo } from "@/components/ui/tipografia"
import { Cargando, SinAcceso } from "./marco-panel"
import { ETIQUETA_ROL, useRoles, type RolRed } from "./use-roles"

type Miembro = { id: number; user_id: string; nombre: string | null; email: string; rol: RolRed; aula_nombre: string | null }
type Invitacion = { id: number; email: string; rol: RolRed; aula: { nombre: string } | null }
type Aula = { id: string; nombre: string; tipo: string }

const select =
  "block min-h-11 w-full border border-input bg-background px-3 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50"

/** Coordinación de la red: asignar y quitar roles (gestor, coordinador, admin). */
export function PanelCoordinacion() {
  const estado = useRoles()
  if (estado.cargando) return <Cargando />
  if (estado.userId === null) return <SinAcceso motivo="sesion" volverA="/coordinacion" />
  if (!estado.esCoordinador) return <SinAcceso motivo="permiso" volverA="/coordinacion" />
  return <Gestion userId={estado.userId} esAdmin={estado.esAdmin} />
}

function Gestion({ userId, esAdmin }: { userId: string; esAdmin: boolean }) {
  const sb = useSupabase()
  const red = useMemo(() => sb.schema("red"), [sb])
  const [miembros, setMiembros] = useState<Miembro[] | null>(null)
  const [invitaciones, setInvitaciones] = useState<Invitacion[]>([])
  const [aulas, setAulas] = useState<Aula[]>([])
  const [correo, setCorreo] = useState("")
  const [rol, setRol] = useState<RolRed>("gestor")
  const [aulaId, setAulaId] = useState("")
  const [errores, setErrores] = useState<{ correo?: string; aula?: string }>({})
  const [aviso, setAviso] = useState<{ tipo: "exito" | "error"; texto: string } | null>(null)
  const [enviando, setEnviando] = useState(false)

  const cargar = useCallback(async () => {
    const [m, i] = await Promise.all([
      red.rpc("listar_miembros"),
      red.from("invitaciones").select("id, email, rol, aula:aulas(nombre)").order("created_at", { ascending: false }),
    ])
    setMiembros((m.data as Miembro[]) ?? [])
    setInvitaciones((i.data as unknown as Invitacion[]) ?? [])
  }, [red])

  useEffect(() => {
    let vigente = true
    Promise.all([
      red.rpc("listar_miembros"),
      red.from("invitaciones").select("id, email, rol, aula:aulas(nombre)").order("created_at", { ascending: false }),
      red.from("aulas").select("id, nombre, tipo").order("nombre"),
    ]).then(([m, i, a]) => {
      if (!vigente) return
      setMiembros((m.data as Miembro[]) ?? [])
      setInvitaciones((i.data as unknown as Invitacion[]) ?? [])
      setAulas((a.data as Aula[]) ?? [])
    })
    return () => {
      vigente = false
    }
  }, [red])

  async function asignar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = correo.trim().toLowerCase()
    const nuevos: typeof errores = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nuevos.correo = "Escribe un correo válido, por ejemplo nombre@dominio.com."
    if (rol === "gestor" && !aulaId) nuevos.aula = "Elige el aula que va a gestionar."
    setErrores(nuevos)
    if (Object.keys(nuevos).length) return
    setEnviando(true)
    setAviso(null)
    const { data, error } = await red.rpc("invitar", { p_email: email, p_rol: rol, p_aula: rol === "gestor" ? aulaId : null })
    setEnviando(false)
    if (error) return setAviso({ tipo: "error", texto: mensajeError(error) })
    setAviso({
      tipo: "exito",
      texto:
        data === "asignado"
          ? `Listo: ${email} ya tiene el rol de ${ETIQUETA_ROL[rol].toLowerCase()}.`
          : `${email} aún no tiene cuenta. El rol se le asignará cuando se registre y confirme su correo.`,
    })
    setCorreo("")
    cargar()
  }

  async function quitar(m: Miembro) {
    const quien = m.nombre || m.email
    if (!window.confirm(`¿Quitar el rol de ${ETIQUETA_ROL[m.rol].toLowerCase()} a ${quien}?`)) return
    const { error } = await red.from("miembros").delete().eq("id", m.id)
    setAviso(error ? { tipo: "error", texto: mensajeError(error) } : { tipo: "exito", texto: `Se quitó el rol a ${quien}.` })
    cargar()
  }

  async function cancelar(inv: Invitacion) {
    const { error } = await red.from("invitaciones").delete().eq("id", inv.id)
    setAviso(error ? { tipo: "error", texto: mensajeError(error) } : { tipo: "exito", texto: `Se canceló la invitación a ${inv.email}.` })
    cargar()
  }

  const puedeQuitar = (m: Miembro) => m.user_id !== userId && (m.rol === "gestor" || esAdmin)

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr]">
      {/* Asignar rol */}
      <section aria-labelledby="asignar-titulo" className="iso-panel h-fit p-5">
        <h2 id="asignar-titulo" className={tipo.h3}>
          Asignar un rol
        </h2>
        <p className={`mt-1.5 ${tipo.textoTarjeta}`}>
          Escribe el correo de la persona. Si aún no tiene cuenta, el rol se aplica cuando se registre.
        </p>
        <form onSubmit={asignar} noValidate className="mt-4 flex flex-col gap-4">
          <Campo
            id="correo"
            etiqueta="Correo"
            type="email"
            autoComplete="off"
            spellCheck={false}
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            error={errores.correo}
          />
          <div className="space-y-1.5">
            <label htmlFor="rol" className="block text-sm font-semibold">
              Rol
            </label>
            <select id="rol" className={select} value={rol} onChange={(e) => setRol(e.target.value as RolRed)}>
              <option value="gestor">Gestor de aula</option>
              {esAdmin && <option value="coordinador">Coordinación de la red</option>}
              {esAdmin && <option value="admin">Administración</option>}
            </select>
            {!esAdmin && <p className="text-xs text-muted-foreground">Solo la administración asigna coordinadores.</p>}
          </div>
          {rol === "gestor" && (
            <div className="space-y-1.5">
              <label htmlFor="aula" className="block text-sm font-semibold">
                Aula
              </label>
              <select
                id="aula"
                className={select}
                value={aulaId}
                onChange={(e) => setAulaId(e.target.value)}
                aria-invalid={errores.aula ? true : undefined}
                aria-describedby={errores.aula ? "aula-error" : undefined}
              >
                <option value="">Elige un aula…</option>
                {aulas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
              {errores.aula && (
                <p id="aula-error" className="text-sm text-destructive-foreground">
                  {errores.aula}
                </p>
              )}
            </div>
          )}
          {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
          <BotonPrincipal type="submit" disabled={enviando}>
            <UserPlusIcon className="size-4" aria-hidden="true" />
            {enviando ? "Asignando…" : "Asignar rol"}
          </BotonPrincipal>
        </form>
      </section>

      <div className="flex min-w-0 flex-col gap-10">
        {/* Personas con rol */}
        <section aria-labelledby="miembros-titulo">
          <h2 id="miembros-titulo" className={tipo.h3}>
            Personas con rol
          </h2>
          {miembros === null ? (
            <Cargando />
          ) : miembros.length === 0 ? (
            <p className="mt-3 border border-dashed p-5 text-sm text-muted-foreground">Todavía no hay roles asignados.</p>
          ) : (
            <div className="mt-3 overflow-x-auto border">
              <table className="w-full text-left text-sm">
                <thead className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-2.5 font-semibold">
                      Persona
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-semibold">
                      Rol
                    </th>
                    <th scope="col" className="px-4 py-2.5 font-semibold">
                      Aula
                    </th>
                    <th scope="col" className="px-4 py-2.5">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {miembros.map((m) => (
                    <tr key={m.id} className="border-t align-middle">
                      <td className="px-4 py-3">
                        <span className="block font-semibold">{m.nombre || "Sin nombre"}</span>
                        <span className="block text-xs text-muted-foreground">{m.email}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">{ETIQUETA_ROL[m.rol]}</td>
                      <td className="px-4 py-3">{m.aula_nombre ?? "Toda la red"}</td>
                      <td className="px-4 py-3 text-right">
                        {puedeQuitar(m) && (
                          <button
                            type="button"
                            onClick={() => quitar(m)}
                            className="inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-semibold hover:bg-red-500/10 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                          >
                            <UserMinusIcon className="size-4" aria-hidden="true" />
                            Quitar<span className="sr-only"> el rol a {m.nombre || m.email}</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Invitaciones pendientes */}
        <section aria-labelledby="invitaciones-titulo">
          <h2 id="invitaciones-titulo" className={tipo.h3}>
            Invitaciones pendientes
          </h2>
          <p className={`mt-1 ${tipo.textoTarjeta}`}>Personas que aún no se han registrado o no han confirmado su correo.</p>
          {invitaciones.length === 0 ? (
            <p className="mt-3 border border-dashed p-5 text-sm text-muted-foreground">No hay invitaciones pendientes.</p>
          ) : (
            <ul className="mt-3 divide-y border">
              {invitaciones.map((inv) => (
                <li key={inv.id} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
                  <span className="font-semibold">{inv.email}</span>
                  <span className="text-muted-foreground">
                    {ETIQUETA_ROL[inv.rol]}
                    {inv.aula ? ` · ${inv.aula.nombre}` : ""}
                  </span>
                  {(inv.rol === "gestor" || esAdmin) && (
                    <button
                      type="button"
                      onClick={() => cancelar(inv)}
                      className="ml-auto inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-semibold hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    >
                      <XIcon className="size-4" aria-hidden="true" />
                      Cancelar<span className="sr-only"> la invitación a {inv.email}</span>
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
