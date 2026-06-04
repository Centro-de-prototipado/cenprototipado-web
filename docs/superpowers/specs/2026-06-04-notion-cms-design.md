# Notion como CMS — Diseño

**Fecha:** 2026-06-04
**Estado:** Aprobado para planificación
**App afectada:** `apps/web` (`@cen/web`)

## Objetivo

Convertir Notion en el gestor de contenido (CMS) del sitio marketing. El contenido
hoy hardcodeado pasa a bases de datos de Notion, consultadas vía la API oficial
`@notionhq/client` (versión `2025-09-03`, modelo de *data sources*). La web revalida
on-demand mediante un endpoint manual protegido por secreto.

### Alcance

**Bases de datos a crear en Notion (fase 1 + fase 2):**

1. **Portafolio** (fase 1 — completa, incluye webhook y scaffolding de la capa de datos)
2. **Tecnologías** (fase 2)
3. **Equipo** (fase 2)
4. **FAQ** (fase 2)

Quedan **hardcodeados** (no entran a Notion): Historia/Timeline, Aliados,
Misión/Visión, métricas, y copys de hero/CTA.

### Decisiones tomadas (brainstorming)

- **Modelo de contenido:** híbrido — propiedades estructuradas en Notion + cuerpo de
  página renderizado como markdown (solo aplica al detalle de Portafolio).
- **Fuente de datos:** Notion reemplaza los `.md`. Notion es fuente única de verdad.
- **Imágenes:** URL pública permanente en una propiedad (no se suben a Notion, no expiran).
- **Revalidación:** endpoint manual `POST /api/revalidate` protegido por secreto.
- **Atributos de las bases de datos:** nombrados en español.
- **Arquitectura:** lectura directa de Notion desde Server Components, cacheada con
  `unstable_cache` + tags. Sin DB intermedia (Supabase `@cen/db` queda libre).

## Arquitectura

```
Notion (4 data sources)
   │  @notionhq/client (NOTION_TOKEN)
   ▼
apps/web/lib/notion/*      ← consulta + mapeo a tipos del dominio
   │  unstable_cache({ tags: [...] })
   ▼
Server Components (páginas/secciones)  ← render
   ▲
   │ revalidateTag(tag)
POST /api/revalidate?secret=…&tag=…    ← disparo manual
```

Razón de `unstable_cache`: `cacheComponents` no está activado en `next.config.mjs`,
así que es el primitivo de caché con tags estable en esta versión.

## Esquemas de las bases de datos (propiedades en español)

### 1. Portafolio

| Propiedad | Tipo | Mapea a | Notas |
|---|---|---|---|
| Título | title | `title` | |
| Slug | texto | `slug` | URL del proyecto |
| Código | texto | `id` | ej. `PROY-002` |
| Categoría | select | `category` | Educación, Industria, Comunidad, Entretenimiento |
| Año | número | `year` | |
| Imagen | url | `image` | URL pública permanente |
| Resumen | texto | `summary` | |
| Reto | texto | `challenge` | |
| Solución | texto | `solution` | |
| Tecnologías | multi-select | `techStack` | |
| Resultados | texto (multilínea) | `outcomes[]` | una por línea |
| Aliado | texto | `partner` | opcional |
| Destacado | checkbox | `featured` | |
| Publicado | checkbox | — | filtro: solo `true` se muestra |
| *(cuerpo de página)* | bloques | `content` | markdown extendido (híbrido) |

### 2. Tecnologías

| Propiedad | Tipo | Mapea a |
|---|---|---|
| Título | title | `title` |
| Subtítulo | texto | `subtitle` |
| Descripción | texto | `description` |
| Aplicaciones | texto (multilínea) | `applications[]` |
| Estado | select (Disponible, Reservada) | `status` |
| Unidades | número | `units` |
| Categoría | select (Fabricación, Inmersivo, Robótica, Electrónica, Digitalización) | `category` |
| Orden | número | ordenamiento |
| Publicado | checkbox | filtro |

### 3. Equipo

| Propiedad | Tipo | Mapea a |
|---|---|---|
| Nombre | title | `name` |
| Rol | texto | `role` |
| Foto | url | `portrait` (si vacío → avatar SVG generado como fallback) |
| Orden | número | ordenamiento |
| Publicado | checkbox | filtro |

### 4. FAQ

| Propiedad | Tipo | Mapea a |
|---|---|---|
| Pregunta | title | `q` |
| Respuesta | texto | `a` |
| Orden | número | ordenamiento |
| Publicado | checkbox | filtro |

## Capa de datos (`apps/web/lib/notion/`)

- **`client.ts`** — instancia única de `@notionhq/client` con `NOTION_TOKEN`.
- **`map.ts`** — helpers para extraer valores de propiedades Notion
  (`getTitle`, `getRichText`, `getSelect`, `getMultiSelect`, `getNumber`,
  `getCheckbox`, `getUrl`, `getMultilineList`).
