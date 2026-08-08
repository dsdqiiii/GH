create or replace function public.create_booking(
  p_unit_id uuid,
  p_booking_type text, -- 'inap' | 'transit'
  p_check_in timestamptz,
  p_duration int,
  p_total_guest int,
  p_proof_url text, -- required: uploaded client-side to storage before calling this RPC
  p_user_id text default null, -- text, not uuid: allows normalizing "" -> null before casting
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
  v_user_id uuid;
  v_check_in timestamptz;
  v_check_out timestamptz;
  v_checkin_date_jkt date;
  v_cutoff_jkt timestamp;
  v_unit record;
  v_addon_count int;
  v_first_addon jsonb;
  v_org_id uuid;
  v_bank record;
  v_units int;
  v_unit_price numeric;
  v_item_subtotal numeric;
  v_property_addon record;
  v_addons_total numeric := 0;
  v_total_amount numeric;
  v_order_id uuid;
  v_order_item_id uuid;
  v_booking_code text;

begin
  
  -- 1. cek input user id
  if p_user_id is null or trim(p_user_id) = '' then
    v_user_id := null;
  else
    v_user_id := p_user_id::uuid;
  end if;

  -- 2. cek input bio
  if v_user_id is null then

    -- 2.1. wajib ada
    if p_guest_name is null or trim(p_guest_name) = '' then
      raise exception 'guest_name is required for anonymous booking'
        using errcode = 'P0001';
    end if;

    -- 2.2. nomor wajib ada
    if p_guest_phone is null or trim(p_guest_phone) = '' then
      raise exception 'guest_phone is required for anonymous booking'
        using errcode = 'P0001';
    end if;

    -- 2.3. email wajib ada
    if p_guest_email is null or trim(p_guest_email) = '' then
      raise exception 'p_guest_email is required for anonymous booking'
        using errcode = 'P0001';
    end if;
  end if;

  -- 3. cek input type booking
  if p_booking_type not in ('inap', 'transit') then
    raise exception 'Invalid booking_type: %', p_booking_type
      using errcode = 'P0001';
  end if;
  
  -- 4. cek input url bukti
  -- ini perlu diperjelas dan dipertajam bagaimana alur nya
  -- siapa yang sanitasi input dsb.
  if p_proof_url is null or trim(p_proof_url) = '' then
    raise exception 'proof_url is required (upload payment proof before creating booking)'
      using errcode = 'P0001';
  end if;

  -- 5. cek addons (mvp: hanya extra bed diizinkan, qty harus = 1)  
  v_addon_count := jsonb_array_length(coalesce(p_addons, '[]'::jsonb));

  if v_addon_count > 1 then
    raise exception 'Only one addon (extra bed) is supported for now'
      using errcode = 'P0004';
  end if;

  if v_addon_count = 1 then
    v_first_addon := p_addons->0;

    if coalesce((v_first_addon->>'quantity')::int, 0) <> 1 then
      raise exception 'Extra bed addon quantity must be exactly 1'
        using errcode = 'P0004';
    end if;
  end if;

  -- 6. cek horizon (maksimal 6 bulan dari sekarang)
  if p_check_in > (now() + interval '6 months') then
    raise exception 'Booking date is too far in advance (max 6 months from now)'
      using errcode = 'P0001';
  end if;

  -- 7. cek inap
  if p_booking_type = 'inap' then

    -- 7.1. hitung check_in/check_out dulu
    v_checkin_date_jkt := ((p_check_in at time zone 'Asia/Jakarta')::date);
    v_check_in  := (v_checkin_date_jkt::text || ' 14:00:00')::timestamp
      at time zone 'Asia/Jakarta';
    v_check_out := ((v_checkin_date_jkt + p_duration)::text || ' 12:00:00')::timestamp
      at time zone 'Asia/Jakarta';

    -- 7.2. cek cut off D+1 07.00
    v_cutoff_jkt := (v_checkin_date_jkt + 1)::text || ' 07:00:00';

    if (now() at time zone 'Asia/Jakarta') >= v_cutoff_jkt::timestamp then
      raise exception 'Booking cut-off has passed for check-in date % (must be booked before 07:00 WIB on %)',
        v_checkin_date_jkt, (v_checkin_date_jkt + 1)
          using errcode = 'P0005';
    end if;

    -- 7.3. cek durasi minmax 
    if p_duration < 1 or p_duration > 10 then
      raise exception 'duration (nights) must be >= 1 or must be <= 10'
        using errcode = 'P0001';
    end if;

  -- 8. cek transit
  else

    -- 8.1. hitung check_in/check_out dulu
    v_check_in  := p_check_in;
    v_check_out := p_check_in + (p_duration || ' hour')::interval;

    -- 8.2. cek interval -30 menit sebelum req
    if v_check_in <= (now() + interval '30 minutes') then
      raise exception 'Transit booking must be made at least 30 minutes before the selected check-in time'
        using errcode = 'P0005';
    end if;

    -- 8.3. cek durasi minmax
    if p_duration < 1 or p_duration > 5 then
      raise exception 'duration (hours) must be between 1 and 5 for transit booking'
        using errcode = 'P0001';
    end if;

  end if;

  -- 9. revalidate cek in cek out, perlu?
  if v_check_out <= v_check_in then
    raise exception 'check_out must be after check_in'
      using errcode = 'P0001';
  end if;

  -- 10. lock & fetch unit
  select *
  into v_unit
  from units
  where id = p_unit_id
    and is_active = true
    and deleted_at is null
  for update;

  -- 10.1. cek ketersediaan overall
  if not found then
    raise exception 'Unit not found or inactive: %', p_unit_id
      using errcode = 'P0002';
  end if;

  -- 10.2. cek bisa transit
  -- boleh = if true and (not true) = if false
  if p_booking_type = 'transit' and not v_unit.is_transit_enabled then
    raise exception 'Unit does not support transit booking'
      using errcode = 'P0001';
  end if;

  -- 10.x (seharusnya di level tabel. cek constraint, nanti revisi)
  if p_booking_type = 'transit' and v_unit.price_per_hour is null then
    raise exception 'Unit has no price_per_hour configured'
      using errcode = 'P0001';
  end if;

  -- 10.3. cek jumlah tamu = + 1 cap
  -- perlu perhitungkan extra bed?
  -- sepertinya tidak usah, tidak perlu seketat itu untuk mvp
  -- intinya N+1 either extra or not
  if p_total_guest > v_unit.capacity + 1 then
    raise exception 'total_guest (%) exceeds unit capacity (%)', p_total_guest, v_unit.capacity
      using errcode = 'P0001';
  end if;

  -- 11. cek ketersediaan
  if exists (
    select 1
    from order_items oi
    where oi.unit_id = p_unit_id
      -- sudah (akan) resolved constraint level tabel
      and oi.status_item not in ('CHECKED_OUT', 'CANCELLED', 'EXPIRED')
      and oi.check_in < v_check_out
      and oi.check_out > v_check_in
  ) then
    raise exception 'Unit is not available for the selected date/time range'
      using errcode = 'P0003';
  end if;

  -- 12. resolve organisasi & bank account tujuan
  -- MVP: 1 organisasi = 1 bank account aktif
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

  -- 13. hitung harga (flat, tanpa diskon)
  -- todo: diskon per-role untuk auth guest (non-anon), based on role bukan kupon.
  -- perlu skema baru (mis. master_role_discounts) - ditunda dari MVP ini.
  if p_booking_type = 'inap' then
    v_units := p_duration; -- sudah dalam satuan malam
    v_unit_price := v_unit.base_price_per_night;
  else
    v_units := p_duration; -- sudah dalam satuan jam
    v_unit_price := v_unit.price_per_hour;
  end if;

  v_item_subtotal := v_unit_price * v_units;

  -- 14. validasi & hitung subtotal addon (mvp: hanya extra_bed, qty selalu 1)
  if v_addon_count = 1 then
    select pa.id, pa.addon_id, pa.price, pa.is_active, ma.code
    into v_property_addon
    from property_addons pa
    join master_addons ma on ma.id = pa.addon_id
    where pa.id = (v_first_addon->>'property_addon_id')::uuid
      and pa.master_properties_id = v_unit.master_properties_id;

    if not found then
      raise exception 'Addon % not found for this property', v_first_addon->>'property_addon_id'
        using errcode = 'P0004';
    end if;

    if not v_property_addon.is_active then
      raise exception 'Addon % is not active', v_first_addon->>'property_addon_id'
        using errcode = 'P0004';
    end if;

    if v_property_addon.code <> 'EXTRA_BED' then
      raise exception 'Only extra_bed addon is supported for now'
        using errcode = 'P0004';
    end if;

    v_addons_total := v_property_addon.price; -- qty dipastikan = 1 dari validasi awal
  else
    v_addons_total := 0;
  end if;

  v_total_amount := v_item_subtotal + v_addons_total;

  -- 15. generate booking code
  v_booking_code := public.generate_booking_code();

  -- 16. insert orders
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
    now() + interval '1 hour', -- payment expiry window
    p_guest_email,
    p_guest_name,
    p_guest_phone,
    'PENDING_PAYMENT',
    v_total_amount,
    p_total_guest,
    v_user_id
  )
  returning id into v_order_id;

  -- 17. insert order_items (qty selalu 1, single unit)
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
    1,
    'PENDING',
    v_item_subtotal,
    p_booking_type,
    p_unit_id
  )
  returning id into v_order_item_id;

  -- 18. insert order_item_addons (kalau ada extra_bed)
  if v_addon_count = 1 then
    insert into order_item_addons (
      addon_id,
      order_item_id,
      price_at_booking,
      quantity
    ) values (
      v_property_addon.addon_id,
      v_order_item_id,
      v_property_addon.price,
      1
    );
  end if;

  -- 19. insert payment (snapshot bank tujuan, status SUBMITTED)
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

  -- 20. logs
  insert into activity_logs (
    actor_type,
    actor_id,
    event,
    entity_type,
    entity_id,
    metadata
  ) values (
      case
          when v_user_id is null then 'anonymous'
          else 'user'
      end,
      v_user_id,
      'booking.created',
      'order',
      v_order_id,
      jsonb_build_object(
        'booking_code', v_booking_code,
        'guest_name', p_guest_name,
        'guest_email', p_guest_email,
        'booking_type', p_booking_type,
        'check_in', v_check_in,
        'check_out', v_check_out,
        'total_guest', p_total_guest,
        'total_amount', v_total_amount
      )
  );

  -- 20. return hasil
  return query
  select v_order_id, v_booking_code, v_total_amount;
end;
$$;

revoke execute on function public.create_booking(
  uuid, text, timestamptz, int, int, text, text, text, text, text, jsonb
) from public;

grant execute on function public.create_booking(
  uuid, text, timestamptz, int, int, text, text, text, text, text, jsonb
) to authenticated, anon;