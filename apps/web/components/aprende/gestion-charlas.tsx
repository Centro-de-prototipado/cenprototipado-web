"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react"
import Link from "next/link"
import {
  CalendarPlusIcon,
  CheckIcon,
  LockIcon,
  SearchIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react"
import { Aviso, CuentaProvider, mensajeError, useSupabase } from "@cen/auth"
import { configCuenta } from "@/lib/cuenta-config"
import { useCoordinacion } from "@/lib/aprende/use-coordinacion"
import { fechaLarga, horasTexto } from "@/lib/aprende/credenciales"
import { Button } from "@/components/ui/button"

type Charla = {
  id: string
  titulo: string
  descripcion: string | null
  fecha: string
  horas: number
  lugar: string | null
  credenciales: { count: number }[]
}
type Persona = { user_id: string; nombre: string | null; email: string }

const control =
  "block min-h-11 w-full border border-input bg-background px-3 text-base outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
const etiqueta = "block text-sm font-semibold"

/** Panel del Centro para las charlas presenciales: crear la charla y marcar asistentes. */
export function GestionCharlas() {
  return (
    <CuentaProvider config={configCuenta}>
      <Acceso />
    </CuentaProvider>
  )
}

function Acceso() {
  const estado = useCoordinacion()
  if (estado === undefined)
    return <p className="text-sm text-muted-foreground">Cargando…</p>
  if (estado === null || !estado.esCoordinador)
    return (
      <div className="flex max-w-xl flex-col gap-3 border p-6">
        <LockIcon className="size-6 text-primary" aria-hidden="true" />
        <p className="m-0 font-bold">
          {estado === null
            ? "Esta página es privada."
            : "No tienes permiso para ver esta página."}
        </p>
        <p className="m-0 text-sm text-muted-foreground">
          {estado === null
            ? "Inicia sesión con una cuenta de coordinación del Centro."
            : "La gestión de Aprende es solo para la coordinación del Centro."}
        </p>
        {estado === null && (
          <Link href="/login?next=%2Faprende%2Fgestion" className="w-fit">
            <Button>Iniciar sesión</Button>
          </Link>
        )}
      </div>
    )
  return <Panel />
}

function Panel() {
  const sb = useSupabase()
  const aprende = useMemo(() => sb.schema("aprende"), [sb])
  const [charlas, setCharlas] = useState<Charla[] | null>(null)
  const [elegida, setElegida] = useState<string | null>(null)
  const [aviso, setAviso] = useState<{
    tipo: "exito" | "error"
    texto: string
  } | null>(null)

  const leer = useCallback(
    () =>
      aprende
        .from("charlas")
        .select(
          "id, titulo, descripcion, fecha, horas, lugar, credenciales(count)"
        )
        .order("fecha", { ascending: false }),
    [aprende]
  )
  const recargar = useCallback(async () => {
    const { data } = await leer()
    setCharlas((data as Charla[]) ?? [])
  }, [leer])

  useEffect(() => {
    let vigente = true
    leer().then(({ data }) => {
      if (vigente) setCharlas((data as Charla[]) ?? [])
    })
    return () => {
      vigente = false
    }
  }, [leer])

  async function borrar(c: Charla) {
    const n = c.credenciales[0]?.count ?? 0
    if (
      !window.confirm(
        `¿Borrar la charla «${c.titulo}»?${n ? ` También se anulan sus ${n} certificados.` : ""} No se puede deshacer.`
      )
    )
      return
    const { error } = await aprende.from("charlas").delete().eq("id", c.id)
    setAviso(
      error
        ? { tipo: "error", texto: mensajeError(error) }
        : { tipo: "exito", texto: `Se borró «${c.titulo}».` }
    )
    if (elegida === c.id) setElegida(null)
    recargar()
  }

  const charla = charlas?.find((c) => c.id === elegida) ?? null

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_1fr]">
      <NuevaCharla
        onCreada={(id, titulo) => {
          setAviso({
            tipo: "exito",
            texto: `Charla «${titulo}» creada. Ahora marca los asistentes.`,
          })
          setElegida(id)
          recargar()
        }}
      />

      <div className="flex min-w-0 flex-col gap-6">
        {aviso && <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>}
        <section aria-labelledby="charlas-titulo">
          <h2 id="charlas-titulo" className="text-base font-bold">
            Charlas registradas
          </h2>
          {charlas === null ? (
            <p className="mt-3 text-sm text-muted-foreground">Cargando…</p>
          ) : charlas.length === 0 ? (
            <p className="mt-3 border border-dashed p-5 text-sm text-muted-foreground">
              Todavía no hay charlas. Crea la primera con el formulario.
            </p>
          ) : (
            <ul className="mt-3 divide-y border">
              {charlas.map((c) => (
                <li
                  key={c.id}
                  className={`flex flex-wrap items-center gap-3 px-4 py-3 ${c.id === elegida ? "bg-muted/60" : ""}`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="m-0 font-semibold">{c.titulo}</p>
                    <p className="m-0 text-xs text-muted-foreground">
                      {fechaLarga(c.fecha)} · {horasTexto(c.horas)}
                      {c.lugar ? ` · ${c.lugar}` : ""} ·{" "}
                      {c.credenciales[0]?.count ?? 0} asistentes
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={c.id === elegida ? "default" : "outline"}
                    size="sm"
                    onClick={() => setElegida(c.id)}
                  >
                    <UsersIcon data-icon="inline-start" /> Asistentes
                    <span className="sr-only"> de «{c.titulo}»</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => borrar(c)}
                  >
                    <Trash2Icon data-icon="inline-start" /> Borrar
                    <span className="sr-only"> «{c.titulo}»</span>
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {charla && (
          <Asistentes key={charla.id} charla={charla} onGuardado={recargar} />
        )}
      </div>
    </div>
  )
}

function NuevaCharla({
  onCreada,
}: {
  onCreada: (id: string, titulo: string) => void
}) {
  const sb = useSupabase()
  const [datos, setDatos] = useState({
    titulo: "",
    fecha: "",
    horas: "2",
    lugar: "Parque de Innovación, Bloque X",
    descripcion: "",
  })
  const [errores, setErrores] = useState<
    Partial<Record<keyof typeof datos, string>>
  >({})
  const [error, setError] = useState<string | null>(null)
  const [guardando, setGuardando] = useState(false)
  const cambiar = (k: keyof typeof datos, v: string) =>
    setDatos((d) => ({ ...d, [k]: v }))

  async function crear(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const n: typeof errores = {}
    if (datos.titulo.trim().length < 3)
      n.titulo = "Escribe el nombre de la charla."
    if (!/^\d{4}-\d{2}-\d{2}$/.test(datos.fecha))
      n.fecha = "Elige la fecha en que se hizo."
    const h = Number(datos.horas.replace(",", "."))
    if (!(h > 0 && h <= 200))
      n.horas = "Escribe las horas, por ejemplo 2 o 1,5."
    setErrores(n)
    if (Object.keys(n).length) {
      document.getElementById(`ch-${Object.keys(n)[0]}`)?.focus()
      return
    }
    setGuardando(true)
    setError(null)
    const { data, error } = await sb
      .schema("aprende")
      .from("charlas")
      .insert({
        titulo: datos.titulo.trim(),
        fecha: datos.fecha,
        horas: h,
        lugar: datos.lugar.trim() || null,
        descripcion: datos.descripcion.trim() || null,
      })
      .select("id")
      .single()
    setGuardando(false)
    if (error) return setError(mensajeError(error))
    onCreada(data.id, datos.titulo.trim())
    setDatos((d) => ({ ...d, titulo: "", descripcion: "" }))
  }

  const campo = (k: keyof typeof datos) => ({
    id: `ch-${k}`,
    value: datos[k],
    "aria-invalid": errores[k] ? true : undefined,
    "aria-describedby": errores[k] ? `ch-${k}-error` : undefined,
  })
  const msg = (k: keyof typeof datos) =>
    errores[k] && (
      <p id={`ch-${k}-error`} className="text-sm text-destructive">
        {errores[k]}
      </p>
    )

  return (
    <section aria-labelledby="nueva-titulo" className="h-fit border p-5">
      <h2 id="nueva-titulo" className="text-base font-bold">
        Nueva charla
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Regístrala el día de la charla o después; luego marca quiénes
        asistieron.
      </p>
      <form onSubmit={crear} noValidate className="mt-4 flex flex-col gap-4">
        <div className="space-y-1.5">
          <label htmlFor="ch-titulo" className={etiqueta}>
            Nombre de la charla
          </label>
          <input
            {...campo("titulo")}
            maxLength={160}
            onChange={(e) => cambiar("titulo", e.target.value)}
            className={control}
          />
          {msg("titulo")}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="ch-fecha" className={etiqueta}>
              Fecha
            </label>
            <input
              {...campo("fecha")}
              type="date"
              onChange={(e) => cambiar("fecha", e.target.value)}
              className={control}
            />
            {msg("fecha")}
          </div>
          <div className="space-y-1.5">
            <label htmlFor="ch-horas" className={etiqueta}>
              Horas
            </label>
            <input
              {...campo("horas")}
              inputMode="decimal"
              onChange={(e) => cambiar("horas", e.target.value)}
              className={control}
            />
            {msg("horas")}
          </div>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="ch-lugar" className={etiqueta}>
            Lugar
          </label>
          <input
            {...campo("lugar")}
            maxLength={200}
            onChange={(e) => cambiar("lugar", e.target.value)}
            className={control}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="ch-descripcion" className={etiqueta}>
            Descripción{" "}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </label>
          <textarea
            id="ch-descripcion"
            rows={3}
            maxLength={2000}
            value={datos.descripcion}
            onChange={(e) => cambiar("descripcion", e.target.value)}
            className={`${control} py-2`}
          />
        </div>
        {error && <Aviso tipo="error">{error}</Aviso>}
        <Button type="submit" size="lg" disabled={guardando}>
          <CalendarPlusIcon data-icon="inline-start" />{" "}
          {guardando ? "Creando…" : "Crear charla"}
        </Button>
      </form>
    </section>
  )
}

function Asistentes({
  charla,
  onGuardado,
}: {
  charla: Charla
  onGuardado: () => void
}) {
  const sb = useSupabase()
  const aprende = useMemo(() => sb.schema("aprende"), [sb])
  const [personas, setPersonas] = useState<Persona[] | null>(null)
  const [marcados, setMarcados] = useState<Set<string>>(new Set())
  const [buscar, setBuscar] = useState("")
  const [aviso, setAviso] = useState<{
    tipo: "exito" | "error"
    texto: string
  } | null>(null)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    let vigente = true
    Promise.all([
      aprende.rpc("listar_personas"),
      aprende.from("credenciales").select("user_id").eq("charla_id", charla.id),
    ]).then(([p, c]) => {
      if (!vigente) return
      setPersonas((p.data as Persona[]) ?? [])
      setMarcados(
        new Set(((c.data as { user_id: string }[]) ?? []).map((x) => x.user_id))
      )
    })
    return () => {
      vigente = false
    }
  }, [aprende, charla.id])

  const filtro = buscar.trim().toLowerCase()
  const visibles = (personas ?? []).filter(
    (p) =>
      !filtro || `${p.nombre ?? ""} ${p.email}`.toLowerCase().includes(filtro)
  )

  function alternar(id: string) {
    setMarcados((m) => {
      const n = new Set(m)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  async function guardar() {
    setGuardando(true)
    const { data, error } = await aprende.rpc("guardar_asistentes", {
      p_charla: charla.id,
      p_usuarios: [...marcados],
    })
    setGuardando(false)
    if (error) return setAviso({ tipo: "error", texto: mensajeError(error) })
    setAviso({
      tipo: "exito",
      texto: `Listo: ${data} asistentes con certificado. Cada uno lo ve en «Mis certificados».`,
    })
    onGuardado()
  }

  return (
    <section aria-labelledby="asistentes-titulo" className="border p-5">
      <h2 id="asistentes-titulo" className="text-base font-bold">
        Asistentes · {charla.titulo}
      </h2>
      <p className="mt-1 text-xs text-muted-foreground">
        Marca a quienes asistieron. Al guardar, cada persona marcada recibe su
        certificado e insignia; si desmarcas a alguien, su certificado se
        retira.
      </p>
      <div className="mt-4 flex items-center gap-2 border px-3">
        <SearchIcon
          className="size-4 text-muted-foreground"
          aria-hidden="true"
        />
        <label htmlFor="buscar-persona" className="sr-only">
          Buscar por nombre o correo
        </label>
        <input
          id="buscar-persona"
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar por nombre o correo"
          className="min-h-11 flex-1 bg-transparent text-base outline-none"
        />
      </div>
      {personas === null ? (
        <p className="mt-3 text-sm text-muted-foreground">Cargando personas…</p>
      ) : personas.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">
          Aún no hay personas registradas en la plataforma.
        </p>
      ) : (
        <fieldset className="mt-3 max-h-96 overflow-y-auto border">
          <legend className="sr-only">Personas registradas</legend>
          {visibles.map((p) => (
            <label
              key={p.user_id}
              className="flex min-h-12 cursor-pointer items-center gap-3 border-b px-4 py-2 last:border-b-0 hover:bg-muted/50"
            >
              <input
                type="checkbox"
                checked={marcados.has(p.user_id)}
                onChange={() => alternar(p.user_id)}
                className="size-5 accent-[var(--primary)]"
              />
              <span className="min-w-0">
                <span className="block text-sm font-semibold">
                  {p.nombre || "Sin nombre"}
                </span>
                <span className="block truncate text-xs text-muted-foreground">
                  {p.email}
                </span>
              </span>
            </label>
          ))}
          {visibles.length === 0 && (
            <p className="px-4 py-3 text-sm text-muted-foreground">
              Nadie coincide con «{buscar}».
            </p>
          )}
        </fieldset>
      )}
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          size="lg"
          onClick={guardar}
          disabled={guardando || personas === null}
        >
          <CheckIcon data-icon="inline-start" />{" "}
          {guardando ? "Guardando…" : `Guardar asistentes (${marcados.size})`}
        </Button>
      </div>
      {aviso && (
        <div className="mt-3">
          <Aviso tipo={aviso.tipo}>{aviso.texto}</Aviso>
        </div>
      )}
    </section>
  )
}
