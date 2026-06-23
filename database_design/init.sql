CREATE TABLE IF NOT EXISTS master_roles (
    id smallint generated always as identity primary key,
    code varchar(25) not null UNIQUE,
    name varchar(25) not null,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS master_facilities (
    id smallint generated always as identity primary key,
    code varchar(25) unique not null,
    name varchar(100) not null,
    icon_url text,
    description text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS master_organizations (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    slug varchar(255) unique not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS master_properties (
    id uuid primary key default gen_random_uuid(),
    master_organizations_id uuid not null references master_organizations(id) on delete cascade,
    name varchar(255) not null,
    slug varchar(255) unique not null,
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
    bank_name varchar(100) not null, -- e.g., 'BCA', 'Mandiri'
    account_number varchar(50) not null,
    account_holder varchar(255) not null,
    is_active boolean not null default true 
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID primary key references auth.users(id) on delete cascade,
    username varchar(255) default NULL,
    role_code varchar(25) not null references master_roles(code) on delete restrict,
    avatar_url text,
    is_verified boolean not null default false,
    is_active boolean not null default true,
    suspended_at timestamptz NULL,
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
  is_active boolean not null default true
);

CREATE TABLE IF NOT EXISTS unit_details (
  id uuid primary key default gen_random_uuid(),
  unit_id uuid not null unique references units(id) on delete cascade,
  floor varchar(25),
  details text,
  descriptions text
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid primary key default gen_random_uuid(),
  booking_code varchar(20) unique not null,
  user_id uuid references auth.users(id) on delete set null, -- next feature auth customers
  guest_name varchar(255),
  guest_phone varchar(20),
  guest_email text,
  status text not null default 'PENDING_PAYMENT' check (status in ('PENDING_PAYMENT', 'BOOKED', 'CANCELLED', 'EXPIRED')), -- PENDING_PAYMENT, BOOKED, CANCELLED
  total_amount numeric(12,2) not null check (total_amount >= 0),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  CONSTRAINT orders_user_or_guest_check CHECK ( user_id IS NOT NULL OR (guest_name IS NOT NULL AND guest_phone IS NOT NULL))
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references orders(id) on delete cascade,
  unit_id uuid not null references units(id) on delete restrict,
  type_booking text not null check (type_booking in ('inap', 'transit')),
  check_in timestamptz not null,
  check_out timestamptz not null,
  price_at_booking numeric(12,2) not null,
  check (check_out > check_in)
);

CREATE TABLE IF NOT EXISTS payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references orders(id) on delete cascade,
  amount numeric(12,2) not null check (amount >= 0),
  proof_url text,
  status text not null default 'PENDING' check (status in ('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED')),
  verified_by uuid references auth.users(id),
  verified_at timestamptz,
  notes text,
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
  mapped_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);