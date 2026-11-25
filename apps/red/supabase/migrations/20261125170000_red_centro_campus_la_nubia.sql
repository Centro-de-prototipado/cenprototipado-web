-- Aplicada en el proyecto Supabase «Red STEAM» el 25 nov 2026.
-- El Centro de Prototipado se trasladó del Museo Interactivo Samoga al Campus La Nubia,
-- Bloque X (Centro de Innovación). Coordenadas del Bloque X en OpenStreetMap.
update red.aulas
set lat = 5.02869,
    lon = -75.47271,
    ubicacion_aproximada = false,
    direccion = 'Campus La Nubia, Bloque X (Centro de Innovación), Universidad Nacional de Colombia, sede Manizales',
    descripcion = 'Nodo central de la Red STEAM de Caldas. Laboratorio de fabricación digital, realidad inmersiva y robótica de la Universidad Nacional de Colombia, sede Manizales, en el Centro de Innovación (Bloque X) del Campus La Nubia.'
where slug = 'centro-de-prototipado';
