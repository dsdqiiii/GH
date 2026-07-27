create or replace function public.get_available_units(
  p_property_id uuid,
  p_check_in timestamptz,
  p_check_out timestamptz,
  p_type_booking text default 'inap'
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
language sql
stable
security invoker
as $$
  select
    u.id,
    u.master_properties_id,
    u.name,
    u.slug,
    u.base_price_per_night,
    u.price_per_hour,
    u.is_transit_enabled,
    u.capacity,
    u.floor,
    u.descriptions,
    u.is_active

  from units u

  where
    u.master_properties_id = p_property_id

    and u.is_active = true

    -- cek transit support
    and (
      p_type_booking <> 'transit'
      or u.is_transit_enabled = true
    )

    -- cek kapasitas
    and not exists (

      select 1

      from order_items oi

      join orders o
        on o.id = oi.order_id

      where
        oi.unit_id = u.id

        -- hanya booking yang mengunci kamar
        and (
          oi.status_item = 'CONFIRMED'

          or (
            oi.status_item = 'PENDING'
            and o.expires_at > now()
          )
        )

        -- overlap tanggal / jam
        and oi.check_in < p_check_out
        and oi.check_out > p_check_in
    );

$$;