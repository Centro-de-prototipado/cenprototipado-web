# Formularios de Contacto Multi-tipo — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactorizar `/contacto` para manejar 4 tipos de formulario (Contacto general, Solicitud de Servicios, Visita Docente UNAL, Visita Externo STEM), con firma dibujada y roster de estudiantes, que al enviarse generan un PDF y lo mandan por Resend al Centro (reply-to al solicitante) además de registrar una fila en Notion.

**Architecture:** Un formulario cliente (`contacto-client.tsx`) con selector de tipo y render dinámico de campos manejado por `react-hook-form` + `zod`. El envío llama a una Server Action que valida, genera un PDF con `@react-pdf/renderer`, y en paralelo envía el email (Resend) y crea la fila en Notion. Las unidades de lógica pura (schemas, mapeo a Notion, asunto del email) se prueban con Vitest; UI/PDF/email se verifican manualmente.

**Tech Stack:** Next.js 16 (App Router, Server Actions), React 19, TypeScript, Tailwind v4, `react-hook-form` + `zod`, `resend` + `@react-email/components`, `@react-pdf/renderer`, `@notionhq/client` (API data sources 2025-09-03), Vitest.

## Global Constraints

- Package manager es **pnpm** — instalar deps con `pnpm add` desde `apps/web`.
- Server Components por defecto; solo `"use client"` para interactividad (hooks/eventos).
- Estilado: Tailwind v4 + `cn()` de `@/lib/utils`. Alias `@/*` mapea a la raíz de la app.
- Copiar/pegar del código existente: usar `Button` de `@/components/ui/button`, patrón de `lib/notion/*`.
- Notion API es la versión **data sources 2025-09-03**: crear páginas con `notion.pages.create({ parent: { type: "data_source_id", data_source_id }, properties })`.
- Idioma de UI y textos: **Español** con acentos correctos.
- No romper el resto de `/contacto` (hero, mapa, FAQ): solo se refactoriza el bloque del formulario.
- Secretos solo por env (`.env.local`), nunca hardcodeados.

---

### Task 1: Dependencias + configuración de Vitest

**Files:**
- Modify: `apps/web/package.json` (deps + script `test`)
- Create: `apps/web/vitest.config.ts`
- Create: `apps/web/lib/forms/__tests__/smoke.test.ts` (test de humo, se borra al final del task)

**Interfaces:**
- Produces: script `pnpm test` funcional en `apps/web`; deps `zod`, `react-hook-form`, `@hookform/resolvers`, `resend`, `@react-email/components`, `@react-pdf/renderer`, `vitest` disponibles.

- [ ] **Step 1: Instalar dependencias de runtime**

Desde `apps/web`:
```bash
pnpm add zod react-hook-form @hookform/resolvers resend @react-email/components @react-pdf/renderer
```

- [ ] **Step 2: Instalar Vitest (dev)**

```bash
pnpm add -D vitest
```

- [ ] **Step 3: Crear `apps/web/vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config"
import { resolve } from "node:path"

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/__tests__/**/*.test.ts", "**/*.test.ts"],
  },
  resolve: {
    // El alias "@/*" mapea a la raíz de apps/web (mismo que tsconfig).
    alias: { "@": resolve(__dirname, ".") },
  },
})
```

- [ ] **Step 4: Añadir script `test` a `apps/web/package.json`**

En `"scripts"`, agregar:
```json
"test": "vitest run"
```

- [ ] **Step 5: Crear test de humo `apps/web/lib/forms/__tests__/smoke.test.ts`**

```ts
import { expect, test } from "vitest"

test("vitest está configurado", () => {
  expect(1 + 1).toBe(2)
})
```

- [ ] **Step 6: Ejecutar y verificar que pasa**

Run: `pnpm test`
Expected: PASS (1 test).

- [ ] **Step 7: Borrar el test de humo y commit**

```bash
rm apps/web/lib/forms/__tests__/smoke.test.ts
git add apps/web/package.json apps/web/vitest.config.ts apps/web/pnpm-lock.yaml ../../pnpm-lock.yaml 2>/dev/null
git commit -m "chore: agrega deps de formularios (zod, resend, react-pdf) y Vitest"
```

---

### Task 2: Schemas zod y configuración declarativa de formularios

**Files:**
- Create: `apps/web/lib/forms/schemas.ts`
- Create: `apps/web/lib/forms/config.ts`
- Test: `apps/web/lib/forms/__tests__/schemas.test.ts`

**Interfaces:**
- Produces:
  - `FormType = "general" | "servicios" | "visita-docente" | "visita-externo"`
  - `type StudentRow = { nombre: string; documento: string; correo: string }`
  - Schemas: `generalSchema`, `serviciosSchema`, `visitaDocenteSchema`, `visitaExternoSchema` (todos `z.ZodType`).
  - `schemaFor(type: FormType): z.ZodType` y tipos inferidos `GeneralData`, `ServiciosData`, `VisitaDocenteData`, `VisitaExternoData`, y union `SolicitudData`.
  - `MAQUINARIA: readonly string[]`, `TIPO_USUARIO: readonly string[]`, `NIVEL_FORMACION: readonly string[]`.
  - `FORM_TYPES: { value: FormType; label: string; hasSignature: boolean; hasRoster: boolean }[]`.

