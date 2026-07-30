create or replace function public.set_default_booking_times()
returns trigger
language plpgsql
as $$
begin
  if new.type_booking = 'inap' then
    new.check_in := date_trunc('day', new.check_in) + interval '14 hours';
    new.check_out := date_trunc('day', new.check_out) + interval '12 hours';
  end if;

  -- transit: check_in & check_out dipercaya apa adanya dari input,
  -- tapi tetap divalidasi durasinya di bawah

  return new;
end;
$$;

create trigger trg_set_default_booking_times
before insert on order_items
for each row
execute function public.set_default_booking_times();