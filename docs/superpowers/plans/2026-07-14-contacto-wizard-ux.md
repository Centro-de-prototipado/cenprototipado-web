# Wizard por pasos (UX) para `/contacto` — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convertir el formulario de `/contacto` de una sola pantalla larga en un wizard por pasos (stepper híbrido) con validación por paso, transiciones animadas, un paso final de "Revisar y enviar", estado de éxito y guardado de borrador en `localStorage` — sin cambiar la lógica de envío, los schemas ni la firma.

**Architecture:** Se extrae el formulario a un nuevo módulo `components/sections/contacto/`: primitivas de campo (`fields.tsx`), barra de progreso (`stepper.tsx`) y el wizard (`contact-wizard.tsx`). La definición de pasos por tipo (`lib/forms/steps.ts`) y el borrador (`lib/forms/draft.ts`) son módulos con lógica pura testeable. `contacto-client.tsx` queda como shell de página (hero/mapa/FAQ) que renderiza `<ContactWizard>`. La validación por paso usa `trigger(campos)` de react-hook-form con el mapeo declarativo paso→campos.

**Tech Stack:** Next.js 16 (client component), React 19, react-hook-form + zod (ya presentes), `motion` (framer-motion, ya presente), Tailwind v4, Vitest.

## Global Constraints

- Package manager **pnpm**; comandos (`pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm build`) **desde `apps/web`**.
- Client component (`"use client"`) para el wizard; `cn()` de `@/lib/utils`; alias `@/*` = raíz de `apps/web`.
- **NO cambiar**: `submitSolicitud` (`app/(marketing)/contacto/actions.ts`), PDF, email, Notion, los schemas (`lib/forms/schemas.ts`), config (`lib/forms/config.ts`) ni `SignaturePad`.
- **Conservar intactos** el hero, el mapa (`MapSVG`) y el FAQ (`FaqSection`) de `contacto-client.tsx`.
- Reutilizar los campos/nombres existentes (definidos por los schemas): no renombrar campos.
- Idioma UI: **Español** con acentos correctos. Estilo Tailwind consistente con el formulario actual (reusar `inputCls`).
- Respetar `prefers-reduced-motion` en las animaciones.
- El borrador **excluye** el campo `firma`.
- Lint sin warnings en archivos nuevos/tocados (autofix con `pnpm exec eslint --fix`). El repo tiene 5 errores `react-hooks/set-state-in-effect` PRE-EXISTENTES en archivos ajenos (theme-toggle, hero-robot-gate, portal, tech-heading, use-mobile) — NO son de esta feature, no tocarlos.

---

### Task 1: Definición declarativa de pasos (`lib/forms/steps.ts`)

**Files:**
- Create: `apps/web/lib/forms/steps.ts`
- Test: `apps/web/lib/forms/__tests__/steps.test.ts`

**Interfaces:**
- Consumes: `FormType` (`@/lib/forms/schemas`).
- Produces:
  - `type StepDef = { id: string; label: string; fields: string[]; kind: "fields" | "roster" | "signature" | "review" }`
  - `stepsFor(type: FormType): StepDef[]`
  - `ALL_STEP_FIELDS: Record<FormType, string[]>` (unión de todos los `fields` de los pasos de tipo, para tests).

- [ ] **Step 1: Escribir el test que falla `apps/web/lib/forms/__tests__/steps.test.ts`**

```ts
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
    expect(s.map((x) => x.kind)).toEqual(["fields", "fields", "signature", "review"])
    expect(s[0].fields).toContain("tipoUsuario")
    expect(s[1].fields).toContain("maquinaria")
  })

  test("visita-docente: datos, detalles, roster, firma, revisar (5 pasos)", () => {
    const s = stepsFor("visita-docente")
    expect(s.map((x) => x.kind)).toEqual(["fields", "fields", "roster", "signature", "review"])
    expect(s[2].fields).toContain("estudiantes")
  })

  test("visita-externo: 5 pasos con roster y captura codigoAsignatura", () => {
    const s = stepsFor("visita-externo")
    expect(s).toHaveLength(5)
    expect(s[1].fields).toContain("codigoAsignatura")
  })
})
```

