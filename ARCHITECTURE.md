# Arquitectura — cenprototipado

Monorepo Turborepo para todas las aplicaciones del Centro de Prototipado (UNAL).

## Estructura

```
cenprototipado/
├── apps/
│   ├── web/          @cen/web        — landing y sitio corporativo (Next.js)
│   ├── dashboard/    @cen/dashboard  — plataforma interna del equipo (Next.js) [futuro]
│   └── lms/          @cen/lms        — repositorio de recursos + YouTube embeds (Next.js) [futuro]
├── packages/
│   ├── ui/           @cen/ui         — componentes shadcn/ui compartidos
│   ├── auth/         @cen/auth       — cliente Logto, hooks, middleware helpers
│   └── db/           @cen/db         — cliente Supabase + tipos generados
├── turbo.json
└── pnpm-workspace.yaml
```

## Convenciones de nombres

| Ámbito | Patrón | Ejemplos |
|--------|--------|---------|
| Packages npm | `@cen/<nombre>` | `@cen/ui`, `@cen/auth`, `@cen/db` |
| Apps internas | nombre corto, sin sufijos | `web`, `dashboard`, `lms` |
| Nuevas apps | `apps/<nombre>/` | `apps/eventos/`, `apps/blog/` |
| Nuevos packages | `packages/<nombre>/` | `packages/email/`, `packages/analytics/` |
| Dominios | `<app>.centrodeprototipado.unal.edu.co` | `dashboard.centrodeprototipado…` |

## Convenciones del monorepo

### Dependencias

Cada dependencia vive **donde se usa**, no todo en la raíz:

| `package.json` | Qué va ahí |
|----------------|-----------|
| Raíz | Solo tooling del monorepo: `turbo`, `prettier`, `typescript` |
| `apps/<app>` | Las deps de esa app (`next`, `three`, etc.) |
| `packages/ui` | `react` como `peerDependency` (lo provee la app, no se duplica) |

Instalar siempre con `--filter` apuntando al workspace:
```bash
pnpm add zod --filter @cen/web            # runtime dep en una app
pnpm add -D vitest --filter @cen/inventory # dev dep en una app
pnpm add @cen/ui --filter @cen/dashboard --workspace  # usar un package interno
```

### Versiones compartidas — pnpm catalog

Las versiones de las deps transversales (`react`, `next`, `typescript`, `eslint`, `prettier`, `tailwindcss`, `@types/*`) se fijan **en un solo lugar**: el bloque `catalog:` de `pnpm-workspace.yaml`. En cada `package.json` se referencian con `"catalog:"` en vez de la versión literal:

```jsonc
"dependencies": {
  "react": "catalog:",
  "next": "catalog:"
}
```

Así todas las apps usan la misma versión de React/Next/TS y se evita el bug de "funciona en una app pero no en otra". Para subir una versión, se cambia una sola línea en el catalog.

### Skills de IA (Claude Code)

Viven en la **raíz** del monorepo (`.claude/skills/`, `.agents/skills/`) — compartidas por todas las apps. No se ponen por-app.

- `skills-lock.json` y el contenido de las skills **se commitean** (el equipo comparte las mismas).
- `.claude/settings.local.json` está **gitignoreado** — es config personal de cada dev (permisos, etc.). El `settings.json` compartido sí se commitea.

## Stack tecnológico

| Capa | Herramienta | Razón |
|------|-------------|-------|
| Framework | Next.js 16 App Router | SSR, file-based routing, RSC |
| Monorepo | Turborepo + pnpm workspaces | build cache, paralelismo, compartir packages |
| Identidad / SSO | **Logto self-hosted** (Railway ~$5) | OIDC/OAuth 2.1 estándar — una cuenta para todas las apps |
| Datos / DB | **Supabase** (un proyecto) | PostgreSQL + RLS atada al JWT de Logto; un schema por app |
| Archivos | **Cloudflare R2** | 10 GB free + cero egress (vs 1 GB de Supabase Storage) |
| UI | shadcn/ui + Tailwind v4 | en `@cen/ui` compartido |
| Deploy | **Cloudflare Pages** ó Vercel Pro | ver nota de uso comercial abajo |

