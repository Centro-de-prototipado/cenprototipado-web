"use server"

import { schemaFor, type FormType, type SolicitudData } from "@/lib/forms/schemas"
import { renderSolicitudPdf } from "@/lib/pdf/solicitud-pdf"
import { enviarSolicitudEmail } from "@/lib/email/client"
import { crearSolicitud } from "@/lib/notion/solicitudes"

const FORM_TYPES: FormType[] = ["general", "servicios", "visita-docente", "visita-externo"]

export async function submitSolicitud(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const type = (raw as { type?: string })?.type
  if (!type || !FORM_TYPES.includes(type as FormType)) {
    return { ok: false, error: "Tipo de formulario inválido." }
  }

  const parsed = schemaFor(type as FormType).safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: "Revisa los campos del formulario." }
  }
  const data = parsed.data as SolicitudData

  try {
    const pdf =
      data.type === "general" ? undefined : await renderSolicitudPdf(data)
    await Promise.all([enviarSolicitudEmail({ data, pdf }), crearSolicitud(data)])
    return { ok: true }
  } catch (err) {
    console.error("submitSolicitud error", err)
    return { ok: false, error: "No pudimos enviar tu solicitud. Intenta de nuevo." }
  }
}