- [ ] **Step 2: Ejecutar para ver que falla**

Run: `pnpm test steps`
Expected: FAIL ("Cannot find module '@/lib/forms/steps'").

- [ ] **Step 3: Implementar `apps/web/lib/forms/steps.ts`**

```ts
import type { FormType } from "@/lib/forms/schemas"

export type StepKind = "fields" | "roster" | "signature" | "review"
export type StepDef = { id: string; label: string; fields: string[]; kind: StepKind }

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
    { id: "datos", label: "Tus datos", kind: "fields", fields: [...COMMON, "programa", "tipoUsuario"] },
    {
      id: "detalles",
      label: "Detalles",
      kind: "fields",
      fields: ["proyecto", "liderResponsable", "asignatura", "descripcion", "maquinaria", "materiales"],
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
        "asignatura", "codigoSia", "programa", "nivel", "fecha", "horario",
        "estudiantesPrevistos", "numeroGrupos", "acompanantes", "descripcion", "equipos",
      ],
    },
    { id: "estudiantes", label: "Estudiantes", kind: "roster", fields: ["estudiantes"] },
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
        "asignatura", "codigoAsignatura", "institucion", "ciudad", "fecha", "horario",
        "numeroEstudiantes", "numeroGrupos", "descripcion", "observaciones",
      ],
    },
    { id: "estudiantes", label: "Estudiantes", kind: "roster", fields: ["estudiantes"] },
    { id: "firma", label: "Firma", kind: "signature", fields: ["firma"] },
    { id: "revisar", label: "Revisar y enviar", kind: "review", fields: [] },
  ],
}

export function stepsFor(type: FormType): StepDef[] {
  return STEPS[type]
}

export const ALL_STEP_FIELDS: Record<FormType, string[]> = Object.fromEntries(
  (Object.keys(STEPS) as FormType[]).map((t) => [t, STEPS[t].flatMap((s) => s.fields)]),
) as Record<FormType, string[]>
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `pnpm test steps`
Expected: PASS (4 tests).

- [ ] **Step 5: Verificar typecheck y commit**

Run: `pnpm typecheck`
```bash
git add apps/web/lib/forms/steps.ts apps/web/lib/forms/__tests__/steps.test.ts
git commit -m "feat: definición declarativa de pasos del wizard de contacto"
```

---

### Task 2: Persistencia de borrador (`lib/forms/draft.ts`)

**Files:**
- Create: `apps/web/lib/forms/draft.ts`
- Test: `apps/web/lib/forms/__tests__/draft.test.ts`

**Interfaces:**
- Consumes: `FormType`.
- Produces:
  - `type DraftState = { type: FormType; step: number; values: Record<string, unknown> }`
  - `loadDraft(): DraftState | null` — devuelve null si no hay/ inválido / sin `window`.
  - `saveDraft(state: DraftState): void` — persiste excluyendo la clave `firma` de `values`.
  - `clearDraft(): void`
  - `DRAFT_KEY = "contacto-draft"`

- [ ] **Step 1: Escribir el test que falla `apps/web/lib/forms/__tests__/draft.test.ts`**

```ts
import { describe, expect, test, beforeEach, vi } from "vitest"
import { loadDraft, saveDraft, clearDraft } from "@/lib/forms/draft"

// jsdom no está activo por defecto (environment: node); simulamos localStorage.
beforeEach(() => {
  const store: Record<string, string> = {}
  vi.stubGlobal("window", {})
  vi.stubGlobal("localStorage", {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v },
    removeItem: (k: string) => { delete store[k] },
  })
})

