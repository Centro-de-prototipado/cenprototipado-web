import { describe, expect, test } from "vitest"
import { stepsFor } from "@/lib/forms/steps"

describe("stepsFor", () => {
  test("general tiene un solo paso de campos", () => {
    const s = stepsFor("general")
    expect(s).toHaveLength(1)
    expect(s[0].kind).toBe("fields")
    expect(s[0].fields).toContain("mensaje")
  })

  test("servicios: datos, detalles, firma, revisar (4 pasos)", () => {
    const s = stepsFor("servicios")
    expect(s.map((x) => x.kind)).toEqual([
      "fields",
      "fields",
      "signature",
      "review",
    ])
    expect(s[0].fields).toContain("tipoUsuario")
    expect(s[1].fields).toContain("maquinaria")
  })

  test("visita-docente: datos, detalles, roster, firma, revisar (5 pasos)", () => {
    const s = stepsFor("visita-docente")
    expect(s.map((x) => x.kind)).toEqual([
      "fields",
      "fields",
      "roster",
      "signature",
      "review",
    ])
    expect(s[2].fields).toContain("estudiantes")
  })

  test("visita-externo: 5 pasos con roster y captura codigoAsignatura", () => {
    const s = stepsFor("visita-externo")
    expect(s).toHaveLength(5)
    expect(s[1].fields).toContain("codigoAsignatura")
  })
})
