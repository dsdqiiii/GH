INSERT INTO master_roles (id, code, name, description) VALUES 
(0, 'SUPERADMIN', 'Super Admin', 'only system owner dan developer'),
(1, 'ADMINISTRATOR', 'Administrator', 'Akses penuh ke semua konfigurasi sistem dan manajemen admin lainnya'),
(2, 'MANAGER', 'Manager', 'Mengelola operasional guest house, booking, dan laporan harian'),
(3, 'STAFF', 'Staff', 'Akses terbatas untuk operasional (seperti check-in/out tamu saja)'),
(4, 'CUSTOMER', 'Customer', 'User terverifikasi yang bisa melakukan booking mandiri'),
(5, 'AFFILIATE', 'Afiliator', 'User terverifikasi yang terdaftar menjadi afiliator');

INSERT INTO master_facilities (name, code) VALUES 
('Parkir', 'PARK'),
('Wi-Fi', 'WIFI'),
('AC', 'AC'),
('Smart TV', 'STV'),
('Resepsionis 24 Jam', 'REC24'),
('Dispenser Air', 'WATER'),
('Sprei & Handuk', 'LINEN'),
('Peralatan Mandi', 'TOILETRIES'),
('Pemanas Air (Shower)', 'WHOT'),
('Ruang Meeting', 'MEET');

INSERT INTO master_organizations (name, slug) VALUES
('Pondok Pesantren Darunnajah Jakarta', 'darunnajah-jakarta');


INSERT INTO master_properties (master_organizations_id, name, slug, address) VALUES
('902c462b-65dd-471c-a750-6ec2060cab8e', 'Guest House Andalusia', 'gh-andalusia', 'Jl. Ulujami Raya No.86, RT.1/RW.7, Ulujami, Kec. Pesanggrahan, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12250'),
('902c462b-65dd-471c-a750-6ec2060cab8e', 'Guest House Andalusia 54', 'gh-andalusia-54', 'Jl. Ulujami Raya No.86, RT.1/RW.7, Ulujami, Kec. Pesanggrahan, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12250')

INSERT INTO master_bank_accounts (master_organizations_id, bank_name, account_number, account_holder) VALUES
('902c462b-65dd-471c-a750-6ec2060cab8e', 'Bank Muamalat', '123', 'Pesantren Darunnajah');

INSERT INTO master_addons (code, name, description, pricing_unit) 
VALUES
  ('EXTRA_BED', 'Extra Bed', 'Tambahan satu kasur tipe single di dalam kamar.', 'per_night'),
  ('LATE_CHECKOUT', 'Late Checkout', 'Kelonggaran waktu checkout hingga pukul 16:00 waktu setempat.', 'flat'),
  ('EARLY_CHECKIN', 'Early Check-in', 'Fasilitas masuk kamar lebih awal mulai dari pukul 10:00 pagi.', 'flat');
  