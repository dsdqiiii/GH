-- -------------------------------------------------------------------------
-- 1. payments.status = 'VERIFIED' -> orders.status = 'CONFIRMED'
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
    set status = 'CONFIRMED', updated_at = now()
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