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

-- Harga add-on per property (breakfast di Property A bisa beda harga dari Property B)
CREATE TABLE IF NOT EXISTS property_addons (
  id uuid primary key default gen_random_uuid(),
  master_properties_id uuid not null references master_properties(id) on delete cascade,
  addon_id smallint not null references master_addons(id) on delete cascade,
  price numeric(12,2) not null check (price >= 0),
  is_active boolean not null default true,
  unique (master_properties_id, addon_id)
);

CREATE UNIQUE INDEX uq_facility_mapping
ON facility_assignments(
  reference_type,
  reference_id,
  facility_id
);
CREATE INDEX idx_facility_assignments_reference
ON facility_assignments(reference_type, reference_id);
CREATE UNIQUE INDEX uq_property_manager
ON property_assignments(
  user_id,
  master_properties_id
);
CREATE INDEX idx_property_assignments_user
ON property_assignments(user_id);
CREATE INDEX idx_property_assignments_property
ON property_assignments(master_properties_id);