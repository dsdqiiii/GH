create or replace function public.sync_items_from_order_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'CONFIRMED' and (old.status is distinct from new.status) then
    update order_items
    set status_item = 'BOOKED'
    where order_id = new.id
      and status_item = 'PENDING';
  end if;

  if new.status in ('CANCELLED', 'EXPIRED') and (old.status is distinct from new.status) then
    update order_items
    set status_item = new.status,
        cancelled_at = now(),
        cancelled_by = case when new.status = 'CANCELLED' then auth.uid() else null end
    where order_id = new.id
      and status_item not in ('CANCELLED', 'EXPIRED', 'CHECKED_IN', 'CHECKED_OUT');
  end if;

  return new;
end;
$$;

drop trigger if exists trg_sync_items_from_order_status on orders;

create trigger trg_sync_items_from_order_status
after update of status on orders
for each row
execute function public.sync_items_from_order_status();