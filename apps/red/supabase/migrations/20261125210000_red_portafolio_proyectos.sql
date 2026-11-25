-- Aplicada en el proyecto Supabase «Red STEAM» el 25 nov 2026.
-- Portafolio colaborativo (Etapa 3, tarea 4).
-- Cada aula publica sus proyectos. El público ve los publicados; el gestor del aula y la
-- coordinación crean, editan, ocultan y borran. Las fotos se suben más adelante a R2
-- (portada_url queda lista para eso).

create or replace function red.gestiona_aula(p_aula uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select red.es_coordinador() or exists (
    select 1 from red.miembros m
    where m.user_id = (select auth.uid()) and m.rol = 'gestor' and m.aula_id = p_aula
  );
$$;
grant execute on function red.gestiona_aula(uuid) to authenticated;

create table red.proyectos (
  id uuid primary key default gen_random_uuid(),
  aula_id uuid not null references red.aulas (id) on delete cascade,
  titulo text not null check (char_length(trim(titulo)) between 3 and 120),
  resumen text not null check (char_length(trim(resumen)) between 10 and 280),
  descripcion text check (char_length(descripcion) <= 5000),
  area text not null default 'otra' check (area in ('robotica', 'impresion_3d', 'electronica', 'programacion', 'realidad_virtual', 'diseno', 'ciencias', 'otra')),
  anio smallint check (anio between 2015 and 2100),
  participantes text check (char_length(participantes) <= 500),
  enlace text check (enlace ~ '^https?://'),
  portada_url text check (portada_url ~ '^https?://'),
  publicado boolean not null default false,
  creado_por uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index proyectos_aula_idx on red.proyectos (aula_id);
create index proyectos_publicados_idx on red.proyectos (created_at desc) where publicado;

create or replace function red.tocar_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
create trigger proyectos_updated_at before update on red.proyectos
  for each row execute function red.tocar_updated_at();

alter table red.proyectos enable row level security;

create policy "Lectura pública de proyectos publicados" on red.proyectos for select to anon, authenticated
  using (publicado and exists (select 1 from red.aulas a where a.id = proyectos.aula_id and a.activa));
create policy "Gestor y coordinación ven los proyectos de su aula" on red.proyectos for select to authenticated
  using (red.gestiona_aula(aula_id));
create policy "Gestor y coordinación crean proyectos" on red.proyectos for insert to authenticated
  with check (red.gestiona_aula(aula_id));
create policy "Gestor y coordinación editan proyectos" on red.proyectos for update to authenticated
  using (red.gestiona_aula(aula_id)) with check (red.gestiona_aula(aula_id));
create policy "Gestor y coordinación borran proyectos" on red.proyectos for delete to authenticated
  using (red.gestiona_aula(aula_id));

grant select on red.proyectos to anon;
grant select, insert, update, delete on red.proyectos to authenticated;
grant all on red.proyectos to service_role;
