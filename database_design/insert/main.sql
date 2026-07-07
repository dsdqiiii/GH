-- =================
-- UNITS INSERT
-- =================

INSERT INTO units (
    master_properties_id, name, slug, base_price_per_night, price_per_hour, is_transit_enabled, capacity, floor
) VALUES
-- Andalusia 54 --

-- lt1
('', 'Kamar 101 Andalusia 54', 'kamar-101-andalus54', 325000, null, false, 2, 'Lantai 1'),
('', 'Kamar 102 Andalusia 54', 'kamar-102-andalus54', 325000, null, false, 2, 'Lantai 1'),
('', 'Kamar 103 Andalusia 54', 'kamar-103-andalus54', 325000, null, false, 2, 'Lantai 1'),
('', 'Kamar 104 Andalusia 54', 'kamar-104-andalus54', 325000, null, false, 2, 'Lantai 1'),
-- lt2
('', 'Kamar 201 Andalusia 54', 'kamar-201-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 202 Andalusia 54', 'kamar-202-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 203 Andalusia 54', 'kamar-203-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 204 Andalusia 54', 'kamar-204-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
-- lt3
('', 'Kamar 301 Andalusia 54', 'kamar-301-andalus54', 275000, null, false, 2, 'Lantai 3'),
('', 'Kamar 302 Andalusia 54', 'kamar-302-andalus54', 275000, null, false, 2, 'Lantai 3'),
('', 'Kamar 303 Andalusia 54', 'kamar-303-andalus54', 275000, null, false, 2, 'Lantai 3'),
('', 'Kamar 304 Andalusia 54', 'kamar-304-andalus54', 275000, null, false, 2, 'Lantai 3'),
-- lt4
('', 'Kamar 401 Andalusia 54', 'kamar-401-andalus54', 150000, 15000, true, 1, 'Lantai 4'),
('', 'Kamar 402 Andalusia 54', 'kamar-402-andalus54', 150000, 15000, true, 1, 'Lantai 4'),
('', 'Kamar 403 Andalusia 54', 'kamar-403-andalus54', 150000, 15000, true, 1, 'Lantai 4'),
('', 'Kamar 404 Andalusia 54', 'kamar-404-andalus54', 150000, 15000, true, 1, 'Lantai 4'),

-- Andalusia --

-- lt1
('', 'Kamar 101 Andalusia', 'kamar-101-andalusia', 300000, null, false, 2, 'Lantai 1'),
('', 'Kamar 102 Andalusia', 'kamar-102-andalusia', 300000, null, false, 2, 'Lantai 1'),
('', 'Kamar 103 Andalusia', 'kamar-103-andalusia', 300000, null, false, 2, 'Lantai 1'),
('', 'Kamar 104 Andalusia', 'kamar-104-andalusia', 300000, null, false, 2, 'Lantai 1'),
-- lt2
('', 'Kamar 201 Andalusia', 'kamar-201-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 202 Andalusia', 'kamar-202-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 203 Andalusia', 'kamar-203-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 204 Andalusia', 'kamar-204-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
-- lt3
('', 'Kamar 301 Andalusia', 'kamar-301-andalusia', 300000, null, false, 2, 'Lantai 3'),
('', 'Kamar 302 Andalusia', 'kamar-302-andalusia', 300000, null, false, 2, 'Lantai 3'),
('', 'Kamar 303 Andalusia', 'kamar-303-andalusia', 300000, null, false, 2, 'Lantai 3'),
('', 'Kamar 304 Andalusia', 'kamar-304-andalusia', 300000, null, false, 2, 'Lantai 3'),
-- lt4
('', 'Kamar 401 Andalusia', 'kamar-401-andalusia', 300000, 15000, true, 2, 'Lantai 4'),
('', 'Kamar 402 Andalusia', 'kamar-402-andalusia', 300000, 15000, true, 2, 'Lantai 4'),
('', 'Kamar 403 Andalusia', 'kamar-403-andalusia', 300000, 15000, true, 2, 'Lantai 4'),
('', 'Kamar 404 Andalusia', 'kamar-404-andalusia', 300000, 15000, true, 2, 'Lantai 4');

-- =================
-- GALLERIES INSERT
-- =================

INSERT INTO galleries (reference_type, reference_id, url, is_hero) VALUES

-- organizations --

-- Darunnajah
('', 'organization', '', '', false),
('', 'organization', '', '', true),
-- Lain-lain
-- ('', 'organization', '', '', false),
-- ('', 'organization', '', '', true),

-- property --

-- Andalusia 54
('', 'property', '', '', false),
('', 'property', '', '', true),
-- Andalusia
('', 'property', '', '', false),
('', 'property', '', '', true),
-- Lain-lain
-- ('', 'property', '', '', false),
-- ('', 'property', '', '', true),

-- unit --

-- Andalusia 54
('', 'unit', '', '', false),
('', 'unit', '', '', true),
-- Andalusia
('', 'unit', '', '', false),
('', 'unit', '', '', true);
-- Lain-lain
-- ('', 'unit', '', '', false),
-- ('', 'unit', '', '', true),

-- ======================
-- PROPERTY ADDONS INSERT
-- ======================

INSERT INTO property_addons (master_properties_id, addon_id, price) VALUES

-- add on 1 BREAKFAST --
('', 1, [HARGANYA]),

-- add on 2 EXTRA BED --
('', 2, [HARGANYA]),

-- add on 3 LATE CHECKOUT --
('', 3, [HARGANYA]),

-- add on 4 EARLY CHECKIN --
('', 4, [HARGANYA]);