> **Por qué Supabase y no Neon:** se evaluó Neon (Postgres serverless, scale-to-zero). Se descartó porque el proyecto **sí usa storage de archivos y RLS atada al JWT de Logto**; Neon es Postgres puro (sin storage ni RLS-por-JWT integrado), lo que obligaría a sumar R2 + construir la capa de authz a mano. Neon solo convendría si fuéramos *solo base de datos sin archivos*.

## Identidad centralizada (Logto)

Logto actúa como Identity Provider (IdP) OIDC. Cada app se registra como un "Application" (cliente OIDC) en Logto:

```
Logto
├── Application: @cen/dashboard  (tipo: Traditional Web)
├── Application: @cen/lms        (tipo: Traditional Web)
├── Application: @cen/inventory  (tipo: Traditional Web)
└── Application: app-móvil       (tipo: Native — futuro)
```

`@cen/web` (marketing) es público y NO necesita Application.

### Por qué self-hosted y no Cloud

El free tier de **Logto Cloud limita a 3 Applications**. Como el proyecto es multi-app (dashboard, lms, inventory, + futuras), se pasa de 3 enseguida. Pasar a Pro cuesta $24/mes.

**Logto self-hosted (OSS)** elimina ese límite: Applications ilimitadas, MAU ilimitados, y RBAC/Organizations incluidos gratis. Se despliega en Railway (~$5/mes) con un servicio `logto` + un Postgres. Agregar una app nueva = registrar un OIDC client en Logto (5 min), sin cambios en el resto.

> El `sub` del JWT de Logto es el **user_id global** — idéntico en todas las apps. Esa es la identidad universal "una cuenta para todo cenprototipado".

## Supabase — un proyecto, un schema por app

Regla: **un schema = una app del monorepo** (`apps/<app>` ↔ `schema <app>`). El schema `public` guarda solo lo verdaderamente compartido entre apps.

```
supabase/  (un proyecto)
├── schema: public      ← compartido: users (espejo de Logto)
├── schema: dashboard   ← solo dashboard  (apps/dashboard)
├── schema: lms         ← solo lms        (apps/lms)
├── schema: inventory   ← solo inventory  (apps/inventory)
└── schema: <nueva_app> ← cuando se agregue
```

Habilitar los schemas en la API de Supabase (`extra_search_path` / config.toml):
```toml
[api]
extra_search_path = ["public", "dashboard", "lms", "inventory"]
```

### Identidad: `public.users` global + `profiles` por app

```
GLOBAL  (una sola vez)
└── public.users (sub PK, email, nombre, avatar)
    └── se llena con un webhook de Logto (evento User.Created)

LOCAL POR APP  (un profile por schema, con su propio rol)
├── inventory.profiles  (user_id → public.users.sub, role, department)
├── lms.profiles        (user_id, role, enrolled_at)
└── dashboard.profiles  (user_id, role, team)
```

- **Datos de la persona** (nombre, email) → `public.users` (global).
- **Rol y datos de contexto** → `profiles` de cada app (local). El mismo usuario puede ser `admin` en inventory y `viewer` en dashboard sin conflicto.
- Una app **nunca** escribe en el schema de otra. Si lo necesita → esa data va en `public`.

### Roles: enum fijo por app

Los roles son **fijos** (no configurables en runtime), así que se modelan como `enum` por schema — type-safe y sin joins:

```sql
create type inventory.app_role as enum ('admin', 'staff', 'viewer');

create table inventory.profiles (
  user_id    text primary key references public.users(sub),
  role       inventory.app_role not null default 'viewer',
  department text
);
```

### RLS con el JWT de Logto

Supabase valida el JWT de Logto vía Third-Party Auth. El `user_id` en las tablas es `text` (el `sub` de Logto), **no** un uuid de `auth.users`. Las políticas leen el claim directo:

```sql
-- el propio usuario lee su registro
create policy "propio usuario"
on lms.progreso for select
using ((auth.jwt() ->> 'sub') = user_id);

-- admin del app (rol consultado en profiles — siempre fresco)
create policy "admin de inventory"
on inventory.inventory_items for all
using (exists (
  select 1 from inventory.profiles p
  where p.user_id = (auth.jwt() ->> 'sub') and p.role = 'admin'
));
```

