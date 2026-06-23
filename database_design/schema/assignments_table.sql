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