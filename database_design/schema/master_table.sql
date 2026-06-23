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