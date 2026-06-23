-- =========================
-- SELECT POLICY
-- =========================

CREATE POLICY "public can read charges"
ON master_charges
FOR SELECT
TO public
USING (
  is_active = true
);

CREATE POLICY "public can read roles"
ON master_roles
FOR SELECT
TO public
USING (
  is_active = true
);

CREATE POLICY "public can read addons"
ON master_addons
FOR SELECT
TO public
USING (
  is_active = true
);

CREATE POLICY "Public can read properties"
ON master_properties
FOR SELECT
TO public
USING (
  is_active = true
);

CREATE POLICY "Public can read organizations"
ON master_organizations
FOR SELECT
TO public
USING (
  is_active = true
);

CREATE POLICY "Public can read facilities"
ON master_facilities
FOR SELECT
TO public
USING (
  is_active = true
);

CREATE POLICY "Public can read active bank accounts"
ON master_bank_accounts
FOR SELECT
TO public
USING (
  is_active = true
); 