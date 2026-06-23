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

DROP POLICY IF EXISTS "public can read active roles" ON master_roles;
CREATE POLICY "public can read active roles"
ON master_roles
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