- **`portfolio.ts`** — replica la **misma API pública** que el actual
  `lib/portfolio-data.ts` (`getPortfolioProjects`, `getPortfolioProjectBySlug`,
  `getFeaturedPortfolioProjects`, `getPortfolioCategories`, `getPortfolioSlugs`).
  Consulta vía `notion.dataSources.query` con filtro `Publicado = true`; para el
  detalle obtiene el cuerpo con `notion.pages.retrieveMarkdown({ page_id })` → `content`.
- **`technologies.ts`**, **`team.ts`**, **`faq.ts`** — mismo patrón.
- Cada lectura envuelta en `unstable_cache(fn, keys, { tags: [<tag>] })`.

**Tags de caché:** `portafolio`, `tecnologias`, `equipo`, `faq`.

El endpoint de markdown nativo (`pages.retrieveMarkdown`, SDK v5.11+, disponible para
integraciones internas desde 2026-03-02) evita necesitar `notion-to-md`.

## Render

- **Portafolio detalle** (`app/(marketing)/portafolio/[slug]/page.tsx`): se mantiene
  el layout actual leyendo propiedades; se agrega una sección que renderiza
  `project.content` con `react-markdown` + `remark-gfm` (ya instalados).
- **Tecnologías** (`tecnologias-client.tsx` es client): la página
  `tecnologias/page.tsx` pasa a `async`, hace fetch de `technologies` y `faq`, y los
  pasa como props al componente cliente (hoy los importa de `institutional-data.ts`).
- **Equipo** (`centro/page.tsx`, ya es Server Component): hace fetch de `teamMembers`
  desde Notion. `timeline` y `allies` siguen importándose de `institutional-data.ts`.

## Endpoint de revalidación

`app/api/revalidate/route.ts` — `POST`:
- Valida secreto: query `?secret=` o header `x-revalidate-secret` contra `REVALIDATE_SECRET`.
- Param opcional `?tag=`: revalida ese tag; sin `tag`, revalida todos
  (`portafolio`, `tecnologias`, `equipo`, `faq`).
- Llama `revalidateTag(tag)` y devuelve JSON `{ revalidated: true, tags: [...] }`.
- Diseñado para conectarse luego a una automatización de Notion sin cambios de código.

## Configuración

**Dependencias** (`apps/web`): añadir `@notionhq/client`
(`react-markdown` y `remark-gfm` ya están).

**Variables de entorno** (`apps/web/.env.local`):
```
NOTION_TOKEN=ntn_...
NOTION_PORTFOLIO_DATA_SOURCE_ID=...
NOTION_TECNOLOGIAS_DATA_SOURCE_ID=...
NOTION_EQUIPO_DATA_SOURCE_ID=...
NOTION_FAQ_DATA_SOURCE_ID=...
REVALIDATE_SECRET=...
```

**`next.config.mjs`:** añadir `images.remotePatterns` para los dominios de las URLs
de imagen (portafolio + fotos de equipo).

## Migración

1. Crear las 4 bases de datos en Notion (vía MCP) con los esquemas de arriba.
2. Poblar datos existentes:
   - Portafolio: 12 proyectos desde `content/portfolio/*.md` (frontmatter → propiedades, cuerpo → bloques).
   - Tecnologías: 8 desde `technologies` en `institutional-data.ts`.
   - Equipo: 10 desde `teamMembers`.
   - FAQ: 6 desde `faq`.
3. Compartir cada base de datos con la integración interna.
4. Eliminar código muerto resultante: `lib/portfolio-data.ts`, directorio
   `content/portfolio/`, dependencia `gray-matter`, y los arrays migrados de
   `institutional-data.ts` (`technologies`, `teamMembers`, `faq` — conservar
   `timeline`, `allies`, `technologySpotlights`/`availableTechnologies` si siguen en uso,
   y `createPortraitDataUri` como fallback de fotos de equipo).

## Plan por fases

- **Fase 1 — Portafolio (extremo a extremo):** dependencia, cliente Notion, helpers de
  mapeo, `lib/notion/portfolio.ts`, render markdown en detalle, endpoint de revalidación,
  config de imágenes, crear + poblar DB Portafolio, eliminar capa de archivos.
  → *Verificación:* `pnpm build` + `pnpm typecheck` OK; `/portafolio` y un detalle
  renderizan desde Notion; `POST /api/revalidate` revalida el tag.
- **Fase 2 — Tecnologías, Equipo, FAQ:** crear + poblar las 3 DBs, `lib/notion/*`
  por cada una, conectar render, limpiar arrays de `institutional-data.ts`.
  → *Verificación:* las 3 secciones renderizan desde Notion; build/typecheck OK.

## No-objetivos (YAGNI)

- Sin sincronización a Supabase / DB intermedia.
- Sin webhook automático de Notion (se deja el endpoint manual listo para conectarlo).
- Sin migrar Historia, Aliados, ni copys estáticos.
- Sin re-hosting/descarga de imágenes (se usan URLs externas permanentes).
