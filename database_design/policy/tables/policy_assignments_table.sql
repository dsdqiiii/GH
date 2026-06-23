-- =========================
-- SELECT POLICY
-- =========================

DROP POLICY IF EXISTS "public can read facility assignments" ON facility_assignments;
CREATE POLICY "public can read facility assignments"
ON facility_assignments
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "public can read facility property assignments" ON property_assignments;
CREATE POLICY "public can read facility property assignments"
ON property_assignments
FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "public can read facility property assignments" ON property_assignments;
CREATE POLICY "public can read facility property assignments"
ON property_assignments
FOR SELECT
TO public
USING (true);