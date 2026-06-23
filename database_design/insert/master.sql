INSERT INTO master_roles (id, code, name, description) VALUES 
(0, 'SUPERADMIN', 'Super Admin', 'only system owner dan developer'),
(1, 'ADMINISTRATOR', 'Administrator', 'Akses penuh ke semua konfigurasi sistem dan manajemen admin lainnya'),
(2, 'MANAGER', 'Manager', 'Mengelola operasional guest house, booking, dan laporan harian'),
(3, 'STAFF', 'Staff', 'Akses terbatas untuk operasional (seperti check-in/out tamu saja)'),
(4, 'CUSTOMER', 'Customer', 'User terverifikasi yang bisa melakukan booking mandiri'),
(5, 'AFFILIATE', 'Afiliator', 'User terverifikasi yang terdaftar menjadi afiliator');

INSERT INTO master_facilities (name, code) VALUES 
('Parkir', 'PARK'),
('Kolam Renang', 'SWIM'),
('Wi-Fi', 'WIFI'),
('AC', 'AC'),
('Smart TV', 'STV'),
('Bathtub', 'BATHTUB'),
('Sarapan', 'BFST'),
('Dapur Bersama', 'KITCHEN'),
('Ruang Meeting', 'MEETING'),
('Aula', 'HALL'),
('Resepsionis 24 Jam', 'REC24'),
('Dispenser Air', 'WATER'),
('Sprei & Handuk', 'LINEN'),
('Peralatan Mandi', 'TOILETRIES'),
('Pemanas Air (Shower)', 'WHOT');

INSERT INTO master_organizations (name, slug) VALUES
('Pondok Pesantren Darunnajah Jakarta', 'darunnajah-jakarta'),
('Pondok Pesantren Nurul Ilmi Darunnajah 14', 'nurul-ilmi-dn14');

INSERT INTO master_properties (master_organizations_id, name, slug, address) VALUES
('', 'Guest House Andalusia (Dalam)', 'gh-andalusia', 'Jl. Ulujami Raya No.86, RT.1/RW.7, Ulujami, Kec. Pesanggrahan, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12250'),
('', 'Guest House Andalusia 54', 'gh-andalusia-54', 'Jl. Ulujami Raya No.86, RT.1/RW.7, Ulujami, Kec. Pesanggrahan, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12250')

INSERT INTO master_bank_accounts (master_organizations_id, bank_name, account_number, account_holder) VALUES
('', 'Bank Muamalat', '123', 'Pesantren Darunnajah'),
('', 'Bank BSI', '456', 'Pesantren Darunnajah'),
('', 'Bank Muamalat', '789', 'Pesantren Nurul Ilmi');

INSERT INTO master_addons (code, name, description, pricing_unit) 
VALUES
  ('BREAKFAST', 'Buffet Breakfast', 'Sarapan prasmanan harian di restoran utama hotel.', 'per_guest_per_night'),
  ('EXTRA_BED', 'Extra Bed', 'Tambahan satu kasur tipe single di dalam kamar.', 'per_night'),
  ('LATE_CHECKOUT', 'Late Checkout', 'Kelonggaran waktu checkout hingga pukul 16:00 waktu setempat.', 'flat'),
  ('EARLY_CHECKIN', 'Early Check-in', 'Fasilitas masuk kamar lebih awal mulai dari pukul 10:00 pagi.', 'flat'),
  ('AIRPORT_PICKUP', 'Airport Pick-up', 'Layanan jemputan satu arah dari bandara menuju hotel.', 'flat');