-- ============================================================
-- 1. INSERT UNITS (LENGKAP)
-- ============================================================
INSERT INTO public.units (
  master_properties_id, name, slug, base_price_per_night, price_per_hour, is_transit_enabled, capacity, floor, unit_type
) VALUES
-- --- Andalusia 54 (b779d9eb-04e9-4b4e-8874-5be67c98abd7) ---
-- Lantai 2 VIP
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 201 Andalusia 54', 'kamar-201-andalus54', 305000, 15000, true, 2, 'Lantai 2', 'VIP'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 202 Andalusia 54', 'kamar-202-andalus54', 305000, 15000, true, 2, 'Lantai 2', 'VIP'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 203 Andalusia 54', 'kamar-203-andalus54', 305000, 15000, true, 2, 'Lantai 2', 'VIP'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 207 Andalusia 54', 'kamar-207-andalus54', 305000, 15000, true, 2, 'Lantai 2', 'VIP'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 208 Andalusia 54', 'kamar-208-andalus54', 305000, 15000, true, 2, 'Lantai 2', 'VIP'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 209 Andalusia 54', 'kamar-209-andalus54', 305000, 15000, true, 2, 'Lantai 2', 'VIP'),
-- Lantai 2 Standard
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 204 Andalusia 54', 'kamar-204-andalus54', 295000, 15000, true, 2, 'Lantai 2', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 205 Andalusia 54', 'kamar-205-andalus54', 295000, 15000, true, 2, 'Lantai 2', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 206 Andalusia 54', 'kamar-206-andalus54', 295000, 15000, true, 2, 'Lantai 2', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 210 Andalusia 54', 'kamar-210-andalus54', 295000, 15000, true, 2, 'Lantai 2', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 211 Andalusia 54', 'kamar-211-andalus54', 295000, 15000, true, 2, 'Lantai 2', 'Standard'),
-- Lantai 3 (301-311 Standard)
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 301 Andalusia 54', 'kamar-301-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 302 Andalusia 54', 'kamar-302-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 303 Andalusia 54', 'kamar-303-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 304 Andalusia 54', 'kamar-304-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 305 Andalusia 54', 'kamar-305-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 306 Andalusia 54', 'kamar-306-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 307 Andalusia 54', 'kamar-307-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 308 Andalusia 54', 'kamar-308-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 309 Andalusia 54', 'kamar-309-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 310 Andalusia 54', 'kamar-310-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 311 Andalusia 54', 'kamar-311-andalus54', 275000, null, false, 2, 'Lantai 3', 'Standard'),
-- Lantai 4 (401-411 Standard)
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 401 Andalusia 54', 'kamar-401-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 402 Andalusia 54', 'kamar-402-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 403 Andalusia 54', 'kamar-403-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 404 Andalusia 54', 'kamar-404-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 405 Andalusia 54', 'kamar-405-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 406 Andalusia 54', 'kamar-406-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 407 Andalusia 54', 'kamar-407-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 408 Andalusia 54', 'kamar-408-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 409 Andalusia 54', 'kamar-409-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 410 Andalusia 54', 'kamar-410-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 411 Andalusia 54', 'kamar-411-andalus54', 265000, 15000, true, 2, 'Lantai 4', 'Standard'),

