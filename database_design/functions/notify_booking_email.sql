-- ============================================================================
-- Prereq: enable pg_net extension (for async HTTP calls from Postgres)
-- ============================================================================
create extension if not exists pg_net with schema extensions;

select vault.create_secret('https://YOUR_PROJECT_REF.supabase.co', 'supabase_url');
select vault.create_secret('YOUR_SERVICE_ROLE_KEY', 'service_role_key');


-- ============================================================================
-- Trigger function: fires after insert on orders, only when guest_email exists
-- ============================================================================
create or replace function public.notify_booking_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_url text;
  v_service_key text;
begin
  if new.guest_email is null or trim(new.guest_email) = '' then
    return new;
  end if;

  select decrypted_secret into v_url
  from vault.decrypted_secrets
  where name = 'supabase_url';

  select decrypted_secret into v_service_key
  from vault.decrypted_secrets
  where name = 'service_role_key';

  v_url := v_url || '/functions/v1/send-booking-email';

  perform net.http_post(
    url := v_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || v_service_key
    ),
    body := jsonb_build_object(
      'order_id', new.id,
      'booking_code', new.booking_code,
      'guest_email', new.guest_email,
      'guest_name', new.guest_name
    )
  );

  return new;
end;
$$;

drop trigger if exists trg_notify_booking_email on orders;

create trigger trg_notify_booking_email
after insert on orders
for each row
execute function public.notify_booking_email();