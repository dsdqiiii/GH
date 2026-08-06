create or replace function public.expire_pending_orders()
returns table (
  order_id uuid,
  reason text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_reason text;
begin
  for v_order_id, v_reason in
    with stale_orders as (
      select distinct o.id,
        case
          when o.expires_at <= now() then 'expires_at_passed'
          else 'checkout_passed'
        end as reason
      from orders o
      where o.status = 'PENDING_PAYMENT'
        and (
          o.expires_at <= now()
          or exists (
            select 1
            from order_items oi2
            where oi2.order_id = o.id
              and oi2.check_out <= now()
              and oi2.status_item not in ('CANCELLED', 'EXPIRED', 'CHECKED_IN', 'CHECKED_OUT')
          )
        )
    ),
    cancel_orders as (
      update orders
      set status = 'EXPIRED',
          updated_at = now()
      where id in (select id from stale_orders)
      returning id
    )
    select so.id, so.reason from stale_orders so
  loop
    insert into activity_logs (
      actor_type, actor_id, event, entity_type, entity_id, metadata
    ) values (
      'system', null, 'order.expired', 'order', v_order_id,
      jsonb_build_object('reason', v_reason)
    );

    order_id := v_order_id;
    reason := v_reason;
    return next;
  end loop;
end;
$$;

revoke all on function public.expire_pending_orders() from public, anon, authenticated;