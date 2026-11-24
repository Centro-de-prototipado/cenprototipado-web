-- Cuentas compartidas Centro + Red (Supabase Auth). Una persona = un usuario de auth.users.
-- Aplicada en el proyecto Supabase «Red STEAM» el 24 nov 2026.

-- Perfil global (compartido por todas las apps del monorepo).
create table public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  nombre text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Se crea solo al registrarse, con el nombre que puso en el formulario.
create or replace function public.crear_perfil() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.perfiles (id, nombre)
  values (new.id, nullif(trim(new.raw_user_meta_data ->> 'nombre'), ''));
  return new;
end;
$$;
create trigger al_crear_usuario after insert on auth.users
  for each row execute function public.crear_perfil();
-- Solo la usa el trigger: no debe llamarse por la API.
revoke execute on function public.crear_perfil() from public, anon, authenticated;

alter table public.perfiles enable row level security;
create policy "Cada quien ve su perfil" on public.perfiles for select to authenticated using (id = (select auth.uid()));
create policy "Cada quien edita su perfil" on public.perfiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
grant select, update (nombre) on public.perfiles to authenticated;

-- Roles de la Red. Toda persona registrada es participante (no necesita fila).
-- gestor: de un aula concreta. coordinador / admin: de toda la red (aula_id null).
create table red.miembros (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  aula_id uuid references red.aulas (id) on delete cascade,
  rol text not null check (rol in ('gestor', 'coordinador', 'admin')),
  created_at timestamptz not null default now(),
  constraint miembros_aula_segun_rol check ((rol = 'gestor') = (aula_id is not null)),
  unique nulls not distinct (user_id, aula_id, rol)
);
create index miembros_user_idx on red.miembros (user_id);

-- ¿El usuario actual coordina o administra la red? (security definer: evita recursión en RLS)
create or replace function red.es_coordinador() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from red.miembros m
    where m.user_id = (select auth.uid()) and m.rol in ('coordinador', 'admin')
  );
$$;

alter table red.miembros enable row level security;
create policy "Cada quien ve sus roles" on red.miembros for select to authenticated
  using (user_id = (select auth.uid()) or red.es_coordinador());
create policy "Coordinación asigna roles" on red.miembros for insert to authenticated with check (red.es_coordinador());
create policy "Coordinación quita roles" on red.miembros for delete to authenticated using (red.es_coordinador());
grant select, insert, delete on red.miembros to authenticated;
grant all on red.miembros to service_role;
grant execute on function red.es_coordinador() to authenticated;
