"use client"

import { useEffect, useState } from "react"
import { MailIcon, MapPinIcon, MessageCircleIcon } from "lucide-react"
import { useSupabase } from "@cen/auth"
import { tipo } from "@/components/ui/tipografia"

export type DatosContacto = {
  direccion: string | null
  gestor_nombre: string | null
  whatsapp: string | null
  correo: string | null
}

/** Tarjeta de contacto del aula. Llega con los datos del build y los refresca en el
 *  navegador, así los cambios que hace el gestor se ven sin volver a compilar el sitio. */
export function ContactoAula({ aulaId, nombre, inicial }: { aulaId: string; nombre: string; inicial: DatosContacto }) {
  const sb = useSupabase()
  const [datos, setDatos] = useState(inicial)

  useEffect(() => {
    let vigente = true
    sb.schema("red")
      .from("aulas")
      .select("direccion, gestor_nombre, whatsapp, correo")
      .eq("id", aulaId)
      .maybeSingle()
      .then(({ data }) => {
        if (vigente && data) setDatos(data as DatosContacto)
      })
    return () => {
      vigente = false
    }
  }, [sb, aulaId])

  const whatsapp = datos.whatsapp?.replace(/\D/g, "")
  return (
    <div className="iso-panel p-5">
      <h2 className={tipo.h3}>Contacto</h2>
      {datos.direccion && (
        <p className="mt-2 flex gap-2 text-sm text-muted-foreground">
          <MapPinIcon className="mt-0.5 size-4 shrink-0 text-link" aria-hidden="true" />
          {datos.direccion}
        </p>
      )}
      {whatsapp || datos.correo ? (
        <div className="mt-3 flex flex-col gap-2">
          {datos.gestor_nombre && <p className="text-sm text-muted-foreground">Gestor: {datos.gestor_nombre}</p>}
          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hola, escribo desde la Red STEAM de Caldas sobre el ${nombre}.`)}`}
              className="inline-flex min-h-11 items-center justify-center gap-2 bg-[#25d366] px-4 font-semibold text-neutral-950"
            >
              <MessageCircleIcon className="size-5" aria-hidden="true" /> Escribir por WhatsApp
            </a>
          )}
          {datos.correo && (
            <a href={`mailto:${datos.correo}`} className="inline-flex min-h-11 items-center justify-center gap-2 border px-4 font-medium break-all hover:bg-accent">
              <MailIcon className="size-5 shrink-0" aria-hidden="true" /> {datos.correo}
            </a>
          )}
        </div>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Los datos de contacto de esta aula se están actualizando. Mientras tanto, escribe al Centro de Prototipado.
        </p>
      )}
    </div>
  )
}
