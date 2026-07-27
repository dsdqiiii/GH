-- =========================================================================
-- FILE: dump.sql
-- DESKRIPSI: Seeding data orders/transaksi dummy untuk testing kalender
-- AMAN DIJALANKAN BERULANG KALI (Idempotent)
-- =========================================================================

DO $$
DECLARE
  v_unit_id uuid := '53fa3d1b-42a6-41ed-8659-e6e9c7294eff'; -- Kamar 201 Andalusia 54
  v_order_id_1 uuid;
  v_order_item_id_1 uuid;
  v_order_id_2 uuid;
  v_order_item_id_2 uuid;
  v_order_id_3 uuid;
  v_order_item_id_3 uuid;
  v_order_id_4 uuid;
  v_order_item_id_4 uuid;
BEGIN
  -- 1. CLEANUP ORDER DUMMY LAMA
  DELETE FROM orders 
  WHERE booking_code IN (
    'TRX-202608-001', 
    'TRX-202608-002', 
    'TRX-202608-003', 
    'TRX-202608-004'
  );

  -- 2. SKENARIO 1: Booking Lunas & Terkonfirmasi (BOOKED) [5-8 Ags 2026]
  INSERT INTO orders (
    booking_code, guest_name, guest_phone, guest_email, status, total_amount, total_guest, expires_at
  ) VALUES (
    'TRX-202608-001', 'Budi Santoso', '081234567890', 'budi@gmail.com', 'BOOKED', 1650000.00, 2, NOW() + INTERVAL '1 day'
  ) RETURNING id INTO v_order_id_1;

  INSERT INTO order_items (
    order_id, unit_id, type_booking, guest_amount, status_item, check_in, check_out, price_at_booking, quantity, subtotal
  ) VALUES (
    v_order_id_1, v_unit_id, 'inap', 2, 'CONFIRMED', '2026-08-05 14:00:00+07', '2026-08-08 12:00:00+07', 500000.00, 3, 1500000.00
  ) RETURNING id INTO v_order_item_id_1;

  INSERT INTO order_item_addons (order_item_id, addon_id, quantity, price_at_booking)
  VALUES (v_order_item_id_1, 1, 1, 150000.00);

  INSERT INTO payments (
    order_id, amount, proof_url, status, destination_bank_name, destination_account_number, destination_account_holder
  ) VALUES (
    v_order_id_1, 1650000.00, 'https://example.com/proof-001.jpg', 'VERIFIED', 'BCA', '1234567890', 'PT Hospitality Indonesia'
  );

  -- 3. SKENARIO 2: Booking Pending Payment (Mengunci Kalender) [12-14 Ags 2026]
  INSERT INTO orders (
    booking_code, guest_name, guest_phone, guest_email, status, total_amount, total_guest, expires_at
  ) VALUES (
    'TRX-202608-002', 'Siti Rahma', '089876543210', 'siti@gmail.com', 'PENDING_PAYMENT', 1000000.00, 1, NOW() + INTERVAL '2 hours'
  ) RETURNING id INTO v_order_id_2;

  INSERT INTO order_items (
    order_id, unit_id, type_booking, guest_amount, status_item, check_in, check_out, price_at_booking, quantity, subtotal
  ) VALUES (
    v_order_id_2, v_unit_id, 'inap', 1, 'PENDING', '2026-08-12 14:00:00+07', '2026-08-14 12:00:00+07', 500000.00, 2, 1000000.00
  ) RETURNING id INTO v_order_item_id_2;

  INSERT INTO payments (
    order_id, amount, proof_url, status, destination_bank_name, destination_account_number, destination_account_holder
  ) VALUES (
    v_order_id_2, 1000000.00, 'https://example.com/proof-002.jpg', 'SUBMITTED', 'Mandiri', '0987654321', 'PT Hospitality Indonesia'
  );

  -- 4. SKENARIO 3: Booking Transit [18 Ags 2026, 14:00 - 18:00]
  INSERT INTO orders (
    booking_code, guest_name, guest_phone, guest_email, status, total_amount, total_guest, expires_at
  ) VALUES (
    'TRX-202608-003', 'Ahmad Dani', '081122334455', 'ahmad@gmail.com', 'BOOKED', 300000.00, 2, NOW() + INTERVAL '1 day'
  ) RETURNING id INTO v_order_id_3;

  INSERT INTO order_items (
    order_id, unit_id, type_booking, guest_amount, status_item, check_in, check_out, price_at_booking, quantity, subtotal
  ) VALUES (
    v_order_id_3, v_unit_id, 'transit', 2, 'CONFIRMED', '2026-08-18 14:00:00+07', '2026-08-18 18:00:00+07', 75000.00, 4, 300000.00
  ) RETURNING id INTO v_order_item_id_3;

  INSERT INTO payments (
    order_id, amount, proof_url, status, destination_bank_name, destination_account_number, destination_account_holder
  ) VALUES (
    v_order_id_3, 300000.00, 'https://example.com/proof-003.jpg', 'VERIFIED', 'BCA', '1234567890', 'PT Hospitality Indonesia'
  );

  -- 5. SKENARIO 4: Booking Batal/Expired (TIDAK Mengunci Kalender) [22-24 Ags 2026]
  INSERT INTO orders (
    booking_code, guest_name, guest_phone, guest_email, status, total_amount, total_guest, expires_at
  ) VALUES (
    'TRX-202608-004', 'Eko Prasetyo', '085566778899', 'eko@gmail.com', 'CANCELLED', 1000000.00, 1, NOW() - INTERVAL '1 hour'
  ) RETURNING id INTO v_order_id_4;

  INSERT INTO order_items (
    order_id, unit_id, type_booking, guest_amount, status_item, check_in, check_out, price_at_booking, quantity, subtotal
  ) VALUES (
    v_order_id_4, v_unit_id, 'inap', 1, 'CANCELLED', '2026-08-22 14:00:00+07', '2026-08-24 12:00:00+07', 500000.00, 2, 1000000.00
  ) RETURNING id INTO v_order_item_id_4;

  RAISE NOTICE 'Seeding orders dummy berhasil ke Kamar 201 Andalusia 54!';
END $$;