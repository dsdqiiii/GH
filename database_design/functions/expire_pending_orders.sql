-- =========================================================================
-- Auto-cancel orders still PENDING_PAYMENT once they are no longer relevant.
--
-- Two independent triggers, both resulting in status = 'CANCELLED'
-- (not 'EXPIRED' — per current decision, EXPIRED is reserved for a
-- separate/future distinction if needed; for now everything caught here
-- becomes CANCELLED):
--
--   1. expires_at has passed (short payment window, e.g. 1 hour) — the
--      normal/expected path.
--   2. Safety net: even if (1) didn't fire in time for some reason, once
--      check_out for the order's item(s) has passed while status is still
--      PENDING_PAYMENT, it's stale and must not linger indefinitely.
--
-- Intended to run on a schedule (pg_cron / Supabase scheduled function),
-- e.g. every 5 minutes.
-- =========================================================================

create or replace function public.expire_pending_orders()
returns table (
  order_id uuid,
  reason text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  return query
  with stale_orders as (
    select distinct o.id,
      case
        when o.expires_at <= now() then 'expires_at_passed'
        else 'checkout_passed'
      end as reason
    from orders o
    left join order_items oi on oi.order_id = o.id
    where o.status = 'PENDING_PAYMENT'
      and (
        o.expires_at <= now()
        or exists (
          select 1
          from order_items oi2
          where oi2.order_id = o.id
            and oi2.check_out <= now()
        )
      )
  ),
  cancel_items as (
    update order_items
    set status_item = 'EXPIRED',
        cancelled_at = now()
    where order_id in (select id from stale_orders)
      and status_item not in ('CANCELLED', 'CHECKED_IN', 'CHECKED_OUT')
  ),
  cancel_orders as (
    update orders
    set status = 'CANCELLED',
        updated_at = now()
    where id in (select id from stale_orders)
    returning id
  )
  select so.id, so.reason
  from stale_orders so;
end;
$$;

-- Only accessible server-side / via scheduled job, not by end users.
revoke all on function public.expire_pending_orders() from public, anon, authenticated;
