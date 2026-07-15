import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer"
import type { SolicitudData } from "@/lib/forms/schemas"
import { CEN_LOGO_PNG } from "./logo"

// Paleta institucional (tomada de los formatos oficiales del centro).
const C = {
  primary: "#003366",
  secondary: "#004b8d",
  lightBlue: "#e6f0ff",
  accent: "#0066cc",
  orange: "#f39c12",
  text: "#2c3e50",
  muted: "#7f8c8d",
  border: "#dde6f0",
}

const s = StyleSheet.create({
  page: {
    paddingTop: 34,
    paddingBottom: 40,
    paddingHorizontal: 40,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: C.text,
    lineHeight: 1.45,
  },

  // Header
  header: {
    alignItems: "center",
    textAlign: "center",
    borderBottomWidth: 2,
    borderBottomColor: C.lightBlue,
    paddingBottom: 12,
    marginBottom: 14,
  },
  logo: { height: 44, objectFit: "contain", marginBottom: 8 },
  h1: {
    fontSize: 15,
    fontFamily: "Helvetica-Bold",
    color: C.primary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  headerSub: { fontSize: 8.5, color: C.muted, marginBottom: 8 },
  badgeRow: { flexDirection: "row", justifyContent: "center", gap: 6 },
  badge: {
    color: "#ffffff",
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    paddingVertical: 2.5,
    paddingHorizontal: 9,
    borderRadius: 10,
  },
  formatoNum: { fontSize: 7.5, color: C.muted, marginTop: 8 },

  // Section
  section: { marginBottom: 6 },
  h2: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.lightBlue,
    color: C.secondary,
    borderRadius: 4,
    paddingVertical: 5,
    paddingHorizontal: 9,
    marginTop: 9,
    marginBottom: 7,
  },
  h2Num: {
    width: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: C.secondary,
    color: "#ffffff",
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    paddingTop: 2.5,
    marginRight: 7,
  },
  h2Text: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: C.secondary },

  // Fields grid
  grid: { flexDirection: "row", flexWrap: "wrap" },
  field: { width: "50%", paddingRight: 14, marginBottom: 7 },
  fieldWide: { width: "100%", paddingRight: 0, marginBottom: 7 },
  label: {
    fontSize: 7,
    color: C.muted,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  value: { fontSize: 10, color: C.text },

  // Roster table
  table: {
    marginTop: 2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
  },
  th: {
    flexDirection: "row",
    backgroundColor: C.primary,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  thCell: { color: "#ffffff", fontSize: 8, fontFamily: "Helvetica-Bold" },
  tr: {
    flexDirection: "row",
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderTopWidth: 0.5,
    borderTopColor: C.border,
  },
  trAlt: { backgroundColor: "#f6f9fe" },
  tdCell: { fontSize: 9 },
  cIdx: { width: "8%" },
  cName: { width: "37%" },
  cDoc: { width: "25%" },
  cMail: { width: "30%" },

  // Signatures
  signatures: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  sigBlock: { width: "46%" },
  signArea: { height: 38, width: "100%", overflow: "hidden" },
  sigImg: { width: 170, height: 38, objectFit: "contain" },
  sigLine: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: C.text,
    marginTop: 4,
    paddingTop: 4,
  },
  sigName: { fontSize: 9, fontFamily: "Helvetica-Bold", color: C.primary },
  sigRole: { fontSize: 7.5, color: C.muted },

  // Footer
  footer: {
    marginTop: 14,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingTop: 6,
  },
  footerText: { fontSize: 7, color: C.muted },
})

type Field = { label: string; value: string; wide?: boolean }
type Section = { title: string; fields: Field[] }

type Meta = { title: string; badges: string[]; formato: string }

const META: Record<SolicitudData["type"], Meta> = {
  general: {
    title: "Contacto General",
    badges: ["Mensaje"],
    formato: "FO-CP-001 · Rev. 01",
  },
  servicios: {
    title: "Solicitud de Servicios",
    badges: ["Solicitud de Fabricación y Uso", "Servicios del Aula STEAM"],
    formato: "FO-CP-005 · Rev. 01",
  },
  "visita-docente": {
    title: "Visita de Docentes UNAL",
    badges: ["Periodo 2026-1S", "Uso Interno Institucional"],
    formato: "FO-CP-003 · Rev. 01",
  },
  "visita-externo": {
    title: "Visita Externa · STEM",
    badges: ["Periodo 2026-1S", "Vinculación Externa"],
    formato: "FO-CP-004 · Rev. 01",
  },
}

