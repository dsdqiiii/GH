-- -------------------------------------------------------------------------
-- 1. payments.status = 'VERIFIED' -> orders.status = 'BOOKED'
-- -------------------------------------------------------------------------
create or replace function public.sync_order_status_from_payment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status = 'VERIFIED' and (old.status is distinct from new.status) then
    update orders
    set status = 'BOOKED', updated_at = now()
    where id = new.order_id
      and status = 'PENDING_PAYMENT';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_sync_order_status_from_payment on payments;

create trigger trg_sync_order_status_from_payment
after update of status on payments
for each row
execute function public.sync_order_status_from_payment();

create or replace function public.sync_items_from_order_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('CANCELLED', 'EXPIRED') and (old.status is distinct from new.status) then
    update order_items
    set status_item = new.status,
        cancelled_at = case when new.status = 'CANCELLED' then now() else cancelled_at end
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