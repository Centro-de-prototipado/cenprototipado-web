import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Hr,
} from "@react-email/components"
import { LABEL_BY_TYPE } from "@/lib/forms/config"
import type { SolicitudData } from "@/lib/forms/schemas"

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

export function SolicitudEmail({ data }: { data: SolicitudData }) {
  const rows: [string, string][] = [
    ["Tipo", LABEL_BY_TYPE[data.type]],
    ["Nombre", data.nombre],
    ["Correo", data.correo],
  ]
  if ("telefono" in data && data.telefono)
    rows.push(["Teléfono", data.telefono])
  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif", color: "#111" }}>
        <Container>
          <Heading as="h2">Nueva {LABEL_BY_TYPE[data.type]}</Heading>
          {rows.map(([k, v]) => (
            <Text key={k} style={{ margin: "2px 0" }}>
              <strong>{k}:</strong> {v}
            </Text>
          ))}
          <Hr />
          <Text>
            {data.type === "general"
              ? data.mensaje
              : "Ver el PDF adjunto con el detalle completo del formulario y la firma."}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