const fechaHora = (fecha: string, horario: string) =>
  [fecha, horario].filter(Boolean).join(" · ")

function sectionsFor(data: SolicitudData): Section[] {
  const datos = (extra: Field[]): Section => ({
    title: "Datos del Solicitante",
    fields: [
      { label: "Nombre completo", value: data.nombre },
      { label: "Documento", value: "documento" in data ? data.documento : "" },
      { label: "Correo", value: data.correo },
      { label: "Teléfono", value: data.telefono ?? "" },
      ...extra,
    ],
  })

  switch (data.type) {
    case "general":
      return [
        datos([{ label: "Afiliación", value: data.afiliacion }]),
        {
          title: "Mensaje",
          fields: [{ label: "Mensaje", value: data.mensaje, wide: true }],
        },
      ]
    case "servicios":
      return [
        datos([
          { label: "Programa / Dependencia", value: data.programa },
          { label: "Tipo de usuario", value: data.tipoUsuario },
        ]),
        {
          title: "Proyecto o Actividad",
          fields: [
            { label: "Proyecto / Práctica", value: data.proyecto },
            { label: "Líder responsable", value: data.liderResponsable },
            { label: "Asignatura", value: data.asignatura },
            {
              label: "¿Qué desea fabricar/realizar?",
              value: data.descripcion,
              wide: true,
            },
          ],
        },
        {
          title: "Maquinaria y Materiales",
          fields: [
            {
              label: "Maquinaria / Equipos",
              value: data.maquinaria.join(", "),
              wide: true,
            },
            {
              label: "Materiales requeridos",
              value: data.materiales,
              wide: true,
            },
          ],
        },
      ]
    case "visita-docente":
      return [
        datos([]),
        {
          title: "Detalles de la Visita",
          fields: [
            { label: "Asignatura / Proyecto", value: data.asignatura },
            { label: "Código SIA", value: data.codigoSia },
            { label: "Programa curricular", value: data.programa },
            { label: "Nivel de formación", value: data.nivel },
            {
              label: "Fecha y horario",
              value: fechaHora(data.fecha, data.horario),
            },
            {
              label: "Estudiantes previstos",
              value: str(data.estudiantesPrevistos),
            },
            { label: "N.º de grupos", value: str(data.numeroGrupos) },
            { label: "Acompañantes", value: str(data.acompanantes) },
            { label: "Equipos o materiales", value: data.equipos, wide: true },
            {
              label: "Descripción de la actividad",
              value: data.descripcion,
              wide: true,
            },
          ],
        },
      ]
    case "visita-externo":
      return [
        datos([]),
        {
          title: "Detalles de la Visita",
          fields: [
            { label: "Asignatura", value: data.asignatura },
            { label: "Código asignatura", value: data.codigoAsignatura },
            { label: "Institución educativa", value: data.institucion },
            { label: "Ciudad", value: data.ciudad },
            {
              label: "Fecha y horario",
              value: fechaHora(data.fecha, data.horario),
            },
            { label: "N.º de estudiantes", value: str(data.numeroEstudiantes) },
            { label: "N.º de grupos", value: str(data.numeroGrupos) },
            {
              label: "Descripción de la actividad",
              value: data.descripcion,
              wide: true,
            },
            { label: "Observaciones", value: data.observaciones, wide: true },
          ],
        },
      ]
  }
}

const str = (v: number | undefined) => (v === undefined ? "" : String(v))

