import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer"
import { LABEL_BY_TYPE } from "@/lib/forms/config"
import type { SolicitudData } from "@/lib/forms/schemas"

const s = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica" },
  h1: { fontSize: 16, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  sub: { fontSize: 9, color: "#555", marginBottom: 12 },
  row: { flexDirection: "row", marginBottom: 3 },
  key: { width: 140, fontFamily: "Helvetica-Bold" },
  val: { flex: 1 },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
    fontSize: 11,
  },
  th: {
    flexDirection: "row",
    borderBottom: 1,
    paddingBottom: 2,
    fontFamily: "Helvetica-Bold",
  },
  td: {
    flexDirection: "row",
    paddingVertical: 2,
    borderBottom: 0.5,
    borderColor: "#ccc",
  },
  cell: { flex: 1, paddingRight: 4 },
  firma: { width: 180, height: 70, marginTop: 6, borderTop: 1, paddingTop: 4 },
})

function entries(data: SolicitudData): [string, string][] {
  const base: [string, string][] = [
    ["Nombre", data.nombre],
    ["Correo", data.correo],
  ]
  if ("documento" in data) base.push(["Documento", data.documento])
  if ("telefono" in data && data.telefono)
    base.push(["Teléfono", data.telefono])
  switch (data.type) {
    case "general":
      return [
        ...base,
        ["Afiliación", data.afiliacion],
        ["Mensaje", data.mensaje],
      ]
    case "servicios":
      return [
        ...base,
        ["Tipo de usuario", data.tipoUsuario],
        ["Programa", data.programa],
        ["Proyecto", data.proyecto],
        ["Líder responsable", data.liderResponsable],
        ["Asignatura", data.asignatura],
        ["Maquinaria", data.maquinaria.join(", ")],
        ["Descripción", data.descripcion],
        ["Materiales", data.materiales],
      ]
    case "visita-docente":
      return [
        ...base,
        ["Asignatura", data.asignatura],
        ["Código SIA", data.codigoSia],
        ["Programa", data.programa],
        ["Nivel", data.nivel],
        ["Fecha", `${data.fecha} ${data.horario}`],
        ["Estudiantes previstos", String(data.estudiantesPrevistos ?? "")],
        ["Grupos", String(data.numeroGrupos ?? "")],
        ["Descripción", data.descripcion],
        ["Equipos", data.equipos],
      ]
    case "visita-externo":
      return [
        ...base,
        ["Asignatura", data.asignatura],
        ["Institución", data.institucion],
        ["Ciudad", data.ciudad],
        ["Fecha", `${data.fecha} ${data.horario}`],
        ["N.º estudiantes", String(data.numeroEstudiantes ?? "")],
        ["Grupos", String(data.numeroGrupos ?? "")],
        ["Descripción", data.descripcion],
        ["Observaciones", data.observaciones],
      ]
  }
}

export async function renderSolicitudPdf(data: SolicitudData): Promise<Buffer> {
  const roster =
    data.type === "visita-docente" || data.type === "visita-externo"
      ? data.estudiantes
      : []
  const firma = "firma" in data ? data.firma : ""
  const doc = (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>{LABEL_BY_TYPE[data.type]}</Text>
        <Text style={s.sub}>
          Centro de Prototipado — UNAL · {new Date().toLocaleString("es-CO")}
        </Text>
        {entries(data)
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <View style={s.row} key={k}>
              <Text style={s.key}>{k}</Text>
              <Text style={s.val}>{v}</Text>
            </View>
          ))}
        {roster.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Estudiantes ({roster.length})</Text>
            <View style={s.th}>
              <Text style={s.cell}>Nombre</Text>
              <Text style={s.cell}>Documento</Text>
              <Text style={s.cell}>Correo</Text>
            </View>
            {roster.map((e, i) => (
              <View style={s.td} key={i}>
                <Text style={s.cell}>{e.nombre}</Text>
                <Text style={s.cell}>{e.documento}</Text>
                <Text style={s.cell}>{e.correo}</Text>
              </View>
            ))}
          </View>
        )}
        {firma && (
          <View>
            <Text style={s.sectionTitle}>Firma del solicitante</Text>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={firma} style={s.firma} />
          </View>
        )}
      </Page>
    </Document>
  )
  return renderToBuffer(doc)
}
