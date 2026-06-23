CREATE TABLE IF NOT EXISTS profiles (
    id UUID primary key references auth.users(id) on delete cascade,
    username varchar(255) default NULL,
    role_code smallint not null references master_roles(id) on delete restrict,
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
    floor varchar(25),
    details text,
    descriptions text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid primary key default gen_random_uuid(),
  booking_code varchar(20) unique not null,
  user_id uuid references auth.users(id) on delete set null,
  guest_name varchar(255),
  guest_phone varchar(20),
  guest_email text,
  status text not null default 'PENDING_PAYMENT' check (status in ('PENDING_PAYMENT', 'BOOKED', 'CANCELLED', 'EXPIRED')),
  total_amount numeric(12,2) not null check (total_amount >= 0),
  total_guest smallint not null check (total_guest > 0), -- Diubah ke smallint
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
  guest_amount smallint not null check (guest_amount > 0), -- Diubah ke smallint
  status_item text not null default 'PENDING' check (status_item in ('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED')), -- Opsional untuk fleksibilitas status per kamar
  check_in timestamptz not null,
  check_out timestamptz not null,
  price_at_booking numeric(12,2) not null,
  check (check_out > check_in)
);

CREATE TABLE IF NOT EXISTS order_item_addons (
  id uuid primary key default gen_random_uuid(),
  order_item_id uuid not null references order_items(id) on delete cascade,
  addon_id smallint not null references master_addons(id) on delete restrict,
  quantity numeric(12,2) not null check (quantity > 0), -- misal: total_guest, atau nights, sesuai pricing_unit
  price_at_booking numeric(12,2) not null check (price_at_booking >= 0),
  subtotal numeric(12,2) generated always as (quantity * price_at_booking) stored
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

CREATE INDEX idx_profiles_role_code
ON profiles(role_code);
CREATE INDEX idx_units_property_active 
ON units(master_properties_id) 
WHERE is_active = true;
CREATE INDEX idx_units_property
ON units(master_properties_id);
CREATE INDEX idx_order_items_unit_checkin
ON order_items(unit_id, check_in);
CREATE INDEX idx_orders_status
ON orders(status);
CREATE INDEX idx_orders_expires_at
ON orders(expires_at);
CREATE INDEX idx_order_items_order
ON order_items(order_id);

INSERT INTO units (property_id, name, base_price_per_night, price_per_hour, is_transit_enabled, capacity) VALUES
('', 'Kamar 101', 500000, NULL, false, 4),
('', 'Kamar 102', 500000, NULL, false, 4),
('', 'Kamar 103', 500000, NULL, false, 4),
('', 'Kamar 104', 500000, NULL, false, 4),
('', 'Kamar 201', 650000, 15000, true, 2),
('', 'Kamar 202', 650000, 15000, true, 2),
('', 'Kamar 203', 650000, 15000, true, 2),
('', 'Kamar 204', 650000, 15000, true, 2),
('', 'Kamar 205', 650000, 15000, true, 2),
('', 'Kamar 206', 650000, 15000, true, 2),
('', 'Kamar 207', 650000, 15000, true, 2),
('', 'Kamar 208', 650000, 15000, true, 2),
('', 'Kamar 209', 650000, 15000, true, 2),
('', 'Kamar 210', 650000, 15000, true, 2),
('', 'Kamar 301', 1200000, NULL, false, 6),
('', 'Kamar 302', 1200000, NULL, false, 6),
('', 'Kamar 303', 1200000, NULL, false, 6),
('', 'Kamar 304', 1200000, NULL, false, 6),
('', 'Kamar 305', 1200000, 25000, true, 6),
('', 'Kamar 306', 1200000, 25000, true, 6),
('', 'Kamar 307', 1200000, 25000, true, 6),
('', 'Kamar 308', 1200000, 25000, true, 6),
('', 'Kamar 309', 1200000, 25000, true, 6),
('', 'Kamar 310', 1200000, 25000, true, 6);