export async function renderSolicitudPdf(data: SolicitudData): Promise<Buffer> {
  const meta = META[data.type]
  const sections = sectionsFor(data).map((sec) => ({
    ...sec,
    fields: sec.fields.filter((f) => f.value),
  }))
  const roster =
    data.type === "visita-docente" || data.type === "visita-externo"
      ? data.estudiantes
      : []
  const firma = "firma" in data ? data.firma : ""
  const generado = new Date().toLocaleDateString("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })

  const doc = (
    <Document
      title={`${meta.title} — Centro de Prototipado UNAL`}
      author="Centro de Prototipado UNAL"
    >
      <Page size="A4" style={s.page}>
        {/* Header */}
        <View style={s.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          <Image src={CEN_LOGO_PNG} style={s.logo} />
          <Text style={s.h1}>{meta.title}</Text>
          <Text style={s.headerSub}>
            Centro de Prototipado · Universidad Nacional de Colombia · Sede
            Manizales
          </Text>
          <View style={s.badgeRow}>
            {meta.badges.map((b, i) => (
              <Text
                key={b}
                style={[
                  s.badge,
                  { backgroundColor: i === 0 ? C.secondary : C.orange },
                ]}
              >
                {b}
              </Text>
            ))}
          </View>
          <Text style={s.formatoNum}>
            {meta.formato} · {generado}
          </Text>
        </View>

        {/* Sections */}
        {sections
          .filter((sec) => sec.fields.length > 0)
          .map((sec, i) => (
            <View key={sec.title} style={s.section} wrap={false}>
              <View style={s.h2}>
                <Text style={s.h2Num}>{i + 1}</Text>
                <Text style={s.h2Text}>{sec.title}</Text>
              </View>
              <View style={s.grid}>
                {sec.fields.map((f) => (
                  <View key={f.label} style={f.wide ? s.fieldWide : s.field}>
                    <Text style={s.label}>{f.label}</Text>
                    <Text style={s.value}>{f.value}</Text>
                  </View>
                ))}
              </View>
            </View>
          ))}

        {/* Roster */}
        {roster.length > 0 && (
          <View style={s.section} wrap={false}>
            <View style={s.h2}>
              <Text style={s.h2Num}>{sections.length + 1}</Text>
              <Text style={s.h2Text}>Estudiantes ({roster.length})</Text>
            </View>
            <View style={s.table}>
              <View style={s.th}>
                <Text style={[s.thCell, s.cIdx]}>#</Text>
                <Text style={[s.thCell, s.cName]}>Nombre</Text>
                <Text style={[s.thCell, s.cDoc]}>Documento</Text>
                <Text style={[s.thCell, s.cMail]}>Correo</Text>
              </View>
              {roster.map((e, i) => (
                <View key={i} style={[s.tr, i % 2 === 1 ? s.trAlt : {}]}>
                  <Text style={[s.tdCell, s.cIdx]}>{i + 1}</Text>
                  <Text style={[s.tdCell, s.cName]}>{e.nombre}</Text>
                  <Text style={[s.tdCell, s.cDoc]}>{e.documento}</Text>
                  <Text style={[s.tdCell, s.cMail]}>{e.correo}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Firmas + footer: bloque indivisible */}
        <View wrap={false}>
          <View style={s.signatures}>
            <View style={s.sigBlock}>
              <View style={s.signArea}>
                {firma ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image src={firma} style={s.sigImg} />
                ) : null}
              </View>
              <View style={s.sigLine}>
                <Text style={s.sigName}>Firma del Solicitante</Text>
                <Text style={s.sigRole}>{data.nombre}</Text>
                {"documento" in data && (
                  <Text style={s.sigRole}>C.C. {data.documento}</Text>
                )}
              </View>
            </View>
            <View style={s.sigBlock}>
              <View style={s.signArea} />
              <View style={s.sigLine}>
                <Text style={s.sigName}>Recibe / Autoriza</Text>
                <Text style={s.sigRole}>Auxiliar Centro de Prototipado</Text>
                <Text style={s.sigRole}>Universidad Nacional de Colombia</Text>
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={s.footer}>
            <Text style={s.footerText}>
              Manizales, Colombia · © 2026 Centro de Prototipado UNAL ·{" "}
              {meta.formato.split(" · ")[0]}
            </Text>
            <Text style={s.footerText}>Documento generado el {generado}</Text>
          </View>
        </View>
      </Page>
    </Document>
  )
  return renderToBuffer(doc)
}
