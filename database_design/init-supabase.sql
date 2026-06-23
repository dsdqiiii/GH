-- =========================================================================
-- 1. LAYER DATA MASTER (Mendukung Soft-Delete via is_active)
-- =========================================================================

CREATE TABLE IF NOT EXISTS master_roles (
    id smallint generated always as identity primary key,
    code varchar(25) not null,
    name varchar(25) not null,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS master_facilities (
    id smallint generated always as identity primary key,
    code varchar(25) not null,
    name varchar(100) not null,
    icon_url text,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS master_organizations (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    slug varchar(255) not null,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS master_properties (
    id uuid primary key default gen_random_uuid(),
    master_organizations_id uuid not null references master_organizations(id) on delete cascade,
    name varchar(255) not null,
    slug varchar(255) not null,
    address text,
    contact_wa text,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS master_bank_accounts (
    id uuid primary key default gen_random_uuid(),
    master_organizations_id uuid not null references master_organizations(id) on delete cascade,
    bank_name varchar(100) not null,
    account_number varchar(50) not null,
    account_holder varchar(255) not null,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS master_addons (
    id smallint generated always as identity primary key,
    code varchar(25) not null,
    name varchar(100) not null,
    description text,
    pricing_unit text not null check (pricing_unit in ('per_guest', 'per_night', 'per_guest_per_night', 'flat')),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS master_charges (
    id smallint generated always as identity primary key,
    name varchar(100) not null,
    type text not null check (type in ('percentage', 'flat')),
    value numeric(12,2) not null check (value >= 0),
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

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
    is_hero boolean not null,
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

-- =========================================================================
-- 3. LAYER ASSIGNMENTS (Pemetaan Staff & Fasilitas)
-- =========================================================================

CREATE TABLE IF NOT EXISTS facility_assignments (
    id uuid primary key default gen_random_uuid(),
    reference_type varchar(20) not null check (reference_type in ('property', 'unit')),
    reference_id uuid not null,
    facility_id smallint not null references master_facilities(id) on delete cascade,
    mapped_by uuid references auth.users(id) on delete set null,
    mapped_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS property_assignments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references auth.users(id) on delete cascade,
    master_properties_id uuid not null references master_properties(id) on delete cascade,
    mapped_by uuid references auth.users(id) on delete set null,
    mapped_at timestamptz not null default now()
);

-- =========================================================================
-- 4. LAYER TRANSAKSI OPERASIONAL & SNAPSHOT FINANSIAL (Marketplace Ready)
-- =========================================================================

CREATE TABLE IF NOT EXISTS orders (
    id uuid primary key default gen_random_uuid(),
    booking_code varchar(20) unique not null,
    user_id uuid references auth.users(id) on delete set null,
    guest_name varchar(255),
    guest_phone varchar(20),
    guest_email text,
    status text not null default 'PENDING_PAYMENT' check (status in ('PENDING_PAYMENT', 'BOOKED', 'CHECKED_IN', 'CHECKED_OUT', 'COMPLETED', 'CANCELLED', 'EXPIRED')),
    total_amount numeric(12,2) not null check (total_amount >= 0),
    total_guest smallint not null check (total_guest > 0),
    expires_at timestamptz not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint orders_user_or_guest_check check (user_id is not null or (guest_name is not null and guest_phone is not null))
);

CREATE TABLE IF NOT EXISTS order_items (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references orders(id) on delete cascade,
    unit_id uuid not null references units(id) on delete restrict,
    type_booking text not null check (type_booking in ('inap', 'transit')),
    guest_amount smallint not null check (guest_amount > 0),
    status_item text not null default 'PENDING' check (status_item in ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED')),
    check_in timestamptz not null,
    check_out timestamptz not null,
    price_at_booking numeric(12,2) not null check (price_at_booking >= 0),
    quantity smallint not null check (quantity > 0), 
    subtotal numeric(12,2) not null check (subtotal >= 0), 
    cancelled_by uuid references auth.users(id) on delete restrict,
    cancelled_at timestamptz,
    checked_in_by uuid references auth.users(id) on delete restrict,
    checked_in_at timestamptz,
    checked_out_by uuid references auth.users(id) on delete restrict,
    checked_out_at timestamptz,
    constraint order_items_dates_check check (check_out > check_in)
);

CREATE TABLE IF NOT EXISTS order_item_addons (
    id uuid primary key default gen_random_uuid(),
    order_item_id uuid not null references order_items(id) on delete cascade,
    addon_id smallint references master_addons(id) on delete set null,
    quantity numeric(12,2) not null check (quantity > 0),
    price_at_booking numeric(12,2) not null check (price_at_booking >= 0),
    subtotal numeric(12,2) generated always as (quantity * price_at_booking) stored
);

CREATE TABLE IF NOT EXISTS order_charges (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null references orders(id) on delete cascade,
    charge_id smallint references master_charges(id) on delete set null,
    charge_name varchar(100) not null,
    charge_type text not null check (charge_type in ('percentage', 'flat')),
    charge_value numeric(12,2) not null,
    calculated_amount numeric(12,2) not null check (calculated_amount >= 0),  
    created_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS payments (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null unique references orders(id) on delete cascade,
    amount numeric(12,2) not null check (amount >= 0),
    proof_url text, 
    status text not null default 'PENDING' check (status in ('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED')),
    destination_bank_name varchar(100) not null,
    destination_account_number varchar(50) not null,
    destination_account_holder varchar(255) not null,
    verified_by uuid references auth.users(id) on delete restrict,
    verified_at timestamptz,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- =========================================================================
-- 5. LAYER INDEKS (Partial & Performance Optimization)
-- =========================================================================

-- Indeks Unik Parsial untuk Data Master (Aman untuk Mekanisme Soft-Delete)
CREATE UNIQUE INDEX uq_master_roles_code_active ON master_roles(code) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_facilities_code_active ON master_facilities(code) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_organizations_slug_active ON master_organizations(slug) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_properties_slug_active ON master_properties(slug) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_addons_code_active ON master_addons(code) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_charges_name_active ON master_charges(name) WHERE is_active = true;
CREATE UNIQUE INDEX uq_property_addons_active ON property_addons(master_properties_id, addon_id) WHERE is_active = true;
CREATE UNIQUE INDEX uq_bank_account_org_active ON master_bank_accounts(master_organizations_id, bank_name, account_number) WHERE is_active = true;

-- Indeks Unik untuk Relasi Tabel Junction M-M
CREATE UNIQUE INDEX uq_property_manager ON property_assignments(user_id, master_properties_id);

-- Indeks Pencarian & Query Relasional Standar
CREATE INDEX idx_profiles_role_id ON profiles(role_id);
CREATE INDEX idx_master_properties_org_active ON master_properties(master_organizations_id) WHERE is_active = true;
CREATE INDEX idx_units_property_active ON units(master_properties_id) WHERE is_active = true;
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_expires_at ON orders(expires_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_charges_order ON order_charges(order_id);
CREATE INDEX idx_property_assignments_user ON property_assignments(user_id);
CREATE INDEX idx_property_assignments_property ON property_assignments(master_properties_id);

-- Indeks Kinerja Khusus (Polimorfik & Logika Temporal Overlap)
CREATE INDEX idx_galleries_poly ON galleries(reference_type, reference_id);
CREATE INDEX idx_facility_assignments_reference ON facility_assignments(reference_type, reference_id);

-- CORE ENGINE INDEX: Penentu Ketersediaan Kamar Tercepat (Sesuai Note #6.1)
-- Hanya mengindeks booking yang secara aktif memblokir ketersediaan unit.
CREATE INDEX idx_order_items_availability_v2 
ON order_items(unit_id, check_in, check_out) 
WHERE status_item IN ('PENDING', 'CONFIRMED', 'CHECKED_IN');