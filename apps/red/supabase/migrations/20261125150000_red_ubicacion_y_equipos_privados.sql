-- Aplicada en el proyecto Supabase «Red STEAM» el 25 nov 2026.
-- 1) Coordenadas de las aulas para el mapa ampliado de Manizales.
-- 2) El inventario de equipos deja de ser público (solo gestor del aula y coordinación).

alter table red.aulas
  add column lat numeric(8,5),
  add column lon numeric(8,5),
  add column ubicacion_aproximada boolean not null default true;

comment on column red.aulas.ubicacion_aproximada is 'true si lat/lon son del barrio o la vereda y no de la sede exacta';

-- Fuente: OpenStreetMap (sedes exactas) o el barrio/vereda (aproximadas).
-- IE Instituto Malabar e IE Marco Fidel Suárez quedan sin ubicación hasta confirmarla.
update red.aulas a set lat = v.lat, lon = v.lon, ubicacion_aproximada = v.aprox
from (values
  ('centro-de-prototipado', 5.05800, -75.49100, true),
  ('ie-la-asuncion', 5.06720, -75.49431, false),
  ('ie-san-sebastian', 5.09062, -75.49246, false),
  ('ie-estambul', 5.05395, -75.52575, false),
  ('ie-instituto-manizales', 5.07151, -75.51361, false),
  ('ie-rural-maria-goretti', 5.03012, -75.53829, false),
  ('ie-san-pio-x', 5.03062, -75.46548, false),
  ('ie-leonardo-da-vinci', 5.05961, -75.50858, false),
  ('ie-instituto-universitario-de-caldas', 5.06752, -75.50854, false),
  ('ie-la-linda', 5.09178, -75.54613, true),
  ('ie-instituto-tecnico-francisco-jose-de-caldas', 5.05597, -75.50841, true),
  ('ie-rural-la-trinidad', 5.02000, -75.59200, true)
) as v(slug, lat, lon, aprox)
where a.slug = v.slug;

drop policy "Lectura pública de equipos" on red.equipos;
revoke select on red.equipos from anon;

create policy "Gestor del aula y coordinación ven los equipos" on red.equipos
  for select to authenticated
  using (
    red.es_coordinador()
    or exists (
      select 1 from red.miembros m
      where m.user_id = (select auth.uid()) and m.rol = 'gestor' and m.aula_id = equipos.aula_id
    )
  );
