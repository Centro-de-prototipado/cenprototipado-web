import { describe, expect, test } from "vitest"
import { buildSolicitudProperties } from "@/lib/notion/solicitudes"
import type { SolicitudData } from "@/lib/forms/schemas"

describe("buildSolicitudProperties", () => {
  test("general mapea título, tipo, correo como link de Gmail y estado inicial", () => {
    const props = buildSolicitudProperties({
      type: "general",
      nombre: "María Gómez",
      correo: "maria@correo.com",
      afiliacion: "",
      telefono: "",
      mensaje: "Hola",
    }) as any
    expect(props.Nombre.title[0].text.content).toBe("María Gómez")
    expect(props.Tipo.select.name).toBe("Contacto general")
    expect(props.Correo.url).toBe(
      "https://mail.google.com/mail/?view=cm&fs=1&to=maria%40correo.com"
    )
    expect(props.Estado.select.name).toBe("Nuevo")
  })

  test("visita-docente incluye resumen del roster con el conteo", () => {
    const props = buildSolicitudProperties({
      type: "visita-docente",
      nombre: "Prof",
      documento: "1",
      correo: "p@c.com",
      telefono: "",
      asignatura: "Física",
      codigoSia: "",
      programa: "",
      nivel: "Pregrado",
      fecha: "2026-08-01",
      horario: "9am",
      firma: "data:image/png;base64,AAAA",
      estudiantes: [
        { nombre: "Ana", documento: "9", correo: "ana@c.com" },
        { nombre: "Luis", documento: "8", correo: "luis@c.com" },
      ],
    } as SolicitudData) as any
    expect(props.Roster.rich_text[0].text.content).toContain("2 estudiantes")
    expect(props.Roster.rich_text[0].text.content).toContain("Ana")
  })
})