- [ ] **Step 1: Escribir el test que falla `apps/web/lib/forms/__tests__/schemas.test.ts`**

```ts
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
```

- [ ] **Step 2: Ejecutar para ver que falla**

Run: `pnpm test schemas`
Expected: FAIL ("Cannot find module '@/lib/forms/schemas'").

- [ ] **Step 3: Implementar `apps/web/lib/forms/schemas.ts`**

```ts
import { z } from "zod"

export type FormType = "general" | "servicios" | "visita-docente" | "visita-externo"

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
  maquinaria: z.array(z.enum(MAQUINARIA)).min(1, "Selecciona al menos un equipo"),
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
  estudiantesPrevistos: z.coerce.number().int().nonnegative().optional(),
  numeroGrupos: z.coerce.number().int().nonnegative().optional(),
  acompanantes: z.coerce.number().int().nonnegative().optional(),
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
  numeroEstudiantes: z.coerce.number().int().nonnegative().optional(),
  numeroGrupos: z.coerce.number().int().nonnegative().optional(),
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
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `pnpm test schemas`
Expected: PASS (4 tests).

- [ ] **Step 5: Crear `apps/web/lib/forms/config.ts`**

```ts
import type { FormType } from "./schemas"

export const FORM_TYPES: {
  value: FormType
  label: string
  hasSignature: boolean
  hasRoster: boolean
}[] = [
  { value: "general", label: "Contacto general", hasSignature: false, hasRoster: false },
  { value: "servicios", label: "Solicitud de Servicios", hasSignature: true, hasRoster: false },
  { value: "visita-docente", label: "Visita Docente UNAL", hasSignature: true, hasRoster: true },
  { value: "visita-externo", label: "Visita Externo (STEM)", hasSignature: true, hasRoster: true },
]

