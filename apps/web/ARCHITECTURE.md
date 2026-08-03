# Arquitectura — `@cen/web`

Sitio marketing/landing del Centro de Prototipado (UNAL Manizales). Next.js 16 App
Router. Sin backend propio: el contenido editorial se gestiona desde **Notion** y se
renderiza estático/SSR.

> Arquitectura del monorepo (auth, Supabase, deploy): ver [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md).

## Rutas (App Router)

| Grupo | Rutas | Propósito |
|-------|-------|-----------|
| `(marketing)` | `/`, `/centro`, `/portafolio`, `/portafolio/[slug]`, `/tecnologias`, `/aprende`, `/contacto` | sitio público con Header/Footer |
| `(auth)` | `/login` | páginas de auth |
| `dashboard/` | `/dashboard` | dashboard interno (placeholder) |
| `api/` | `/api/revalidate` | revalidación on-demand del CMS |

## Capas de componentes

- **`components/ui/`** — primitivos shadcn/ui (estilo Base Vega, color "mist") + utilidades (`markdown.tsx`, `decor-icon`, `grid-pattern`…).
- **`components/layout/`** — Header, Footer, nav desktop/mobile, `theme-provider`.
- **`components/sections/`** — secciones de página (Hero, Gallery, Features, Cases, CTA, Contact, HeroRobot, clientes de tecnologías/contacto).
- **`components/portfolio/`** — showcase y detalle de portafolio.
- **`components/dashboard/`** — shell del dashboard.

## CMS de contenido — Notion

El contenido editorial vive en **bases de datos de Notion** y se lee server-side con la
API oficial `@notionhq/client` (versión `2025-09-03`, modelo de *data sources*). No hay
base de datos ni API propia para esto.

### Bases de datos

Todas cuelgan de la página **«CMS — Centro de Prototipado»**
(`375ce4e8-43ab-81f1-8401-dc55ea08ced4`). Atributos **en español**, con un checkbox
**`Publicado`** que filtra qué se muestra (solo `true` aparece en la web).

| Base de datos | Data source ID | Contenido | Render en |
|---|---|---|---|
| Portafolio | `2518f455-7332-40c4-b3c7-ee0905d2391e` | proyectos (híbrido: propiedades + cuerpo markdown) | `/portafolio`, `/portafolio/[slug]`, home (Cases) |
| Tecnologías | `9616e1e9-cb5c-4908-8bd3-987384f5ff64` | inventario de equipos | `/tecnologias` |
| Equipo | `4692245a-0dc7-41bd-89a1-09719cf6b8e5` | personas del Centro | `/centro` |
| FAQ | `a4fb64e7-3c81-4634-b6e3-4f3edbafef67` | preguntas frecuentes | `/tecnologias` (filtrado por `Categoría`), `/contacto` |
| Configuración | `a5cba8c6-4d8f-462c-af18-1b2ea3f09353` | contacto (correo/teléfono/sede/horario/coordenadas), misión, visión, usuario de Instagram — clave-valor | footer, home, `/contacto`, `/centro` |
| Instagram | `8cbb9e37-18b7-45bc-8747-2ad302e2e893` | posts destacados curados a mano | home (franja «Lo último del Centro») |

**Esquema Portafolio (propiedades → tipo):** `Título` (title), `Slug`,
`Categoría` (multi-select), `Año` (number), `Imagen` (url — destino final),
`Imagen (subir aquí)` (file — el editor sube aquí; el sync la envía a Cloudinary y
escribe la URL en `Imagen`), `Resumen`, `Reto`, `Solución`,
`Tecnologías` (multi-select), `Resultados` (texto multilínea → lista), `Aliado`,
`Enlace` (url, opcional), `Orden` (number, opcional — prioriza sobre `Año` al ordenar),
`Destacado` (checkbox), `Publicado` (checkbox). **Cuerpo de página → markdown.**

**Esquema Tecnologías:** `Título` (title), `Subtítulo`, `Descripción`,
`Aplicaciones` (texto multilínea → lista),
`Unidades` (number), `Categoría` (select), `Imagen` (url — destino final, opcional),
`Imagen (subir aquí)` (file — el editor sube aquí; el sync la envía a Cloudinary y escribe
la URL en `Imagen`), `Orden`, `Publicado`.

