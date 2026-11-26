-- Aplicada en el proyecto Supabase «Red STEAM» el 26 nov 2026.
-- Aprende (Semana 4): charlas presenciales del Centro y credenciales propias
-- (insignia + certificado PDF + verificación pública). Las mismas credenciales servirán
-- luego para los cursos (tipo 'curso').
create schema if not exists aprende;
grant usage on schema aprende to anon, authenticated, service_role;

create table aprende.charlas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (char_length(trim(titulo)) between 3 and 160),
  descripcion text check (char_length(descripcion) <= 2000),
  fecha date not null,
  horas numeric(4,1) not null check (horas > 0 and horas <= 200),
  lugar text check (char_length(lugar) <= 200),
  creado_por uuid references auth.users (id) on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);

create table aprende.credenciales (
  id uuid primary key default gen_random_uuid(),
  codigo text not null unique,
  user_id uuid not null references auth.users (id) on delete cascade,
  nombre text not null,
  tipo text not null check (tipo in ('charla', 'curso')),
  charla_id uuid references aprende.charlas (id) on delete cascade,
  titulo text not null,
  horas numeric(4,1) not null,
  fecha date not null,
  emitida_at timestamptz not null default now(),
  revocada boolean not null default false,
  constraint credenciales_origen check ((tipo = 'charla') = (charla_id is not null)),
  unique (user_id, charla_id)
);
create index credenciales_user_idx on aprende.credenciales (user_id);

-- Código legible y difícil de adivinar: CP-XXXX-XXXX (sin 0/O/1/I).
create or replace function aprende.nuevo_codigo() returns text
language plpgsql volatile set search_path = '' as $$
declare
  alfabeto constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  b bytea := extensions.gen_random_bytes(8);
  s text := '';
begin
  for i in 0..7 loop
    s := s || substr(alfabeto, (get_byte(b, i) % 32) + 1, 1);
  end loop;
  return 'CP-' || substr(s, 1, 4) || '-' || substr(s, 5, 4);
end;
$$;

alter table aprende.charlas enable row level security;
alter table aprende.credenciales enable row level security;

create policy "Lectura pública de charlas" on aprende.charlas for select to anon, authenticated using (true);
create policy "Coordinación crea charlas" on aprende.charlas for insert to authenticated with check (red.es_coordinador());
create policy "Coordinación edita charlas" on aprende.charlas for update to authenticated using (red.es_coordinador()) with check (red.es_coordinador());
create policy "Coordinación borra charlas" on aprende.charlas for delete to authenticated using (red.es_coordinador());
grant select on aprende.charlas to anon;
grant select, insert, update, delete on aprende.charlas to authenticated;

create policy "Cada quien ve sus credenciales" on aprende.credenciales for select to authenticated
  using (user_id = (select auth.uid()) or red.es_coordinador());
grant select on aprende.credenciales to authenticated;
grant all on aprende.charlas, aprende.credenciales to service_role;

-- Personas registradas (para marcar asistentes). Solo coordinación.
create or replace function aprende.listar_personas()
returns table (user_id uuid, nombre text, email text)
language sql stable security definer set search_path = '' as $$
  select u.id, p.nombre, u.email::text
  from auth.users u left join public.perfiles p on p.id = u.id
  where red.es_coordinador() and u.email_confirmed_at is not null
  order by coalesce(p.nombre, u.email::text);
$$;
revoke execute on function aprende.listar_personas() from public, anon;
grant execute on function aprende.listar_personas() to authenticated;

-- Guarda la lista de asistentes de una charla: emite credencial a quien se marcó y retira
-- la de quien se desmarcó. Devuelve cuántas quedaron.
create or replace function aprende.guardar_asistentes(p_charla uuid, p_usuarios uuid[])
returns integer
language plpgsql security definer set search_path = '' as $$
declare
  c aprende.charlas%rowtype;
  total integer;
begin
  if not red.es_coordinador() then
    raise exception 'Solo la coordinación puede registrar asistentes' using errcode = '42501';
  end if;
  select * into c from aprende.charlas where id = p_charla;
  if not found then raise exception 'La charla no existe'; end if;

  delete from aprende.credenciales cr
  where cr.charla_id = p_charla and not (cr.user_id = any (coalesce(p_usuarios, '{}')));

  insert into aprende.credenciales (codigo, user_id, nombre, tipo, charla_id, titulo, horas, fecha)
  select aprende.nuevo_codigo(), u.id, coalesce(nullif(trim(p.nombre), ''), u.email), 'charla', c.id, c.titulo, c.horas, c.fecha
  from auth.users u left join public.perfiles p on p.id = u.id
  where u.id = any (coalesce(p_usuarios, '{}'))
  on conflict (user_id, charla_id) do nothing;

  select count(*) into total from aprende.credenciales where charla_id = p_charla;
  return total;
end;
$$;
revoke execute on function aprende.guardar_asistentes(uuid, uuid[]) from public, anon;
grant execute on function aprende.guardar_asistentes(uuid, uuid[]) to authenticated;

-- Verificación pública por código (no expone correo ni id de usuario).
create or replace function aprende.verificar(p_codigo text)
returns table (codigo text, nombre text, tipo text, titulo text, horas numeric, fecha date, emitida_at timestamptz, revocada boolean)
language sql stable security definer set search_path = '' as $$
  select c.codigo, c.nombre, c.tipo, c.titulo, c.horas, c.fecha, c.emitida_at, c.revocada
  from aprende.credenciales c where c.codigo = upper(trim(p_codigo));
$$;
grant execute on function aprende.verificar(text) to anon, authenticated;

alter role authenticator set pgrst.db_schemas = 'public, graphql_public, red, aprende';
notify pgrst, 'reload config';
