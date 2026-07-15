import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Hr,
} from "@react-email/components"
import { LABEL_BY_TYPE } from "@/lib/forms/config"
import type { SolicitudData } from "@/lib/forms/schemas"

// Paleta institucional (coherente con el PDF y el sitio).
const C = {
  primary: "#003366",
  secondary: "#004b8d",
  lightBlue: "#e6f0ff",
  orange: "#f39c12",
  text: "#2c3e50",
  muted: "#7f8c8d",
  border: "#dde6f0",
  bg: "#f4f6fb",
}

export function subjectFor(data: SolicitudData): string {
  const ref =
    data.type === "visita-externo"
      ? data.institucion
      : "proyecto" in data && data.proyecto
        ? data.proyecto
        : "asignatura" in data && data.asignatura
          ? data.asignatura
          : ""
  return `[${LABEL_BY_TYPE[data.type]}] ${data.nombre}${ref ? ` — ${ref}` : ""}`
}

const fechaHora = (fecha: string, horario: string) =>
  [fecha, horario].filter(Boolean).join(" · ")

const num = (v: number | undefined) => (v === undefined ? "" : String(v))

// Detalles concisos por tipo (el PDF adjunto tiene el detalle completo).
function detailsFor(data: SolicitudData): [string, string][] {
  const base: [string, string][] = [["Correo", data.correo]]
  if ("telefono" in data && data.telefono)
    base.push(["Teléfono", data.telefono])
  if ("documento" in data) base.push(["Documento", data.documento])

  switch (data.type) {
    case "general":
      return [...base, ["Afiliación", data.afiliacion]]
    case "servicios":
      return [
        ...base,
        ["Tipo de usuario", data.tipoUsuario],
        ["Programa", data.programa],
        ["Proyecto", data.proyecto],
        ["Maquinaria", data.maquinaria.join(", ")],
      ]
    case "visita-docente":
      return [
        ...base,
        ["Asignatura", data.asignatura],
        ["Nivel", data.nivel],
        ["Fecha y horario", fechaHora(data.fecha, data.horario)],
        ["Estudiantes previstos", num(data.estudiantesPrevistos)],
        ["Estudiantes en lista", String(data.estudiantes.length)],
      ]
    case "visita-externo":
      return [
        ...base,
        ["Institución", data.institucion],
        ["Ciudad", data.ciudad],
        ["Fecha y horario", fechaHora(data.fecha, data.horario)],
        ["N.º de estudiantes", num(data.numeroEstudiantes)],
        ["Estudiantes en lista", String(data.estudiantes.length)],
      ]
  }
}

