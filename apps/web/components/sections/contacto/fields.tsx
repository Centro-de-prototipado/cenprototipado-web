"use client"

import {
  type UseFormRegister,
  type Control,
  type FieldErrors,
  type UseFieldArrayReturn,
} from "react-hook-form"

import { MAQUINARIA, TIPO_USUARIO, NIVEL_FORMACION } from "@/lib/forms/schemas"
import { cn } from "@/lib/utils"

// Los distintos schemas de zod (uno por tipo de trámite) no comparten forma;
// se maneja el formulario como un registro dinámico y se valida contra el
// schema correcto en tiempo de ejecución (ver el resolver del wizard).
export type FormValues = Record<string, any>

export const inputCls =
  "border bg-muted/20 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

export type FieldsProps = {
  register: UseFormRegister<FormValues>
  control?: Control<FormValues>
  errors?: FieldErrors<FormValues>
}

export function FieldError({ error }: { error?: { message?: string } }) {
  if (!error?.message) return null
  return <p className="text-xs text-red-500">{error.message}</p>
}

export function Text({
  label,
  name,
  register,
  type = "text",
  placeholder,
  errors,
}: {
  label: string
  name: string
  register: UseFormRegister<FormValues>
  type?: string
  placeholder?: string
  errors?: FieldErrors<FormValues>
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <input
        type={type}
        className={inputCls}
        placeholder={placeholder}
        {...register(name)}
      />
      <FieldError error={errors?.[name]} />
    </div>
  )
}

export function Area({
  label,
  name,
  register,
  placeholder,
  errors,
}: {
  label: string
  name: string
  register: UseFormRegister<FormValues>
  placeholder?: string
  errors?: FieldErrors<FormValues>
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <textarea
        className={cn(inputCls, "min-h-24 resize-y leading-relaxed")}
        placeholder={placeholder}
        {...register(name)}
      />
      <FieldError error={errors?.[name]} />
    </div>
  )
}

export function Select({
  label,
  name,
  options,
  register,
  errors,
}: {
  label: string
  name: string
  options: readonly string[]
  register: UseFormRegister<FormValues>
  errors?: FieldErrors<FormValues>
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <select className={inputCls} {...register(name)}>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <FieldError error={errors?.[name]} />
    </div>
  )
}

export function GeneralFields({ register, errors }: FieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Nombre completo"
          name="nombre"
          register={register}
          placeholder="María Gómez"
          errors={errors}
        />
        <Text
          label="Correo"
          name="correo"
          type="email"
          register={register}
          placeholder="tu@correo.com"
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Afiliación"
          name="afiliacion"
          register={register}
          placeholder="UNAL · Estudiante / Empresa…"
          errors={errors}
        />
        <Text
          label="Teléfono (opcional)"
          name="telefono"
          register={register}
          placeholder="+57 300 000 0000"
          errors={errors}
        />
      </div>
      <Area
        label="Mensaje"
        name="mensaje"
        register={register}
        placeholder="Cuéntanos sobre tu proyecto…"
        errors={errors}
      />
    </>
  )
}

export function DatosComunes({ register, errors }: FieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Nombre completo"
          name="nombre"
          register={register}
          placeholder="María Gómez"
          errors={errors}
        />
        <Text
          label="Documento de identidad"
          name="documento"
          register={register}
          placeholder="1053…"
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Correo"
          name="correo"
          type="email"
          register={register}
          placeholder="tu@correo.com"
          errors={errors}
        />
        <Text
          label="Teléfono"
          name="telefono"
          register={register}
          placeholder="+57 300 000 0000"
          errors={errors}
        />
      </div>
    </>
  )
}

export function ServiciosFields({ register, errors }: FieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Programa / Dependencia"
          name="programa"
          register={register}
          errors={errors}
        />
        <Select
          label="Tipo de usuario"
          name="tipoUsuario"
          options={TIPO_USUARIO}
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Proyecto / Práctica"
          name="proyecto"
          register={register}
          errors={errors}
        />
        <Text
          label="Docente o líder responsable"
          name="liderResponsable"
          register={register}
          errors={errors}
        />
      </div>
      <Text
        label="Asignatura (si aplica)"
        name="asignatura"
        register={register}
        errors={errors}
      />
      <Area
        label="¿Qué desea fabricar/realizar?"
        name="descripcion"
        register={register}
        errors={errors}
      />
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-foreground">
          Maquinaria / Equipos
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {MAQUINARIA.map((m) => (
            <label
              key={m}
              className="flex items-center gap-2 text-xs text-foreground"
            >
              <input
                type="checkbox"
                value={m}
                className="accent-primary"
                {...register("maquinaria")}
              />{" "}
              {m}
            </label>
          ))}
        </div>
        <FieldError error={errors?.maquinaria} />
      </div>
      <Area
        label="Materiales requeridos"
        name="materiales"
        register={register}
        errors={errors}
      />
    </>
  )
}

