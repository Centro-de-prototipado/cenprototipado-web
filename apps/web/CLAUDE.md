# CLAUDE.md — apps/web

Guidance specific to `@cen/web` (the Next.js marketing app). See the root [CLAUDE.md](../../CLAUDE.md) for monorepo-wide guidance and [ARCHITECTURE.md](./ARCHITECTURE.md) for the full app architecture.

### Data Flow (Notion CMS)

Editorial content (Portfolio, Technologies, Team, FAQ) lives in **Notion data sources**, read server-side via `@notionhq/client` in **`lib/notion/*`** (`portfolio.ts`, `technologies.ts`, `team.ts`, `faq.ts`). Reads are filtered by `Publicado = true`, mapped to domain types, and wrapped in `unstable_cache` with tags (`portafolio`, `tecnologias`, `equipo`, `faq`). Pages are async Server Components; client sections receive data as props.

Portfolio uses a **hybrid** model: structured Notion properties feed the layout, and the page body is fetched as markdown (`pages.retrieveMarkdown()`) and rendered with `react-markdown`. Update after editing Notion via `POST /api/revalidate?secret=…[&tag=…]`. Notion property/DB details and data-source IDs live in [ARCHITECTURE.md](./ARCHITECTURE.md).

### Key Conventions

- **Server Components by default** — only add `"use client"` for interactive features (hooks, event handlers)
- **Styling**: Tailwind v4 + CSS custom properties in `app/globals.css`. Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) for conditional classes
- **Theme**: Dark mode default; "D" key hotkey toggles theme (configured in `components/layout/theme-provider.tsx`)
- **Responsive**: Mobile-first with `md:` / `lg:` breakpoints; `useIsMobile()` hook for runtime detection (768px breakpoint)
- **3D**: `components/sections/hero-robot.tsx` uses Three.js — keep heavy imports client-only

### Fonts & Assets

Custom `AncizarSans` variable font (weight 400–900) loaded from `/fonts/`. Static assets in `/public/`.

### Path Alias

`@/*` maps to the repo root — use it for all internal imports.
