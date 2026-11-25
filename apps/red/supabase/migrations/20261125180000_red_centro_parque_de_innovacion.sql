-- Aplicada en el proyecto Supabase «Red STEAM» el 25 nov 2026.
-- Corrección: el Bloque X del Campus La Nubia es el Parque de Innovación.
update red.aulas
set direccion = 'Campus La Nubia, Bloque X (Parque de Innovación), Universidad Nacional de Colombia, sede Manizales',
    descripcion = 'Nodo central de la Red STEAM de Caldas. Laboratorio de fabricación digital, realidad inmersiva y robótica de la Universidad Nacional de Colombia, sede Manizales, en el Parque de Innovación (Bloque X) del Campus La Nubia.'
where slug = 'centro-de-prototipado';