describe("draft", () => {
  test("save + load round-trip", () => {
    saveDraft({ type: "servicios", step: 2, values: { nombre: "Ana" } })
    expect(loadDraft()).toEqual({ type: "servicios", step: 2, values: { nombre: "Ana" } })
  })

  test("save excluye la firma", () => {
    saveDraft({ type: "servicios", step: 1, values: { nombre: "Ana", firma: "data:image/png;base64,AAA" } })
    const d = loadDraft()
    expect(d?.values.firma).toBeUndefined()
    expect(d?.values.nombre).toBe("Ana")
  })

  test("clear elimina el borrador", () => {
    saveDraft({ type: "general", step: 0, values: { mensaje: "hola" } })
    clearDraft()
    expect(loadDraft()).toBeNull()
  })

  test("load devuelve null si el JSON es inválido", () => {
    localStorage.setItem("contacto-draft", "{ no json")
    expect(loadDraft()).toBeNull()
  })
})
```

- [ ] **Step 2: Ejecutar para ver que falla**

Run: `pnpm test draft`
Expected: FAIL ("Cannot find module '@/lib/forms/draft'").

- [ ] **Step 3: Implementar `apps/web/lib/forms/draft.ts`**

```ts
import type { FormType } from "@/lib/forms/schemas"

export const DRAFT_KEY = "contacto-draft"

export type DraftState = {
  type: FormType
  step: number
  values: Record<string, unknown>
}

const hasStorage = () => typeof window !== "undefined" && !!window.localStorage

export function saveDraft(state: DraftState): void {
  if (!hasStorage()) return
  // Nunca persistir la firma (imagen grande y sensible).
  const { firma: _firma, ...values } = state.values
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ ...state, values }))
  } catch {
    // Cuota llena o storage no disponible: ignorar (el borrador es best-effort).
  }
}

export function loadDraft(): DraftState | null {
  if (!hasStorage()) return null
  const raw = localStorage.getItem(DRAFT_KEY)
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== "object" || !parsed.type) return null
    return parsed as DraftState
  } catch {
    return null
  }
}

