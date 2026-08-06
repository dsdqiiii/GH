
CREATE TABLE IF NOT EXISTS orders (
    id uuid primary key default gen_random_uuid(),
    booking_code varchar(20) unique not null,
    user_id uuid references auth.users(id) on delete set null,
    guest_name varchar(255),
    guest_phone varchar(20),
    guest_email text,
    status text not null default 'PENDING_PAYMENT'
        check (status in ('PENDING_PAYMENT', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'EXPIRED')),
    total_amount numeric(12,2) not null check (total_amount >= 0),
    total_guest smallint not null check (total_guest > 0),
    expires_at timestamptz not null,
    cancel_reason text,
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
    status_item text not null default 'PENDING'
        check (status_item in ('PENDING', 'BOOKED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'EXPIRED')),
    check_in timestamptz not null,
    check_out timestamptz not null,
    price_at_booking numeric(12,2) not null check (price_at_booking >= 0),
    quantity smallint not null check (quantity > 0),
    subtotal numeric(12,2) not null check (subtotal >= 0),

    -- kapan status berakhir (CANCELLED atau EXPIRED) — selalu wajib diisi
    cancelled_at timestamptz,

    -- siapa admin yang membatalkan (manual reject) — NULL kalau otomatis expired
    cancelled_by uuid references auth.users(id) on delete restrict,

    checked_in_by uuid references auth.users(id) on delete restrict,
    checked_in_at timestamptz,
    checked_out_by uuid references auth.users(id) on delete restrict,
    checked_out_at timestamptz,
    cancel_reason text,

    constraint order_items_dates_check check (check_out > check_in),
    constraint order_items_transit_duration_check
        check (
            type_booking <> 'transit'
            or (check_out - check_in) between interval '1 hour' and interval '5 hours'
        ),

    -- cancelled_at wajib terisi untuk CANCELLED maupun EXPIRED
    constraint logic_order_status_cancelled_at_snapshot
        check (
            cancelled_at is not null or status_item not in ('CANCELLED', 'EXPIRED')
        ),

    -- cancelled_by HANYA boleh terisi kalau statusnya CANCELLED (ada admin di baliknya);
    -- untuk EXPIRED, wajib NULL karena tidak ada actor manusia
    constraint sync_cancelled_by_requires_admin_action
        check (
            (cancelled_by is null)
            or (cancelled_by is not null and status_item = 'CANCELLED')
        )
);

CREATE TABLE IF NOT EXISTS order_item_addons (
    id uuid primary key default gen_random_uuid(),
    order_item_id uuid not null references order_items(id) on delete cascade,
    addon_id smallint references master_addons(id) on delete set null,
    quantity numeric(12,2) not null check (quantity > 0),
    price_at_booking numeric(12,2) not null check (price_at_booking >= 0),
    subtotal numeric(12,2) generated always as (quantity * price_at_booking) stored
);

CREATE TABLE IF NOT EXISTS payments (
    id uuid primary key default gen_random_uuid(),
    order_id uuid not null unique references orders(id) on delete cascade,
    amount numeric(12,2) not null check (amount >= 0),
    proof_url text, 
    status text not null default 'SUBMITTED' check (status in ('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED')),
    destination_bank_name varchar(100) not null,
    destination_account_number varchar(50) not null,
    destination_account_holder varchar(255) not null,
    verified_by uuid references auth.users(id) on delete restrict,
    verified_at timestamptz,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);


-- charges kita agak skip, no charge, hanya persiapan feat/upgrade.
-- tidak usah dulu.
-- CREATE TABLE IF NOT EXISTS order_charges (
--     id uuid primary key default gen_random_uuid(),
--     order_id uuid not null references orders(id) on delete cascade,
--     charge_id smallint references master_charges(id) on delete set null,
--     charge_name varchar(100) not null,
--     charge_type text not null check (charge_type in ('percentage', 'flat')),
--     charge_value numeric(12,2) not null,
--     calculated_amount numeric(12,2) not null check (calculated_amount >= 0),  
--     created_at timestamptz not null default now()
-- );

