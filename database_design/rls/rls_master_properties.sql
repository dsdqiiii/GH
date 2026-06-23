CREATE POLICY "Any users can read properties"
ON master_properties
FOR SELECT
USING (true);