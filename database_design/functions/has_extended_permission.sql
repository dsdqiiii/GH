create or replace function public.has_extended_permission(p_permission_name text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.extended_permissions ep
    join public.permissions p on p.id = ep.permission_id
    where ep.user_id = auth.uid()
      and p.name = p_permission_name
  );
$$;