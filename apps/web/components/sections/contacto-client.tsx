"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  ClockIcon,
  ArrowRightIcon,
  GlobeIcon,
} from "lucide-react"
import {
  useForm,
  useFieldArray,
  Controller,
  type UseFormRegister,
  type Control,
  type FieldErrors,
  type Resolver,
  type UseFieldArrayReturn,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { DecorIcon } from "@/components/ui/decor-icon"
import { GridPattern } from "@/components/ui/grid-pattern"
import { Reveal } from "@/components/ui/reveal"
import { TechHeading } from "@/components/ui/tech-heading"
import { Button } from "@/components/ui/button"
import { SignaturePad } from "@/components/ui/signature-pad"
import { FORM_TYPES } from "@/lib/forms/config"
import {
  schemaFor,
  MAQUINARIA,
  TIPO_USUARIO,
  NIVEL_FORMACION,
  type FormType,
} from "@/lib/forms/schemas"
import { submitSolicitud } from "@/app/(marketing)/contacto/actions"
import type { FaqItem } from "@/lib/institutional-data"
import { cn } from "@/lib/utils"

// Los distintos schemas de zod (uno por tipo de trámite) no comparten forma;
// se maneja el formulario como un registro dinámico y se valida contra el
// schema correcto en tiempo de ejecución (ver `currentTypeRef` más abajo).
type FormValues = Record<string, any>

export function ContactoClient({
  faq,
  config,
}: {
  faq: FaqItem[]
  config: Record<string, string>
}) {
  const [formType, setFormType] = useState<FormType>("general")
  const [sent, setSent] = useState(false)
  const [serverError, setServerError] = useState("")

  // El resolver de zodResolver se captura en el primer render de useForm y no
  // se re-crea al cambiar `formType`; por eso se envuelve en una función que
  // lee el tipo actual desde un ref (actualizado en `changeType`) y resuelve
  // contra el schema correspondiente en cada validación.
  const currentTypeRef = useRef<FormType>(formType)
  const resolver = ((values: FormValues, context: unknown, options: unknown) =>
    (
      zodResolver(schemaFor(currentTypeRef.current) as never) as (
        ...args: unknown[]
      ) => unknown
    )(values, context, options)) as unknown as Resolver<FormValues>

  const form = useForm<FormValues>({
    resolver,
    defaultValues: { type: formType },
  })
  const { register, handleSubmit, control, reset, formState } = form
  const roster = useFieldArray({ control, name: "estudiantes" })

  const activeMeta = FORM_TYPES.find((f) => f.value === formType)!

  const changeType = (t: FormType) => {
    currentTypeRef.current = t
    setFormType(t)
    setServerError("")
    reset({ type: t })
  }

  const onSubmit = handleSubmit(async (values) => {
    const res = await submitSolicitud({ ...values, type: formType })
    if (res.ok) {
      setSent(true)
      reset({ type: formType })
    } else {
      setServerError(res.error)
    }
  })

  const contact = {
    email: config["contacto-email"] ?? "",
    phone: config["contacto-telefono"] ?? "",
    location: config["contacto-sede"] ?? "",
    hours: config["contacto-horario"] ?? "",
    coordinates: config["contacto-coordenadas"] ?? "",
  }

  return (
    <>
      {/* ── Hero split ── */}
      <section className="relative overflow-hidden border-b">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          <div className="absolute inset-0 opacity-40">
            <GridPattern
              className="size-full stroke-foreground/8"
              height={40}
              width={40}
              x={0}
            />
          </div>
          <div
            className="fx-aurora absolute -top-1/5 left-1/3 h-4/5 w-1/2 opacity-0 blur-[70px] dark:opacity-15"
            style={{
              background:
                "radial-gradient(ellipse, var(--color-cyan-400), transparent 65%)",
            }}
          />
        </div>

        <div className="relative z-1 grid grid-cols-1 gap-8 px-8 py-16 lg:grid-cols-2 lg:items-center lg:px-14 lg:py-20">
          <div className="flex flex-col gap-5">
            <Reveal
              as="span"
              immediate
              index={0}
              className="inline-flex w-fit border bg-card px-3 py-1 text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase"
            >
              Contacto · Hablemos
            </Reveal>
            <Reveal
              as="h1"
              immediate
              index={1}
              className="m-0 max-w-[14ch] text-4xl leading-[0.98] font-extrabold tracking-[-0.03em] text-foreground lg:text-[clamp(36px,5vw,72px)]"
            >
              ¿Tienes una idea o proyecto?
            </Reveal>
            <Reveal
              as="p"
              immediate
              index={2}
              className="m-0 max-w-[44ch] text-base leading-relaxed text-muted-foreground"
            >
              Coordinamos asesoría técnica, talleres, reservas de equipo y
              proyectos colaborativos con la comunidad académica y aliados
              externos.
            </Reveal>
          </div>

          {/* Contact info grid */}
          {(() => {
            const rows = [
              {
                Icon: MailIcon,
                label: "Correo",
                value: contact.email,
                href: `mailto:${contact.email}`,
              },
              {
                Icon: PhoneIcon,
                label: "Teléfono",
                value: contact.phone,
                href: `tel:${contact.phone.replace(/\s/g, "")}`,
              },
              {
                Icon: MapPinIcon,
                label: "Sede",
                value: contact.location,
                href: "#mapa",
              },
              {
                Icon: ClockIcon,
                label: "Horario",
                value: contact.hours,
                href: "#",
              },
            ].filter((r) => r.value)
            if (rows.length === 0) return null
            return (
              <Reveal
                as="div"
                immediate
                index={2}
                delay={0.1}
                className="border bg-card"
              >
                {rows.map(({ Icon, label, value, href }, i) => (
                  <a
                    key={label}
                    href={href}
                    className="grid transition-colors hover:bg-muted/20"
                    style={{
                      gridTemplateColumns: "48px 1fr",
                      borderBottom:
                        i < rows.length - 1
                          ? "1px solid var(--color-border)"
                          : undefined,
                    }}
                  >
                    <span
                      className="flex h-13 w-12 items-center justify-center text-primary"
                      style={{ borderRight: "1px solid var(--color-border)" }}
                    >
                      <Icon className="size-4" />
                    </span>
                    <span className="px-4 py-2.5">
                      <span className="block text-[9px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                        {label}
                      </span>
                      <span className="mt-0.5 block text-sm font-medium text-foreground">
                        {value}
                      </span>
                    </span>
                  </a>
                ))}
              </Reveal>
            )
          })()}
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── Form + sidebar ── */}
      <section className="relative border-b py-14 lg:px-16 lg:py-16">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <div className="grid grid-cols-1 border lg:grid-cols-[1.5fr_1fr]">
          {/* Form */}
          <Reveal
            as="form"
            onSubmit={onSubmit}
            className="relative flex flex-col gap-5 p-5 sm:p-8 lg:border-r lg:p-9"
          >
            <DecorIcon className="size-2" position="top-left" />
            <DecorIcon className="size-2" position="bottom-right" />

            <div>
              <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                Escríbenos
              </span>
              <TechHeading
                as="h2"
                text="Cuéntanos en qué podemos ayudarte."
                className="mt-2.5 text-2xl leading-[1.1] font-extrabold tracking-[-0.015em] text-foreground"
              />
            </div>

            {/* Selector de tipo */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-foreground">
                Tipo de trámite
              </label>
              <div className="flex flex-wrap gap-2">
                {FORM_TYPES.map((t) => (
                  <button
                    type="button"
                    key={t.value}
                    onClick={() => changeType(t.value)}
                    className={cn(
                      "h-8 border px-3 text-xs font-medium transition-colors",
                      formType === t.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-transparent text-foreground hover:border-primary"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Campos por tipo */}
            <FormFields
              formType={formType}
              register={register}
              control={control}
              roster={roster}
              errors={formState.errors}
            />

            {/* Firma */}
            {activeMeta.hasSignature && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Firma
                </label>
                <Controller
                  control={control}
                  name="firma"
                  render={({ field }) => (
                    <SignaturePad
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  )}
                />
                <FieldError error={formState.errors.firma} />
              </div>
            )}

            {formState.isSubmitted && !formState.isValid && (
              <p className="text-sm text-red-500">
                Revisa los campos marcados antes de enviar.
              </p>
            )}
            {serverError && (
              <p className="text-sm text-red-500">{serverError}</p>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  required
                  defaultChecked
                  className="accent-primary"
                />
                Acepto el tratamiento de datos según la política UNAL.
              </label>
              <Button type="submit" size="lg" disabled={formState.isSubmitting}>
                {sent
                  ? "¡Enviado ✓"
                  : formState.isSubmitting
                    ? "Enviando…"
                    : "Enviar"}{" "}
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          </Reveal>

          {/* Sidebar */}
          <Reveal
            as="aside"
            index={1}
            className="flex flex-col gap-6 bg-background p-5 sm:p-7 lg:p-8"
          >
            <div
              className="border bg-card p-5"
              style={{
                boxShadow:
                  "5px 5px 0 0 color-mix(in srgb, var(--color-border) 60%, transparent)",
              }}
            >
              <span className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                <span className="h-1.5 w-1.5 rounded-none bg-primary" />
                Tiempo de respuesta
              </span>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                Promedio{" "}
                <strong className="text-foreground">≤ 36 h hábiles</strong> por
                correo institucional. Reservas confirmadas en ≤ 2 días hábiles.
              </p>
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
                También puedes
              </span>
              <div className="mt-3.5 flex flex-col gap-2.5">
                <Link href="/tecnologias">
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="size-3.5" /> Reservar equipo
                    directamente
                  </Button>
                </Link>
                <a href="https://unal.edu.co" target="_blank" rel="noreferrer">
                  <Button variant="outline" className="w-full justify-start">
                    <GlobeIcon className="size-3.5" /> unal.edu.co
                  </Button>
                </a>
                {contact.email && (
                  <a href={`mailto:${contact.email}`}>
                    <Button variant="outline" className="w-full justify-start">
                      <MailIcon className="size-3.5" /> {contact.email}
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        </div>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── Mapa ── */}
      <section className="relative border-b py-14 lg:px-16 lg:py-16" id="mapa">
        <DecorIcon className="size-3" position="top-left" />
        <DecorIcon className="size-3" position="top-right" />

        <Reveal as="div" className="mb-6 px-8 lg:px-0">
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            Cómo llegar
          </span>
          <TechHeading
            as="h2"
            text="Museo Interactivo Samoga, segundo piso."
            className="mt-3.5 text-3xl leading-[1.05] font-extrabold tracking-[-0.015em] text-foreground"
          />
          <p className="mt-2 text-sm text-muted-foreground">
            Entrada por la portería principal del museo, Sede Manizales de la
            UNAL.
          </p>
        </Reveal>

        <Reveal
          as="div"
          index={1}
          className="grid grid-cols-1 border lg:grid-cols-[1.5fr_1fr]"
        >
          {/* SVG Map */}
          <div
            className="relative min-h-80 overflow-hidden border-b lg:border-r lg:border-b-0"
            style={{ background: "var(--color-muted)" }}
          >
            <MapSVG />
            {/* Pulse pin */}
            <div
              className="absolute"
              style={{
                top: "48%",
                left: "56%",
                width: 18,
                height: 18,
                background: "var(--color-primary)",
                border: "3px solid var(--color-background)",
                boxShadow: "0 0 0 2px var(--color-primary)",
                animation: "pulse-pin 1.8s ease-out infinite",
              }}
            />
            <div
              className="absolute border bg-card text-xs"
              style={{
                top: "52%",
                left: "min(58%, calc(100% - 172px))",
                width: 160,
                padding: "10px 12px",
                boxShadow:
                  "3px 3px 0 0 color-mix(in srgb, var(--color-border) 60%, transparent)",
                zIndex: 2,
              }}
            >
              <p className="m-0 text-[9px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                Sede
              </p>
              <p className="m-0 mt-1 text-sm font-bold text-foreground">
                Centro de Prototipado
              </p>
              <p className="m-0 text-xs text-muted-foreground">
                Samoga · 2do piso
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5 bg-card p-5 sm:p-7">
            {[
              {
                k: "Dirección",
                v: "Museo Interactivo Samoga · 2do piso\nSede Manizales · Universidad Nacional\nManizales, Caldas — Colombia",
              },
              { k: "Coordenadas", v: contact.coordinates },
              {
                k: "Transporte",
                v: "Cable Aéreo · estación Cámbulos\nBuses ruta UNAL · paradero principal",
              },
            ]
              .filter((r) => r.v)
              .map((r) => (
                <div key={r.k}>
                  <p className="m-0 mb-1.5 text-[10px] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                    {r.k}
                  </p>
                  <p className="m-0 text-sm leading-relaxed whitespace-pre-line text-foreground">
                    {r.v}
                  </p>
                </div>
              ))}
            <div className="mt-auto flex flex-wrap gap-2 pt-2">
              <a
                href="https://www.google.com/maps/search/?api=1&query=Museo+Interactivo+Samoga+Manizales"
                target="_blank"
                rel="noreferrer"
              >
                <Button variant="outline" size="sm">
                  Google Maps <ArrowRightIcon data-icon="inline-end" />
                </Button>
              </a>
              {contact.phone && (
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`}>
                  <Button variant="ghost" size="sm">
                    <PhoneIcon className="size-3.5" /> Llamar
                  </Button>
                </a>
              )}
            </div>
          </div>
        </Reveal>

        <DecorIcon className="size-3" position="bottom-left" />
        <DecorIcon className="size-3" position="bottom-right" />
      </section>

      {/* ── FAQ ── */}
      <FaqSection faq={faq} />

      <style>{`
        @keyframes pulse-pin {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-primary) 70%, transparent); }
          50% { box-shadow: 0 0 0 6px transparent; }
        }
      `}</style>
    </>
  )
}

const inputCls =
  "border bg-muted/20 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

type FieldsProps = {
  register: UseFormRegister<FormValues>
  control?: Control<FormValues>
  errors?: FieldErrors<FormValues>
}

function FieldError({ error }: { error?: { message?: string } }) {
  if (!error?.message) return null
  return <p className="text-xs text-red-500">{error.message}</p>
}

function Text({
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

function Area({
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

function Select({
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

function FormFields({
  formType,
  register,
  control,
  roster,
  errors,
}: FieldsProps & {
  formType: FormType
  roster: UseFieldArrayReturn<FormValues, "estudiantes">
}) {
  if (formType === "general") {
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

      {formType === "servicios" && (
        <ServiciosFields register={register} errors={errors} />
      )}
      {formType === "visita-docente" && (
        <VisitaDocenteFields register={register} errors={errors} />
      )}
      {formType === "visita-externo" && (
        <VisitaExternoFields register={register} errors={errors} />
      )}

      {(formType === "visita-docente" || formType === "visita-externo") &&
        control && (
          <RosterField roster={roster} register={register} errors={errors} />
        )}
    </>
  )
}

function ServiciosFields({ register, errors }: FieldsProps) {
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

function VisitaDocenteFields({ register, errors }: FieldsProps) {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        <Text
          label="Estudiantes previstos"
          name="estudiantesPrevistos"
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

function VisitaExternoFields({ register, errors }: FieldsProps) {
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
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
        <Text
          label="N.º de estudiantes"
          name="numeroEstudiantes"
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

function RosterField({
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

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function MapSVG() {
  return (
    <svg
      viewBox="0 0 800 450"
      className="block h-full w-full"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id="mg" width="32" height="32" patternUnits="userSpaceOnUse">
          <path
            d="M32 0L0 0 0 32"
            fill="none"
            stroke="var(--color-border)"
            strokeWidth="1"
          />
        </pattern>
        <pattern
          id="mh"
          width="12"
          height="12"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="12"
            stroke="var(--color-border)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="800" height="450" fill="var(--color-muted)" />
      <rect width="800" height="450" fill="url(#mg)" />
      <g
        fill="none"
        stroke="var(--color-border)"
        strokeWidth="1.2"
        opacity="0.7"
      >
        <path d="M-20 200 Q100 170 250 190 T520 220 T820 200" />
        <path d="M-20 240 Q120 210 280 235 T540 270 T820 250" />
        <path d="M-20 280 Q140 260 310 280 T580 310 T820 300" />
      </g>
      <path
        d="M0 370 C200 350 320 410 500 380 S720 350 800 360"
        fill="none"
        stroke="var(--color-primary)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        opacity="0.5"
      />
      <rect
        x="370"
        y="150"
        width="120"
        height="80"
        fill="url(#mh)"
        stroke="var(--color-border)"
        strokeWidth="1"
        opacity="0.6"
      />
      <rect
        x="190"
        y="110"
        width="75"
        height="48"
        fill="url(#mh)"
        stroke="var(--color-border)"
        strokeWidth="1"
        opacity="0.4"
      />
      <g stroke="var(--color-border)" fill="none" strokeWidth="1.4">
        <line x1="0" y1="195" x2="800" y2="215" />
        <line x1="110" y1="0" x2="360" y2="450" />
        <line x1="505" y1="0" x2="655" y2="450" />
      </g>
      <g fill="var(--color-muted-foreground)" fontSize="9" letterSpacing="1">
        <text x="190" y="128" fontFamily="monospace">
          SAMOGA
        </text>
        <text x="382" y="168" fontFamily="monospace">
          SEDE UNAL
        </text>
        <text x="42" y="185" fontFamily="monospace">
          CL 30
        </text>
        <text x="630" y="54" textAnchor="end" fontFamily="monospace">
          N ↑
        </text>
      </g>
    </svg>
  )
}

function FaqSection({ faq }: { faq: FaqItem[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  if (faq.length === 0) return null
  return (
    <section
      className="relative border-b px-8 py-14 lg:px-16 lg:py-16"
      id="faq"
    >
      <DecorIcon className="size-3" position="top-left" />
      <DecorIcon className="size-3" position="top-right" />
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.6fr]">
        <Reveal as="div">
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            FAQ
          </span>
          <TechHeading
            as="h2"
            text="Preguntas frecuentes."
            className="mt-3.5 text-3xl leading-[1.05] font-extrabold tracking-[-0.015em] text-foreground"
          />
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Todo lo que sueles preguntarte antes de contactarnos.
          </p>
        </Reveal>
        <Reveal as="div" index={1} className="border bg-card">
          {faq.map((f, i) => (
            <div key={i} className="border-b last:border-b-0">
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/20"
              >
                <span className="text-sm font-semibold text-foreground">
                  {f.q}
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center border text-lg leading-none transition-transform",
                    openIdx === i
                      ? "rotate-45 border-primary bg-primary text-primary-foreground"
                      : ""
                  )}
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {openIdx === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.4, bounce: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </Reveal>
      </div>
      <DecorIcon className="size-3" position="bottom-left" />
      <DecorIcon className="size-3" position="bottom-right" />
    </section>
  )
}
