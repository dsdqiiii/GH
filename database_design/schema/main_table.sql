-- =========================================================================
-- 2. LAYER PROFIL, AKSES, & INVENTORY (Kamar & Galeri Polimorfik)
-- =========================================================================

CREATE TABLE IF NOT EXISTS profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username varchar(255) default null,
    role_id smallint not null references master_roles(id) on delete restrict, -- FIXED: Mengunci ke ID, bukan Code teks
    avatar_url text,
    is_verified boolean not null default false,
    is_active boolean not null default true,
    suspended_at timestamptz null,
    suspended_by uuid references auth.users(id) on delete set null,
    suspended_reason varchar(255),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS units (
    id uuid primary key default gen_random_uuid(),
    master_properties_id uuid not null references master_properties(id) on delete cascade,
    name text not null,
    slug varchar(255) not null,
    base_price_per_night numeric(12,2) not null check (base_price_per_night >= 0),
    price_per_hour numeric(12,2) check (price_per_hour is null or price_per_hour >= 0),
    is_transit_enabled boolean not null default false,
    capacity int not null default 2 check (capacity > 0),
    floor varchar(25),
    descriptions text,
    is_active boolean not null default true,
    details text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS galleries (
    id uuid primary key default gen_random_uuid(),
    reference_type varchar(20) not null check (reference_type in ('property', 'unit', 'organization')),
    reference_id uuid not null,
    url text not null,
    is_hero boolean not null default false,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS property_addons (
    id uuid primary key default gen_random_uuid(),
    master_properties_id uuid not null references master_properties(id) on delete cascade,
    addon_id smallint not null references master_addons(id) on delete cascade,
    price numeric(12,2) not null check (price >= 0),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);