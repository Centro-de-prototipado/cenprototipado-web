import type { FormType } from "@/lib/forms/schemas"

export type StepKind = "fields" | "roster" | "signature" | "review"
export type StepDef = {
  id: string
  label: string
  fields: string[]
  kind: StepKind
}

const COMMON = ["nombre", "documento", "correo", "telefono"]

const STEPS: Record<FormType, StepDef[]> = {
  general: [
    {
      id: "general",
      label: "Tu mensaje",
      kind: "fields",
      fields: ["nombre", "correo", "afiliacion", "telefono", "mensaje"],
    },
  ],
  servicios: [
    {
      id: "datos",
      label: "Tus datos",
      kind: "fields",
      fields: [...COMMON, "programa", "tipoUsuario"],
    },
    {
      id: "detalles",
      label: "Detalles",
      kind: "fields",
      fields: [
        "proyecto",
        "liderResponsable",
        "asignatura",
        "descripcion",
        "maquinaria",
        "materiales",
      ],
    },
    { id: "firma", label: "Firma", kind: "signature", fields: ["firma"] },
    { id: "revisar", label: "Revisar y enviar", kind: "review", fields: [] },
  ],
  "visita-docente": [
    { id: "datos", label: "Tus datos", kind: "fields", fields: COMMON },
    {
      id: "detalles",
      label: "Detalles de la visita",
      kind: "fields",
      fields: [
        "asignatura",
        "codigoSia",
        "programa",
        "nivel",
        "fecha",
        "horario",
        "estudiantesPrevistos",
        "numeroGrupos",
        "acompanantes",
        "descripcion",
        "equipos",
      ],
    },
    {
      id: "estudiantes",
      label: "Estudiantes",
      kind: "roster",
      fields: ["estudiantes"],
    },
    { id: "firma", label: "Firma", kind: "signature", fields: ["firma"] },
    { id: "revisar", label: "Revisar y enviar", kind: "review", fields: [] },
  ],
  "visita-externo": [
    { id: "datos", label: "Tus datos", kind: "fields", fields: COMMON },
    {
      id: "detalles",
      label: "Detalles de la visita",
      kind: "fields",
      fields: [
        "asignatura",
        "codigoAsignatura",
        "institucion",
        "ciudad",
        "fecha",
        "horario",
        "numeroEstudiantes",
        "numeroGrupos",
        "descripcion",
        "observaciones",
      ],
    },
    {
      id: "estudiantes",
      label: "Estudiantes",
      kind: "roster",
      fields: ["estudiantes"],
    },
    { id: "firma", label: "Firma", kind: "signature", fields: ["firma"] },
    { id: "revisar", label: "Revisar y enviar", kind: "review", fields: [] },
  ],
}

export function stepsFor(type: FormType): StepDef[] {
  return STEPS[type]
}

export const ALL_STEP_FIELDS: Record<FormType, string[]> = Object.fromEntries(
  (Object.keys(STEPS) as FormType[]).map((t) => [
    t,
    STEPS[t].flatMap((s) => s.fields),
  ])
) as Record<FormType, string[]>
