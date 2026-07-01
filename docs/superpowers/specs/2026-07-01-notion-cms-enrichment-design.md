# Enriquecimiento del CMS de Notion — Diseño

## Contexto

El sitio (`apps/web`) usa 5 bases de datos de Notion como CMS (Portafolio, Equipo,
Tecnologías, FAQ, Métricas), leídas server-side vía `lib/notion/*.ts`. Una auditoría del
código encontró:

1. Datos de contacto (correo, teléfono, sede, horario) **hardcodeados y duplicados en 3
   archivos** (`components/layout/footer.tsx`, `components/sections/contact-section.tsx`,
   `components/sections/contacto-client.tsx`).
2. El campo `Tecnologías` (multi-select) de Portafolio se captura en Notion pero está
   **comentado/sin renderizar** en `app/(marketing)/portafolio/[slug]/page.tsx:99-103`.
3. FAQ se muestra **idéntico** en `/tecnologias` y `/contacto` — no hay forma de mostrar
   subconjuntos relevantes por página.
4. Equipo no tiene bio ni redes — solo nombre/rol/foto.
5. `components/sections/institutional-preview-section.tsx` (home) tiene un array `stats`
   **hardcodeado y desincronizado** de la BD Métricas, mientras que `hero.tsx` y
   `app/(marketing)/centro/page.tsx` sí consumen `getMetrics()`/`pickMetrics()` correctamente.
6. Misión y Visión están hardcodeadas en `institutional-section.tsx` y
   `centro/page.tsx` (duplicadas entre sí, con redacciones ligeramente distintas).

Fuera de alcance (decisión explícita, no vale la pena mover a Notion): copys puramente
decorativos que cambian poco (hero de home, "capabilities" strip, "para quién", puntos
STEM, pasos de proceso del portafolio).

## Cambios en Notion

### Nueva base de datos: "Configuración"

Mismo patrón clave-valor que ya usa **Métricas** (consistencia, sin sobre-ingeniería).
Cuelga de la página «Web» junto a las demás. Esquema:

| Propiedad | Tipo | Notas |
|---|---|---|
| `Etiqueta` | title | nombre legible interno (no se muestra) |
| `Clave` | text | identificador estable usado en código, ej. `contacto-email` |
| `Valor` | text | el dato |
| `Orden` | number | opcional, no crítico para esta DB |
| `Publicado` | checkbox | filtro estándar |

Filas iniciales:

| Clave | Valor |
|---|---|
| `contacto-email` | cenprototipado_man@unal.edu.co |
| `contacto-telefono` | +57 (606) 887 9300 |
| `contacto-sede` | Museo Interactivo Samoga, 2do piso · Manizales |
| `contacto-horario` | Lun–Vie · 8:00 a.m. – 5:00 p.m. |
| `contacto-coordenadas` | 5.0594° N · 75.4905° W |
| `mision` | (texto misión, unificado) |
| `vision` | (texto visión, unificado) |

### Portafolio — nuevos campos

| Propiedad | Tipo | Notas |
|---|---|---|
| `Enlace` | url | opcional — demo/repo/video del proyecto |
| `Orden` | number | opcional — curar orden manual en vez de depender solo de `Año` |

(`Tecnologías` ya existe — el cambio es solo de código, ver abajo.)

### Equipo — nuevos campos

| Propiedad | Tipo | Notas |
|---|---|---|
| `Bio` | text | opcional, texto corto |
| `LinkedIn` | url | opcional |

### FAQ — nuevo campo

| Propiedad | Tipo | Notas |
|---|---|---|
| `Categoría` | select | opciones: `General`, `Tecnologías`, `Contacto` |

## Cambios en código (`apps/web`)

1. **`lib/notion/config.ts`** (nuevo) — fetcher `getConfig()` que lee la BD
   Configuración y devuelve un `Record<string, string>` indexado por `Clave` (filtrado
   por `Publicado`), con `"use cache"` + `cacheTag("configuracion")` + `cacheLife("max")`,
   igual patrón que los demás fetchers.
2. **`footer.tsx`, `contact-section.tsx`, `contacto-client.tsx`** — reemplazar los objetos
   `contact`/`contactItems` hardcodeados por datos de `getConfig()`, pasados por props
   desde su page/section padre (Server Component).
3. **`institutional-section.tsx`, `centro/page.tsx`** — Misión/Visión leídas de
   `getConfig()` en vez de JSX hardcodeado duplicado.
4. **`portafolio/[slug]/page.tsx`** — descomentar y renderizar el bloque de
   `project.techStack` (línea ~99-103) usando el campo `Tecnologías` ya mapeado.
5. **`portafolio/[slug]/page.tsx`** — mostrar `project.link` (nuevo campo `Enlace`) si
   existe, como botón adicional junto a "Replicar este proyecto".
6. **`lib/notion/portfolio.ts`** — ordenar por `Orden` si está presente, con fallback a
   `Año` (comportamiento actual) cuando no lo esté.
7. **`lib/notion/team.ts`** — mapear `Bio` y `LinkedIn`; **`TeamMember` type** en
   `lib/institutional-data.ts` gana esos dos campos opcionales; render en
   `team-carousel`/`institutional-section` (mostrar solo si el dato existe).
8. **`lib/notion/faq.ts`** — mapear `Categoría`; `getFaq` acepta un filtro opcional de
   categoría. `/tecnologias` filtra a `Tecnologías` + `General`; `/contacto` sigue
   mostrando todas las publicadas (sin filtro) — es la página de contacto general, tiene
   sentido que agregue cualquier pregunta frecuente. Preguntas sin `Categoría` asignada
   se tratan como `General` (aparecen en `/tecnologias` también) para no romper contenido
   existente que aún no se haya categorizado.
9. **`institutional-preview-section.tsx`** — quitar el array `stats` hardcodeado; el
   componente pasa a recibir `metrics: Metric[]` por props (cargados una vez en la home
   page y compartidos con `hero.tsx`), usando `pickMetrics(metrics, ["tecnologias",
   "proyectos", ...])` igual que en `/centro`.
10. **`ARCHITECTURE.md`** — actualizar la tabla de bases de datos y el bloque de "Contenido
    que NO está en Notion" para reflejar el nuevo estado (incluir Configuración, quitar
    referencia obsoleta al array `allies` que ya no existe).

## Revalidación

`Configuración` se suma a las tags de `POST /api/revalidate`: sin `tag` revalida las
6 bases (antes 5); con `&tag=configuracion` revalida solo esa.

## Fuera de alcance

- No se migra ningún copy puramente decorativo (hero de home, capability strip, "para
  quién", puntos STEM, pasos de proceso del portafolio) — cambia poco y no está duplicado,
  así que forzarlo a Notion añadiría complejidad sin beneficio real.
- No se crean relaciones/logos para `Aliado` en Portafolio (sigue como texto libre) — no
  se pidió y no hay evidencia de necesidad actual.
- No se toca el formulario de contacto (`contacto-client.tsx` `<form>`) — es un mock sin
  backend, fuera del alcance de "bases de datos".
