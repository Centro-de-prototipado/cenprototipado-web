-- Esquema de la Red STEAM Caldas (un schema por app, según ARCHITECTURE.md).
-- Aplicada en el proyecto Supabase «Red STEAM» el 23 nov 2026.
create schema if not exists red;

create table red.municipios (
  codigo text primary key,            -- código DANE de 5 dígitos (17xxx)
  nombre text not null
);

create table red.aulas (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  nombre text not null,
  tipo text not null check (tipo in ('centro', 'municipal', 'colegio')),
  municipio_codigo text not null references red.municipios (codigo),
  institucion text,                   -- institución educativa (aulas de colegio)
  anio_dotacion int,
  descripcion text,
  direccion text,
  latitud numeric(9, 6),
  longitud numeric(9, 6),
  gestor_nombre text,
  whatsapp text,
  correo text,
  foto_url text,                      -- archivo en Cloudflare R2
  activa boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index aulas_municipio_idx on red.aulas (municipio_codigo);

create table red.equipos (
  id bigint generated always as identity primary key,
  aula_id uuid not null references red.aulas (id) on delete cascade,
  categoria text not null,
  nombre text not null,
  descripcion text,
  cantidad int not null default 1 check (cantidad >= 0),
  serial text,
  anio int,
  estado text check (estado in ('funcional', 'inconvenientes', 'danado', 'no_funcional')),
  tipo_dano text,
  frecuencia_uso text check (frecuencia_uso in ('diario', 'semanal', 'mensual', 'ocasional', 'no_se_usa')),
  observaciones text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index equipos_aula_idx on red.equipos (aula_id);

create table red.servicios (
  id bigint generated always as identity primary key,
  aula_id uuid not null references red.aulas (id) on delete cascade,
  nombre text not null,
  descripcion text,
  equipo_base text,
  unidad_cobro text,
  tarifa_min numeric(12, 2),          -- null = «Precio a convenir con el aula»
  tarifa_max numeric(12, 2),
  activo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index servicios_aula_idx on red.servicios (aula_id);

-- Privado: solo gestor y coordinación (políticas cuando exista el inicio de sesión).
create table red.fuentes_ingreso (
  id bigint generated always as identity primary key,
  aula_id uuid not null references red.aulas (id) on delete cascade,
  tipo text not null check (tipo in ('convocatoria', 'venta', 'alcaldia', 'otra')),
  descripcion text,
  created_at timestamptz not null default now()
);
create index fuentes_ingreso_aula_idx on red.fuentes_ingreso (aula_id);

create or replace function red.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger aulas_touch before update on red.aulas for each row execute function red.touch_updated_at();
create trigger equipos_touch before update on red.equipos for each row execute function red.touch_updated_at();
create trigger servicios_touch before update on red.servicios for each row execute function red.touch_updated_at();

alter table red.municipios enable row level security;
alter table red.aulas enable row level security;
alter table red.equipos enable row level security;
alter table red.servicios enable row level security;
alter table red.fuentes_ingreso enable row level security;

create policy "Lectura pública de municipios" on red.municipios for select to anon, authenticated using (true);
create policy "Lectura pública de aulas activas" on red.aulas for select to anon, authenticated using (activa);
create policy "Lectura pública de equipos" on red.equipos for select to anon, authenticated
  using (exists (select 1 from red.aulas a where a.id = aula_id and a.activa));
create policy "Lectura pública de servicios activos" on red.servicios for select to anon, authenticated
  using (activo and exists (select 1 from red.aulas a where a.id = aula_id and a.activa));
-- fuentes_ingreso: sin políticas → sin acceso desde la API pública.

grant usage on schema red to anon, authenticated, service_role;
grant select on red.municipios, red.aulas, red.equipos, red.servicios to anon, authenticated;
grant all on all tables in schema red to service_role;
grant all on all sequences in schema red to service_role;
