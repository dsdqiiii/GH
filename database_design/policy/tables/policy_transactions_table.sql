-- =========================
-- SELECT POLICY
-- =========================

DROP POLICY IF EXISTS "auth user can read own order" ON orders;
CREATE POLICY "auth user can read own order"
ON orders
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid()
);

DROP POLICY IF EXISTS "auth user can read own order item" ON order_items;
CREATE POLICY "auth user can read own order item"
ON order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "auth user can read own order item addons" ON order_item_addons;
CREATE POLICY "auth user can read own order item addons"
ON order_item_addons
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 
    FROM order_items 
    JOIN orders ON orders.id = order_items.order_id
    WHERE order_items.id = order_item_addons.order_item_id
    AND orders.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "auth user can read own order charges" ON order_charges;
CREATE POLICY "auth user can read own order charges"
ON order_charges
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_charges.order_id 
    AND orders.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "auth user can read own payments" ON payments;
CREATE POLICY "auth user can read own payments"
ON payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = payments.order_id 
    AND orders.user_id = auth.uid()
  )
);