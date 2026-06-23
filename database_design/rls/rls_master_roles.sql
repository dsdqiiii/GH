CREATE POLICY "Any users can read roles"
ON master_roles
FOR SELECT
USING (true);