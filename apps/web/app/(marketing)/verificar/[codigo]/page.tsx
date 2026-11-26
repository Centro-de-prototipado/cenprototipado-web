import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import {
  BadgeCheckIcon,
  CircleAlertIcon,
  DownloadIcon,
  SearchIcon,
} from "lucide-react"
import { Insignia } from "@/components/aprende/insignia"
import { BotonLinkedIn } from "@/components/aprende/boton-linkedin"
import {
  EMISOR,
  fechaLarga,
  horasTexto,
  urlCertificadoPdf,
  verificarCredencial,
} from "@/lib/aprende/credenciales"

export const metadata: Metadata = {
  title: "Verificar certificado",
  description:
    "Verificación pública de certificados e insignias del Centro de Prototipado de la UNAL Manizales.",
}

type Props = { params: Promise<{ codigo: string }> }

export default function Pagina({ params }: Props) {
  return (
    <section className="border-b px-8 py-14 lg:px-16 lg:py-16">
      <Suspense
        fallback={<p className="text-sm text-muted-foreground">Verificando…</p>}
      >
        <Resultado params={params} />
      </Suspense>
    </section>
  )
}

async function Resultado({ params }: Props) {
  const { codigo } = await params
  const c = await verificarCredencial(decodeURIComponent(codigo))

  if (!c)
    return (
      <div className="flex max-w-xl flex-col gap-4">
        <CircleAlertIcon
          className="size-8 text-destructive"
          aria-hidden="true"
        />
        <h1 className="m-0 text-3xl font-extrabold">
          No encontramos este certificado
        </h1>
        <p className="m-0 text-muted-foreground">
          Revisa que el código esté completo, con el formato CP-XXXX-XXXX. Si lo
          copiaste de un PDF, escríbelo de nuevo.
        </p>
        <Link
          href="/verificar"
          className="inline-flex w-fit items-center gap-2 font-semibold text-primary underline underline-offset-4"
        >
          <SearchIcon className="size-4" aria-hidden="true" /> Verificar otro
          código
        </Link>
      </div>
    )

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
      <div className="flex flex-col gap-5">
        {c.revocada ? (
          <p className="m-0 inline-flex w-fit items-center gap-2 border border-red-500/40 bg-red-500/10 px-3 py-1.5 text-sm font-semibold">
            <CircleAlertIcon className="size-4" aria-hidden="true" />{" "}
            Certificado anulado
          </p>
        ) : (
          <p className="m-0 inline-flex w-fit items-center gap-2 border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            <BadgeCheckIcon className="size-4" aria-hidden="true" /> Certificado
            válido
          </p>
        )}
        <h1 className="m-0 text-3xl leading-tight font-extrabold text-balance md:text-5xl">
          {c.titulo}
        </h1>
        <dl className="grid gap-4 border-t pt-6 sm:grid-cols-2">
          <Dato rotulo="Otorgado a" valor={c.nombre} />
          <Dato
            rotulo={
              c.tipo === "charla" ? "Asistencia a charla" : "Curso aprobado"
            }
            valor={`${fechaLarga(c.fecha)} · ${horasTexto(c.horas)}`}
          />
          <Dato rotulo="Emitido por" valor={EMISOR} />
          <Dato rotulo="Código" valor={c.codigo} />
        </dl>
        {!c.revocada && (
          <div className="flex flex-wrap gap-2 pt-2">
            <a
              href={urlCertificadoPdf(c.codigo)}
              className="inline-flex min-h-10 items-center gap-2 border px-4 text-sm font-semibold hover:bg-muted"
            >
              <DownloadIcon className="size-4" aria-hidden="true" /> Descargar
              certificado (PDF)
            </a>
            <BotonLinkedIn credencial={c} />
          </div>
        )}
      </div>
      <Insignia
        titulo={c.titulo}
        tipo={c.tipo}
        horas={c.horas}
        className="mx-auto w-56 lg:w-full"
      />
    </div>
  )
}

function Dato({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div>
      <dt className="text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
        {rotulo}
      </dt>
      <dd className="m-0 mt-1 text-base font-semibold">{valor}</dd>
    </div>
  )
}
