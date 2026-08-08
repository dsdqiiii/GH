-- 1. Pastikan Row Level Security (RLS) aktif di tabel roles
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;

-- 2. Hapus policy lama jika ada untuk menghindari konflik
DROP POLICY IF EXISTS "public can read roles" ON public.roles;

-- 3. Buat policy SELECT untuk public
CREATE POLICY "public can read roles"
ON public.roles
FOR SELECT
TO public
USING (true);