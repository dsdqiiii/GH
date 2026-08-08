create or replace function is_assigned_to_property(p_property_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from property_assignments pa
    where pa.user_id = auth.uid()
      and pa.master_properties_id = p_property_id
  );
$$;