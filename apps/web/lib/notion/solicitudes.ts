import { DATA_SOURCES, notion } from "./client"
import { LABEL_BY_TYPE } from "@/lib/forms/config"
import type { SolicitudData } from "@/lib/forms/schemas"

const richText = (content: string) =>
  content
    ? { rich_text: [{ text: { content: content.slice(0, 1900) } }] }
    : { rich_text: [] }

function rosterSummary(data: SolicitudData): string {
  if (data.type !== "visita-docente" && data.type !== "visita-externo")
    return ""
  const n = data.estudiantes.length
  const nombres = data.estudiantes.map((e) => e.nombre).join(", ")
  return `${n} estudiante${n === 1 ? "" : "s"}: ${nombres}`
}

function detalle(data: SolicitudData): string {
  switch (data.type) {
    case "general":
      return data.mensaje
    case "servicios":
      return `Tipo usuario: ${data.tipoUsuario}\nMaquinaria: ${data.maquinaria.join(", ")}\nProyecto: ${data.proyecto}\nDescripción: ${data.descripcion}\nMateriales: ${data.materiales}`
    case "visita-docente":
      return `Asignatura: ${data.asignatura}\nNivel: ${data.nivel}\nFecha: ${data.fecha} ${data.horario}\n${data.descripcion}`
    case "visita-externo":
      return `Institución: ${data.institucion} (${data.ciudad})\nFecha: ${data.fecha} ${data.horario}\n${data.descripcion}\n${data.observaciones}`
  }
}

export function buildSolicitudProperties(
  data: SolicitudData
): Record<string, unknown> {
  const telefono = "telefono" in data ? data.telefono : ""
  return {
    Nombre: { title: [{ text: { content: data.nombre } }] },
    Tipo: { select: { name: LABEL_BY_TYPE[data.type] } },
    Correo: { url: `mailto:${data.correo}` },
    Teléfono: telefono ? { phone_number: telefono } : { phone_number: null },
    Estado: { select: { name: "Nuevo" } },
    Detalle: richText(detalle(data)),
    Roster: richText(rosterSummary(data)),
  }
}

export async function crearSolicitud(data: SolicitudData): Promise<void> {
  await notion.pages.create({
    parent: {
      type: "data_source_id",
      data_source_id: DATA_SOURCES.solicitudes,
    },
    properties: buildSolicitudProperties(data) as never,
  })
}