**Esquema Equipo:** `Nombre` (title), `Rol`, `Foto` (url — destino final),
`Foto (subir aquí)` (file — el editor sube aquí; el sync la envía a Cloudinary y escribe la
URL en `Foto`; si `Foto` queda vacía → avatar SVG generado), `Bio` (opcional), `LinkedIn`
(url, opcional), `Orden`, `Publicado`.

**Esquema FAQ:** `Pregunta` (title), `Respuesta`, `Categoría` (select: `General`,
`Tecnologías`, `Contacto` — sin asignar se trata como `General`), `Orden`, `Publicado`.

**Esquema Configuración:** `Etiqueta` (title, solo interno), `Clave` (identificador
estable usado en código, ej. `contacto-email`), `Valor`, `Orden`, `Publicado`.

**Esquema Instagram:** `Caption` (title), `URL del post` (url — enlace público al
post o reel), `Imagen` (url — portada, la rellena el sync), `Imagen (subir aquí)`
(file — vía manual de respaldo), `Tipo` (select: `Post`/`Reel`), `Orden`,
`Publicado`. Sin `URL del post` o sin `Imagen` la fila se descarta al mapear.

**Flujo propio:** a diferencia del resto de bases, aquí el editor **solo pega la
URL del post**. `syncInstagramMedia` (en `lib/cloudinary/sync.ts`) resuelve la
portada con `lib/instagram/media.ts` y la rehospeda en Cloudinary, porque las URLs
del CDN de Instagram van firmadas y caducan. Solo procesa las filas sin `Imagen`,
así que revalidar es idempotente y no pisa una portada puesta a mano. **El video no
se rehospeda**: lo sirve el embed oficial.

`lib/instagram/media.ts` lee los datos públicos del permalink con un User-Agent de
rastreador (Instagram sirve muro de login a peticiones normales, pero entrega el
JSON del post a los crawlers — es lo que alimenta las previsualizaciones de
enlaces). Se ancla en la **última** aparición de `"code":"<shortcode>"`, que es el
nodo del propio media; las anteriores son el timeline de posts relacionados y
llevan al caption equivocado. Es una fuente no documentada: ante cualquier
imprevisto devuelve `null` y el sync conserva lo ya guardado en vez de borrarlo.

Los reels se reproducen **dentro del sitio** con `components/ui/reel-player.tsx`:
la tarjeta muestra portada y botón de play propios, y al pulsar abre el **embed
oficial** (`instagram.com/reel/<code>/embed/`) en un modal. Va en modal, y no
dentro de la tarjeta, porque el embed trae su propio chrome y un ancho mínimo de
~326px que no cabe en el carrusel. Cargarlo solo al abrir evita que la home
arrastre el iframe de Meta —y sus cookies— en cada visita.

Verificado en navegador con contexto aislado (sin sesión de Instagram): los tres
reels renderizan y reproducen. El embed **no requiere token**, a diferencia del
oEmbed oficial, que lo exige desde 2020.

**Modelo híbrido:** las propiedades estructuradas alimentan el layout (hero,
reto/solución, techStack…) y el **cuerpo** de la página de Notion se lee como markdown
vía `notion.pages.retrieveMarkdown()` → se renderiza con `react-markdown` + `remark-gfm`
(componente `components/ui/markdown.tsx`) en la sección «Detalle».

## Aprende con nosotros (YouTube Data API v3)

`/aprende` **no** usa Notion: `lib/youtube/videos.ts` lee el canal con la YouTube
Data API v3 (`YOUTUBE_API_KEY` + `YOUTUBE_CHANNEL_ID`, ambas server-side). Trae los
videos de la playlist de subidas y convierte cada **playlist pública del canal** en
un filtro de categoría, de modo que la organización se hace en YouTube y la web se
actualiza sola. Cacheado con tag `tutoriales` y `cacheLife("hours")`; sin credenciales
devuelve listas vacías y la página muestra su estado vacío.

