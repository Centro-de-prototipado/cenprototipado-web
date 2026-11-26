"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { DownloadIcon, ExternalLinkIcon } from "lucide-react"
import { MiCuenta, useSupabase } from "@cen/auth"
import { BotonLinkedIn } from "@/components/aprende/boton-linkedin"
import {
  fechaLarga,
  horasTexto,
  urlCertificadoPdf,
  type Credencial,
} from "@/lib/aprende/credenciales"

/** «Mi cuenta» del Centro: datos comunes + los certificados de la persona. */
export function CuentaCentro() {
  return <MiCuenta>{(userId) => <MisCertificados userId={userId} />}</MiCuenta>
}

function MisCertificados({ userId }: { userId: string }) {
  const sb = useSupabase()
  const aprende = useMemo(() => sb.schema("aprende"), [sb])
  const [lista, setLista] = useState<{
    para: string
    filas: Credencial[]
  } | null>(null)

  useEffect(() => {
    let vigente = true
    aprende
      .from("credenciales")
      .select(
        "codigo, nombre, tipo, titulo, horas, fecha, emitida_at, revocada"
      )
      .eq("user_id", userId)
      .eq("revocada", false)
      .order("fecha", { ascending: false })
      .then(({ data }) => {
        if (vigente)
          setLista({ para: userId, filas: (data as Credencial[]) ?? [] })
      })
    return () => {
      vigente = false
    }
  }, [aprende, userId])

  const filas = lista?.para === userId ? lista.filas : null

  return (
    <section
      id="certificados"
      aria-labelledby="certificados-titulo"
      className="scroll-mt-24"
    >
      <h2 id="certificados-titulo" className="font-semibold">
        Mis certificados
      </h2>
      {filas === null ? (
        <p className="mt-2 text-sm text-muted-foreground">Cargando…</p>
      ) : filas.length === 0 ? (
        <p className="mt-2 border p-3 text-sm text-muted-foreground">
          Aún no tienes certificados. Aparecen aquí cuando el Centro registra tu
          asistencia a una charla o apruebas un curso.
        </p>
      ) : (
        <ul className="mt-2 space-y-2">
          {filas.map((c) => (
            <li key={c.codigo} className="border p-3">
              <p className="m-0 text-sm font-semibold">{c.titulo}</p>
              <p className="m-0 text-xs text-muted-foreground">
                {c.tipo === "charla" ? "Charla" : "Curso"} ·{" "}
                {fechaLarga(c.fecha)} · {horasTexto(c.horas)} · {c.codigo}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <a
                  href={urlCertificadoPdf(c.codigo)}
                  className="inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-semibold hover:bg-muted"
                >
                  <DownloadIcon className="size-4" aria-hidden="true" /> PDF
                </a>
                <Link
                  href={`/verificar/${c.codigo}`}
                  className="inline-flex min-h-9 items-center gap-1.5 border px-3 text-xs font-semibold hover:bg-muted"
                >
                  <ExternalLinkIcon className="size-4" aria-hidden="true" />{" "}
                  Insignia
                </Link>
                <BotonLinkedIn
                  credencial={c}
                  className="inline-flex min-h-9 items-center gap-1.5 bg-[#0a66c2] px-3 text-xs font-semibold text-white hover:bg-[#004182]"
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
