create or replace function public.get_available_units(
  p_property_id uuid,
  p_check_in timestamptz,
  p_duration int default 1,
  p_type_booking text default 'inap',
  p_adult int default 2
)
returns table (
  id uuid,
  master_properties_id uuid,
  name text,
  slug text,
  base_price_per_night numeric,
  price_per_hour numeric,
  is_transit_enabled boolean,
  capacity integer,
  floor text,
  descriptions text,
  is_active boolean
)
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_duration            int := coalesce(p_duration, 1);
  v_check_in            timestamptz;
  v_check_out           timestamptz;

  v_maintenance_buffer  interval := interval '1 hour';
  v_max_horizon         interval := interval '1 year';
  v_transit_min_lead    interval := interval '30 minutes';
begin

  if p_type_booking not in ('inap', 'transit') then
    raise exception 'p_type_booking tidak valid: %', p_type_booking;
  end if;

  if p_type_booking = 'transit' then
    if v_duration < 1 or v_duration > 5 then
      raise exception 'duration transit harus antara 1-5 jam, diterima: %', v_duration;
    end if;
  else
    if v_duration < 1 or v_duration > 100 then
      raise exception 'duration inap harus antara 1-100 malam, diterima: %', v_duration;
    end if;
  end if;

  if p_type_booking = 'inap' then
    v_check_in  := date_trunc('day', p_check_in) + interval '14 hours';
    v_check_out := date_trunc('day', v_check_in) + (v_duration || ' days')::interval + interval '12 hours';
  else
    v_check_in  := p_check_in;
    v_check_out := v_check_in + (v_duration || ' hours')::interval;
  end if;

  if v_check_in > now() + v_max_horizon then
    raise exception 'check-in tidak boleh lebih dari % ke depan', v_max_horizon;
  end if;

  if p_type_booking = 'inap' then
    if now() >= date_trunc('day', v_check_in) + interval '1 day' + interval '7 hours' then
      raise exception 'sudah melewati batas waktu booking untuk tanggal check-in tersebut (cutoff 07:00 keesokan harinya)';
    end if;
  else
    if now() >= v_check_in - v_transit_min_lead then
      raise exception 'booking transit harus dilakukan minimal % sebelum check-in', v_transit_min_lead;
    end if;
  end if;

  return query
  select
    u.id,
    u.master_properties_id,
    u.name::text,
    u.slug::text,
    u.base_price_per_night,
    u.price_per_hour,
    u.is_transit_enabled,
    u.capacity,
    u.floor::text,
    u.descriptions::text,
    u.is_active
  from units u
  where
    u.master_properties_id = p_property_id
    and u.is_active = true
    and (
      p_type_booking <> 'transit'
      or u.is_transit_enabled = true
    )
    and not exists (
      select 1
      from order_items oi
      join orders o on o.id = oi.order_id
      where
        oi.unit_id = u.id
        and (
          oi.status_item in ('CONFIRMED', 'CHECKED_IN')
          or (oi.status_item = 'PENDING' and o.expires_at > now())
        )
        and oi.check_in - v_maintenance_buffer < v_check_out
        and oi.check_out + v_maintenance_buffer > v_check_in
    );
end;
$$;

revoke execute on function public.get_available_units(
  uuid, timestamptz, int, text, int
) from public;

grant execute on function public.get_available_units(
  uuid, timestamptz, int, text, int
) to anon, authenticated;