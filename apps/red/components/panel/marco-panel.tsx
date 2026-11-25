import type { ReactNode } from "react"
import Link from "next/link"
import { LockIcon } from "lucide-react"
import { Antetitulo, tipo } from "@/components/ui/tipografia"

/** Encabezado común de las páginas privadas de la Red. */
export function EncabezadoPanel({ antetitulo, titulo, descripcion }: { antetitulo: string; titulo: string; descripcion: ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <Antetitulo pulso>{antetitulo}</Antetitulo>
      <h1 className="m-0 text-3xl leading-[1.05] font-extrabold tracking-[-0.02em] md:text-5xl">{titulo}</h1>
      <p className={tipo.entrada}>{descripcion}</p>
    </div>
  )
}

/** Mensaje cuando falta la sesión o el permiso. */
export function SinAcceso({ motivo, volverA }: { motivo: "sesion" | "permiso"; volverA: string }) {
  return (
    <div className="iso-panel flex max-w-xl flex-col gap-3 p-6">
      <LockIcon className="size-6 text-link" aria-hidden="true" />
      {motivo === "sesion" ? (
        <>
          <p className="m-0 font-bold">Esta página es privada.</p>
          <p className="m-0 text-sm text-muted-foreground">Inicia sesión con tu cuenta de la Red para continuar.</p>
          <Link
            href={`/ingresar?next=${encodeURIComponent(volverA)}`}
            className="inline-flex min-h-11 w-fit items-center bg-primary px-5 font-semibold text-neutral-950"
          >
            Iniciar sesión
          </Link>
        </>
      ) : (
        <>
          <p className="m-0 font-bold">No tienes permiso para ver esta página.</p>
          <p className="m-0 text-sm text-muted-foreground">
            Si crees que es un error, pide a la coordinación de la red que te asigne el rol.
          </p>
          <Link href="/cuenta" className="text-link w-fit text-sm font-semibold underline">
            Ir a Mi cuenta
          </Link>
        </>
      )}
    </div>
  )
}

export function Cargando() {
  return (
    <p role="status" className="text-sm text-muted-foreground">
      Cargando…
    </p>
  )
}
