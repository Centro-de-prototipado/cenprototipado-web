# Base de datos de la Red (Supabase · schema `red`)

Proyecto Supabase: **Red STEAM** (`hlbvnqxobjetnikxozre`). Las migraciones de `migrations/` ya están aplicadas.

| Tabla | Contenido | Lectura pública |
| --- | --- | --- |
| `municipios` | 27 municipios de Caldas (código DANE) | Sí |
| `aulas` | Centro + 11 aulas municipales + 13 de colegio | Sí (solo activas) |
| `equipos_catalogo` | 83 modelos de equipo con categoría y descripción | Sí |
| `equipos` | 683 registros de inventario por aula (1.484 unidades) | Sí |
| `servicios` | Servicios tipo por aula según su dotación; tarifa opcional | Sí (solo activos) |
| `fuentes_ingreso` | Fuentes de ingreso de cada aula | No (privada) |

Datos iniciales: inventario «Inventario equipos aulas STEM Manizales_Caldas.xlsx» (cargado el 23 nov 2026).

## Exponer el schema en la API

El schema `red` se expuso con:

```sql
alter role authenticator set pgrst.db_schemas = 'public, graphql_public, red';
notify pgrst, 'reload config';
```

Para que el ajuste no se pierda, agrégalo también en el panel de Supabase: **Project Settings → Data API → Exposed schemas → `red`**.

## Archivos

Fotos y documentos de las aulas y proyectos irán en **Cloudflare R2** (la columna `foto_url` guarda la URL pública).
