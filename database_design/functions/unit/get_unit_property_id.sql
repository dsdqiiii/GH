create or replace function get_unit_property_id(p_unit_id uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
  select master_properties_id from units where id = p_unit_id;
$$;