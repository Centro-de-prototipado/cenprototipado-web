# Diseño: Formularios de contacto multi-tipo en `/contacto`

**Fecha:** 2026-07-14
**App:** `apps/web` (`@cen/web`)
**Estado:** Aprobado — listo para plan de implementación

## Resumen

La página `/contacto` tiene hoy un único formulario hardcodeado (`components/sections/contacto-client.tsx`)
cuyo selector de "Tipo de consulta" es puramente decorativo (no cambia los campos) y cuyo envío solo hace
`setSent(true)` — sin backend, sin email, sin persistencia.

Refactorizamos ese formulario para manejar **4 tipos de formulario** según la ocasión, portando 3 de los formatos
que el Centro usaba antes (`C:/Users/STEM/Desktop/Code/Otros/formatos-cen`, que eran HTML solo-imprimir con
`window.print()` y bloque de firma). Cada envío:

1. Genera un **PDF** del formulario diligenciado + firma.
2. Se envía por **Resend** al correo del Centro, con `reply-to` = correo del solicitante (para responder desde Gmail).
3. Registra una fila en una **DB de Notion** (`Solicitudes`) como CRM consultable, enlazando al correo del solicitante.

## Alcance

### Dentro de alcance
- Refactor de `/contacto` a un formulario multi-tipo con selector que **cambia los campos de verdad**.
- 4 tipos: **Contacto general**, **Solicitud de Servicios**, **Visita Docente UNAL**, **Visita Externo (STEM)**.
- Firma dibujada en canvas en los 3 formularios estructurados (no en Contacto general).
- Roster dinámico de estudiantes en los 2 formularios de visita.
- Envío: PDF por Resend (adjunto + reply-to) **y** fila en Notion (datos + enlace `mailto:`, sin PDF).

### Fuera de alcance (proyecto futuro: dashboard interno + auth)
- **Participación en Proyectos** (acta de cierre con resultados/firma) y **Acta de Vinculación Externo**
  (acta de cierre post-servicio) — documentos internos, van al dashboard con auth.
- **Asistencia firmada en sitio** el día de la visita — futura; se relacionará con estas solicitudes vía una
  DB `Asistencias` con propiedad *Relation* apuntando a la fila de `Solicitudes`. NO se implementa ahora (YAGNI:
  no hay a qué relacionar todavía).
- Toda la infraestructura de auth (Logto en `@cen/auth`) y persistencia Supabase (`@cen/db`) — hoy son stubs vacíos.

## Tipos de formulario y campos

### Campos comunes (todos los tipos estructurados)
- Nombre completo (texto, requerido)
- Documento de identidad (texto, requerido)
- Correo electrónico (email, requerido) → usado como `reply-to` y enlace `mailto:` en Notion
- Teléfono de contacto (texto)

### 1. Contacto general
- Nombre completo (texto, requerido)
- Correo (email, requerido)
- Afiliación (texto, opcional)
- Teléfono (texto, opcional)
- Mensaje (textarea, requerido)
- **Sin firma, sin roster.**

### 2. Solicitud de Servicios (con firma)
**Datos del solicitante:** comunes + Programa Académico / Dependencia (texto) + Tipo de Usuario
(select: `Estudiante` · `Docente` · `Administrativo` · `Externo / Investigador`).

**Información del proyecto:**
- Nombre del Proyecto / Práctica (texto)
- Docente o Líder Responsable (texto)
- Asignatura Vinculada — si aplica (texto)
- Descripción breve de lo que se desea fabricar/realizar (textarea)

**Requerimientos de maquinaria** (checklist multi-selección):
`Impresora 3D FDM` · `Impresora 3D Resina` · `CNC 3018 (Fresado PCB/Madera)` · `Plóter de Corte / Vinilo` ·
`Cortadora y Grabadora Láser` · `Estación de Soldadura` · `Herramientas Manuales` · `Otro`

**Materiales:** Detalle de materiales requeridos (o proporcionados por el usuario) (textarea).

### 3. Visita Docente UNAL (con firma + roster)
- Nombre de la Asignatura / Proyecto (texto)
- Código SIA — si aplica (texto)
- Programa Curricular (texto)
- Nivel de Formación (select: `Pregrado` · `Posgrado (Maestría/Doctorado)` · `Extensión / Educación Continua` · `Grupo de Investigación`)
- Fecha Propuesta (date)
- Horario Solicitado (texto)
- Estudiantes Previstos (number)
- Número de Grupos (number)
- Acompañantes Adicionales (number)
- Descripción de la Actividad Académica (textarea)
- Equipos o Materiales Específicos Requeridos (textarea)
- **Roster de estudiantes** (ver abajo)

### 4. Visita Externo (STEM) (con firma + roster)
- Nombre de la Asignatura — si aplica (texto)
- Código de la Asignatura — si aplica (texto)
- Institución Educativa (texto)
- Ciudad (texto)
- Fecha de la Visita (date)
- Horario de la Actividad (texto)
- Número de Estudiantes (number)
- Número de Grupos (number)
- Descripción de la Actividad (textarea)
- Observaciones Adicionales (textarea)
- **Roster de estudiantes** (ver abajo)

## Roster de estudiantes (visitas)

Los 2 formularios de visita incluyen una **tabla dinámica** que el docente/líder llena al solicitar: registra por
adelantado quién va a asistir (absorbe la antigua Planilla de Asistencia en su versión *previa*).