> Nota: la data de autorización va en `app_metadata` del token (no editable por el usuario), nunca en `user_metadata`.

## LMS — diseño simplificado

No hay hosting de video. Los recursos son:
- **Video**: `youtube_id` (embed de video no listado/privado de YouTube)
- **Documento**: URL de **Cloudflare R2** (PDF, presentación) — ver sección de archivos
- **Enlace**: URL externa

Tablas mínimas:
```
lms.modulos     (id, titulo, descripcion, orden)
lms.recursos    (id, modulo_id, tipo, titulo, youtube_id, r2_key, url_externa)
lms.progreso    (user_id, recurso_id, completado_at)
```

## Archivos — Cloudflare R2

Los archivos (PDFs, documentos, imágenes pesadas) van a **Cloudflare R2**, no a Supabase Storage.

**Por qué:** Supabase Storage da solo **1 GB** en free tier (se llena con ~200-500 PDFs → es el primer muro). R2 da **10 GB gratis y cero costo de egress**. La DB guarda solo la `r2_key`; el archivo vive en R2.

```
Supabase  → metadata (la fila con r2_key)
R2        → el archivo binario
```

## Límites del free tier y cuándo se rompen

| Servicio | Límite gratis | Qué pasa al llegar | Primer muro |
|----------|--------------|-------------------|-------------|
| Supabase DB | 500 MB | Rechaza escrituras | lejano (meses/años) |
| Supabase Storage | 1 GB | Rechaza uploads | **mitigado** → se usa R2 |
| Supabase pausa | 7 días sin queries | Pausa **manual** ⚠️ | mitigado → cron anti-pausa |
| Cloudflare R2 | 10 GB + egress gratis | Cobra el delta | lejano |
| Logto (self-host) | ilimitado (OSS) | — | solo hosting Railway ~$5 |
| Railway Hobby | $5 incluye $5 de uso | Cobra el delta | Logto + Postgres caben |
| Cloudflare Pages | sin límite comercial | — | sin el problema de Vercel |

### Dos trampas a tener presentes

1. **Supabase se pausa tras 7 días sin actividad y hay que despausar a mano.** Mitigación: un **cron semanal** (GitHub Action o Cloudflare Cron) que ejecute `select 1`. En producción real, Supabase Pro ($25/mes) elimina la pausa.

2. **Vercel Hobby (gratis) es solo uso NO comercial.** Un sitio oficial de un centro UNAL es uso institucional → viola el ToS del free tier. Por eso el deploy por defecto es **Cloudflare Pages** (free sin restricción comercial, Next.js vía adapter OpenNext). Alternativa: Vercel Pro ($20/dev/mes).

## Tipos generados por schema

Cada schema genera sus tipos en `@cen/db`, mapeando 1:1 con su app:

```bash
supabase gen types typescript --schema inventory > packages/db/src/schemas/inventory.ts
```

```
packages/db/src/
├── schemas/
│   ├── public.ts      ← users global
│   ├── inventory.ts
│   ├── lms.ts
│   └── dashboard.ts
└── index.ts           ← re-exporta + helper supabase.schema('<app>')
```

## Escalar: agregar una app nueva

1. `cp -r apps/dashboard apps/nueva-app`
2. Cambiar `name` en `package.json` a `@cen/nueva-app`
3. Registrar OIDC client en Logto (self-hosted → ilimitado)
4. Crear schema `nueva_app` en Supabase + agregarlo a `extra_search_path`
5. Crear `nueva_app.profiles` con su enum de roles
6. Generar tipos en `packages/db/src/schemas/nueva-app.ts`
7. Agregar proyecto en Vercel

El monorepo, la auth y la DB ya están listos — solo se conecta.

## Comandos raíz

```bash
pnpm dev              # todas las apps en paralelo
pnpm dev:web          # solo marketing
pnpm dev:dashboard    # solo dashboard
pnpm dev:lms          # solo lms
pnpm build            # build de todas (con caché Turborepo)
pnpm lint             # lint de todo
pnpm typecheck        # typecheck de todo
```
