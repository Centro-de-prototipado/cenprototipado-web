-- Aplicada en el proyecto Supabase «Red STEAM» el 25 nov 2026.
-- Gestión de roles de la Red (Etapa 3, tarea 2).
-- coordinador/admin asignan gestores; solo admin asigna coordinadores y admins.
-- Se invita por correo: si la persona ya tiene cuenta confirmada, el rol se aplica al
-- instante; si no, queda en red.invitaciones y se aplica cuando confirma su correo.
-- La primera administración se asigna a mano (ver packages/auth/README.md).

create or replace function red.es_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from red.miembros m where m.user_id = (select auth.uid()) and m.rol = 'admin');
$$;
grant execute on function red.es_admin() to authenticated;

drop policy "Coordinación asigna roles" on red.miembros;
drop policy "Coordinación quita roles" on red.miembros;
create policy "Coordinación asigna roles" on red.miembros for insert to authenticated
  with check (red.es_coordinador() and (rol = 'gestor' or red.es_admin()));
create policy "Coordinación quita roles" on red.miembros for delete to authenticated
  using (red.es_coordinador() and (rol = 'gestor' or red.es_admin()) and user_id <> (select auth.uid()));

create table red.invitaciones (
  id bigint generated always as identity primary key,
  email text not null check (email = lower(trim(email)) and email like '%@%'),
  rol text not null check (rol in ('gestor', 'coordinador', 'admin')),
  aula_id uuid references red.aulas (id) on delete cascade,
  creado_por uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  constraint invitaciones_aula_segun_rol check ((rol = 'gestor') = (aula_id is not null)),
  unique nulls not distinct (email, aula_id, rol)
);
alter table red.invitaciones enable row level security;
create policy "Coordinación ve invitaciones" on red.invitaciones for select to authenticated using (red.es_coordinador());
create policy "Coordinación cancela invitaciones" on red.invitaciones for delete to authenticated
  using (red.es_coordinador() and (rol = 'gestor' or red.es_admin()));
grant select, delete on red.invitaciones to authenticated;
grant all on red.invitaciones to service_role;

create or replace function red.invitar(p_email text, p_rol text, p_aula uuid default null)
returns text
language plpgsql security definer set search_path = '' as $$
declare
  v_email text := lower(trim(p_email));
  v_user uuid;
begin
  if not red.es_coordinador() then
    raise exception 'Solo la coordinación de la red puede asignar roles' using errcode = '42501';
  end if;
  if p_rol <> 'gestor' and not red.es_admin() then
    raise exception 'Solo la administración puede asignar coordinadores o administradores' using errcode = '42501';
  end if;
  if p_rol not in ('gestor', 'coordinador', 'admin') then
    raise exception 'Rol no válido';
  end if;
  if (p_rol = 'gestor') <> (p_aula is not null) then
    raise exception 'El rol de gestor necesita un aula (y los demás roles no llevan aula)';
  end if;

  select u.id into v_user from auth.users u
  where lower(u.email) = v_email and u.email_confirmed_at is not null;

  if v_user is not null then
    insert into red.miembros (user_id, aula_id, rol) values (v_user, p_aula, p_rol)
    on conflict do nothing;
    return 'asignado';
  end if;

  insert into red.invitaciones (email, rol, aula_id, creado_por)
  values (v_email, p_rol, p_aula, (select auth.uid()))
  on conflict do nothing;
  return 'invitado';
end;
$$;
revoke execute on function red.invitar(text, text, uuid) from public, anon;
grant execute on function red.invitar(text, text, uuid) to authenticated;

create or replace function red.listar_miembros()
returns table (id bigint, user_id uuid, nombre text, email text, rol text, aula_id uuid, aula_nombre text, created_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select m.id, m.user_id, p.nombre, u.email::text, m.rol, m.aula_id, a.nombre, m.created_at
  from red.miembros m
  join auth.users u on u.id = m.user_id
  left join public.perfiles p on p.id = m.user_id
  left join red.aulas a on a.id = m.aula_id
  where red.es_coordinador()
  order by case m.rol when 'admin' then 0 when 'coordinador' then 1 else 2 end, a.nombre, p.nombre;
$$;
revoke execute on function red.listar_miembros() from public, anon;
grant execute on function red.listar_miembros() to authenticated;

create or replace function red.aplicar_invitaciones() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email_confirmed_at is not null then
    insert into red.miembros (user_id, aula_id, rol)
    select new.id, i.aula_id, i.rol from red.invitaciones i where i.email = lower(new.email)
    on conflict do nothing;
    delete from red.invitaciones i where i.email = lower(new.email);
  end if;
  return new;
end;
$$;
revoke execute on function red.aplicar_invitaciones() from public, anon, authenticated;
create trigger al_confirmar_correo_aplicar_invitaciones
  after insert or update of email_confirmed_at on auth.users
  for each row execute function red.aplicar_invitaciones();
