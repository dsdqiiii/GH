-- 1. MASTER ROLES
CREATE TABLE IF NOT EXISTS master_roles (
    id smallint generated always as identity primary key,
    code varchar(25) not null, -- UNIQUE dihapus dari sini
    name varchar(25) not null,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 2. MASTER FACILITIES
CREATE TABLE IF NOT EXISTS master_facilities (
    id smallint generated always as identity primary key,
    code varchar(25) not null, -- UNIQUE dihapus dari sini
    name varchar(100) not null,
    icon_url text,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 3. MASTER ORGANIZATIONS
CREATE TABLE IF NOT EXISTS master_organizations (
    id uuid primary key default gen_random_uuid(),
    name varchar(255) not null,
    slug varchar(255) not null, -- UNIQUE dihapus dari sini
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 4. MASTER PROPERTIES
CREATE TABLE IF NOT EXISTS master_properties (
    id uuid primary key default gen_random_uuid(),
    master_organizations_id uuid not null references master_organizations(id) on delete cascade,
    name varchar(255) not null,
    slug varchar(255) not null, -- UNIQUE dihapus dari sini
    address text,
    contact_wa text,
    description text,
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 5. MASTER BANK ACCOUNTS
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

-- 6. MASTER ADDONS
CREATE TABLE IF NOT EXISTS master_addons (
  id smallint generated always as identity primary key,
  code varchar(25) not null, -- UNIQUE dihapus dari sini
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
    type text not null check (type in ('percentage', 'flat')), -- 'percentage' untuk % (misal: PPN), 'flat' untuk nominal tetap
    value numeric(12,2) not null check (value >= 0),          -- Bisa diisi 11.00 (untuk 11%) atau 50000.00 (untuk Rp50.000)
    is_active boolean not null default true,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Partial Unique Index (Mengikuti pola standarmu agar nama charge yang aktif tidak kembar)
CREATE UNIQUE INDEX uq_master_charges_name_active 
ON master_charges(name) 
WHERE is_active = true;


CREATE UNIQUE INDEX uq_master_roles_code_active ON master_roles(code) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_facilities_code_active ON master_facilities(code) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_organizations_slug_active ON master_organizations(slug) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_properties_slug_active ON master_properties(slug) WHERE is_active = true;
CREATE INDEX idx_master_properties_org_active 
ON master_properties(master_organizations_id) 
WHERE is_active = true;
CREATE UNIQUE INDEX uq_bank_account_org_active 
ON master_bank_accounts(master_organizations_id, bank_name, account_number) 
WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_addons_code_active ON master_addons(code) WHERE is_active = true;

INSERT INTO master_roles (code, name, description) VALUES 
('ADMINISTRATOR', 'Administrator', 'Akses penuh ke semua konfigurasi sistem dan manajemen admin lainnya'),
('MANAGER', 'Manager', 'Mengelola operasional guest house, booking, dan laporan harian'),
('STAFF', 'Staff', 'Akses terbatas untuk operasional (seperti check-in/out tamu saja)'),
('CUSTOMER', 'Customer', 'User terverifikasi yang bisa melakukan booking mandiri'),
('GUEST', 'Guest', 'Tamu sementara tanpa akun permanen')
('AFFILIATE', 'Afiliator', 'User terverifikasi yang terdaftar menjadi afiliator');

INSERT INTO master_facilities (name, code) VALUES 
('Parkir', 'PARK'),
('Kolam Renang', 'SWIM'),
('Wi-Fi', 'WIFI'),
('AC', 'AC'),
('Smart TV', 'STV'),
('Bathtub', 'BATHTUB'),
('Sarapan', 'BFST'),
('Dapur Bersama', 'KITCHEN'),
('Ruang Meeting', 'MEETING'),
('Aula', 'HALL'),
('Resepsionis 24 Jam', 'REC24'),
('Dispenser Air', 'WATER'),
('Sprei & Handuk', 'LINEN'),
('Peralatan Mandi', 'TOILETRIES'),
('Pemanas Air (Shower)', 'WHOT');

INSERT INTO master_organizations (name, slug) VALUES
('Pondok Pesantren Darunnajah Pusat', 'darunnajah-pusat'),
('Pondok Pesantren Nurul Ilmi Darunnajah 14', 'nurul-ilmi-dn14');

INSERT INTO master_properties (master_organizations_id, name, slug) VALUES
('', 'Guest House Andalusia', 'gh-andalusia'),
('', 'Guest House Gedung 54', 'gh-gedung-54'),
('', 'Guest House Darunnajah 14', 'gh-dn14');

INSERT INTO master_bank_accounts (master_organizations_id, bank_name, account_number, account_holder) VALUES
('', 'Bank Muamalat', '123', 'Pesantren Darunnajah'),
('', 'Bank BSI', '456', 'Pesantren Darunnajah'),
('', 'Bank Muamalat', '789', 'Pesantren Nurul Ilmi');

INSERT INTO master_addons (code, name, description, pricing_unit) 
VALUES
  ('BREAKFAST', 'Buffet Breakfast', 'Sarapan prasmanan harian di restoran utama hotel.', 'per_guest_per_night'),
  ('EXTRA_BED', 'Extra Bed', 'Tambahan satu kasur tipe single di dalam kamar.', 'per_night'),
  ('LATE_CHECKOUT', 'Late Checkout', 'Kelonggaran waktu checkout hingga pukul 16:00 waktu setempat.', 'flat'),
  ('EARLY_CHECKIN', 'Early Check-in', 'Fasilitas masuk kamar lebih awal mulai dari pukul 10:00 pagi.', 'flat'),
  ('AIRPORT_PICKUP', 'Airport Pick-up', 'Layanan jemputan satu arah dari bandara menuju hotel.', 'flat');