export const LABEL_BY_TYPE: Record<FormType, string> = Object.fromEntries(
  FORM_TYPES.map((f) => [f.value, f.label]),
) as Record<FormType, string>
```

- [ ] **Step 6: Verificar typecheck y commit**

Run: `pnpm typecheck`
Expected: sin errores nuevos en `lib/forms/*`.
```bash
git add apps/web/lib/forms
git commit -m "feat: schemas zod y config de formularios de contacto multi-tipo"
```

---

### Task 3: Capa de escritura a Notion + mapeo a propiedades

**Files:**
- Create: `apps/web/lib/notion/solicitudes.ts`
- Test: `apps/web/lib/notion/__tests__/solicitudes.test.ts`
- Modify: `apps/web/lib/notion/client.ts` (agregar id de la DB `Solicitudes`)

**Interfaces:**
- Consumes: `SolicitudData`, `LABEL_BY_TYPE` (Task 2); `notion` client (`lib/notion/client.ts`).
- Produces:
  - `buildSolicitudProperties(data: SolicitudData): Record<string, unknown>` — mapea el formulario a propiedades de Notion (función pura, testeable).
  - `crearSolicitud(data: SolicitudData): Promise<void>` — crea la página vía `notion.pages.create`.

- [ ] **Step 1: Escribir el test que falla `apps/web/lib/notion/__tests__/solicitudes.test.ts`**

```ts
import { describe, expect, test } from "vitest"
import { buildSolicitudProperties } from "@/lib/notion/solicitudes"

describe("buildSolicitudProperties", () => {
  test("general mapea título, tipo, correo como mailto y estado inicial", () => {
    const props = buildSolicitudProperties({
      type: "general",
      nombre: "María Gómez",
      correo: "maria@correo.com",
      afiliacion: "",
      telefono: "",
      mensaje: "Hola",
    }) as any
    expect(props.Nombre.title[0].text.content).toBe("María Gómez")
    expect(props.Tipo.select.name).toBe("Contacto general")
    expect(props.Correo.url).toBe("mailto:maria@correo.com")
    expect(props.Estado.select.name).toBe("Nuevo")
  })

  test("visita-docente incluye resumen del roster con el conteo", () => {
    const props = buildSolicitudProperties({
      type: "visita-docente",
      nombre: "Prof",
      documento: "1",
      correo: "p@c.com",
      telefono: "",
      asignatura: "Física",
      codigoSia: "",
      programa: "",
      nivel: "Pregrado",
      fecha: "2026-08-01",
      horario: "9am",
      firma: "data:image/png;base64,AAAA",
      estudiantes: [
        { nombre: "Ana", documento: "9", correo: "ana@c.com" },
        { nombre: "Luis", documento: "8", correo: "luis@c.com" },
      ],
    }) as any
    expect(props.Roster.rich_text[0].text.content).toContain("2 estudiantes")
    expect(props.Roster.rich_text[0].text.content).toContain("Ana")
  })
})
```

- [ ] **Step 2: Ejecutar para ver que falla**

Run: `pnpm test solicitudes`
Expected: FAIL ("Cannot find module '@/lib/notion/solicitudes'").

- [ ] **Step 3: Agregar el id de la DB en `apps/web/lib/notion/client.ts`**

Dentro del objeto `DATA_SOURCES`, agregar (id real se rellena en Task 9 vía env):
```ts
  solicitudes:
    process.env.NOTION_SOLICITUDES_DATA_SOURCE_ID || "",
```

- [ ] **Step 4: Implementar `apps/web/lib/notion/solicitudes.ts`**

```ts
import { DATA_SOURCES, notion } from "./client"
import { LABEL_BY_TYPE } from "@/lib/forms/config"
import type { SolicitudData } from "@/lib/forms/schemas"

const richText = (content: string) =>
  content ? { rich_text: [{ text: { content: content.slice(0, 1900) } }] } : { rich_text: [] }

function rosterSummary(data: SolicitudData): string {
  if (data.type !== "visita-docente" && data.type !== "visita-externo") return ""
  const n = data.estudiantes.length
  const nombres = data.estudiantes.map((e) => e.nombre).join(", ")
  return `${n} estudiante${n === 1 ? "" : "s"}: ${nombres}`
}

function detalle(data: SolicitudData): string {
  switch (data.type) {
    case "general":
      return data.mensaje
    case "servicios":
      return `Tipo usuario: ${data.tipoUsuario}\nMaquinaria: ${data.maquinaria.join(", ")}\nProyecto: ${data.proyecto}\nDescripción: ${data.descripcion}\nMateriales: ${data.materiales}`
    case "visita-docente":
      return `Asignatura: ${data.asignatura}\nNivel: ${data.nivel}\nFecha: ${data.fecha} ${data.horario}\n${data.descripcion}`
    case "visita-externo":
      return `Institución: ${data.institucion} (${data.ciudad})\nFecha: ${data.fecha} ${data.horario}\n${data.descripcion}\n${data.observaciones}`
  }
}

export function buildSolicitudProperties(data: SolicitudData): Record<string, unknown> {
  const telefono = "telefono" in data ? data.telefono : ""
  return {
    Nombre: { title: [{ text: { content: data.nombre } }] },
    Tipo: { select: { name: LABEL_BY_TYPE[data.type] } },
    Correo: { url: `mailto:${data.correo}` },
    Teléfono: telefono ? { phone_number: telefono } : { phone_number: null },
    Estado: { select: { name: "Nuevo" } },
    Detalle: richText(detalle(data)),
    Roster: richText(rosterSummary(data)),
  }
}

export async function crearSolicitud(data: SolicitudData): Promise<void> {
  await notion.pages.create({
    parent: { type: "data_source_id", data_source_id: DATA_SOURCES.solicitudes },
    properties: buildSolicitudProperties(data) as never,
  })
}
```

- [ ] **Step 5: Ejecutar y verificar que pasa**

Run: `pnpm test solicitudes`
Expected: PASS (2 tests).

- [ ] **Step 6: Commit**

```bash
git add apps/web/lib/notion/solicitudes.ts apps/web/lib/notion/client.ts apps/web/lib/notion/__tests__
git commit -m "feat: escritura de solicitudes a Notion con mapeo de propiedades"
```

---

### Task 4: Capa de email (Resend) + asunto

**Files:**
- Create: `apps/web/lib/email/client.ts`
- Create: `apps/web/lib/email/solicitud-email.tsx`
- Test: `apps/web/lib/email/__tests__/subject.test.ts`

**Interfaces:**
- Consumes: `SolicitudData`, `LABEL_BY_TYPE` (Task 2).
- Produces:
  - `subjectFor(data: SolicitudData): string`
  - `SolicitudEmail(props: { data: SolicitudData }): JSX.Element` — cuerpo react-email.
  - `enviarSolicitudEmail(args: { data: SolicitudData; pdf?: Buffer }): Promise<void>`

- [ ] **Step 1: Escribir el test que falla `apps/web/lib/email/__tests__/subject.test.ts`**

```ts
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
```

- [ ] **Step 2: Ejecutar para ver que falla**

Run: `pnpm test subject`
Expected: FAIL ("Cannot find module '@/lib/email/solicitud-email'").

- [ ] **Step 3: Implementar `apps/web/lib/email/solicitud-email.tsx`**

```tsx
import { Html, Body, Container, Heading, Text, Hr } from "@react-email/components"
import { LABEL_BY_TYPE } from "@/lib/forms/config"
import type { SolicitudData } from "@/lib/forms/schemas"

export function subjectFor(data: SolicitudData): string {
  const ref =
    data.type === "visita-externo"
      ? data.institucion
      : "proyecto" in data && data.proyecto
        ? data.proyecto
        : "asignatura" in data && data.asignatura
          ? data.asignatura
          : ""
  return `[${LABEL_BY_TYPE[data.type]}] ${data.nombre}${ref ? ` — ${ref}` : ""}`
}

export function SolicitudEmail({ data }: { data: SolicitudData }) {
  const rows: [string, string][] = [
    ["Tipo", LABEL_BY_TYPE[data.type]],
    ["Nombre", data.nombre],
    ["Correo", data.correo],
  ]
  if ("telefono" in data && data.telefono) rows.push(["Teléfono", data.telefono])
  return (
    <Html>
      <Body style={{ fontFamily: "sans-serif", color: "#111" }}>
        <Container>
          <Heading as="h2">Nueva {LABEL_BY_TYPE[data.type]}</Heading>
          {rows.map(([k, v]) => (
            <Text key={k} style={{ margin: "2px 0" }}>
              <strong>{k}:</strong> {v}
            </Text>
          ))}
          <Hr />
          <Text>
            {data.type === "general"
              ? data.mensaje
              : "Ver el PDF adjunto con el detalle completo del formulario y la firma."}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
```

- [ ] **Step 4: Ejecutar y verificar que pasa**

Run: `pnpm test subject`
Expected: PASS (1 test).

- [ ] **Step 5: Implementar `apps/web/lib/email/client.ts`**

```ts
import { Resend } from "resend"
import { render } from "@react-email/components"
import { SolicitudEmail, subjectFor } from "./solicitud-email"
import type { SolicitudData } from "@/lib/forms/schemas"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function enviarSolicitudEmail({
  data,
  pdf,
}: {
  data: SolicitudData
  pdf?: Buffer
}): Promise<void> {
  const html = await render(<SolicitudEmail data={data} />)
  await resend.emails.send({
    from: process.env.RESEND_FROM as string,
    to: process.env.CONTACT_TO_EMAIL as string,
    replyTo: data.correo,
    subject: subjectFor(data),
    html,
    attachments: pdf
      ? [{ filename: `solicitud-${data.type}.pdf`, content: pdf }]
      : undefined,
  })
}
```

> Nota: `client.ts` usa JSX (`<SolicitudEmail />`), así que debe tener extensión `.tsx`. Renómbralo a `apps/web/lib/email/client.tsx`.

- [ ] **Step 6: Corregir extensión y typecheck**

```bash
mv apps/web/lib/email/client.ts apps/web/lib/email/client.tsx
```
Run: `pnpm typecheck`
Expected: sin errores en `lib/email/*`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/lib/email
git commit -m "feat: envío de solicitudes por email con Resend + plantilla react-email"
```

---

### Task 5: Generación de PDF

**Files:**
- Create: `apps/web/lib/pdf/solicitud-pdf.tsx`

**Interfaces:**
- Consumes: `SolicitudData`, `LABEL_BY_TYPE`.
- Produces: `renderSolicitudPdf(data: SolicitudData): Promise<Buffer>`

- [ ] **Step 1: Implementar `apps/web/lib/pdf/solicitud-pdf.tsx`**

```tsx
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer"
import { LABEL_BY_TYPE } from "@/lib/forms/config"
import type { SolicitudData } from "@/lib/forms/schemas"

const s = StyleSheet.create({
  page: { padding: 32, fontSize: 10, fontFamily: "Helvetica" },
  h1: { fontSize: 16, marginBottom: 4, fontFamily: "Helvetica-Bold" },
  sub: { fontSize: 9, color: "#555", marginBottom: 12 },
  row: { flexDirection: "row", marginBottom: 3 },
  key: { width: 140, fontFamily: "Helvetica-Bold" },
  val: { flex: 1 },
  sectionTitle: { marginTop: 12, marginBottom: 4, fontFamily: "Helvetica-Bold", fontSize: 11 },
  th: { flexDirection: "row", borderBottom: 1, paddingBottom: 2, fontFamily: "Helvetica-Bold" },
  td: { flexDirection: "row", paddingVertical: 2, borderBottom: 0.5, borderColor: "#ccc" },
  cell: { flex: 1, paddingRight: 4 },
  firma: { width: 180, height: 70, marginTop: 6, borderTop: 1, paddingTop: 4 },
})

function entries(data: SolicitudData): [string, string][] {
  const base: [string, string][] = [["Nombre", data.nombre], ["Correo", data.correo]]
  if ("documento" in data) base.push(["Documento", data.documento])
  if ("telefono" in data && data.telefono) base.push(["Teléfono", data.telefono])
  switch (data.type) {
    case "general":
      return [...base, ["Afiliación", data.afiliacion], ["Mensaje", data.mensaje]]
    case "servicios":
      return [
        ...base,
        ["Tipo de usuario", data.tipoUsuario],
        ["Programa", data.programa],
        ["Proyecto", data.proyecto],
        ["Líder responsable", data.liderResponsable],
        ["Asignatura", data.asignatura],
        ["Maquinaria", data.maquinaria.join(", ")],
        ["Descripción", data.descripcion],
        ["Materiales", data.materiales],
      ]
    case "visita-docente":
      return [
        ...base,
        ["Asignatura", data.asignatura],
        ["Código SIA", data.codigoSia],
        ["Programa", data.programa],
        ["Nivel", data.nivel],
        ["Fecha", `${data.fecha} ${data.horario}`],
        ["Estudiantes previstos", String(data.estudiantesPrevistos ?? "")],
        ["Grupos", String(data.numeroGrupos ?? "")],
        ["Descripción", data.descripcion],
        ["Equipos", data.equipos],
      ]
    case "visita-externo":
      return [
        ...base,
        ["Asignatura", data.asignatura],
        ["Institución", data.institucion],
        ["Ciudad", data.ciudad],
        ["Fecha", `${data.fecha} ${data.horario}`],
        ["N.º estudiantes", String(data.numeroEstudiantes ?? "")],
        ["Grupos", String(data.numeroGrupos ?? "")],
        ["Descripción", data.descripcion],
        ["Observaciones", data.observaciones],
      ]
  }
}

export async function renderSolicitudPdf(data: SolicitudData): Promise<Buffer> {
  const roster =
    data.type === "visita-docente" || data.type === "visita-externo" ? data.estudiantes : []
  const firma = "firma" in data ? data.firma : ""
  const doc = (
    <Document>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>{LABEL_BY_TYPE[data.type]}</Text>
        <Text style={s.sub}>Centro de Prototipado — UNAL · {new Date().toLocaleString("es-CO")}</Text>
        {entries(data)
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <View style={s.row} key={k}>
              <Text style={s.key}>{k}</Text>
              <Text style={s.val}>{v}</Text>
            </View>
          ))}
        {roster.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Estudiantes ({roster.length})</Text>
            <View style={s.th}>
              <Text style={s.cell}>Nombre</Text>
              <Text style={s.cell}>Documento</Text>
              <Text style={s.cell}>Correo</Text>
            </View>
            {roster.map((e, i) => (
              <View style={s.td} key={i}>
                <Text style={s.cell}>{e.nombre}</Text>
                <Text style={s.cell}>{e.documento}</Text>
                <Text style={s.cell}>{e.correo}</Text>
              </View>
            ))}
          </View>
        )}
        {firma && (
          <View>
            <Text style={s.sectionTitle}>Firma del solicitante</Text>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={firma} style={s.firma} />
          </View>
        )}
      </Page>
    </Document>
  )
  return renderToBuffer(doc)
}
```

- [ ] **Step 2: Verificar typecheck**

Run: `pnpm typecheck`
Expected: sin errores en `lib/pdf/*`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/lib/pdf
git commit -m "feat: generación de PDF del formulario firmado con react-pdf"
```

---

### Task 6: Componente de firma (canvas)

**Files:**
- Create: `apps/web/components/ui/signature-pad.tsx`

**Interfaces:**
- Produces: `SignaturePad(props: { value: string; onChange: (dataUrl: string) => void; className?: string }): JSX.Element` — canvas donde se dibuja; llama `onChange` con el dataURL PNG al soltar; botón "Limpiar" que llama `onChange("")`.

- [ ] **Step 1: Implementar `apps/web/components/ui/signature-pad.tsx`**

```tsx
"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function SignaturePad({
  value,
  onChange,
  className,
}: {
  value: string
  onChange: (dataUrl: string) => void
  className?: string
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(Boolean(value))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.strokeStyle = "#111"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
  }, [])

  const pos = (e: React.PointerEvent) => {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const start = (e: React.PointerEvent) => {
    drawing.current = true
    const ctx = canvasRef.current!.getContext("2d")!
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    ;(e.target as Element).setPointerCapture(e.pointerId)
  }
  const move = (e: React.PointerEvent) => {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext("2d")!
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasInk(true)
  }
  const end = () => {
    if (!drawing.current) return
    drawing.current = false
    onChange(canvasRef.current!.toDataURL("image/png"))
  }
  const clear = () => {
    const canvas = canvasRef.current!
    canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
    onChange("")
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <canvas
        ref={canvasRef}
        width={480}
        height={140}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="w-full touch-none border bg-muted/20"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {hasInk ? "Firma capturada" : "Dibuja tu firma en el recuadro"}
        </span>
        <button type="button" onClick={clear} className="text-xs text-primary underline">
          Limpiar
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verificar typecheck y commit**

Run: `pnpm typecheck`
Expected: sin errores.
```bash
git add apps/web/components/ui/signature-pad.tsx
git commit -m "feat: componente de firma en canvas"
```

---

### Task 7: Server Action de envío

**Files:**
- Create: `apps/web/app/(marketing)/contacto/actions.ts`

**Interfaces:**
- Consumes: `schemaFor`, `FormType`, `SolicitudData` (Task 2); `renderSolicitudPdf` (Task 5); `enviarSolicitudEmail` (Task 4); `crearSolicitud` (Task 3).
- Produces: `submitSolicitud(raw: unknown): Promise<{ ok: true } | { ok: false; error: string }>`

- [ ] **Step 1: Implementar `apps/web/app/(marketing)/contacto/actions.ts`**

```ts
"use server"

import { schemaFor, type FormType, type SolicitudData } from "@/lib/forms/schemas"
import { renderSolicitudPdf } from "@/lib/pdf/solicitud-pdf"
import { enviarSolicitudEmail } from "@/lib/email/client"
import { crearSolicitud } from "@/lib/notion/solicitudes"

const FORM_TYPES: FormType[] = ["general", "servicios", "visita-docente", "visita-externo"]

export async function submitSolicitud(
  raw: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const type = (raw as { type?: string })?.type
  if (!type || !FORM_TYPES.includes(type as FormType)) {
    return { ok: false, error: "Tipo de formulario inválido." }
  }

  const parsed = schemaFor(type as FormType).safeParse(raw)
  if (!parsed.success) {
    return { ok: false, error: "Revisa los campos del formulario." }
  }
  const data = parsed.data as SolicitudData

  try {
    const pdf =
      data.type === "general" ? undefined : await renderSolicitudPdf(data)
    await Promise.all([enviarSolicitudEmail({ data, pdf }), crearSolicitud(data)])
    return { ok: true }
  } catch (err) {
    console.error("submitSolicitud error", err)
    return { ok: false, error: "No pudimos enviar tu solicitud. Intenta de nuevo." }
  }
}
```

- [ ] **Step 2: Verificar typecheck y commit**

Run: `pnpm typecheck`
Expected: sin errores.
```bash
git add "apps/web/app/(marketing)/contacto/actions.ts"
git commit -m "feat: server action submitSolicitud (valida, PDF, email, Notion)"
```

---

### Task 8: Refactor de `contacto-client.tsx` (selector + campos dinámicos + roster + firma)

**Files:**
- Modify: `apps/web/components/sections/contacto-client.tsx:16-181` (selector, estado y bloque `<form>`; el resto de la página se conserva)

**Interfaces:**
- Consumes: `FORM_TYPES`, `LABEL_BY_TYPE` (Task 2 config); `schemaFor`, tipos (Task 2); `SignaturePad` (Task 6); `submitSolicitud` (Task 7); `Button` existente.
- Produces: UI funcional; sin exports nuevos.

- [ ] **Step 1: Reemplazar imports y estado del componente**

En la parte superior de `contacto-client.tsx`, reemplazar la línea `const queryTypes = [...]` (línea 16) y el bloque de estado (líneas 25-26) por el uso de `react-hook-form`. Agregar imports:

```tsx
import { useForm, useFieldArray, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FORM_TYPES } from "@/lib/forms/config"
import { schemaFor, type FormType } from "@/lib/forms/schemas"
import { SignaturePad } from "@/components/ui/signature-pad"
import { submitSolicitud } from "@/app/(marketing)/contacto/actions"
```

Dentro del componente, reemplazar `const [sent, setSent] = useState(false)` y `const [queryType, setQueryType] = useState(...)` por:

```tsx
const [formType, setFormType] = useState<FormType>("general")
const [sent, setSent] = useState(false)
const [serverError, setServerError] = useState("")

const form = useForm({
  resolver: zodResolver(schemaFor(formType)),
  defaultValues: { type: formType } as Record<string, unknown>,
})
const { register, handleSubmit, control, reset, formState } = form
const roster = useFieldArray({ control, name: "estudiantes" })

const activeMeta = FORM_TYPES.find((f) => f.value === formType)!

const changeType = (t: FormType) => {
  setFormType(t)
  setServerError("")
  reset({ type: t })
}

const onSubmit = handleSubmit(async (values) => {
  const res = await submitSolicitud({ ...values, type: formType })
  if (res.ok) setSent(true)
  else setServerError(res.error)
})
```

- [ ] **Step 2: Reemplazar el `<form>` (líneas ~109-181) por el formulario dinámico**

Sustituir el `Reveal as="form"` completo (el `onSubmit` viejo y sus hijos) por:

```tsx
<Reveal
  as="form"
  onSubmit={onSubmit}
  className="relative flex flex-col gap-5 p-5 sm:p-8 lg:border-r lg:p-9"
>
  <DecorIcon className="size-2" position="top-left" />
  <DecorIcon className="size-2" position="bottom-right" />

  <div>
    <span className="text-[11px] font-semibold tracking-[0.24em] text-muted-foreground uppercase">Escríbenos</span>
    <TechHeading
      as="h2"
      text="Cuéntanos en qué podemos ayudarte."
      className="mt-2.5 text-2xl font-extrabold leading-[1.1] tracking-[-0.015em] text-foreground"
    />
  </div>

  {/* Selector de tipo */}
  <div className="flex flex-col gap-2">
    <label className="text-xs font-semibold text-foreground">Tipo de trámite</label>
    <div className="flex flex-wrap gap-2">
      {FORM_TYPES.map((t) => (
        <button
          type="button"
          key={t.value}
          onClick={() => changeType(t.value)}
          className={cn(
            "h-8 px-3 text-xs font-medium border transition-colors",
            formType === t.value
              ? "bg-primary text-primary-foreground border-primary"
              : "bg-transparent text-foreground border-border hover:border-primary",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  </div>

  {/* Campos por tipo */}
  <FormFields formType={formType} register={register} control={control} roster={roster} errors={formState.errors} />

  {/* Firma */}
  {activeMeta.hasSignature && (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-foreground">Firma</label>
      <Controller
        control={control}
        name="firma"
        render={({ field }) => <SignaturePad value={field.value ?? ""} onChange={field.onChange} />}
      />
    </div>
  )}

  {serverError && <p className="text-sm text-red-500">{serverError}</p>}

  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
    <label className="flex items-center gap-2 text-xs text-muted-foreground">
      <input type="checkbox" required defaultChecked className="accent-primary" />
      Acepto el tratamiento de datos según la política UNAL.
    </label>
    <Button type="submit" size="lg" disabled={formState.isSubmitting}>
      {sent ? "¡Enviado ✓" : formState.isSubmitting ? "Enviando…" : "Enviar"} <ArrowRightIcon data-icon="inline-end" />
    </Button>
  </div>
</Reveal>
```

- [ ] **Step 3: Añadir el subcomponente `FormFields` al final del archivo**

Agregar (antes de `CalendarIcon`), con los inputs por tipo. Usa clases de input idénticas a las actuales (extráelas a una constante `inputCls` reutilizable):

```tsx
const inputCls =
  "border bg-muted/20 px-3 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"

function Text({ label, name, register, type = "text", placeholder }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <input type={type} className={inputCls} placeholder={placeholder} {...register(name)} />
    </div>
  )
}

function Area({ label, name, register, placeholder }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <textarea className={cn(inputCls, "min-h-24 resize-y leading-relaxed")} placeholder={placeholder} {...register(name)} />
    </div>
  )
}

function FormFields({ formType, register, control, roster, errors }: any) {
  if (formType === "general") {
    return (
      <>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Text label="Nombre completo" name="nombre" register={register} placeholder="María Gómez" />
          <Text label="Correo" name="correo" type="email" register={register} placeholder="tu@correo.com" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Text label="Afiliación" name="afiliacion" register={register} placeholder="UNAL · Estudiante / Empresa…" />
          <Text label="Teléfono (opcional)" name="telefono" register={register} placeholder="+57 300 000 0000" />
        </div>
        <Area label="Mensaje" name="mensaje" register={register} placeholder="Cuéntanos sobre tu proyecto…" />
      </>
    )
  }
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text label="Nombre completo" name="nombre" register={register} placeholder="María Gómez" />
        <Text label="Documento de identidad" name="documento" register={register} placeholder="1053…" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text label="Correo" name="correo" type="email" register={register} placeholder="tu@correo.com" />
        <Text label="Teléfono" name="telefono" register={register} placeholder="+57 300 000 0000" />
      </div>

      {formType === "servicios" && <ServiciosFields register={register} />}
      {formType === "visita-docente" && <VisitaDocenteFields register={register} />}
      {formType === "visita-externo" && <VisitaExternoFields register={register} />}

      {(formType === "visita-docente" || formType === "visita-externo") && (
        <RosterField roster={roster} register={register} />
      )}
    </>
  )
}
```

- [ ] **Step 4: Añadir los grupos de campos específicos y el roster**

Agregar los subcomponentes `ServiciosFields`, `VisitaDocenteFields`, `VisitaExternoFields` y `RosterField`. Importar `MAQUINARIA`, `TIPO_USUARIO`, `NIVEL_FORMACION` desde `@/lib/forms/schemas`.

```tsx
import { MAQUINARIA, TIPO_USUARIO, NIVEL_FORMACION } from "@/lib/forms/schemas"

function Select({ label, name, options, register }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-foreground">{label}</label>
      <select className={inputCls} {...register(name)}>
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  )
}

function ServiciosFields({ register }: any) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text label="Programa / Dependencia" name="programa" register={register} />
        <Select label="Tipo de usuario" name="tipoUsuario" options={TIPO_USUARIO} register={register} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text label="Proyecto / Práctica" name="proyecto" register={register} />
        <Text label="Docente o líder responsable" name="liderResponsable" register={register} />
      </div>
      <Text label="Asignatura (si aplica)" name="asignatura" register={register} />
      <Area label="¿Qué desea fabricar/realizar?" name="descripcion" register={register} />
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-foreground">Maquinaria / Equipos</label>
        <div className="grid grid-cols-2 gap-1.5">
          {MAQUINARIA.map((m) => (
            <label key={m} className="flex items-center gap-2 text-xs text-foreground">
              <input type="checkbox" value={m} className="accent-primary" {...register("maquinaria")} /> {m}
            </label>
          ))}
        </div>
      </div>
      <Area label="Materiales requeridos" name="materiales" register={register} />
    </>
  )
}

