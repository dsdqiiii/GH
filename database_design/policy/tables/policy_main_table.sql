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
  or is_admin()
  or is_assigned_to_property(master_properties_id)
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

-- =========================
-- INSERT POLICY
-- =========================

drop policy if exists "admin or assigned staff can insert unit" on units;
create policy "admin or assigned staff can insert unit"
on units
for insert
with check (
  is_admin() or is_assigned_to_property(master_properties_id)
);

-- =========================
-- UPDATE POLICY
-- =========================

drop policy if exists "admin or assigned staff can update unit" on units;
create policy "admin or assigned staff can update unit"
on units
for update
using (
  is_admin() or is_assigned_to_property(master_properties_id)
)
with check (
  is_admin() or is_assigned_to_property(master_properties_id)
);