CREATE POLICY "Anyone can read active bank accounts"
ON bank_accounts
FOR SELECT
USING (
  is_active = true
); 