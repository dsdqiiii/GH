CREATE POLICY "Any users can read facilities"
ON master_facilities
FOR SELECT
USING (true);