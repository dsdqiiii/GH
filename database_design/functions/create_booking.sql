create or replace function public.create_booking(
  p_unit_id uuid,
  p_booking_type text,           -- 'inap' | 'transit'
  p_check_in timestamptz,
  p_check_out timestamptz,
  p_total_guest int,
  p_proof_url text,              -- required: uploaded client-side to storage before calling this RPC
  p_user_id text default null,   -- text, not uuid: allows normalizing "" -> null before casting
  p_guest_name text default null,
  p_guest_phone text default null,
  p_guest_email text default null,
  p_addons jsonb default '[]'::jsonb
)
returns table (
  order_id uuid,
  booking_code text,
  total_amount numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_unit record;
  v_org_id uuid;
  v_bank record;
  v_order_id uuid;
  v_order_item_id uuid;
  v_booking_code text;
  v_units int;              -- number of nights or hours
  v_unit_price numeric;
  v_item_subtotal numeric;
  v_addons_total numeric := 0;
  v_total_amount numeric;
  v_addon jsonb;
  v_property_addon record;
  v_addon_subtotal numeric;
  v_user_id uuid;
  v_checkin_date_jkt date;
  v_cutoff_jkt timestamp;
  v_check_in timestamptz;   -- normalized check_in actually used from here on
  v_check_out timestamptz;  -- normalized check_out actually used from here on
begin
  -- Defensive normalization: treat empty/blank string as null (common client-side mistake)
  if p_user_id is null or trim(p_user_id) = '' then
    v_user_id := null;
  else
    v_user_id := p_user_id::uuid;
  end if;

  -- --------------------------------------------------------------------
  -- 1. Validate booking type & basic inputs
  -- --------------------------------------------------------------------
  if p_booking_type not in ('inap', 'transit') then
    raise exception 'Invalid booking_type: %', p_booking_type
      using errcode = 'P0001';
  end if;

  if p_proof_url is null or trim(p_proof_url) = '' then
    raise exception 'proof_url is required (upload payment proof before creating booking)'
      using errcode = 'P0001';
  end if;

  if p_booking_type = 'inap' then
    v_check_in  := (((p_check_in  at time zone 'Asia/Jakarta')::date)::text || ' 14:00:00')::timestamp
                     at time zone 'Asia/Jakarta';
    v_check_out := (((p_check_out at time zone 'Asia/Jakarta')::date)::text || ' 12:00:00')::timestamp
                     at time zone 'Asia/Jakarta';
  else
    v_check_in  := p_check_in;
    v_check_out := p_check_out;
  end if;

  if v_check_out <= v_check_in then
    raise exception 'check_out must be after check_in'
      using errcode = 'P0001';
  end if;

  if p_booking_type = 'inap' then
    v_checkin_date_jkt := (v_check_in at time zone 'Asia/Jakarta')::date;
    v_cutoff_jkt := v_checkin_date_jkt + interval '1 day' + interval '7 hour';

    if (now() at time zone 'Asia/Jakarta') >= v_cutoff_jkt then
      raise exception 'Booking cut-off has passed for check-in date % (must be booked before 07:00 WIB on %)',
        v_checkin_date_jkt, (v_checkin_date_jkt + interval '1 day')
        using errcode = 'P0005';
    end if;

  else -- transit
    if v_check_in <= (now() + interval '30 minutes') then
      raise exception 'Transit booking must be made at least 30 minutes before the selected check-in time'
        using errcode = 'P0005';
    end if;
  end if;

  -- --------------------------------------------------------------------
  -- 2. Lock and fetch unit (row lock prevents race conditions on availability)
  -- --------------------------------------------------------------------
  select *
  into v_unit
  from units
  where id = p_unit_id
    and is_active = true
    and deleted_at is null
  for update;

  if not found then
    raise exception 'Unit not found or inactive: %', p_unit_id
      using errcode = 'P0002';
  end if;

  if p_booking_type = 'transit' and not v_unit.is_transit_enabled then
    raise exception 'Unit does not support transit booking'
      using errcode = 'P0001';
  end if;

  if p_booking_type = 'transit' and v_unit.price_per_hour is null then
    raise exception 'Unit has no price_per_hour configured'
      using errcode = 'P0001';
  end if;

  if p_total_guest > v_unit.capacity then
    raise exception 'total_guest (%) exceeds unit capacity (%)', p_total_guest, v_unit.capacity
      using errcode = 'P0001';
  end if;

  -- Anonymous booking (no logged-in user) must supply guest identity
  if v_user_id is null then
    if p_guest_name is null or trim(p_guest_name) = '' then
      raise exception 'guest_name is required for anonymous booking'
        using errcode = 'P0001';
    end if;

    if p_guest_phone is null or trim(p_guest_phone) = '' then
      raise exception 'guest_phone is required for anonymous booking'
        using errcode = 'P0001';
    end if;
  end if;

  -- --------------------------------------------------------------------
  -- 2b. Resolve destination bank account via unit -> property -> organization
  --     MVP assumption: single active bank account per organization.
  -- --------------------------------------------------------------------
  select mp.master_organizations_id
  into v_org_id
  from master_properties mp
  where mp.id = v_unit.master_properties_id;

  if v_org_id is null then
    raise exception 'Organization could not be resolved for unit %', p_unit_id
      using errcode = 'P0006';
  end if;

  select mba.bank_name, mba.account_number, mba.account_holder
  into v_bank
  from master_bank_accounts mba
  where mba.master_organizations_id = v_org_id
    and mba.is_active = true
  order by mba.created_at asc
  limit 1;

  if not found then
    raise exception 'No active bank account configured for this organization'
      using errcode = 'P0006';
  end if;

  -- --------------------------------------------------------------------
  -- 3. Availability check (overlap against existing active order_items)
  --    Active = not cancelled. Adjust status_item filter to your enum values.
  -- --------------------------------------------------------------------
  if exists (
    select 1
    from order_items oi
    where oi.unit_id = p_unit_id
      and oi.cancelled_at is null
      and oi.status_item not in ('CANCELLED')
      and oi.check_in < v_check_out
      and oi.check_out > v_check_in
  ) then
    raise exception 'Unit is not available for the selected date/time range'
      using errcode = 'P0003';
  end if;

  -- --------------------------------------------------------------------
  -- 4. Calculate price for the item
  -- --------------------------------------------------------------------
  if p_booking_type = 'inap' then
    v_units := ceil(extract(epoch from (v_check_out - v_check_in)) / 86400.0)::int;
    if v_units < 1 then
      v_units := 1;
    end if;
    v_unit_price := v_unit.base_price_per_night;
  else
    v_units := ceil(extract(epoch from (v_check_out - v_check_in)) / 3600.0)::int;
    if v_units < 1 then
      v_units := 1;
    end if;
    v_unit_price := v_unit.price_per_hour;
  end if;

  v_item_subtotal := v_unit_price * v_units;

  -- --------------------------------------------------------------------
  -- 5. Validate addons upfront (fail fast before writing anything)
  -- --------------------------------------------------------------------
  for v_addon in select * from jsonb_array_elements(coalesce(p_addons, '[]'::jsonb))
  loop
    select pa.id, pa.addon_id, pa.price, pa.is_active
    into v_property_addon
    from property_addons pa
    where pa.id = (v_addon->>'property_addon_id')::uuid
      and pa.master_properties_id = v_unit.master_properties_id;

    if not found then
      raise exception 'Addon % not found for this property', v_addon->>'property_addon_id'
        using errcode = 'P0004';
    end if;

    if not v_property_addon.is_active then
      raise exception 'Addon % is not active', v_addon->>'property_addon_id'
        using errcode = 'P0004';
    end if;

    if coalesce((v_addon->>'quantity')::int, 0) < 1 then
      raise exception 'Addon quantity must be >= 1 for %', v_addon->>'property_addon_id'
        using errcode = 'P0001';
    end if;

    v_addons_total := v_addons_total + (v_property_addon.price * (v_addon->>'quantity')::int);
  end loop;

  v_total_amount := v_item_subtotal + v_addons_total;

  -- --------------------------------------------------------------------
  -- 6. Create order
  -- --------------------------------------------------------------------
  v_booking_code := public.generate_booking_code();

  insert into orders (
    booking_code,
    expires_at,
    guest_email,
    guest_name,
    guest_phone,
    status,
    total_amount,
    total_guest,
    user_id
  ) values (
    v_booking_code,
    now() + interval '1 hour',   -- payment expiry window, adjust as needed
    p_guest_email,
    p_guest_name,
    p_guest_phone,
    'PENDING_PAYMENT',
    v_total_amount,
    p_total_guest,
    v_user_id
  )
  returning id into v_order_id;

  -- --------------------------------------------------------------------
  -- 7. Create order_item
  -- --------------------------------------------------------------------
  insert into order_items (
    check_in,
    check_out,
    guest_amount,
    order_id,
    price_at_booking,
    quantity,
    status_item,
    subtotal,
    type_booking,
    unit_id
  ) values (
    v_check_in,
    v_check_out,
    p_total_guest,
    v_order_id,
    v_unit_price,
    v_units,
    'PENDING',
    v_item_subtotal,
    p_booking_type,
    p_unit_id
  )
  returning id into v_order_item_id;

  -- --------------------------------------------------------------------
  -- 8. Create order_item_addons
  -- --------------------------------------------------------------------
  for v_addon in select * from jsonb_array_elements(coalesce(p_addons, '[]'::jsonb))
  loop
    select pa.addon_id, pa.price
    into v_property_addon
    from property_addons pa
    where pa.id = (v_addon->>'property_addon_id')::uuid;

    v_addon_subtotal := v_property_addon.price * (v_addon->>'quantity')::int;

    insert into order_item_addons (
      addon_id,
      order_item_id,
      price_at_booking,
      quantity
    ) values (
      v_property_addon.addon_id,
      v_order_item_id,
      v_property_addon.price,
      (v_addon->>'quantity')::int
    );
  end loop;

  -- --------------------------------------------------------------------
  -- 9. Create payment record (snapshot destination bank, status SUBMITTED)
  -- --------------------------------------------------------------------
  insert into payments (
    order_id,
    amount,
    proof_url,
    status,
    destination_bank_name,
    destination_account_number,
    destination_account_holder
  ) values (
    v_order_id,
    v_total_amount,
    p_proof_url,
    'SUBMITTED',
    v_bank.bank_name,
    v_bank.account_number,
    v_bank.account_holder
  );

  -- --------------------------------------------------------------------
  -- 10. Return result
  -- --------------------------------------------------------------------
  return query
  select v_order_id, v_booking_code, v_total_amount;
end;
$$;

-- NOTE: signature unchanged from create_booking_v2.sql (still has p_proof_url
-- as parameter #6), so a plain `create or replace` is sufficient here — no
-- need to drop the function first if v2 is already applied.

grant execute on function public.create_booking(
  uuid, text, timestamptz, timestamptz, int, text, text, text, text, text, jsonb
) to authenticated, anon;