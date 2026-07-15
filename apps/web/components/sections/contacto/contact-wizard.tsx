"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon } from "lucide-react"
import {
  useForm,
  useFieldArray,
  Controller,
  type Resolver,
} from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { SignaturePad } from "@/components/ui/signature-pad"
import { FORM_TYPES, LABEL_BY_TYPE } from "@/lib/forms/config"
import { schemaFor, type FormType } from "@/lib/forms/schemas"
import { submitSolicitud } from "@/app/(marketing)/contacto/actions"
import { stepsFor, ALL_STEP_FIELDS, type StepDef } from "@/lib/forms/steps"
import { loadDraft, saveDraft, clearDraft } from "@/lib/forms/draft"

import {
  DatosComunes,
  FieldError,
  GeneralFields,
  RosterField,
  ServiciosDatosExtra,
  ServiciosDetalles,
  VisitaDocenteFields,
  VisitaExternoFields,
  type FormValues,
} from "@/components/sections/contacto/fields"
import { Stepper } from "@/components/sections/contacto/stepper"

// Etiquetas legibles para el resumen de «Revisar y enviar».
const FIELD_LABELS: Record<string, string> = {
  nombre: "Nombre completo",
  documento: "Documento",
  correo: "Correo",
  telefono: "Teléfono",
  afiliacion: "Afiliación",
  mensaje: "Mensaje",
  programa: "Programa / Dependencia",
  tipoUsuario: "Tipo de usuario",
  proyecto: "Proyecto / Práctica",
  liderResponsable: "Docente o líder responsable",
  asignatura: "Asignatura",
  descripcion: "Descripción",
  maquinaria: "Maquinaria / Equipos",
  materiales: "Materiales",
  codigoSia: "Código SIA",
  nivel: "Nivel de formación",
  fecha: "Fecha",
  horario: "Horario",
  estudiantesPrevistos: "Estudiantes previstos",
  numeroGrupos: "Número de grupos",
  acompanantes: "Acompañantes",
  equipos: "Equipos / Materiales",
  codigoAsignatura: "Código asignatura",
  institucion: "Institución educativa",
  ciudad: "Ciudad",
  numeroEstudiantes: "N.º de estudiantes",
  observaciones: "Observaciones",
}

function formatValue(v: unknown): string | null {
  if (v === undefined || v === null || v === "") return null
  if (Array.isArray(v)) return v.length ? v.join(", ") : null
  return String(v)
}

