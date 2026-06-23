-- =================
-- UNITS INSERT
-- =================

INSERT INTO units (
    master_properties_id, name, slug, base_price_per_night, price_per_hour, is_transit_enabled, capacity, floor
) VALUES

-- Andalusia 54 --

-- lt2
('', 'Kamar 201 Andalusia 54', 'kamar-201-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 202 Andalusia 54', 'kamar-202-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 203 Andalusia 54', 'kamar-203-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 204 Andalusia 54', 'kamar-204-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
-- lt3
('', 'Kamar 301 Andalusia 54', 'kamar-301-andalus54', 300000, 15000, true, 2, 'Lantai 3'),
('', 'Kamar 302 Andalusia 54', 'kamar-302-andalus54', 300000, 15000, true, 2, 'Lantai 3'),
('', 'Kamar 303 Andalusia 54', 'kamar-303-andalus54', 300000, 15000, true, 2, 'Lantai 3'),
('', 'Kamar 304 Andalusia 54', 'kamar-304-andalus54', 300000, 15000, true, 2, 'Lantai 3'),
-- lt4
('', 'Kamar 401 Andalusia 54', 'kamar-401-andalus54', 300000, 15000, true, 2, 'Lantai 4'),
('', 'Kamar 402 Andalusia 54', 'kamar-402-andalus54', 300000, 15000, true, 2, 'Lantai 4'),
('', 'Kamar 403 Andalusia 54', 'kamar-403-andalus54', 300000, 15000, true, 2, 'Lantai 4'),
('', 'Kamar 404 Andalusia 54', 'kamar-404-andalus54', 300000, 15000, true, 2, 'Lantai 4'),

-- Andalusia --

-- lt2
('', 'Kamar 201 Andalusia (Dalam)', 'kamar-201-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 202 Andalusia (Dalam)', 'kamar-202-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 203 Andalusia (Dalam)', 'kamar-203-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
('', 'Kamar 204 Andalusia (Dalam)', 'kamar-204-andalusia', 300000, 15000, true, 2, 'Lantai 2'),

-- lt3
('', 'Kamar 301 Andalusia (Dalam)', 'kamar-301-andalusia', 300000, 15000, true, 2, 'Lantai 3'),
('', 'Kamar 302 Andalusia (Dalam)', 'kamar-302-andalusia', 300000, 15000, true, 2, 'Lantai 3'),
('', 'Kamar 303 Andalusia (Dalam)', 'kamar-303-andalusia', 300000, 15000, true, 2, 'Lantai 3'),
('', 'Kamar 304 Andalusia (Dalam)', 'kamar-304-andalusia', 300000, 15000, true, 2, 'Lantai 3'),

-- lt4
('', 'Kamar 401 Andalusia (Dalam)', 'kamar-401-andalusia', 300000, 15000, true, 2, 'Lantai 4'),
('', 'Kamar 402 Andalusia (Dalam)', 'kamar-402-andalusia', 300000, 15000, true, 2, 'Lantai 4'),
('', 'Kamar 403 Andalusia (Dalam)', 'kamar-403-andalusia', 300000, 15000, true, 2, 'Lantai 4'),
('', 'Kamar 404 Andalusia (Dalam)', 'kamar-404-andalusia', 300000, 15000, true, 2, 'Lantai 4');

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