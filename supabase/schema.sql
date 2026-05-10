create table pedidos (
    id uuid primary key default gen_random_uuid(),
    servicios text[] not null,
    nombre_razon_social text not null,
    cif_dni text not null,
    direccion text not null,
    email text not null,
    persona_contacto text not null,
    telefono text not null,
    precio_setup integer not null,
    precio_mantenimiento integer not null,
    estado text not null default 'pendiente',
    stripe_session_id text,
    creado_en timestamptz default now()
);
