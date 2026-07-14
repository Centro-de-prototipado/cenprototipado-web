import type { FormType } from "./schemas"

export const FORM_TYPES: {
  value: FormType
  label: string
  hasSignature: boolean
  hasRoster: boolean
}[] = [
  {
    value: "general",
    label: "Contacto general",
    hasSignature: false,
    hasRoster: false,
  },
  {
    value: "servicios",
    label: "Solicitud de Servicios",
    hasSignature: true,
    hasRoster: false,
  },
  {
    value: "visita-docente",
    label: "Visita Docente UNAL",
    hasSignature: true,
    hasRoster: true,
  },
  {
    value: "visita-externo",
    label: "Visita Externo (STEM)",
    hasSignature: true,
    hasRoster: true,
  },
]

export const LABEL_BY_TYPE: Record<FormType, string> = Object.fromEntries(
  FORM_TYPES.map((f) => [f.value, f.label])
) as Record<FormType, string>