- Columnas por fila: **Nombre Completo** (texto) · **Documento de Identidad** (texto) · **Correo Electrónico** (email).
- Acciones: "Agregar fila" / "Quitar fila". Mínimo 1 fila.
- El roster aparece en el PDF y se resume en Notion (p. ej. conteo + lista; el detalle completo en el PDF).

> La versión *firmada en sitio el día de la visita* queda fuera de alcance (dashboard futuro).

## Firma

- Componente de **canvas** propio y ligero (sin librería pesada): el solicitante dibuja con dedo/mouse.
- Botón "Limpiar". Se captura como imagen (`toDataURL`, PNG).
- Presente en los 3 formularios estructurados; requerida para enviar. Ausente en Contacto general.
- La imagen se incrusta en el PDF junto al nombre y la fecha de firma.

## Pipeline de envío

Server Action (`"use server"`) invocada desde el cliente al enviar:

```
submit()
  → valida con zod (schema por tipo de formulario)
  → genera PDF (datos + roster + firma) con @react-pdf/renderer
  → Promise.all:
      ├─ Resend: email al Centro
      │     from: remitente verificado del sitio
      │     to: correo del Centro (env)
      │     replyTo: correo del solicitante
      │     subject: "[<Tipo>] <Nombre> — <Proyecto/Institución>"
      │     attachments: [ PDF firmado ]
      │     (cuerpo HTML con @react-email/components)
      └─ Notion: crea página en DB "Solicitudes"
            props: Tipo (select), Nombre, Correo (mailto), Teléfono, Fecha, Estado="Nuevo",
                   + campos específicos del tipo, + resumen del roster
            (sin PDF: el PDF vive en el hilo de Gmail)
  → devuelve { ok } / { error } al cliente para feedback
```

- **Contacto general** no genera PDF ni firma: solo email (reply-to + cuerpo con el mensaje) + fila en Notion.
- Manejo de errores: si Resend o Notion fallan, se reporta al usuario y se registra; el envío es idempotente por
  intento (reintentar re-crea, se acepta para v1). Validación server-side siempre, además de la del cliente.

## Estructura de la DB de Notion

Una **DB compartida `Solicitudes`** (cuenta `centrodeprototipado`), creada vía Executor. Propiedades:
- `Nombre` (title)
- `Tipo` (select: General · Servicios · Visita Docente · Visita Externo)
- `Correo` (email/url `mailto:`)
- `Teléfono` (phone/text)
- `Estado` (select: Nuevo · En proceso · Atendido) — default Nuevo
- Campos específicos por tipo como propiedades opcionales (quedan vacías cuando no aplican).
- `Creado` (created time).

Una **automatización de Notion** (configurada manualmente por el equipo, no por API) notifica al Gmail del Centro
cuando se agrega una fila. La app **no** depende de esa automatización para funcionar (el email por Resend es el
canal primario garantizado).

## Dependencias nuevas (`apps/web`)

- `react-hook-form` + `zod` (+ `@hookform/resolvers`) — formulario condicional multi-tipo, field array del roster, validación.
- `resend` + `@react-email/components` — email con adjunto y reply-to.
- `@react-pdf/renderer` — PDF server-side del formulario firmado.
- Canvas de firma: componente propio en `components/ui/`.
- Notion write: integration con **permiso de escritura** compartido con la DB `Solicitudes`; token en `.env.local`.

### Variables de entorno nuevas
- `RESEND_API_KEY`
- `RESEND_FROM` (remitente verificado)
- `CONTACT_TO_EMAIL` (correo del Centro destino)
- `NOTION_SOLICITUDES_DB_ID`
- (El token de Notion de escritura — reutilizar `NOTION_TOKEN` si se le da acceso a la DB, o uno nuevo.)

## Arquitectura de archivos (propuesta)

- `lib/forms/schemas.ts` — schemas zod + tipos por formulario (fuente única de la verdad de los campos).
- `lib/forms/config.ts` — metadata declarativa de cada tipo (label, campos, si tiene firma/roster) para render dinámico.
- `app/(marketing)/contacto/actions.ts` — Server Action `submitSolicitud`.
- `lib/notion/solicitudes.ts` — escritura a la DB `Solicitudes` (junto a los `lib/notion/*` existentes).
- `lib/email/` — cliente Resend + plantillas react-email.
- `lib/pdf/solicitud-pdf.tsx` — documento `@react-pdf/renderer`.
- `components/ui/signature-pad.tsx` — canvas de firma.
- `components/sections/contacto-client.tsx` — refactor: selector de tipo + render dinámico de campos + roster + firma + submit.

Se mantiene el resto de `/contacto` (hero, mapa, FAQ) tal cual.

## Testing

- Unit: schemas zod (validación por tipo, roster mín. 1 fila, firma requerida en estructurados).
- Unit: mapeo formulario → props de Notion.
- Integración (mock de Resend/Notion): la Server Action arma el email y la fila correctos por tipo.
- Manual/verify: llenar cada tipo, firmar, enviar; confirmar email con PDF + fila en Notion.

## Riesgos / dependencias externas a confirmar

1. **Remitente verificado en Resend** — requiere verificar un dominio o usar `onboarding@resend.dev` en dev.
2. **Automatización Notion → Gmail externo** — puede requerir plan pago; alternativa: @mencionar a un miembro del
   workspace. No bloquea la feature (Resend es el canal primario).
3. **Token de escritura Notion** — el integration actual es solo-lectura; hay que dar acceso de escritura a la DB.
