import { describe, expect, test } from "vitest"
import { subjectFor } from "@/lib/email/solicitud-email"

describe("subjectFor", () => {
  test("servicios incluye tipo y nombre", () => {
    const s = subjectFor({
      type: "servicios",
      nombre: "María Gómez",
      documento: "1",
      correo: "m@c.com",
      telefono: "",
      programa: "",
      tipoUsuario: "Estudiante",
      proyecto: "Robot",
      liderResponsable: "",
      asignatura: "",
      descripcion: "",
      maquinaria: ["Impresora 3D FDM"],
      materiales: "",
      firma: "data:image/png;base64,AAAA",
    })
    expect(s).toContain("Solicitud de Servicios")
    expect(s).toContain("María Gómez")
  })
})
