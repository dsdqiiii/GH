
drop table if exists public.master_roles cascade;

-- ---------------------------------------------------------------------
-- 1. roles
-- ---------------------------------------------------------------------
create table if not exists public.roles (
    id smallint primary key,
    name varchar(25) not null unique,
    description text
);

comment on table public.roles is 'Daftar role yang tersedia di sistem. Base permission per role diimplementasikan langsung di RLS/functions, bukan lewat tabel mapping.';


-- ---------------------------------------------------------------------
-- 2. permissions
-- ---------------------------------------------------------------------
create table if not exists public.permissions (
    id smallint primary key,
    name varchar(50) not null unique,
    category text,
    description text
);

comment on table public.permissions is 'Daftar permission yang bisa di-extend ke user tertentu di luar base role-nya.';
comment on column public.permissions.category is 'Grouping untuk keperluan UI, mis. ''units'', ''bookings'', ''payments''.';


-- ---------------------------------------------------------------------
-- 3. extended_permissions
-- ---------------------------------------------------------------------
create table if not exists public.extended_permissions (
    user_id uuid not null references auth.users(id) on delete cascade,
    permission_id smallint not null references public.permissions(id) on delete cascade,
    granted_by uuid references auth.users(id) on delete set null,
    granted_at timestamptz not null default now(),
    notes text,
    primary key (user_id, permission_id)
);

comment on table public.extended_permissions is 'Permission tambahan per-user, di luar base permission role-nya. Contoh: staff biasa tidak bisa create:units, tapi user tertentu di-extend.';


-- ---------------------------------------------------------------------
-- 4. profiles (ringkas — tanpa kolom yang belum kepakai kalau tidak perlu)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username varchar(255) default null,
    role_id smallint not null references public.roles(id) on delete restrict default 2,
    avatar_url text,
    is_verified boolean not null default false,
    is_active boolean not null default true,
    suspended_at timestamptz null,
    suspended_by uuid references auth.users(id) on delete set null,
    suspended_reason varchar(255),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Satu row per auth.users, mengikat role_id. Sumber kebenaran untuk role checking di RLS.';


-- ---------------------------------------------------------------------
-- 5. Seed data
-- ---------------------------------------------------------------------
insert into public.roles (id, name, description) values
(1, 'administrator', 'administrator dengan full system access'),
(2, 'staff', 'staff operasional harian')
on conflict (id) do nothing;

insert into public.permissions (id, name, category) values
(1, 'create:units', 'units')
on conflict (id) do nothing;


-- ---------------------------------------------------------------------
-- 8. Contoh pemakaian di RLS policy (referensi, sesuaikan per tabel)
-- ---------------------------------------------------------------------
-- create policy "staff can create units if extended"
-- on public.units
-- for insert
-- to authenticated
-- with check (
--   public.is_admin() or public.has_extended_permission('create:units')
-- );