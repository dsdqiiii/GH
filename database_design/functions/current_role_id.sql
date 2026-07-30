create or replace function public.current_role_id()
returns smallint
language sql
stable
security definer
set search_path = public
as $$
  select role_id
  from public.profiles
  where id = auth.uid();
$$;