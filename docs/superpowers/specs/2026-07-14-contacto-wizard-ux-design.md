# Diseño: Wizard por pasos (UX) para los formularios de `/contacto`

**Fecha:** 2026-07-14
**App:** `apps/web` (`@cen/web`)
**Rama base:** `feat/formularios-contacto` (construye sobre la feature de formularios multi-tipo)
**Estado:** Aprobado — listo para plan de implementación

## Resumen

El formulario de `/contacto` (`components/sections/contacto-client.tsx`) hoy es una **sola pantalla
larga**: se elige el tipo con chips y todos los campos aparecen de golpe (datos + detalles +
maquinaria/roster + firma + consentimiento). Para los tipos estructurados (sobre todo visitas, con
roster + firma) es un scroll pesado.

Esta feature reescribe **solo el bloque del `<form>`** para convertirlo en un **wizard por pasos**
(stepper híbrido): entrada por selección de trámite, luego pasos secuenciales con validación por
paso, barra de progreso animada, un paso final de "Revisar y enviar", y **guardado de borrador** en
`localStorage`. La lógica de envío (Server Action, PDF, email, Notion), los schemas zod y el
componente de firma **no cambian** — se reutilizan; solo cambia la presentación.

## Alcance

### Dentro de alcance
- Wizard por pasos para los 4 tipos de formulario, con validación por paso y transiciones animadas.
- Entrada por selección de trámite (paso 0), con "cambiar trámite" desde la cabecera del wizard.
- Paso final "Revisar y enviar" (resumen de solo-lectura + consentimiento + enviar).
- Estado de éxito como paso final con check animado.
- Guardado de borrador en `localStorage` (restaura tipo, paso y valores; excluye la firma).
- Accesibilidad: manejo de foco al cambiar de paso, `aria-current`, navegación por teclado, móvil.

### Fuera de alcance (no cambian)
- Server Action `submitSolicitud`, generación de PDF, envío por Resend, escritura a Notion.
- Schemas zod (`lib/forms/schemas.ts`) y config (`lib/forms/config.ts`).
- Componente `SignaturePad`.
- Hero, mapa y FAQ de `/contacto` (se conservan intactos).
- No se implementa: "editar esta sección" desde el resumen, drafts por-tipo, saltar pasos.

## Estructura de pasos

La entrada es **paso 0: elegir trámite** (los 4 tipos como opciones). La barra de progreso cuenta
solo los pasos del tipo elegido (no el paso 0). Una cabecera muestra el trámite actual + enlace
"cambiar trámite" (vuelve al paso 0 y resetea el borrador).

| Tipo | Pasos (tras elegir el trámite) |
|---|---|
| **Contacto general** | **1 paso**: mensaje → Enviar (sin atrás/siguiente; incluye consentimiento). |
| **Solicitud de Servicios** | **4**: 1 Tus datos · 2 Detalles + maquinaria · 3 Firma · 4 Revisar y enviar. |
| **Visita Docente UNAL** | **5**: 1 Tus datos · 2 Detalles de la visita · 3 Estudiantes (roster) · 4 Firma · 5 Revisar y enviar. |
| **Visita Externo (STEM)** | **5**: igual que Visita Docente. |

### Campos por paso

Reutiliza los mismos campos y nombres que hoy (definidos por los schemas). Distribución:

**Contacto general — paso único:** nombre, correo, afiliación, teléfono, mensaje, consentimiento.

**Solicitud de Servicios:**
- Paso 1 «Tus datos»: nombre, documento, correo, teléfono, programa, tipoUsuario.
- Paso 2 «Detalles»: proyecto, liderResponsable, asignatura, descripcion, maquinaria (checklist), materiales.
- Paso 3 «Firma»: `SignaturePad`.
- Paso 4 «Revisar y enviar»: resumen + consentimiento + Enviar.

**Visita Docente / Visita Externo:**
- Paso 1 «Tus datos»: nombre, documento, correo, teléfono.
- Paso 2 «Detalles de la visita»: (docente) asignatura, codigoSia, programa, nivel, fecha, horario,
  estudiantesPrevistos, numeroGrupos, acompanantes, descripcion, equipos · (externo) asignatura,
  codigoAsignatura, institucion, ciudad, fecha, horario, numeroEstudiantes, numeroGrupos,
  descripcion, observaciones.
- Paso 3 «Estudiantes»: roster dinámico (`useFieldArray`).
- Paso 4 «Firma»: `SignaturePad`.
- Paso 5 «Revisar y enviar»: resumen + consentimiento + Enviar.

> El mapeo paso→campos es la fuente de verdad para la validación por paso; se define de forma
> declarativa (ver Arquitectura) para no dispersarlo por el JSX.

## Interacción

- **Avanzar:** el botón "Siguiente" valida **solo los campos del paso actual** con `trigger(campos)`
  de react-hook-form; si fallan, se muestran los errores y no avanza. "Atrás" nunca valida.
- **Barra de progreso:** dots + etiqueta del paso actual (`aria-current="step"`). Permite volver a un
  paso ya visitado haciendo clic; no permite saltar a pasos futuros sin validar los intermedios.
