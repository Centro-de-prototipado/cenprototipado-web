-- Aplicada en el proyecto Supabase «Red STEAM» el 25 nov 2026.
-- Panel de administración (Etapa 3, tarea 5): el gestor de un aula y la coordinación
-- editan los datos públicos del aula. Solo se permiten estas columnas; nombre, tipo,
-- municipio y ubicación siguen cambiándose desde la base de datos.
create policy "Gestor y coordinación editan los datos del aula" on red.aulas for update to authenticated
  using (red.gestiona_aula(id)) with check (red.gestiona_aula(id));
grant update (descripcion, direccion, gestor_nombre, whatsapp, correo) on red.aulas to authenticated;

alter table red.aulas
  add constraint aulas_whatsapp_formato check (whatsapp is null or whatsapp ~ '^\+?[0-9 ]{7,20}$'),
  add constraint aulas_correo_formato check (correo is null or correo ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  add constraint aulas_descripcion_largo check (descripcion is null or char_length(descripcion) <= 1000);

-- Resumen de la red para el panel de administración (solo coordinación).
create or replace function red.resumen_red()
returns table (aulas bigint, gestores bigint, aulas_sin_gestor bigint, proyectos_publicados bigint, proyectos_borrador bigint, invitaciones bigint)
language sql stable security definer set search_path = '' as $$
  select
    (select count(*) from red.aulas where activa),
    (select count(distinct user_id) from red.miembros where rol = 'gestor'),
    (select count(*) from red.aulas a where a.activa and not exists (select 1 from red.miembros m where m.aula_id = a.id and m.rol = 'gestor')),
    (select count(*) from red.proyectos where publicado),
    (select count(*) from red.proyectos where not publicado),
    (select count(*) from red.invitaciones)
  where red.es_coordinador();
$$;
revoke execute on function red.resumen_red() from public, anon;
grant execute on function red.resumen_red() to authenticated;
