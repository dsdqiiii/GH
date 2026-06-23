-- =========================
-- SELECT POLICY
-- =========================

DROP POLICY IF EXISTS "auth user can read own profile" ON profiles;
CREATE POLICY "auth user can read own profile"
ON profiles
FOR SELECT
TO authenticated
USING (
  id = auth.uid()
);

DROP POLICY IF EXISTS "public can read active unit" ON units;
CREATE POLICY "public can read active unit"
ON units
FOR SELECT
TO public
USING (
  is_active = true
);

DROP POLICY IF EXISTS "public can read active galleries" ON galleries;
CREATE POLICY "public can read active galleries"
ON galleries
FOR SELECT
TO public
USING (
  is_active = true
);

DROP POLICY IF EXISTS "public can read active property addons" ON property_addons;
CREATE POLICY "public can read active property addons"
ON property_addons
FOR SELECT
TO public
USING (
  is_active = true
);