import { describe, expect, test } from "vitest"
import { schemaFor } from "@/lib/forms/schemas"

describe("schemaFor", () => {
  test("general acepta mensaje mínimo válido", () => {
    const r = schemaFor("general").safeParse({
      type: "general",
      nombre: "María Gómez",
      correo: "maria@correo.com",
      mensaje: "Hola, quiero información.",
    })
    expect(r.success).toBe(true)
  })

  test("servicios exige firma (dataURL) no vacía", () => {
    const r = schemaFor("servicios").safeParse({
      type: "servicios",
      nombre: "María",
      documento: "123",
      correo: "m@c.com",
      tipoUsuario: "Estudiante",
      maquinaria: ["Impresora 3D FDM"],
      firma: "",
    })
    expect(r.success).toBe(false)
  })

  test("visita-docente exige al menos un estudiante en el roster", () => {
    const r = schemaFor("visita-docente").safeParse({
      type: "visita-docente",
      nombre: "Prof",
      documento: "1",
      correo: "p@c.com",
      asignatura: "Física",
      nivel: "Pregrado",
      fecha: "2026-08-01",
      firma: "data:image/png;base64,AAAA",
      estudiantes: [],
    })
    expect(r.success).toBe(false)
  })

  test("visita-docente válido con un estudiante", () => {
    const r = schemaFor("visita-docente").safeParse({
      type: "visita-docente",
      nombre: "Prof",
      documento: "1",
      correo: "p@c.com",
      asignatura: "Física",
      nivel: "Pregrado",
      fecha: "2026-08-01",
      horario: "9am",
      firma: "data:image/png;base64,AAAA",
      estudiantes: [{ nombre: "Ana", documento: "9", correo: "ana@c.com" }],
    })
    expect(r.success).toBe(true)
  })
})
