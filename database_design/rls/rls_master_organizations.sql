CREATE POLICY "Any users can read organizations"
ON master_organizations
FOR SELECT
USING (true);