function VisitaDocenteFields({ register }: any) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text label="Asignatura / Proyecto" name="asignatura" register={register} />
        <Text label="Código SIA (si aplica)" name="codigoSia" register={register} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text label="Programa curricular" name="programa" register={register} />
        <Select label="Nivel de formación" name="nivel" options={NIVEL_FORMACION} register={register} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Text label="Fecha propuesta" name="fecha" type="date" register={register} />
        <Text label="Horario" name="horario" register={register} />
        <Text label="Estudiantes previstos" name="estudiantesPrevistos" type="number" register={register} />
      </div>
      <Area label="Descripción de la actividad" name="descripcion" register={register} />
      <Area label="Equipos o materiales requeridos" name="equipos" register={register} />
    </>
  )
}

function VisitaExternoFields({ register }: any) {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text label="Institución educativa" name="institucion" register={register} />
        <Text label="Ciudad" name="ciudad" register={register} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Text label="Asignatura (si aplica)" name="asignatura" register={register} />
        <Text label="Código asignatura (si aplica)" name="codigoAsignatura" register={register} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Text label="Fecha de la visita" name="fecha" type="date" register={register} />
        <Text label="Horario" name="horario" register={register} />
        <Text label="N.º de estudiantes" name="numeroEstudiantes" type="number" register={register} />
      </div>
      <Area label="Descripción de la actividad" name="descripcion" register={register} />
      <Area label="Observaciones adicionales" name="observaciones" register={register} />
    </>
  )
}

