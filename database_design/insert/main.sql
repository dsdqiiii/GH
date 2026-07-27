-- =================
-- UNITS INSERT
-- =================

INSERT INTO units (
    master_properties_id, name, slug, base_price_per_night, price_per_hour, is_transit_enabled, capacity, floor
) VALUES
-- Andalusia 54 --


-- lt2
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 201 Andalusia 54', 'kamar-201-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 202 Andalusia 54', 'kamar-202-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 203 Andalusia 54', 'kamar-203-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 204 Andalusia 54', 'kamar-204-andalus54', 300000, 15000, true, 2, 'Lantai 2'),
-- lt3
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 301 Andalusia 54', 'kamar-301-andalus54', 275000, null, false, 2, 'Lantai 3'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 302 Andalusia 54', 'kamar-302-andalus54', 275000, null, false, 2, 'Lantai 3'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 303 Andalusia 54', 'kamar-303-andalus54', 275000, null, false, 2, 'Lantai 3'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 304 Andalusia 54', 'kamar-304-andalus54', 275000, null, false, 2, 'Lantai 3'),
-- lt4
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 401 Andalusia 54', 'kamar-401-andalus54', 150000, 15000, true, 1, 'Lantai 4'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 402 Andalusia 54', 'kamar-402-andalus54', 150000, 15000, true, 1, 'Lantai 4'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 403 Andalusia 54', 'kamar-403-andalus54', 150000, 15000, true, 1, 'Lantai 4'),
('b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'Kamar 404 Andalusia 54', 'kamar-404-andalus54', 150000, 15000, true, 1, 'Lantai 4'),

-- Andalusia --

-- lt1
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 101 Andalusia', 'kamar-101-andalusia', 300000, null, false, 2, 'Lantai 1'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 102 Andalusia', 'kamar-102-andalusia', 300000, null, false, 2, 'Lantai 1'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 103 Andalusia', 'kamar-103-andalusia', 300000, null, false, 2, 'Lantai 1'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 104 Andalusia', 'kamar-104-andalusia', 300000, null, false, 2, 'Lantai 1'),
-- lt2
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 201 Andalusia', 'kamar-201-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 202 Andalusia', 'kamar-202-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 203 Andalusia', 'kamar-203-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 204 Andalusia', 'kamar-204-andalusia', 300000, 15000, true, 2, 'Lantai 2'),
-- lt3
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 301 Andalusia', 'kamar-301-andalusia', 300000, null, false, 2, 'Lantai 3'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 302 Andalusia', 'kamar-302-andalusia', 300000, null, false, 2, 'Lantai 3'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 303 Andalusia', 'kamar-303-andalusia', 300000, null, false, 2, 'Lantai 3'),
('e225567b-8278-4b82-9abe-051dbd5d3359', 'Kamar 304 Andalusia', 'kamar-304-andalusia', 300000, null, false, 2, 'Lantai 3');


-- =================
-- GALLERIES INSERT
-- =================

-- Andalusia 54
    INSERT INTO galleries (reference_type, reference_id, url, is_hero) VALUES
    ('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/lorong.jpg', false),

('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/02_lorong_kaligrafi.jpg', true),
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/04_gedung_andalusia.jpg', true),
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/04_gedung_andalusia.jpg', false),
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/lorong.jpg', true),
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/resepsionis_gh54.jpg', true),

('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/02_lorong_kaligrafi.jpg', false),
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/04_gedung_andalusia.jpg', false),
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/04_gedung_andalusia.jpg', false),
('property', 'b779d9eb-04e9-4b4e-8874-5be67c98abd7', 'public/GH54/resepsionis_gh54.jpg', false),
('property', 'e225567b-8278-4b82-9abe-051dbd5d3359', 'public/GHDALAM/kamar_standard.jpg', false),
-- Andalusia
('property', 'e225567b-8278-4b82-9abe-051dbd5d3359', 'public/GHDALAM/03_lorong_kamar.jpg', true),
('property', 'e225567b-8278-4b82-9abe-051dbd5d3359', 'public/GHDALAM/03_lorong_kamar.jpg', false),
('property', 'e225567b-8278-4b82-9abe-051dbd5d3359', 'public/GHDALAM/kamar_standard.jpg', true),
('property', 'e225567b-8278-4b82-9abe-051dbd5d3359', 'public/GHDALAM/kamar_standard.jpg', false);

-- ===== Andalusia 54 =====

-- Lantai 2 (201-204) -> kamar_vip.jpg
INSERT INTO galleries (reference_type, reference_id, url, is_hero) VALUES
('unit', '53fa3d1b-42a6-41ed-8659-e6e9c7294eff', 'public/GH54/kamar_vip.jpg', false),
('unit', 'e0306504-b143-4509-9320-0eb373b7d2cb', 'public/GH54/kamar_vip.jpg', false),
('unit', '52f073e9-57c6-414a-b277-e2357e9a6d93', 'public/GH54/kamar_vip.jpg', false),
('unit', '92ec4430-4631-4c9e-9d65-7044017ae301', 'public/GH54/kamar_vip.jpg', false),

