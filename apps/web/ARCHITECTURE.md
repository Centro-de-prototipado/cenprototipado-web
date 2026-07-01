# Arquitectura — `@cen/web`

Sitio marketing/landing del Centro de Prototipado (UNAL Manizales). Next.js 16 App
Router. Sin backend propio: el contenido editorial se gestiona desde **Notion** y se
renderiza estático/SSR.

> Arquitectura del monorepo (auth, Supabase, deploy): ver [`../../ARCHITECTURE.md`](../../ARCHITECTURE.md).

## Rutas (App Router)

| Grupo | Rutas | Propósito |
|-------|-------|-----------|
| `(marketing)` | `/`, `/centro`, `/portafolio`, `/portafolio/[slug]`, `/tecnologias`, `/contacto` | sitio público con Header/Footer |
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
| Configuración | `a5cba8c6-4d8f-462c-af18-1b2ea3f09353` | contacto (correo/teléfono/sede/horario/coordenadas), misión, visión — clave-valor | footer, home, `/contacto`, `/centro` |

**Esquema Portafolio (propiedades → tipo):** `Título` (title), `Slug`,
`Categoría` (multi-select), `Año` (number), `Imagen` (url), `Resumen`, `Reto`, `Solución`,
`Tecnologías` (multi-select), `Resultados` (texto multilínea → lista), `Aliado`,
`Enlace` (url, opcional), `Orden` (number, opcional — prioriza sobre `Año` al ordenar),
`Destacado` (checkbox), `Publicado` (checkbox). **Cuerpo de página → markdown.**

**Esquema Equipo:** `Nombre` (title), `Rol`, `Foto` (url), `Bio` (opcional), `LinkedIn`
(url, opcional), `Orden`, `Publicado`.

**Esquema FAQ:** `Pregunta` (title), `Respuesta`, `Categoría` (select: `General`,
`Tecnologías`, `Contacto` — sin asignar se trata como `General`), `Orden`, `Publicado`.

**Esquema Configuración:** `Etiqueta` (title, solo interno), `Clave` (identificador
estable usado en código, ej. `contacto-email`), `Valor`, `Orden`, `Publicado`.

**Modelo híbrido:** las propiedades estructuradas alimentan el layout (hero,
reto/solución, techStack…) y el **cuerpo** de la página de Notion se lee como markdown
vía `notion.pages.retrieveMarkdown()` → se renderiza con `react-markdown` + `remark-gfm`
(componente `components/ui/markdown.tsx`) en la sección «Detalle».

### Capa de datos (`lib/notion/`)

```
client.ts        ← cliente @notionhq/client + IDs de data sources (env)
map.ts           ← helpers para leer propiedades (getTitle, getSelect, getMultiSelect, getMultilineList…)
portfolio.ts     ← getPortfolioProjects / …BySlug / …Featured / …Categories / …Slugs
technologies.ts  ← getTechnologies
team.ts          ← getTeamMembers   (foto: URL externa; si vacía → avatar SVG generado)
faq.ts           ← getFaq(category?)  — sin categoría devuelve todas; con categoría filtra a esa + "General"
metrics.ts       ← getMetrics (cifras de impacto, indexadas por `Clave`) + pickMetrics()
config.ts        ← getConfig (contacto, misión, visión — indexado por `Clave`)
```

Cada lectura se filtra por `Publicado = true`, se ordena (por `Año`, `Orden` o similar) y se
marca con la directiva **`"use cache"`** + `cacheTag(<tag>)` + `cacheLife("max")` (requerido
por `cacheComponents: true`; reemplaza al antiguo `unstable_cache`). El contenido se cachea
indefinidamente y solo se refresca on-demand.
Tags de caché: `portafolio`, `tecnologias`, `equipo`, `faq`, `metricas`, `configuracion`.

Las páginas/secciones son **Server Components async** que hacen `await` de estos
fetchers. Los componentes cliente (`tecnologias-client`, `contacto-client`) reciben los
datos por **props** desde su page server.

### Revalidación on-demand

`POST /api/revalidate?secret=<REVALIDATE_SECRET>[&tag=<tag>]`
(`app/api/revalidate/route.ts`):
- Valida el secreto (`?secret=` o header `x-revalidate-secret`).
- Ejecuta `revalidateTag(tag, "max")` (firma de Next 16) → las páginas estáticas se
  regeneran en la siguiente petición.
- Sin `tag` revalida los cinco; con `tag` solo ese.

Es **manual** por ahora (curl/bookmark). Siguiente paso natural: una automatización de
Notion («al editar → enviar webhook») que golpee ese endpoint al guardar.

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:3000/api/revalidate?secret=<REVALIDATE_SECRET>&tag=portafolio"
```

### Imágenes

La propiedad **`Imagen`** guarda una **URL pública permanente** (no se suben a Notion,
cuyas URLs expiran a ~1h). En `next.config.mjs`, `images.remotePatterns` debe listar los
hosts permitidos — **no usar `**`** (riesgo de SSRF vía el optimizador de imágenes). Las
imágenes locales en `/public` (`/taller.jpg`) no requieren patrón.

### Variables de entorno (`.env.local`)

```
NOTION_TOKEN                       # imprescindible — integración interna (ntn_…), con la página compartida
REVALIDATE_SECRET                  # protege POST /api/revalidate (necesario para revalidar)
NOTION_PORTFOLIO_DATA_SOURCE_ID    # opcional — override; por defecto van hardcodeados en lib/notion/client.ts
NOTION_TECNOLOGIAS_DATA_SOURCE_ID  # opcional
NOTION_EQUIPO_DATA_SOURCE_ID       # opcional
NOTION_FAQ_DATA_SOURCE_ID          # opcional
NOTION_METRICAS_DATA_SOURCE_ID     # opcional
NOTION_CONFIGURACION_DATA_SOURCE_ID # opcional
```

> En **despliegue (Vercel)** solo hace falta `NOTION_TOKEN` (y `REVALIDATE_SECRET` para
> revalidar). Los data source IDs tienen valor por defecto en el código.

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
