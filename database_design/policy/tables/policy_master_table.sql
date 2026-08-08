-- =========================
-- SELECT POLICY
-- =========================

DROP POLICY IF EXISTS "public can read active charges" ON master_charges;
CREATE POLICY "public can read active charges"
ON master_charges
FOR SELECT
TO public
USING (
  is_active = true
);

DROP POLICY IF EXISTS "public can read active addons" ON master_addons;
CREATE POLICY "public can read active addons"
ON master_addons
FOR SELECT
TO public
USING (
  is_active = true
);

DROP POLICY IF EXISTS "public can read active properties" ON master_properties;
CREATE POLICY "public can read active properties"
ON master_properties
FOR SELECT
TO public
USING (
  is_active = true
  or is_admin()
  or is_assigned_to_property(id)
);

DROP POLICY IF EXISTS "public can read active organizations" ON master_organizations;
CREATE POLICY "public can read active organizations"
ON master_organizations
FOR SELECT
TO public
USING (
  is_active = true
);

DROP POLICY IF EXISTS "public can read active facilities" ON master_facilities;
CREATE POLICY "public can read active facilities"
ON master_facilities
FOR SELECT
TO public
USING (
  is_active = true
);

DROP POLICY IF EXISTS "public can read active bank accounts" ON master_bank_accounts;
CREATE POLICY "public can read active bank accounts"
ON master_bank_accounts
FOR SELECT
TO public
USING (
  is_active = true
); 

-- =========================
-- INSERT POLICY
-- =========================

-- 1. Buat Policy khusus INSERT
DROP POLICY IF EXISTS "authorized users can insert properties" ON master_properties;

CREATE POLICY "authorized users can insert properties"
ON master_properties
FOR insert
TO authenticated
WITH CHECK (
  is_admin()
);

-- =========================
-- UPDATE POLICY
-- =========================

-- 1. Buat Policy khusus UPDATE
DROP POLICY IF EXISTS "authorized users can update properties" ON master_properties;

CREATE POLICY "authorized users can update properties"
ON master_properties
FOR UPDATE
TO authenticated
USING (
  is_admin() OR is_assigned_to_property(id)
)
WITH CHECK (
  is_admin() OR is_assigned_to_property(id)
);