export function VisitaDocenteFields({ register, errors }: FieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Asignatura / Proyecto"
          name="asignatura"
          register={register}
          errors={errors}
        />
        <Text
          label="Código SIA (si aplica)"
          name="codigoSia"
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Programa curricular"
          name="programa"
          register={register}
          errors={errors}
        />
        <Select
          label="Nivel de formación"
          name="nivel"
          options={NIVEL_FORMACION}
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Fecha propuesta"
          name="fecha"
          type="date"
          register={register}
          errors={errors}
        />
        <Text
          label="Horario"
          name="horario"
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Text
          label="Estudiantes previstos"
          name="estudiantesPrevistos"
          type="number"
          register={register}
          errors={errors}
        />
        <Text
          label="Número de grupos"
          name="numeroGrupos"
          type="number"
          register={register}
          errors={errors}
        />
        <Text
          label="Acompañantes adicionales"
          name="acompanantes"
          type="number"
          register={register}
          errors={errors}
        />
      </div>
      <Area
        label="Descripción de la actividad"
        name="descripcion"
        register={register}
        errors={errors}
      />
      <Area
        label="Equipos o materiales requeridos"
        name="equipos"
        register={register}
        errors={errors}
      />
    </>
  )
}

export function VisitaExternoFields({ register, errors }: FieldsProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Institución educativa"
          name="institucion"
          register={register}
          errors={errors}
        />
        <Text
          label="Ciudad"
          name="ciudad"
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Asignatura (si aplica)"
          name="asignatura"
          register={register}
          errors={errors}
        />
        <Text
          label="Código asignatura (si aplica)"
          name="codigoAsignatura"
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="Fecha de la visita"
          name="fecha"
          type="date"
          register={register}
          errors={errors}
        />
        <Text
          label="Horario"
          name="horario"
          register={register}
          errors={errors}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text
          label="N.º de estudiantes"
          name="numeroEstudiantes"
          type="number"
          register={register}
          errors={errors}
        />
        <Text
          label="Número de grupos"
          name="numeroGrupos"
          type="number"
          register={register}
          errors={errors}
        />
      </div>
      <Area
        label="Descripción de la actividad"
        name="descripcion"
        register={register}
        errors={errors}
      />
      <Area
        label="Observaciones adicionales"
        name="observaciones"
        register={register}
        errors={errors}
      />
    </>
  )
}

export function RosterField({
  roster,
  register,
  errors,
}: {
  roster: UseFieldArrayReturn<FormValues, "estudiantes">
  register: UseFormRegister<FormValues>
  errors?: FieldErrors<FormValues>
}) {
  const rosterError = errors?.estudiantes
  const rosterMessage = Array.isArray(rosterError)
    ? undefined
    : (rosterError as { message?: string } | undefined)?.message
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">
          Estudiantes que asistirán
        </label>
        <button
          type="button"
          onClick={() =>
            roster.append({ nombre: "", documento: "", correo: "" })
          }
          className="text-xs text-primary underline"
        >
          + Agregar estudiante
        </button>
      </div>
      {roster.fields.length === 0 && (
        <p className="text-xs text-muted-foreground">
          Agrega al menos un estudiante.
        </p>
      )}
      {rosterMessage && <p className="text-xs text-red-500">{rosterMessage}</p>}
      {roster.fields.map((f, i) => {
        const rowErrors = Array.isArray(rosterError)
          ? rosterError[i]
          : undefined
        return (
          <div key={f.id} className="flex flex-col gap-1">
            <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
              <input
                className={inputCls}
                placeholder="Nombre"
                {...register(`estudiantes.${i}.nombre`)}
              />
              <input
                className={inputCls}
                placeholder="Documento"
                {...register(`estudiantes.${i}.documento`)}
              />
              <input
                className={inputCls}
                placeholder="Correo"
                {...register(`estudiantes.${i}.correo`)}
              />
              <button
                type="button"
                onClick={() => roster.remove(i)}
                className="px-2 text-muted-foreground hover:text-red-500"
              >
                ×
              </button>
            </div>
            {rowErrors && (
              <p className="text-xs text-red-500">
                {rowErrors.nombre?.message ||
                  rowErrors.documento?.message ||
                  rowErrors.correo?.message}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
