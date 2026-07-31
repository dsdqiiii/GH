create or replace function public.generate_booking_code()
returns text
language plpgsql
as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- exclude 0/O, 1/I
  code text;
  i int;
begin
  loop
    code := 'DN-' || to_char(now(), 'YYMMDD') || '-';
    for i in 1..4 loop
      code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    end loop;

    exit when not exists (select 1 from orders where booking_code = code);
  end loop;

  return code;
end;
$$;