-- --- Andalusia (e225567b-8278-4b82-9abe-051dbd5d3359) ---
-- Lantai 1
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 104 Andalusia', 'kamar-104-andalusia', 380000, null, false, 2, 'Lantai 1', 'VIP'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 102 Andalusia', 'kamar-102-andalusia', 355000, null, false, 2, 'Lantai 1', 'Standard'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 103 Andalusia', 'kamar-103-andalusia', 355000, null, false, 2, 'Lantai 1', 'Standard'),
-- Lantai 2
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 201 Andalusia', 'kamar-201-andalusia', 355000, 15000, true, 2, 'Lantai 2', 'VIP'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 208 Andalusia', 'kamar-208-andalusia', 355000, 15000, true, 2, 'Lantai 2', 'VIP'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 202 Andalusia', 'kamar-202-andalusia', 330000, 15000, true, 2, 'Lantai 2', 'Standard'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 207 Andalusia', 'kamar-207-andalusia', 330000, 15000, true, 2, 'Lantai 2', 'Standard'),
-- Lantai 3
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 301 Andalusia', 'kamar-301-andalusia', 315000, null, false, 2, 'Lantai 3', 'VIP'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 308 Andalusia', 'kamar-308-andalusia', 315000, null, false, 2, 'Lantai 3', 'VIP'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 302 Andalusia', 'kamar-302-andalusia', 290000, null, false, 2, 'Lantai 3', 'Standard'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 307 Andalusia', 'kamar-307-andalusia', 290000, null, false, 2, 'Lantai 3', 'Standard'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 309 Andalusia', 'kamar-309-andalusia', 265000, null, false, 2, 'Lantai 3', 'Standard'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 310 Andalusia', 'kamar-310-andalusia', 265000, null, false, 2, 'Lantai 3', 'Standard'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 311 Andalusia', 'kamar-311-andalusia', 35000,  null, false, 1, 'Lantai 3', 'Jamaah');


-- ============================================================
-- 2. INSERT GALLERIES - PROPERTY
-- ============================================================
INSERT INTO public.galleries (reference_type, reference_id, url, is_main) VALUES
-- Andalusia 54
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/lorong.jpg', false),
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/02_lorong_kaligrafi.jpg', true),
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/04_gedung_andalusia.jpg', true),
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/resepsionis_gh54.jpg', true),
-- Andalusia (Biasa)
('property', 'e225567b-8278-4b82-9abe-051dbd5d3359', 'public/GHDALAM/03_lorong_kamar.jpg', true),
('property', 'e225567b-8278-4b82-9abe-051dbd5d3359', 'public/GHDALAM/kamar_standard.jpg', true);


-- ============================================================
-- 3. INSERT GALLERIES - UNITS (AMAN KARENA GUNAKAN SLUG LOOKUP)
-- ============================================================
-- Gambar Kamar & Toilet untuk SEMUA Unit di Andalusia 54
INSERT INTO public.galleries (reference_type, reference_id, url, is_main)
SELECT 
  'unit', 
  u.id, 
  CASE 
    WHEN u.unit_type = 'VIP' THEN 'public/GH54/kamar_vip.jpg' 
    ELSE 'public/GH54/kamar_standard.jpg' 
  END, 
  false
FROM public.units u WHERE u.master_properties_id = 'b779d9eb-04e9-4b4e-8874-5be67c98abd7';

INSERT INTO public.galleries (reference_type, reference_id, url, is_main)
SELECT 'unit', u.id, 'public/GH54/Toilet.jpg', false
FROM public.units u WHERE u.master_properties_id = 'b779d9eb-04e9-4b4e-8874-5be67c98abd7';


-- Gambar Kamar & Toilet untuk SEMUA Unit di Andalusia (Biasa)
INSERT INTO public.galleries (reference_type, reference_id, url, is_main)
SELECT 'unit', u.id, 'public/GHDALAM/kamar_standard.jpg', false
FROM public.units u WHERE u.master_properties_id = 'e225567b-8278-4b82-9abe-051dbd5d3359';

INSERT INTO public.galleries (reference_type, reference_id, url, is_main)
SELECT 'unit', u.id, 'public/GHDALAM/Toilet.jpg', false
FROM public.units u WHERE u.master_properties_id = 'e225567b-8278-4b82-9abe-051dbd5d3359';

-- ======================
-- PROPERTY ADDONS INSERT
-- ======================
INSERT INTO property_addons (master_properties_id, addon_id, price) VALUES
-- Property 1
('e225567b-8278-4b82-9abe-051dbd5d3359', 1, 30000.00), -- Extra Bed
('e225567b-8278-4b82-9abe-051dbd5d3359', 2, 25000.00),  -- Late Checkout
('e225567b-8278-4b82-9abe-051dbd5d3359', 3, 25000.00),  -- Early Check-in

-- Property 2
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 1, 30000.00), -- Extra Bed
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 2, 25000.00),  -- Late Checkout
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 3, 25000.00);  -- Early Check-in