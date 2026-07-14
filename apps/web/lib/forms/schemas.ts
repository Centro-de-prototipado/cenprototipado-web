import { z } from "zod"

export type FormType =
  | "general"
  | "servicios"
  | "visita-docente"
  | "visita-externo"

export const MAQUINARIA = [
  "Impresora 3D FDM",
  "Impresora 3D Resina",
  "CNC 3018 (Fresado PCB/Madera)",
  "Plóter de Corte / Vinilo",
  "Cortadora y Grabadora Láser",
  "Estación de Soldadura",
  "Herramientas Manuales",
  "Otro",
] as const

export const TIPO_USUARIO = [
  "Estudiante",
  "Docente",
  "Administrativo",
  "Externo / Investigador",
] as const

export const NIVEL_FORMACION = [
  "Pregrado",
  "Posgrado (Maestría/Doctorado)",
  "Extensión / Educación Continua",
  "Grupo de Investigación",
] as const

const requiredText = z.string().trim().min(1, "Requerido")
const email = z.string().trim().email("Correo inválido")
// Firma: dataURL PNG no vacío.
const firma = z.string().min(1, "La firma es obligatoria")

// Number("") === 0, así que un <input type="number"> vacío coercería a 0 en
// vez de quedar sin definir. Se normaliza "" (y null/undefined) a undefined
// antes de coercionar, para que estos campos queden realmente opcionales.
const optionalNonNegativeInt = z.preprocess(
  (v) => (v === "" || v === undefined || v === null ? undefined : v),
  z.coerce.number().int().nonnegative().optional()
)

const studentRow = z.object({
  nombre: requiredText,
  documento: requiredText,
  correo: email,
})
export type StudentRow = z.infer<typeof studentRow>

const commonRequester = {
  nombre: requiredText,
  documento: requiredText,
  correo: email,
  telefono: z.string().trim().optional().default(""),
}

export const generalSchema = z.object({
  type: z.literal("general"),
  nombre: requiredText,
  correo: email,
  afiliacion: z.string().trim().optional().default(""),
  telefono: z.string().trim().optional().default(""),
  mensaje: requiredText,
})

export const serviciosSchema = z.object({
  type: z.literal("servicios"),
  ...commonRequester,
  programa: z.string().trim().optional().default(""),
  tipoUsuario: z.enum(TIPO_USUARIO),
  proyecto: z.string().trim().optional().default(""),
  liderResponsable: z.string().trim().optional().default(""),
  asignatura: z.string().trim().optional().default(""),
  descripcion: z.string().trim().optional().default(""),
  maquinaria: z
    .array(z.enum(MAQUINARIA))
    .min(1, "Selecciona al menos un equipo"),
  materiales: z.string().trim().optional().default(""),
  firma,
})

export const visitaDocenteSchema = z.object({
  type: z.literal("visita-docente"),
  ...commonRequester,
  asignatura: requiredText,
  codigoSia: z.string().trim().optional().default(""),
  programa: z.string().trim().optional().default(""),
  nivel: z.enum(NIVEL_FORMACION),
  fecha: requiredText,
  horario: z.string().trim().optional().default(""),
  estudiantesPrevistos: optionalNonNegativeInt,
  numeroGrupos: optionalNonNegativeInt,
  acompanantes: optionalNonNegativeInt,
  descripcion: z.string().trim().optional().default(""),
  equipos: z.string().trim().optional().default(""),
  firma,
  estudiantes: z.array(studentRow).min(1, "Agrega al menos un estudiante"),
})

export const visitaExternoSchema = z.object({
  type: z.literal("visita-externo"),
  ...commonRequester,
  asignatura: z.string().trim().optional().default(""),
  codigoAsignatura: z.string().trim().optional().default(""),
  institucion: requiredText,
  ciudad: z.string().trim().optional().default(""),
  fecha: requiredText,
  horario: z.string().trim().optional().default(""),
  numeroEstudiantes: optionalNonNegativeInt,
  numeroGrupos: optionalNonNegativeInt,
  descripcion: z.string().trim().optional().default(""),
  observaciones: z.string().trim().optional().default(""),
  firma,
  estudiantes: z.array(studentRow).min(1, "Agrega al menos un estudiante"),
})

export type GeneralData = z.infer<typeof generalSchema>
export type ServiciosData = z.infer<typeof serviciosSchema>
export type VisitaDocenteData = z.infer<typeof visitaDocenteSchema>
export type VisitaExternoData = z.infer<typeof visitaExternoSchema>
export type SolicitudData =
  | GeneralData
  | ServiciosData
  | VisitaDocenteData
  | VisitaExternoData

export function schemaFor(type: FormType): z.ZodType {
  switch (type) {
    case "general":
      return generalSchema
    case "servicios":
      return serviciosSchema
    case "visita-docente":
      return visitaDocenteSchema
    case "visita-externo":
      return visitaExternoSchema
  }
}
