-- Catálogo común de modelos de equipo: la dotación se repite entre aulas, así que la
-- descripción y la categoría viven una sola vez aquí y cada aula registra sus unidades.
create table red.equipos_catalogo (
  id bigint generated always as identity primary key,
  nombre text not null unique,
  categoria text not null,
  descripcion text,
  created_at timestamptz not null default now()
);

alter table red.equipos add column catalogo_id bigint references red.equipos_catalogo (id);
create index equipos_catalogo_idx on red.equipos (catalogo_id);

alter table red.equipos_catalogo enable row level security;
create policy "Lectura pública del catálogo de equipos" on red.equipos_catalogo for select to anon, authenticated using (true);
grant select on red.equipos_catalogo to anon, authenticated;
grant all on red.equipos_catalogo to service_role;