Los videos se renderizan con `components/ui/youtube-facade.tsx`: miniatura propia +
botón de play, y el iframe (`youtube-nocookie.com`) solo se monta al hacer clic. Se
evitó `lite-youtube-embed` / `@next/third-parties` porque sirven su script y su CSS
desde un CDN externo sin versión fijada y traen chrome visual no tematizable.

### Capa de datos (`lib/notion/`)

```
client.ts        ← cliente @notionhq/client + IDs de data sources (env)
map.ts           ← helpers para leer propiedades (getTitle, getSelect, getMultiSelect, getMultilineList…)
portfolio.ts     ← getPortfolioProjects / …BySlug / …Featured / …Categories / …Slugs
technologies.ts  ← getTechnologies
team.ts          ← getTeamMembers   (foto: URL en `Foto` sincronizada a Cloudinary; si vacía → avatar SVG generado)
faq.ts           ← getFaq(category?)  — sin categoría devuelve todas; con categoría filtra a esa + "General"
metrics.ts       ← getMetrics (cifras de impacto, indexadas por `Clave`) + pickMetrics()
config.ts        ← getConfig (contacto, misión, visión — indexado por `Clave`)
```

Cada lectura se filtra por `Publicado = true`, se ordena (por `Año`, `Orden` o similar) y se
marca con la directiva **`"use cache"`** + `cacheTag(<tag>)` + `cacheLife("max")` (requerido
por `cacheComponents: true`; reemplaza al antiguo `unstable_cache`). El contenido se cachea
indefinidamente y solo se refresca on-demand.
Tags de caché: `portafolio`, `tecnologias`, `equipo`, `faq`, `metricas`, `configuracion`,
`instagram`, `tutoriales` (este último cachea la API de YouTube, no Notion, y usa
`cacheLife("hours")`).

Las páginas/secciones son **Server Components async** que hacen `await` de estos
fetchers. Los componentes cliente (`tecnologias-client`, `contacto-client`) reciben los
datos por **props** desde su page server.

### Revalidación on-demand

`POST /api/revalidate?secret=<REVALIDATE_SECRET>[&tag=<tag>]`
(`app/api/revalidate/route.ts`):
- Valida el secreto (`?secret=` o header `x-revalidate-secret`).
- Ejecuta `revalidateTag(tag, "max")` (firma de Next 16) → las páginas estáticas se
  regeneran en la siguiente petición.
- Sin `tag` revalida todos; con `tag` solo ese.
- **Sync de imágenes:** cuando los tags incluyen `portafolio`, `equipo`, `tecnologias`
  y/o `instagram` (o sin `tag`, los cuatro), antes de revalidar ejecuta el sync
  correspondiente de `lib/cloudinary/sync.ts` (`syncPortfolioImages` / `syncTeamImages` /
  `syncTechnologyImages` / `syncInstagramMedia`)
  — sube a Cloudinary las imágenes recién puestas en la propiedad file y escribe su URL
  permanente en la propiedad url destino. `maxDuration = 60`. El resumen (por tag) va en la
  respuesta (`imageSync`).

