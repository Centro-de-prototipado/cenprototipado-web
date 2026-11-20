# @cen/red — Red STEAM Caldas

Plataforma de la red de aulas STEAM de Caldas, articulada por el Centro de Prototipado (nodo central en Manizales). Esta es la base de la app: página de inicio con el mapa Blueprint + Neón nocturno y la lista de las 24 aulas del inventario. Los módulos (servicios y cotizador, capacitaciones y certificados, convocatorias, montaje de aulas) llegan en las siguientes etapas.

## Desarrollo

```bash
pnpm install
pnpm dev:red        # http://localhost:3001
```

## Despliegue en Vercel (proyecto propio)

1. En Vercel: **Add New → Project** e importar este mismo repositorio.
2. **Root Directory:** `apps/red`. Vercel detecta Next.js y pnpm.
3. **Project name:** `red-steam-caldas` (queda en `red-steam-caldas.vercel.app`; si el nombre está ocupado, usar otro con «red-steam»).
4. Variables de entorno:
   - `NEXT_PUBLIC_RED_STEAM_URL` = la dirección final del proyecto.
   - `NEXT_PUBLIC_CENTRO_URL` = `https://cenprototipado.vercel.app`.
5. En el proyecto de `apps/web`, agregar `NEXT_PUBLIC_RED_STEAM_URL` con la misma dirección y volver a desplegar: es el destino de la pestaña «Red STEAM» del menú.

> El plan Hobby de Vercel no permite uso comercial (ver ARCHITECTURE.md). La Red no cobra en línea, pero conviene confirmarlo con el Centro.

## Notas

- Identidad visual: mismos tokens que `apps/web` (copiados en `app/globals.css` hasta que `packages/ui` deje de ser un stub), con dos ajustes de accesibilidad: texto oscuro sobre el cian y enlaces en cyan-700.
- Datos de aulas en `lib/aulas.ts`, con la ubicación aproximada de cada municipio. Pasarán al schema `red` de Supabase cuando se conecte `packages/db`.
- Pendiente según ARCHITECTURE.md: cliente OIDC en Logto, schema `red` en Supabase y tipos en `packages/db`.
