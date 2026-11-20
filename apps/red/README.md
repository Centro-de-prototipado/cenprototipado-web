# @cen/red — Red STEAM Caldas

Plataforma de la red de aulas STEAM de Caldas, articulada por el Centro de Prototipado (nodo central en Manizales). Esta es la base de la app: página de inicio con el mapa Blueprint + Neón nocturno y la lista de las 24 aulas del inventario. Los módulos (servicios y cotizador, capacitaciones y certificados, convocatorias, montaje de aulas) llegan en las siguientes etapas.

## Desarrollo

```bash
pnpm install
pnpm dev:red        # http://localhost:3001
```

## Despliegue en Cloudflare Pages (proyecto propio)

La app se exporta como sitio estático (`output: "export"` en `next.config.mjs`, salida en `apps/red/out`). Vercel Hobby no despliega repositorios privados de una organización; Cloudflare Pages sí, sin costo.

1. En Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, autorizar la organización `Centro-de-prototipado` y elegir este repositorio.
2. **Project name:** `red-steam-caldas` (queda en `red-steam-caldas.pages.dev`; si está ocupado, usar otro con «red-steam»).
3. **Production branch:** `main`.
4. **Framework preset:** None. **Root directory:** vacío (raíz del monorepo).
5. **Build command:**
   ```bash
   npx -y pnpm@11.20.0 install --frozen-lockfile && npx -y pnpm@11.20.0 --filter @cen/red build
   ```
6. **Build output directory:** `apps/red/out`
7. Variables de entorno:
   - `NODE_VERSION` = `22`
   - `SKIP_DEPENDENCY_INSTALL` = `1` (la instalación la hace el comando de build con la versión de pnpm del repo)
   - `NEXT_PUBLIC_RED_STEAM_URL` = la dirección final del proyecto
   - `NEXT_PUBLIC_CENTRO_URL` = `https://cenprototipado.vercel.app`
8. En el proyecto de `apps/web`, agregar `NEXT_PUBLIC_RED_STEAM_URL` con la misma dirección y volver a desplegar: es el destino de la pestaña «Red STEAM» del menú.

Cuando la Red necesite servidor (inicio de sesión con Logto, Supabase, formularios), migrar a `@opennextjs/cloudflare` (Cloudflare Workers) y quitar `output: "export"`.

## Notas

- Identidad visual: mismos tokens que `apps/web` (copiados en `app/globals.css` hasta que `packages/ui` deje de ser un stub), con dos ajustes de accesibilidad: texto oscuro sobre el cian y enlaces en cyan-700.
- Datos de aulas en `lib/aulas.ts`, con la ubicación aproximada de cada municipio. Pasarán al schema `red` de Supabase cuando se conecte `packages/db`.
- Pendiente según ARCHITECTURE.md: cliente OIDC en Logto, schema `red` en Supabase y tipos en `packages/db`.