function RosterField({ roster, register }: any) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-foreground">Estudiantes que asistirán</label>
        <button
          type="button"
          onClick={() => roster.append({ nombre: "", documento: "", correo: "" })}
          className="text-xs text-primary underline"
        >
          + Agregar estudiante
        </button>
      </div>
      {roster.fields.length === 0 && (
        <p className="text-xs text-muted-foreground">Agrega al menos un estudiante.</p>
      )}
      {roster.fields.map((f: any, i: number) => (
        <div key={f.id} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2">
          <input className={inputCls} placeholder="Nombre" {...register(`estudiantes.${i}.nombre`)} />
          <input className={inputCls} placeholder="Documento" {...register(`estudiantes.${i}.documento`)} />
          <input className={inputCls} placeholder="Correo" {...register(`estudiantes.${i}.correo`)} />
          <button type="button" onClick={() => roster.remove(i)} className="px-2 text-muted-foreground hover:text-red-500">×</button>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Verificar typecheck y lint**

Run: `pnpm typecheck && pnpm lint`
Expected: sin errores. (Si lint marca `any` en props de subcomponentes, dejar los tipos explícitos mínimos que el linter exija; el objetivo es que compile y pase lint.)

- [ ] **Step 6: Commit**

```bash
git add apps/web/components/sections/contacto-client.tsx
git commit -m "feat: formulario de contacto multi-tipo con campos dinámicos, roster y firma"
```

---

### Task 9: Env, creación de la DB de Notion y verificación end-to-end

**Files:**
- Modify: `apps/web/.env.local` (variables nuevas)
- Modify: `apps/web/ARCHITECTURE.md` (documentar la DB `Solicitudes` y el flujo)

**Interfaces:**
- Consumes: todo lo anterior.
- Produces: feature verificada en dev.

- [ ] **Step 1: Crear la DB `Solicitudes` en Notion (cuenta `centrodeprototipado`)**

Usar el skill `mcp-integrations` (vía Executor) para crear una data source `Solicitudes` con propiedades:
`Nombre` (title), `Tipo` (select: Contacto general · Solicitud de Servicios · Visita Docente UNAL · Visita Externo (STEM)), `Correo` (url), `Teléfono` (phone), `Estado` (select: Nuevo · En proceso · Atendido), `Detalle` (rich text), `Roster` (rich text), `Creado` (created time). Compartir la DB con el integration de escritura y anotar su `data_source_id`.

- [ ] **Step 2: Rellenar `apps/web/.env.local`**

Agregar (valores reales):
```
RESEND_API_KEY=re_...
RESEND_FROM="Centro de Prototipado <noreply@TU-DOMINIO-VERIFICADO>"
CONTACT_TO_EMAIL=correo-del-centro@gmail.com
NOTION_SOLICITUDES_DATA_SOURCE_ID=...
```
Confirmar que `NOTION_TOKEN` tiene acceso de escritura a la DB (o usar un token con ese permiso).

- [ ] **Step 3: Levantar dev y probar cada tipo**

Run: `pnpm dev` (desde `apps/web`).
Verificar manualmente en `http://localhost:3000/contacto`:
- Cambiar entre los 4 tipos: los campos cambian; la firma aparece solo en los 3 estructurados; el roster solo en las visitas.
- Enviar **Contacto general** → llega email (sin PDF) + fila en Notion.
- Enviar **Solicitud de Servicios** firmado → llega email con PDF que incluye la firma + fila en Notion.
- Enviar **Visita Docente** con 2 estudiantes → PDF con la tabla del roster + resumen del roster en Notion.
- Verificar que **Responder** en el correo va al solicitante (reply-to correcto).

- [ ] **Step 4: Configurar la automatización de Notion → Gmail**

En Notion, en la DB `Solicitudes`, crear una automatización "Cuando se agrega página → notificar" al Gmail del Centro (o @mención a un miembro). Documentar limitación si el plan no permite email a Gmail externo (Resend sigue siendo el canal primario).

- [ ] **Step 5: Documentar en `apps/web/ARCHITECTURE.md`**

Agregar una sección breve: la DB `Solicitudes`, sus propiedades, el flujo `submitSolicitud` (PDF → Resend + Notion), y las variables de entorno nuevas.

- [ ] **Step 6: Verificación final y commit**

Run: `pnpm typecheck && pnpm lint && pnpm test && pnpm build`
Expected: todo verde.
```bash
git add apps/web/ARCHITECTURE.md
git commit -m "docs: documenta flujo de solicitudes de contacto y DB Solicitudes"
```

---

## Notas de verificación (spec coverage)

- 4 tipos de formulario → Task 2 (schemas/config) + Task 8 (UI).
- Firma en canvas (3 estructurados) → Task 6 + Task 8.
- Roster de estudiantes en visitas → Task 2 (schema) + Task 8 (`RosterField`) + Task 5 (PDF).
- Envío por Resend con PDF + reply-to → Task 4 + Task 5 + Task 7.
- Registro en Notion (mailto, sin PDF) → Task 3 + Task 7.
- Contacto general sin firma/PDF → Task 7 (rama `type === "general"`) + Task 8.
- Fuera de alcance (Participación, Acta Vinculación, asistencia firmada en sitio) → no hay tasks (correcto).
- Dependencias externas (Resend verificado, token Notion escritura, automatización) → Task 9.