Cada tab de la base en Notion tiene un botón «Actualizar» con webhook a este endpoint
(header `x-revalidate-secret`), así que subir una imagen + pulsar «Actualizar» la publica.

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/revalidate?secret=<REVALIDATE_SECRET>&tag=portafolio"
```

### Imágenes

La propiedad url destino (`Imagen` en Portafolio/Tecnologías, `Foto` en Equipo) guarda una
**URL pública permanente** (las URLs de archivos subidos a Notion expiran a ~1h, por eso no
se leen directo). El editor sube el archivo en la propiedad file («subir aquí») y, al pulsar
«Actualizar», el sync de `lib/cloudinary/sync.ts` lo sube a Cloudinary
(carpetas `cenprototipado/portafolio`, `cenprototipado/equipo`, `cenprototipado/tecnologias`)
y escribe la `secure_url` en la propiedad url. El `public_id` incluye un hash del archivo de
origen, así que el sync solo re-sube cuando cambia el archivo (idempotente). En `next.config.mjs`, `images.remotePatterns` lista los
hosts permitidos (incl. `res.cloudinary.com`) — **no usar `**`** (riesgo de SSRF vía el
optimizador de imágenes). Las imágenes locales en `/public` (`/taller.jpg`) no requieren patrón.

### Variables de entorno (`.env.local`)

```
NOTION_TOKEN                       # imprescindible — integración interna (ntn_…), con la página compartida (con permiso de escritura)
REVALIDATE_SECRET                  # protege POST /api/revalidate (necesario para revalidar)
CLOUDINARY_CLOUD_NAME              # sync de imágenes (Portafolio, Equipo, Tecnologías) → Cloudinary
CLOUDINARY_API_KEY                 # ídem (subidas firmadas)
CLOUDINARY_API_SECRET              # ídem (subidas firmadas)
NOTION_PORTFOLIO_DATA_SOURCE_ID    # opcional — override; por defecto van hardcodeados en lib/notion/client.ts
NOTION_TECNOLOGIAS_DATA_SOURCE_ID  # opcional
NOTION_EQUIPO_DATA_SOURCE_ID       # opcional
NOTION_FAQ_DATA_SOURCE_ID          # opcional
NOTION_METRICAS_DATA_SOURCE_ID     # opcional
NOTION_CONFIGURACION_DATA_SOURCE_ID # opcional
RESEND_API_KEY                     # formularios de contacto — envío de solicitudes por email
RESEND_FROM                        # remitente verificado (ej. "Centro de Prototipado <noreply@dominio-verificado>")
CONTACT_TO_EMAIL                   # correo del Centro que recibe las solicitudes
NOTION_SOLICITUDES_DATA_SOURCE_ID  # data source de la DB "Solicitudes" (registro de formularios)
```

> En **despliegue (Vercel)** solo hace falta `NOTION_TOKEN` (y `REVALIDATE_SECRET` para
> revalidar) para el CMS; los formularios de contacto requieren además `RESEND_API_KEY`,
> `RESEND_FROM`, `CONTACT_TO_EMAIL` y `NOTION_SOLICITUDES_DATA_SOURCE_ID`. Los data source
> IDs del CMS tienen valor por defecto en el código.

> **Setup imprescindible:** la integración interna debe tener compartida la página «CMS —
> Centro de Prototipado» (UI de Notion → Conexiones), o las queries dan `object_not_found`.

### Cómo editar contenido

1. Edita la base de datos correspondiente en Notion (marca `Publicado` para publicar).
2. Llama a `/api/revalidate` con el secreto (todo, o `&tag=` de esa sección).
3. Refresca → el cambio aparece.

## Contenido que NO está en Notion (hardcodeado)

Copys puramente decorativos que cambian poco: hero/CTA de home, "capabilities" strip,
"para quién", los puntos STEM (`stemPoints`) y los pasos de proceso del portafolio
(`processSteps`). `lib/institutional-data.ts` conserva los **tipos** `TeamMember`,
`Technology`, `FaqItem` y el helper `createPortraitDataUri` (fallback de fotos de equipo).

> **Tecnologías, métricas, contacto y misión/visión son fuente única en Notion.** Las
> cifras de impacto se leen de la DB **Métricas** (`getMetrics` + `pickMetrics` por
> `Clave`); el catálogo de tecnologías (home: ticker + grid; /tecnologias) se lee de la DB
> **Tecnologías**; los datos de contacto y misión/visión se leen de la DB
> **Configuración** (`getConfig`, indexado por `Clave`). No duplicar estos valores en
> código.

## Formularios de contacto (`/contacto`)

A diferencia del CMS (solo lectura), `/contacto` **escribe** solicitudes. El formulario
(`components/sections/contacto-client.tsx`, client component con `react-hook-form` + `zod`)
maneja **4 tipos** vía un selector que cambia los campos:

| Tipo (`FormType`) | Firma | Roster | Campos propios |
|---|---|---|---|
| `general` | no | no | mensaje libre |
| `servicios` | sí | no | tipo de usuario, checklist de maquinaria, materiales |
| `visita-docente` | sí | sí | asignatura/SIA, nivel, fecha, logística |
| `visita-externo` | sí | sí | institución, ciudad, fecha, estadísticas |

- **Fuente de verdad de los campos:** `lib/forms/schemas.ts` (schemas zod por tipo, tipos
  inferidos y constantes `MAQUINARIA`/`TIPO_USUARIO`/`NIVEL_FORMACION`) + `lib/forms/config.ts`
  (`FORM_TYPES`, `LABEL_BY_TYPE`). El resolver del formulario elige el schema según el tipo
  activo en cada validación (resolver dinámico vía ref).
- **Roster de estudiantes** (visitas): tabla dinámica (`useFieldArray`) con
  Nombre/Documento/Correo — el docente/líder registra por adelantado quién asistirá.
- **Firma**: `components/ui/signature-pad.tsx` (canvas), capturada como dataURL PNG.

### Pipeline de envío

Server Action `app/(marketing)/contacto/actions.ts` → `submitSolicitud(raw)`:

1. Valida `raw` con `schemaFor(type)` (rechaza tipos inválidos; nunca lanza al cliente).
2. Genera un **PDF** (`lib/pdf/solicitud-pdf.tsx`, `@react-pdf/renderer`) con datos + roster +
   firma — salvo `general`, que no lleva PDF.
3. En paralelo (`Promise.all`):
   - **Email (Resend)** `lib/email/client.tsx` → correo al Centro (`CONTACT_TO_EMAIL`) con el
     PDF adjunto y `replyTo` = correo del solicitante (para responder desde Gmail). Plantilla
     en `lib/email/solicitud-email.tsx` (`@react-email/components`).
   - **Notion** `lib/notion/solicitudes.ts` → fila en la DB `Solicitudes` (sin PDF): `Nombre`,
     `Tipo`, `Correo` (`mailto:`), `Teléfono`, `Estado`="Nuevo", `Detalle`, `Roster` (resumen).
4. Devuelve `{ ok }` / `{ ok: false, error }` para feedback en el cliente.

> El PDF firmado vive en el hilo de Gmail (artefacto formal + respuesta); Notion es el
> registro consultable (CRM). Riesgo conocido v1: si un destino falla tras el otro (email OK /
> Notion falla), no hay compensación — se reporta error genérico al usuario.

### DB `Solicitudes` (Notion, escritura)

Cuelga de la página «CMS — Centro de Prototipado». Propiedades: `Nombre` (title),
`Tipo` (select: Contacto general · Solicitud de Servicios · Visita Docente UNAL · Visita
Externo (STEM)), `Correo` (url `mailto:`), `Teléfono` (phone), `Estado` (select: Nuevo · En
proceso · Atendido), `Detalle` (rich text), `Roster` (rich text), `Creado` (created time).
Requiere que el integration de `NOTION_TOKEN` tenga **permiso de escritura** sobre la DB. Una
**automatización de Notion** (configurada en la UI, no por API) notifica al Gmail del Centro al
crearse una fila; la app no depende de ella (Resend es el canal primario).

### Futuro (dashboard interno)

La **asistencia firmada en sitio** el día de la visita y las actas de cierre
(Participación en Proyectos, Vinculación Externo) son documentos internos que irán al
dashboard con auth; se relacionarán con estas solicitudes (DB `Asistencias` con *Relation* a
`Solicitudes`). Fuera de alcance de esta feature.

## Convenciones clave

- **Server Components por defecto** — `"use client"` solo para interactividad (hooks, eventos).
- **Estilos**: Tailwind v4 + CSS custom properties en `app/globals.css`. Usar `cn()` de `lib/utils.ts`.
- **Tema**: dark por defecto; tecla "D" alterna tema (`components/layout/theme-provider.tsx`, `next-themes`).
- **Responsive**: mobile-first con `md:`/`lg:`; hook `useIsMobile()` (breakpoint 768px).
- **3D**: `components/sections/hero-robot.tsx` usa Three.js — imports pesados solo en cliente.
- **Alias de path**: `@/*` apunta a la raíz de `apps/web`.

## Fuentes y assets

Fuente variable `AncizarSans` (peso 400–900) desde `/fonts/`. Assets estáticos en `/public/`.

## Comandos

```bash
pnpm dev        # next dev --turbopack
pnpm build      # next build
pnpm typecheck  # tsc --noEmit
pnpm lint
```