-- Lantai 3 & 4 (301-304, 401-404) -> kamar_standard.jpg
('unit', '586a32aa-f4b4-4a73-9fb5-df05ef5cbfca', 'public/GH54/kamar_standard.jpg', false),
('unit', '3aa75e48-cb21-40c8-85ad-312e8b6f1916', 'public/GH54/kamar_standard.jpg', false),
('unit', 'a5689962-22d3-4a3f-91b4-84ddda6db025', 'public/GH54/kamar_standard.jpg', false),
('unit', '47b73139-8586-48ef-8af7-7a221b2c797b', 'public/GH54/kamar_standard.jpg', false),
('unit', '252e5bf6-9642-4594-8d09-e4d419e973e9', 'public/GH54/kamar_standard.jpg', false),
('unit', '0a694903-8b34-49e8-b919-c473f941aac8', 'public/GH54/kamar_standard.jpg', false),
('unit', '6b1cdfbb-6643-4748-a1f9-154716cb06f4', 'public/GH54/kamar_standard.jpg', false),
('unit', '0710fb42-f0a4-4f8b-8f28-cd1c6f204021', 'public/GH54/kamar_standard.jpg', false),

-- Toilet.jpg untuk semua unit Andalusia 54
('unit', '53fa3d1b-42a6-41ed-8659-e6e9c7294eff', 'public/GH54/Toilet.jpg', false),
('unit', 'e0306504-b143-4509-9320-0eb373b7d2cb', 'public/GH54/Toilet.jpg', false),
('unit', '52f073e9-57c6-414a-b277-e2357e9a6d93', 'public/GH54/Toilet.jpg', false),
('unit', '92ec4430-4631-4c9e-9d65-7044017ae301', 'public/GH54/Toilet.jpg', false),
('unit', '586a32aa-f4b4-4a73-9fb5-df05ef5cbfca', 'public/GH54/Toilet.jpg', false),
('unit', '3aa75e48-cb21-40c8-85ad-312e8b6f1916', 'public/GH54/Toilet.jpg', false),
('unit', 'a5689962-22d3-4a3f-91b4-84ddda6db025', 'public/GH54/Toilet.jpg', false),
('unit', '47b73139-8586-48ef-8af7-7a221b2c797b', 'public/GH54/Toilet.jpg', false),
('unit', '252e5bf6-9642-4594-8d09-e4d419e973e9', 'public/GH54/Toilet.jpg', false),
('unit', '0a694903-8b34-49e8-b919-c473f941aac8', 'public/GH54/Toilet.jpg', false),
('unit', '6b1cdfbb-6643-4748-a1f9-154716cb06f4', 'public/GH54/Toilet.jpg', false),
('unit', '0710fb42-f0a4-4f8b-8f28-cd1c6f204021', 'public/GH54/Toilet.jpg', false),

-- ===== Andalusia (biasa) =====

-- Semua kamar -> kamar_standard.jpg
('unit', '3825d4b0-5097-4570-8b83-a3bdd4041006', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', 'f323f7c6-1115-4c5a-9c9a-1a39488d5723', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', '716175fd-3d2c-4886-b05b-bc2dbe47bedf', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', 'f5d856e1-b018-47c1-8563-e405e76e1c74', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', '4af22482-7856-46b0-b746-8e632ac5da1e', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', '979cda42-2a3d-4eeb-aefb-2396065b51b4', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', '7bf5a598-dbfe-405e-a6e0-50b47d469c15', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', 'aa817b30-3fe4-4a42-817e-1dd1f5086e02', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', 'b3ba4745-89ac-4f41-94d9-d7d92c4a6547', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', '14d71b2c-2168-46b3-91da-2f8b5b4c5cb4', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', '1126115c-b2b8-4774-a151-480e3c1060bc', 'public/GHDALAM/kamar_standard.jpg', false),
('unit', 'd5d3494f-6066-44b3-8dfe-4d9fda361301', 'public/GHDALAM/kamar_standard.jpg', false),

-- Toilet.jpg untuk semua unit Andalusia
('unit', '3825d4b0-5097-4570-8b83-a3bdd4041006', 'public/GHDALAM/Toilet.jpg', false),
('unit', 'f323f7c6-1115-4c5a-9c9a-1a39488d5723', 'public/GHDALAM/Toilet.jpg', false),
('unit', '716175fd-3d2c-4886-b05b-bc2dbe47bedf', 'public/GHDALAM/Toilet.jpg', false),
('unit', 'f5d856e1-b018-47c1-8563-e405e76e1c74', 'public/GHDALAM/Toilet.jpg', false),
('unit', '4af22482-7856-46b0-b746-8e632ac5da1e', 'public/GHDALAM/Toilet.jpg', false),
('unit', '979cda42-2a3d-4eeb-aefb-2396065b51b4', 'public/GHDALAM/Toilet.jpg', false),
('unit', '7bf5a598-dbfe-405e-a6e0-50b47d469c15', 'public/GHDALAM/Toilet.jpg', false),
('unit', 'aa817b30-3fe4-4a42-817e-1dd1f5086e02', 'public/GHDALAM/Toilet.jpg', false),
('unit', 'b3ba4745-89ac-4f41-94d9-d7d92c4a6547', 'public/GHDALAM/Toilet.jpg', false),
('unit', '14d71b2c-2168-46b3-91da-2f8b5b4c5cb4', 'public/GHDALAM/Toilet.jpg', false),
('unit', '1126115c-b2b8-4774-a151-480e3c1060bc', 'public/GHDALAM/Toilet.jpg', false),
('unit', 'd5d3494f-6066-44b3-8dfe-4d9fda361301', 'public/GHDALAM/Toilet.jpg', false);

-- ======================
-- PROPERTY ADDONS INSERT
-- ======================

INSERT INTO property_addons (master_properties_id, addon_id, price) VALUES

-- add on 2 EXTRA BED --
('', 2, 30000),
-- add on 2 EXTRA BED --
('', 2, 30000),