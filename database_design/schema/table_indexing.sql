-- =========================================================================
-- 5. LAYER INDEKS (Partial & Performance Optimization)
-- =========================================================================

-- Indeks Unik Parsial untuk Data Master (Aman untuk Mekanisme Soft-Delete)
CREATE UNIQUE INDEX uq_master_roles_code_active ON master_roles(code) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_facilities_code_active ON master_facilities(code) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_organizations_slug_active ON master_organizations(slug) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_properties_slug_active ON master_properties(slug) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_addons_code_active ON master_addons(code) WHERE is_active = true;
CREATE UNIQUE INDEX uq_master_charges_name_active ON master_charges(name) WHERE is_active = true;
CREATE UNIQUE INDEX uq_property_addons_active ON property_addons(master_properties_id, addon_id) WHERE is_active = true;
CREATE UNIQUE INDEX uq_bank_account_org_active ON master_bank_accounts(master_organizations_id, bank_name, account_number) WHERE is_active = true;

-- Indeks Unik untuk Relasi Tabel Junction M-M
CREATE UNIQUE INDEX uq_property_manager ON property_assignments(user_id, master_properties_id);

-- Indeks Pencarian & Query Relasional Standar
CREATE INDEX idx_profiles_role_id ON profiles(role_id);
CREATE INDEX idx_master_properties_org_active ON master_properties(master_organizations_id) WHERE is_active = true;
CREATE INDEX idx_units_property_active ON units(master_properties_id) WHERE is_active = true;
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_expires_at ON orders(expires_at);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_charges_order ON order_charges(order_id);
CREATE INDEX idx_property_assignments_user ON property_assignments(user_id);
CREATE INDEX idx_property_assignments_property ON property_assignments(master_properties_id);

-- Indeks Kinerja Khusus (Polimorfik & Logika Temporal Overlap)
CREATE INDEX idx_galleries_poly ON galleries(reference_type, reference_id);
CREATE INDEX idx_facility_assignments_reference ON facility_assignments(reference_type, reference_id);

-- CORE ENGINE INDEX: Penentu Ketersediaan Kamar Tercepat (Sesuai Note #6.1)
-- Hanya mengindeks booking yang secara aktif memblokir ketersediaan unit.
CREATE INDEX idx_order_items_availability_v2 
ON order_items(unit_id, check_in, check_out) 
WHERE status_item IN ('PENDING', 'CONFIRMED', 'CHECKED_IN');