export function clearDraft(): void {
  if (!hasStorage()) return
  localStorage.removeItem(DRAFT_KEY)
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `pnpm test draft`
Expected: PASS (4 tests).

- [ ] **Step 5: Verificar typecheck y commit**

Run: `pnpm typecheck`
```bash
git add apps/web/lib/forms/draft.ts apps/web/lib/forms/__tests__/draft.test.ts
git commit -m "feat: persistencia de borrador del formulario en localStorage"
```

---

### Task 3: Extraer primitivas de campo a `components/sections/contacto/fields.tsx`

**Files:**
- Create: `apps/web/components/sections/contacto/fields.tsx`
- Modify: `apps/web/components/sections/contacto-client.tsx` (mover las primitivas y los grupos de campos; importarlos desde el nuevo archivo)

**Interfaces:**
- Produces (exportadas desde `fields.tsx`): `inputCls` (string), `FieldError`, `Text`, `Area`, `Select`, `RosterField`, `FieldsProps` (tipo), y los grupos `ServiciosFields`, `VisitaDocenteFields`, `VisitaExternoFields`, `GeneralFields`, `DatosComunes`. Todas con las mismas firmas que hoy.

> Esta task es una **extracción sin cambio de comportamiento**: mover código, no reescribirlo. El
> objetivo es que `fields.tsx` exporte las primitivas y grupos, y que `contacto-client.tsx` los
> importe. Al final `pnpm build` debe seguir pasando idéntico.

- [ ] **Step 1: Crear `apps/web/components/sections/contacto/fields.tsx` moviendo las primitivas**

Mover verbatim desde `contacto-client.tsx` a este archivo (con `"use client"` al tope): `inputCls`,
`FieldError`, `Text`, `Area`, `Select`, `RosterField`, el tipo `FieldsProps`, y los grupos
`ServiciosFields`, `VisitaDocenteFields`, `VisitaExternoFields`. Exportar todas (`export function`/`export const`).
Añadir imports que necesiten: `cn`, `Controller`/tipos de `react-hook-form`, `SignaturePad` (si algún
grupo lo usa), `MAQUINARIA`/`TIPO_USUARIO`/`NIVEL_FORMACION` de `@/lib/forms/schemas`.

Además, extraer de la función `FormFields` los dos sub-bloques reutilizables como componentes
exportados nuevos, para que el wizard arme cada paso:
- `GeneralFields({ register, errors })` — los campos de `general` (nombre, correo, afiliacion, telefono, mensaje).
- `DatosComunes({ register, errors })` — nombre, documento, correo, telefono (usado por el paso «Tus datos» de servicios y visitas).

```tsx
"use client"

import { Controller, type UseFormRegister, type Control, type FieldErrors } from "react-hook-form"
import { SignaturePad } from "@/components/ui/signature-pad"
import { MAQUINARIA, TIPO_USUARIO, NIVEL_FORMACION } from "@/lib/forms/schemas"
import { cn } from "@/lib/utils"

export const inputCls =
  "border bg-muted/20 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

// … (mover aquí FieldError, Text, Area, Select, RosterField, FieldsProps,
//     ServiciosFields, VisitaDocenteFields, VisitaExternoFields sin cambios) …

export function GeneralFields({ register, errors }: FieldsProps) {
  return (/* los campos de general extraídos de FormFields */)
}

export function DatosComunes({ register, errors }: FieldsProps) {
  return (/* nombre, documento, correo, telefono extraídos de FormFields */)
}
```

> El agente debe copiar el cuerpo real de estos componentes desde `contacto-client.tsx` (líneas de
> `FieldError`, `Text`, `Area`, `Select`, `RosterField`, `ServiciosFields`, `VisitaDocenteFields`,
> `VisitaExternoFields`) — no inventarlos. Para `GeneralFields`/`DatosComunes`, extraer los bloques
> correspondientes del cuerpo actual de `FormFields`.

- [ ] **Step 2: Actualizar `contacto-client.tsx` para importar desde `fields.tsx`**

Borrar de `contacto-client.tsx` las definiciones movidas y `import`arlas desde
`@/components/sections/contacto/fields`. Mantener por ahora la función `FormFields` local, pero
reescrita para usar `GeneralFields`/`DatosComunes`/grupos importados (comportamiento idéntico). El
`<form>` de una sola pantalla sigue funcionando igual — esta task no cambia UX.

- [ ] **Step 3: Verificar typecheck, lint y build (sin cambio de comportamiento)**

Run (desde `apps/web`):
```bash
pnpm typecheck
pnpm exec eslint --fix components/sections/contacto/fields.tsx components/sections/contacto-client.tsx
pnpm lint components/sections/contacto/fields.tsx components/sections/contacto-client.tsx
pnpm build
```
Expected: typecheck limpio, lint sin warnings en esos archivos, build exit 0.

- [ ] **Step 4: Commit**

```bash
git add apps/web/components/sections/contacto/fields.tsx apps/web/components/sections/contacto-client.tsx
git commit -m "refactor: extrae primitivas y grupos de campos a components/sections/contacto/fields"
```

---

### Task 4: Componente de barra de progreso (`stepper.tsx`)

**Files:**
- Create: `apps/web/components/sections/contacto/stepper.tsx`

**Interfaces:**
- Consumes: `StepDef` (`@/lib/forms/steps`).
- Produces: `Stepper({ steps, current, onStepClick }: { steps: StepDef[]; current: number; onStepClick: (i: number) => void }): JSX.Element` — dots + etiquetas; marca completados (`< current`), activo (`=== current`, `aria-current="step"`) y futuros (deshabilitados). `onStepClick` solo se invoca para pasos ya visitados (`i <= current`). Compacto en móvil ("Paso N de M" + barra).

- [ ] **Step 1: Implementar `apps/web/components/sections/contacto/stepper.tsx`**

```tsx
"use client"

import type { StepDef } from "@/lib/forms/steps"
import { cn } from "@/lib/utils"

export function Stepper({
  steps,
  current,
  onStepClick,
}: {
  steps: StepDef[]
  current: number
  onStepClick: (i: number) => void
}) {
  return (
    <nav aria-label="Progreso del formulario" className="flex flex-col gap-2">
      {/* Móvil: texto + barra */}
      <div className="flex items-center justify-between sm:hidden">
        <span className="text-xs font-semibold text-foreground">
          Paso {current + 1} de {steps.length}
        </span>
        <span className="text-xs text-muted-foreground">{steps[current]?.label}</span>
      </div>
      <div className="h-1 w-full bg-muted sm:hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((current + 1) / steps.length) * 100}%` }}
        />
      </div>

      {/* Desktop: dots con etiquetas */}
      <ol className="hidden items-center gap-1 sm:flex">
        {steps.map((s, i) => {
          const done = i < current
          const active = i === current
          const clickable = i <= current
          return (
            <li key={s.id} className="flex flex-1 items-center gap-1">
              <button
                type="button"
                disabled={!clickable}
                aria-current={active ? "step" : undefined}
                onClick={() => clickable && onStepClick(i)}
                className={cn(
                  "flex items-center gap-2 text-left",
                  clickable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                )}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center border text-xs font-semibold transition-colors",
                    active && "border-primary bg-primary text-primary-foreground",
                    done && "border-primary bg-primary/10 text-primary",
                    !active && !done && "border-border text-muted-foreground",
                  )}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={cn(
                    "text-xs font-medium",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {s.label}
                </span>
              </button>
              {i < steps.length - 1 && <span className="h-px flex-1 bg-border" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
```

- [ ] **Step 2: Verificar typecheck/lint y commit**

Run: `pnpm typecheck && pnpm lint components/sections/contacto/stepper.tsx`
```bash
git add apps/web/components/sections/contacto/stepper.tsx
git commit -m "feat: barra de progreso del wizard de contacto"
```

---

### Task 5: El wizard (`contact-wizard.tsx`)

**Files:**
- Create: `apps/web/components/sections/contacto/contact-wizard.tsx`

**Interfaces:**
- Consumes: `stepsFor`, `StepDef` (steps); `loadDraft`/`saveDraft`/`clearDraft` (draft); `FORM_TYPES` (config); `schemaFor`, `FormType` (schemas); primitivas y grupos de `fields.tsx`; `Stepper`; `SignaturePad`; `submitSolicitud`; `Button`.
- Produces: `ContactWizard(): JSX.Element` — el formulario completo por pasos (sin hero/mapa/FAQ).

- [ ] **Step 1: Implementar `apps/web/components/sections/contacto/contact-wizard.tsx`**

Estado y lógica:
- `phase`: `"choose"` (paso 0, elegir trámite) | `"form"` | `"success"`.
- `formType`, `stepIndex`. `steps = stepsFor(formType)`.
- `react-hook-form` con el mismo resolver dinámico que hoy (copiar el patrón `currentTypeRef` + wrapper `resolver` de `contacto-client.tsx`).
- Al montar: `loadDraft()` → si hay, restaura `formType`, `stepIndex`, valores (via `reset(values)`), y `phase="form"`.
- `useEffect` que hace `saveDraft({ type: formType, step: stepIndex, values: watch() })` con debounce (~500 ms) cuando cambian valores/paso (usar `form.watch` + `useEffect`/timeout). Respetar guard SSR.
- `next()`: valida los campos del paso actual con `await form.trigger(steps[stepIndex].fields as never)`; si ok, `stepIndex++`. Para el paso `roster`/`signature` validar sus `fields`.
- `back()`: `stepIndex--` sin validar.
- `goTo(i)`: solo si `i <= stepIndex`.
- `changeType(t)`: setFormType, `reset({ type: t })`, `stepIndex=0`, `clearDraft()` (nuevo trámite reemplaza borrador), `phase="form"`.
- Envío (en el paso `review`): `handleSubmit(async (values) => { const r = await submitSolicitud({ ...values, type: formType }); if (r.ok) { clearDraft(); setPhase("success") } else setServerError(r.error) })`.
- Render por `steps[stepIndex].kind`:
  - `fields`: según `formType`+`stepIndex` renderiza `GeneralFields` / `DatosComunes` / grupo de detalles (`ServiciosFields`, `VisitaDocenteFields`, `VisitaExternoFields` — que ya incluyen sus campos; para el paso «detalles» usar el grupo correspondiente; para «datos» usar `DatosComunes` + extras de servicios).
  - `roster`: `RosterField`.
  - `signature`: `SignaturePad` vía `Controller` + `FieldError`.
  - `review`: componente `ReviewSummary` (abajo) + checkbox consentimiento + botón Enviar.
- Navegación: botones «Atrás» (si `stepIndex>0` y no es `general`), «Siguiente» (si no es el último) o «Enviar» (en `review`/`general`).
- Transiciones: envolver el contenido del paso en `AnimatePresence` + `motion.div` con slide horizontal (`initial/animate/exit` con `x`), key = `stepIndex`. Respetar `prefers-reduced-motion` (hook `useReducedMotion` de `motion/react`): si está activo, sin desplazamiento (solo fade o nada).
- `phase="choose"`: tarjetas/botones de `FORM_TYPES` (reusar estilo de chips actual, o tarjetas). Al elegir → `changeType`.
- `phase="success"`: check animado + texto + botón «Enviar otra solicitud» (resetea todo, `clearDraft`, `phase="choose"`).

Incluir subcomponente `ReviewSummary({ type, values })` que lista etiqueta→valor de los campos del tipo (derivado de `stepsFor(type)` + `ALL_STEP_FIELDS`), miniatura de la firma (`<img src={values.firma}>` si existe) y conteo del roster.

> El agente debe reutilizar el patrón exacto del resolver dinámico de `contacto-client.tsx`
> (`currentTypeRef`, wrapper `resolver`, `FormValues = Record<string, any>`), y las primitivas de
> `fields.tsx`. Cuidar deps de `useEffect` (borrador) para no violar reglas de hooks; tipar props sin
> `any` salvo el `FormValues` del resolver ya justificado.

- [ ] **Step 2: Verificar typecheck y lint**

Run:
```bash
pnpm typecheck
pnpm exec eslint --fix components/sections/contacto/contact-wizard.tsx
pnpm lint components/sections/contacto/contact-wizard.tsx
```
Expected: typecheck limpio; lint sin errores/warnings.

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/sections/contacto/contact-wizard.tsx
git commit -m "feat: wizard por pasos de contacto (validación por paso, revisión, éxito, borrador)"
```

---

### Task 6: Integrar el wizard en `contacto-client.tsx`

**Files:**
- Modify: `apps/web/components/sections/contacto-client.tsx`

**Interfaces:**
- Consumes: `ContactWizard` (Task 5).
- Produces: `contacto-client.tsx` reducido a shell de página.

- [ ] **Step 1: Reemplazar el bloque del `<form>` por `<ContactWizard />`**

En `contacto-client.tsx`: importar `ContactWizard` de `@/components/sections/contacto/contact-wizard`
y reemplazar todo el `<Reveal as="form" …>…</Reveal>` (el formulario de una pantalla, incluida su
lógica de estado `useForm`/`resolver`/`onSubmit`/`changeType`/`activeMeta` y el selector de tipo) por
`<ContactWizard />` dentro del mismo contenedor/columna. Conservar el `<aside>` sidebar, el hero, el
mapa y el FAQ. Eliminar los imports y estado que ya no se usan (`useForm`, `useFieldArray`,
`Controller`, `zodResolver`, `schemaFor`, `MAQUINARIA`/`TIPO_USUARIO`/`NIVEL_FORMACION`,
`SignaturePad`, `submitSolicitud`, `FORM_TYPES`, `currentTypeRef`, etc.) y las funciones/componentes
locales ya movidos (`FormFields` y cualquier resto). Mantener `config`/`contact` para hero/mapa/sidebar.

- [ ] **Step 2: Verificar typecheck, lint y build**

Run (desde `apps/web`):
```bash
pnpm typecheck
pnpm exec eslint --fix components/sections/contacto-client.tsx
pnpm lint components/sections/contacto-client.tsx
pnpm test
pnpm build
```
Expected: typecheck limpio, lint sin warnings, tests pasan, build exit 0 (`/contacto` generada).

- [ ] **Step 3: Commit**

```bash
git add apps/web/components/sections/contacto-client.tsx
git commit -m "feat: /contacto usa el wizard por pasos (reemplaza el formulario de una pantalla)"
```

---

### Task 7: Accesibilidad, reduced-motion y verificación final

**Files:**
- Modify: `apps/web/components/sections/contacto/contact-wizard.tsx` (ajustes de a11y/foco/reduced-motion si la verificación los descubre)

**Interfaces:**
- Consumes: todo lo anterior.

- [ ] **Step 1: Manejo de foco al cambiar de paso**

En `contact-wizard.tsx`, al cambiar `stepIndex`, mover el foco al encabezado del paso (un `<h3>` con
`tabIndex={-1}` y `ref`, `focus()` en `useEffect([stepIndex])`), para que lectores de pantalla y
teclado sigan el flujo. Verificar que no rompe reglas de hooks (`pnpm lint`).

- [ ] **Step 2: Confirmar `prefers-reduced-motion`**

Verificar que con `useReducedMotion()` activo, las transiciones de paso no desplazan (sin animación
de `x`). Ajustar si hace falta.

- [ ] **Step 3: Verificación manual (dev)**

Run: `pnpm dev` (desde `apps/web`). En `http://localhost:3000/contacto` confirmar:
- Elegir trámite → entra al wizard; barra de progreso correcta por tipo.
- «Siguiente» bloquea el avance si el paso tiene campos inválidos (probar firma vacía y roster vacío).
- «Atrás» y clic en pasos ya visitados navegan sin validar.
- Recargar a mitad → restaura tipo/paso/valores; la firma se vuelve a pedir; «descartar borrador» limpia.
- Paso «Revisar» muestra resumen correcto (incl. miniatura de firma y conteo de roster).
- Enviar con datos válidos → paso de éxito; el borrador se borra; «enviar otra» resetea.
- Navegación por teclado y foco al cambiar de paso; con reduced-motion no hay slide.
- Hero, mapa, FAQ y sidebar intactos.

- [ ] **Step 4: Verificación final y commit**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: typecheck/tests/build verdes; lint sin errores nuevos de la feature (recordar: los 5 errores `set-state-in-effect` pre-existentes en archivos ajenos no cuentan).
```bash
git add apps/web/components/sections/contacto/contact-wizard.tsx
git commit -m "polish: foco por paso y reduced-motion en el wizard de contacto"
```

---

## Notas de verificación (spec coverage)

- Entrada por selección de trámite (paso 0) + «cambiar trámite» → Task 5 (`phase="choose"`, `changeType`).
- Pasos por tipo + validación por paso → Task 1 (steps) + Task 5 (`trigger(fields)`).
- Paso «Revisar y enviar» con resumen + consentimiento → Task 5 (`ReviewSummary`, `review`).
- Estado de éxito animado → Task 5 (`phase="success"`).
- Barra de progreso animada + reduced-motion → Task 4 (Stepper) + Task 5/7 (motion, useReducedMotion).
- Guardado de borrador (excluye firma, clave única, borrar al enviar/descartar) → Task 2 + Task 5.
- Accesibilidad (foco, aria-current, teclado, móvil) → Task 4 + Task 7.
- No cambia envío/schemas/firma; hero/mapa/FAQ intactos → Tasks 3/6 (extracción sin cambio; shell conservado).
- Extracción a módulo `components/sections/contacto/` para no engordar `contacto-client.tsx` → Tasks 3/4/5/6.