- **Transiciones:** slide horizontal entre pasos con `motion` (`AnimatePresence`), respetando
  `prefers-reduced-motion` (sin desplazamiento si el usuario lo prefiere).
- **Paso «Revisar y enviar»:** resumen de solo-lectura de todos los valores (etiqueta → valor),
  miniatura de la firma y conteo/lista breve del roster; el checkbox de tratamiento de datos y el
  botón Enviar viven aquí. Enviar llama a `submitSolicitud` (sin cambios).
- **Éxito:** al recibir `{ ok: true }`, se muestra un paso de éxito con check animado y opción de
  "enviar otra solicitud" (resetea el wizard y borra el borrador).
- **Error de envío:** se muestra en el paso de revisión (mensaje devuelto por la acción), sin perder
  los datos.

## Guardado de borrador (`localStorage`)

- **Clave única** `contacto-draft` con forma `{ type, step, values }`.
- Se guarda (debounced, ~500 ms) cuando cambian los valores o el paso.
- **Excluye la firma** (`firma`): es una imagen grande y sensible; al restaurar, el usuario re-firma.
- Al montar, si hay borrador válido, restaura tipo, paso y valores (sin la firma).
- Se **borra** al enviar con éxito y al usar el botón "descartar borrador" (visible cuando hay
  borrador). Un indicador discreto ("borrador guardado") comunica que se está persistiendo.
- Cambiar de trámite reemplaza el borrador por el del nuevo tipo (no se guardan drafts por-tipo).
- **Privacidad (tradeoff conocido):** el borrador guarda datos personales y documentos del roster en
  el navegador; en un equipo compartido pueden quedar hasta enviar/descartar. Se acepta para v1; se
  mitiga borrando al enviar y con el botón de descartar. La firma nunca se persiste.

## Arquitectura de archivos

Se mantiene el envío y los schemas. Cambios/adiciones:

- `lib/forms/steps.ts` (nuevo) — definición declarativa de pasos por tipo: para cada `FormType`, la
  lista de pasos `{ id, label, fields: (keyof valores)[] }`. Fuente de verdad para render y para
  `trigger(fields)`. Incluye helper `stepsFor(type)`.
- `lib/forms/draft.ts` (nuevo) — `loadDraft()`, `saveDraft(state)`, `clearDraft()`, con la forma
  `{ type, step, values }` y exclusión de `firma`; encapsula el acceso a `localStorage` (guard SSR).
- `components/sections/contacto-client.tsx` (modificar) — reescribe el bloque del `<form>`:
  selección de trámite (paso 0), render del paso actual, navegación (atrás/siguiente/enviar), barra
  de progreso, paso de revisión, paso de éxito, integración del borrador. Reutiliza los
  subcomponentes de campos existentes (`Text`, `Area`, `Select`, `RosterField`, maquinaria) y
  `SignaturePad`. Hero/mapa/FAQ intactos.
- (Opcional) extraer `components/sections/contacto/` si el archivo crece demasiado — decidir durante
  la implementación; por defecto mantener en `contacto-client.tsx` salvo que supere un tamaño
  manejable, en cuyo caso separar el wizard en su propio archivo.

## Componentes de UI

- **Stepper/progress**: componente propio ligero (dots + labels + estado activo/completado), sin
  librería nueva. Responsive (compacto en móvil: "Paso N de M" + barra).
- **Contenedor de paso animado**: `AnimatePresence` + `motion.div` con slide; respeta
  `prefers-reduced-motion`.
- **Resumen de revisión**: lista etiqueta→valor derivada del mismo mapeo declarativo de campos.

## Testing

- Unit (Vitest): `stepsFor(type)` devuelve los pasos correctos por tipo; el mapeo paso→campos cubre
  todos los campos del schema de cada tipo (sin campos huérfanos).
- Unit: `draft.ts` — `save`/`load`/`clear` round-trip; `load` excluye `firma`; guard SSR (sin
  `window`) no rompe.
- Manual/verify: recorrer cada tipo por pasos; validación por paso bloquea avanzar con campos
  inválidos; borrador restaura tras recargar; firma se re-pide; envío exitoso limpia el borrador y
  muestra el éxito; `prefers-reduced-motion` desactiva el slide; navegación por teclado y foco.

## Riesgos / consideraciones

1. **Validación por paso con schema discriminado:** el resolver valida el schema completo; para "solo
   este paso" se usa `trigger(campos)` con los nombres del paso. Hay que mantener el mapeo
   paso→campos sincronizado con los schemas (test lo cubre).
2. **Tamaño del componente:** `contacto-client.tsx` ya es grande; el wizard añade estado y JSX.
   Considerar extraer el wizard a su propio archivo si perjudica la legibilidad.
3. **Borrador vs privacidad:** ya cubierto arriba (excluir firma, borrar al enviar, botón descartar).
4. **Números vacíos → `undefined`:** ya resuelto en la feature base (preprocess en schemas); el
   resumen no debe mostrar "0" para campos no llenados.
