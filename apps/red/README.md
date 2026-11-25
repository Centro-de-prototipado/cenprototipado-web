# @cen/red — Red STEAM Caldas

Plataforma de la red de aulas STEAM de Caldas, articulada por el Centro de Prototipado (nodo central en Manizales). Incluye la página de inicio con el mapa Blueprint + Neón nocturno y una página de perfil por aula (`/aulas/[slug]`) con sus servicios y su contacto, todo leído de Supabase. El inventario de equipos es privado (solo lo ven el gestor del aula y la coordinación con sesión iniciada). El mapa se amplía a Manizales para mostrar las aulas de colegio (límites de OpenStreetMap, `lib/manizales-geo.ts`). Los módulos (cotizador, capacitaciones y certificados, convocatorias, montaje de aulas) llegan en las siguientes etapas.

## Desarrollo

```bash
cp apps/red/.env.example apps/red/.env.local   # completar URL y clave publicable de Supabase
pnpm install
pnpm dev:red        # http://localhost:3001
```

Los datos vienen del schema `red` del proyecto Supabase «Red STEAM» (ver `supabase/README.md`). Como la app es estática, **los cambios en la base de datos se ven al volver a compilar y desplegar**.

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
   - `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` = los del proyecto Supabase «Red STEAM»
8. En el proyecto de `apps/web`, agregar `NEXT_PUBLIC_RED_STEAM_URL` con la misma dirección y volver a desplegar: es el destino de la pestaña «Red STEAM» del menú.

Cuando la Red necesite servidor (inicio de sesión con Logto, Supabase, formularios), migrar a `@opennextjs/cloudflare` (Cloudflare Workers) y quitar `output: "export"`.

## Notas

- Identidad visual: mismos tokens que `apps/web` (copiados en `app/globals.css` hasta que `packages/ui` deje de ser un stub), con dos ajustes de accesibilidad: texto oscuro sobre el cian y enlaces en cyan-700.
- Datos: `lib/red-data.ts` (cliente Supabase de solo lectura; pasará a `packages/db` cuando ese paquete se llene). Mapa: `lib/caldas-geo.ts` con los límites municipales del DANE.
- Archivos (fotos de aulas y proyectos): Cloudflare R2.
- Inicio de sesión: será el mismo del sitio del Centro (pendiente de que el Centro lo ponga en funcionamiento), compartido por ambas apps.