function ReviewSummary({
  type,
  values,
}: {
  type: FormType
  values: FormValues
}) {
  const rows = ALL_STEP_FIELDS[type]
    .filter((f) => f !== "firma" && f !== "estudiantes")
    .map((f) => ({
      label: FIELD_LABELS[f] ?? f,
      value: formatValue(values[f]),
    }))
    .filter((r) => r.value !== null)

  const roster = Array.isArray(values.estudiantes) ? values.estudiantes : []
  const firma = typeof values.firma === "string" ? values.firma : ""

  return (
    <div className="flex flex-col gap-4">
      <dl className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col gap-0.5">
            <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
              {r.label}
            </dt>
            <dd className="m-0 text-sm break-words text-foreground">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>

      {roster.length > 0 && (
        <div className="flex flex-col gap-1 border-t pt-3">
          <span className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Estudiantes ({roster.length})
          </span>
          <span className="text-sm text-foreground">
            {roster
              .map((s: { nombre?: string }) => s?.nombre)
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>
      )}

      {firma && (
        <div className="flex flex-col gap-1 border-t pt-3">
          <span className="text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            Firma
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={firma}
            alt="Firma"
            className="h-20 w-auto border bg-white"
          />
        </div>
      )}
    </div>
  )
}

type Phase = "choose" | "form" | "success"

export function ContactWizard() {
  const [phase, setPhase] = useState<Phase>("choose")
  const [formType, setFormType] = useState<FormType>("general")
  const [stepIndex, setStepIndex] = useState(0)
  const [serverError, setServerError] = useState("")
  const [hasDraft, setHasDraft] = useState(false)

  // El resolver de zodResolver se captura en el primer render de useForm y no
  // se re-crea al cambiar `formType`; se envuelve en una función que lee el
  // tipo actual desde un ref y resuelve contra el schema correspondiente.
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
  const { register, control, reset, formState } = form
  const roster = useFieldArray({ control, name: "estudiantes" })

  const steps = stepsFor(formType)
  const step = steps[stepIndex]
  // react-hook-form es incompatible con la memoización del React Compiler; se
  // usa `watch()` a propósito para reaccionar a cambios de valores (guardado de
  // borrador y resumen en vivo). El warning del compilador es esperado.
  // eslint-disable-next-line react-hooks/incompatible-library
  const watched = form.watch()

  const reduce = useReducedMotion()
  const headingRef = useRef<HTMLHeadingElement>(null)

  // Restaurar borrador al montar (en microtask para no hidratar desde el
  // render SSR y evitar setState síncrono en el efecto).
  useEffect(() => {
    queueMicrotask(() => {
      const d = loadDraft()
      if (!d) return
      currentTypeRef.current = d.type
      const maxStep = stepsFor(d.type).length - 1
      setFormType(d.type)
      reset({ ...d.values, type: d.type })
      setStepIndex(Math.min(Math.max(d.step ?? 0, 0), maxStep))
      setHasDraft(true)
      setPhase("form")
    })
  }, [reset])

  // Persistir borrador (debounced) cuando cambian valores o paso.
  useEffect(() => {
    if (phase !== "form") return
    const id = setTimeout(() => {
      saveDraft({
        type: currentTypeRef.current,
        step: stepIndex,
        values: form.getValues(),
      })
      setHasDraft(true)
    }, 500)
    return () => clearTimeout(id)
  }, [phase, stepIndex, watched, form])

  const chooseType = (t: FormType) => {
    currentTypeRef.current = t
    setFormType(t)
    setServerError("")
    setStepIndex(0)
    reset({ type: t })
    clearDraft()
    setHasDraft(false)
    setPhase("form")
  }

  const changeTramite = () => {
    setServerError("")
    setStepIndex(0)
    reset({ type: formType })
    clearDraft()
    setHasDraft(false)
    setPhase("choose")
  }

  const discardDraft = () => {
    clearDraft()
    setHasDraft(false)
    setServerError("")
    setStepIndex(0)
    reset({ type: formType })
  }

  const next = async () => {
    const fields = steps[stepIndex].fields
    const ok = fields.length === 0 || (await form.trigger(fields as never))
    if (ok) setStepIndex((i) => Math.min(i + 1, steps.length - 1))
  }

  const back = () => setStepIndex((i) => Math.max(i - 1, 0))

  const goTo = (i: number) => {
    if (i <= stepIndex) setStepIndex(i)
  }

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError("")
    const res = await submitSolicitud({ ...values, type: formType })
    if (res.ok) {
      clearDraft()
      setHasDraft(false)
      setPhase("success")
    } else {
      setServerError(res.error)
    }
  })

  const resetAll = () => {
    reset({ type: "general" })
    currentTypeRef.current = "general"
    setFormType("general")
    setStepIndex(0)
    setServerError("")
    setHasDraft(false)
    clearDraft()
    setPhase("choose")
  }

  // ── Éxito ──
  if (phase === "success") {
    return (
      <div className="flex flex-col items-center gap-5 py-10 text-center">
        <motion.span
          initial={reduce ? { opacity: 0 } : { scale: 0.6, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.4 }}
          className="flex h-16 w-16 items-center justify-center border border-primary bg-primary/10 text-primary"
        >
          <CheckIcon className="size-8" />
        </motion.span>
        <div className="flex flex-col gap-1.5">
          <h3 className="m-0 text-xl font-extrabold tracking-[-0.015em] text-foreground">
            ¡Solicitud enviada!
          </h3>
          <p className="m-0 max-w-[42ch] text-sm text-muted-foreground">
            Recibimos tu solicitud. Te responderemos por correo institucional en
            ≤ 36 h hábiles.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={resetAll}>
          Enviar otra solicitud
        </Button>
      </div>
    )
  }

  // ── Selección de trámite (paso 0) ──
  if (phase === "choose") {
    return (
      <div className="flex flex-col gap-4">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">
            ¿Qué necesitas?
          </span>
          <h3 className="mt-2 text-lg font-bold text-foreground">
            Elige el tipo de trámite
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {FORM_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => chooseType(t.value)}
              className="group flex items-center justify-between border bg-card px-4 py-3.5 text-left transition-colors hover:border-primary"
            >
              <span className="text-sm font-semibold text-foreground">
                {t.label}
              </span>
              <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Formulario por pasos ──
  const isReview = step.kind === "review"
  const isGeneral = formType === "general"
  const submittable = isReview || isGeneral

  const variants = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -24 },
      }

  const renderStep = (s: StepDef) => {
    switch (s.kind) {
      case "fields":
        if (isGeneral) {
          return <GeneralFields register={register} errors={formState.errors} />
        }
        if (s.id === "datos") {
          return (
            <>
              <DatosComunes register={register} errors={formState.errors} />
              {formType === "servicios" && (
                <ServiciosDatosExtra
                  register={register}
                  errors={formState.errors}
                />
              )}
            </>
          )
        }
        // s.id === "detalles"
        if (formType === "servicios") {
          return (
            <ServiciosDetalles register={register} errors={formState.errors} />
          )
        }
        if (formType === "visita-docente") {
          return (
            <VisitaDocenteFields
              register={register}
              errors={formState.errors}
            />
          )
        }
        return (
          <VisitaExternoFields register={register} errors={formState.errors} />
        )
      case "roster":
        return (
          <RosterField
            roster={roster}
            register={register}
            errors={formState.errors}
          />
        )
      case "signature":
        return (
          <div className="flex flex-col gap-1.5">
            <p className="text-xs text-muted-foreground">
              Firma con el mouse o el dedo dentro del recuadro.
            </p>
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
        )
      case "review":
        return <ReviewSummary type={formType} values={watched} />
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      onKeyDown={(e) => {
        // Evita que Enter dispare el envío en pasos intermedios.
        if (
          e.key === "Enter" &&
          !submittable &&
          (e.target as HTMLElement).tagName !== "TEXTAREA"
        ) {
          e.preventDefault()
        }
      }}
      className="flex flex-col gap-5"
    >
      {/* Cabecera: trámite actual + cambiar */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-foreground">
          {LABEL_BY_TYPE[formType]}
        </span>
        <button
          type="button"
          onClick={changeTramite}
          className="text-xs text-primary underline underline-offset-2"
        >
          Cambiar trámite
        </button>
      </div>

      {/* Barra de progreso */}
      <Stepper steps={steps} current={stepIndex} onStepClick={goTo} />

      {/* Contenido del paso */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={stepIndex}
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-col gap-4"
        >
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="m-0 text-sm font-bold tracking-[-0.01em] text-foreground outline-none"
          >
            {step.label}
          </h3>
          {renderStep(step)}
        </motion.div>
      </AnimatePresence>

      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      {/* Consentimiento (solo en pasos de envío) */}
      {submittable && (
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            required
            defaultChecked
            className="accent-primary"
          />
          Acepto el tratamiento de datos según la política UNAL.
        </label>
      )}

      {/* Navegación */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-3">
          {stepIndex > 0 && !isGeneral && (
            <Button type="button" variant="outline" onClick={back}>
              <ArrowLeftIcon data-icon="inline-start" /> Atrás
            </Button>
          )}
          {hasDraft && (
            <button
              type="button"
              onClick={discardDraft}
              className="text-xs text-muted-foreground underline underline-offset-2 hover:text-red-500"
            >
              Descartar borrador
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {hasDraft && (
            <span className="text-[11px] text-muted-foreground">
              Borrador guardado
            </span>
          )}
          {submittable ? (
            <Button type="submit" size="lg" disabled={formState.isSubmitting}>
              {formState.isSubmitting ? "Enviando…" : "Enviar"}{" "}
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          ) : (
            <Button type="button" size="lg" onClick={next}>
              Siguiente <ArrowRightIcon data-icon="inline-end" />
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