export function SolicitudEmail({ data }: { data: SolicitudData }) {
  const label = LABEL_BY_TYPE[data.type]
  const rows = detailsFor(data).filter(([, v]) => v)
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    data.correo
  )}`
  const preview =
    data.type === "general"
      ? `${label} · ${data.nombre}: ${data.mensaje}`.slice(0, 120)
      : `${label} · ${data.nombre} — revisa el detalle y el PDF adjunto`

  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={body}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={wordmark}>CENTRO DE PROTOTIPADO</Text>
            <Text style={wordmarkSub}>
              Universidad Nacional de Colombia · Sede Manizales
            </Text>
          </Section>

          {/* Body */}
          <Section style={content}>
            <Text style={badge}>{label.toUpperCase()}</Text>
            <Heading as="h1" style={h1}>
              Nueva solicitud de {data.nombre}
            </Heading>
            <Text style={intro}>
              Se recibió una nueva solicitud a través del formulario de
              contacto. Estos son los datos principales:
            </Text>

            {/* Detalles */}
            <Section style={card}>
              {rows.map(([k, v], i) => (
                <Row key={k} style={i === 0 ? undefined : rowSpacing}>
                  <Column style={cellKey}>{k}</Column>
                  <Column style={cellVal}>{v}</Column>
                </Row>
              ))}
            </Section>

            {data.type === "general" ? (
              <>
                <Text style={sectionLabel}>Mensaje</Text>
                <Text style={message}>{data.mensaje}</Text>
              </>
            ) : (
              <Text style={pdfNote}>
                📎 Se adjunta un PDF con el detalle completo del formulario, el
                listado de estudiantes (si aplica) y la firma del solicitante.
              </Text>
            )}

            <Button href={gmailCompose} style={cta}>
              Responder al solicitante
            </Button>

            <Hr style={hr} />
            <Text style={footerText}>
              Centro de Prototipado · Universidad Nacional de Colombia · Sede
              Manizales
            </Text>
            <Text style={footerMuted}>
              Notificación automática del formulario de contacto.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// ── Estilos (inline para compatibilidad con clientes de correo) ──
const body: React.CSSProperties = {
  backgroundColor: C.bg,
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  color: C.text,
  margin: 0,
  padding: "24px 0",
}

const container: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  border: `1px solid ${C.border}`,
  borderRadius: "10px",
  overflow: "hidden",
}

const header: React.CSSProperties = {
  backgroundColor: C.primary,
  padding: "22px 32px",
  textAlign: "center",
}

const wordmark: React.CSSProperties = {
  margin: 0,
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: 800,
  letterSpacing: "2px",
}

const wordmarkSub: React.CSSProperties = {
  margin: "4px 0 0",
  color: "#cdd9ec",
  fontSize: "11px",
  letterSpacing: "0.5px",
}

const content: React.CSSProperties = { padding: "28px 32px" }

const badge: React.CSSProperties = {
  display: "inline-block",
  backgroundColor: C.lightBlue,
  color: C.secondary,
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "1px",
  padding: "5px 12px",
  borderRadius: "20px",
  margin: 0,
}

const h1: React.CSSProperties = {
  margin: "14px 0 6px",
  color: C.primary,
  fontSize: "22px",
  fontWeight: 800,
}

const intro: React.CSSProperties = {
  margin: "0 0 18px",
  color: C.muted,
  fontSize: "14px",
  lineHeight: "22px",
}

const card: React.CSSProperties = {
  backgroundColor: "#fafbfe",
  border: `1px solid ${C.border}`,
  borderRadius: "8px",
  padding: "14px 16px",
}

const rowSpacing: React.CSSProperties = { paddingTop: "8px" }

const cellKey: React.CSSProperties = {
  width: "38%",
  color: C.muted,
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.4px",
  verticalAlign: "top",
  paddingRight: "10px",
}

const cellVal: React.CSSProperties = {
  color: C.text,
  fontSize: "14px",
  verticalAlign: "top",
}

const sectionLabel: React.CSSProperties = {
  margin: "20px 0 4px",
  color: C.muted,
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.4px",
}

const message: React.CSSProperties = {
  margin: 0,
  color: C.text,
  fontSize: "14px",
  lineHeight: "22px",
  whiteSpace: "pre-line",
}

const pdfNote: React.CSSProperties = {
  margin: "18px 0 0",
  backgroundColor: "#fff7e9",
  border: `1px solid ${C.orange}`,
  borderRadius: "8px",
  padding: "12px 14px",
  color: "#8a5a00",
  fontSize: "13px",
  lineHeight: "20px",
}

const cta: React.CSSProperties = {
  display: "block",
  backgroundColor: C.secondary,
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: 700,
  textAlign: "center",
  textDecoration: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  margin: "22px 0 0",
  boxSizing: "border-box",
}

const hr: React.CSSProperties = {
  border: "none",
  borderTop: `1px solid ${C.border}`,
  margin: "24px 0 14px",
}

const footerText: React.CSSProperties = {
  margin: 0,
  color: C.text,
  fontSize: "12px",
  fontWeight: 600,
  textAlign: "center",
}

const footerMuted: React.CSSProperties = {
  margin: "4px 0 0",
  color: C.muted,
  fontSize: "11px",
  textAlign: "center",
}
