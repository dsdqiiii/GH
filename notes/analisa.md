# Analisa Proyek: Guest House (Penginapan Darunnajah)

> **Dibuat:** 2025-07-16
> **Berdasarkan:** README, package.json, database_design/, notes/, dan source code

---

## 1. Ringkasan Proyek

**Guest House (GH)** adalah sistem **Sistem Informasi Manajemen Penginapan (SIM Penginapan)** berbasis web yang dikembangkan untuk **Yayasan Darunnajah**. Proyek ini merupakan aplikasi **booking properti** (guest house, villa, dan sejenisnya) yang mencakup:

- **Frontend Public**: Halaman untuk tamu melihat ketersediaan, melakukan pemesanan, dan upload bukti pembayaran.
- **Back-Office (Admin Dashboard)**: Halaman untuk staf yayasan mengelola properti, unit, booking, pembayaran, laporan, pengguna, dan inventaris.
- **Database & API**: Supabase sebagai backend/database dengan Row Level Security (RLS).

---

## 2. Tujuan Utama

Berdasarkan wawancara business requirement discovery (`notes/note.md`), tujuan utama proyek ini adalah:

1. **Ekspansi promosi** — memperluas jangkauan pemasaran penginapan yayasan.
2. **Menyederhanakan implementasi bisnis di lapangan** — mengotomatisasi proses manual yang sebelumnya dilakukan via WhatsApp, pencatatan dokumen fisik, dan tanya ketersediaan.
3. **Digitalisasi pencatatan** — mengonversi data pemesanan menjadi dokumen digital siap cetak/unduh (PDF/Excel) untuk kebutuhan laporan pertanggungjawaban (LPJ) pimpinan yayasan dan tim audit.

---

## 3. Fitur Utama

### 3.1. Frontend (Publik/Tamu)

| Fitur | Keterangan |
|-------|------------|
| Landing Page | Hero, Featured Guest Houses, Join Section, About, Contact |
| Cek Ketersediaan | Tamu dapat melihat unit yang tersedia |
| Booking / Pemesanan | Pemesanan langsung dari website (bukan via WhatsApp) |
| Upload Bukti Pembayaran | Transfer manual, upload bukti via website |
| Guest Checkout | Bisa booking tanpa akun (cukup nama & nomor telepon) |
| Harga Khusus | Pelanggan dengan akun khusus (pengurus, mitra) mendapat diskon paten |

### 3.2. Back-Office (Admin Dashboard)

| Fitur | Keterangan |
|-------|------------|
| Dashboard | Ringkasan data dan metrik |
| Booking Management | Kelola pemesanan masuk |
| Pembayaran | Verifikasi pembayaran manual |
| Laporan | Laporan keuangan dan aktivitas (PDF/Excel) |
| Manage Properti | CRUD properti, unit, fasilitas |
| Manage Pengguna | Manajemen akun dan role staf |
| Manage Inventaris | Inventaris properti dan unit |

### 3.3. Sistem Inti

| Fitur | Keterangan |
|-------|------------|
| Multi-Organisasi | Mendukung banyak organisasi dalam satu database |
| Multi-Properti | Satu organisasi dapat memiliki banyak properti |
| Multi-Unit | Satu properti dapat memiliki banyak unit/kamar |
| Role-Based Access Control | 6 level role: Anonymous, Customer, Staff, Manager, Administrator, Superadmin |
| Booking Inap & Transit | Inap (per malam) dan transit (per jam) |
| Payment Manual | Verifikasi pembayaran oleh admin, upload bukti transfer |
| Snapshot Strategy | Harga, charge, data customer di-snapshot saat booking |
| Audit Trail | Aktivitas penting tercatat (siapa, kapan) |
| Soft Delete | Data master menggunakan soft delete (is_active) |

---

## 4. Alur Booking (Lifecycle)

```
PENDING_PAYMENT
    ├── EXPIRED (jika N menit tidak bayar)
    ├── CANCELLED (jika dibatalkan sebelum bayar)
    │
    └── BOOKED (setelah admin verifikasi pembayaran)
            ↓
        CHECKED_IN (tamu check-in)
            ↓
        CHECKED_OUT (tamu check-out)
            ↓
        COMPLETED (selesai)
```

- **Tidak ada DP** — langsung lunas di awal.
- **1 Order = 1 Payment Intent** — satu pesanan hanya punya satu pembayaran.
- **Partial Cancellation** — pembatalan bisa per item (order_item).
- **Refund** — dicatat sebagai transaksi terpisah, bukan payment baru.

---

## 5. Arsitektur Database

```
master_organizations
 ├─ master_properties
 │   ├─ units
 │   │   ├─ unit_details
 │   │   ├─ galleries
 │   │   └─ facility_assignments
 │   │
 │   └─ property_assignments
 │
 └─ master_bank_accounts

auth.users (Supabase)
 └─ profiles

master_roles
 └─ profiles

master_facilities
 └─ facility_assignments

orders
 ├─ order_items
 └─ payments
```

**Source of Truth Ketersediaan**: Dihitung dari data booking aktif (`orders` + `order_items`), bukan dari tabel inventory terpisah.

---

## 6. Role & Hak Akses

| Role | Akses |
|------|-------|
| **Anonymous** (Tamu tanpa akun) | Lihat publik, booking via kode booking |
| **Customer** (Tamu dengan akun) | Semua akses Anonymous + histori booking sendiri |
| **Staff** | Operasional properti yang ditugaskan (view & update terbatas) |
| **Manager** | Manajemen penuh properti yang ditugaskan |
| **Administrator** | Akses operasional global ke semua organisasi & properti |
| **Superadmin** | Akses penuh ke seluruh sistem (hanya pemilik/platform owner) |

---

## 7. Tech Stack

| Teknologi | Versi | Keterangan |
|-----------|-------|------------|
| **Framework** | Next.js 16 | React framework (App Router) |
| **UI Library** | React 19 | — |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Icons** | lucide-react | Icon library |
| **Font** | Geist (Geist Sans & Geist Mono) | Font dari Vercel |
| **Backend/Database** | Supabase | PostgreSQL + Auth + RLS |
| **Bahasa** | TypeScript 5 | Type-safe JavaScript |
| **Linter** | ESLint | — |

---

## 8. Status Pengembangan

### ✅ Sudah Matang / Final
- **Domain**: Order, Payment, Booking Item sudah terdefinisi dengan jelas
- **Lifecycle**: Status booking dan transisi sudah final
- **Finance**: Tax, service charge, fee, snapshot pricing sudah matang
- **Availability**: Source of truth dari booking data
- **Snapshot Strategy**: Harga, charge, customer, payment destination di-snapshot
- **Audit Strategy**: MVP-ready (siapa & kapan untuk aktivitas penting)
- **Database Schema**: Sudah dirancang lengkap di `database_design/`

### ✅ Sudah Diimplementasikan (Frontend)
- Halaman publik (Hero, Featured, Join, Footer, About, Contact)
- Routing dan layout admin
- Struktur halaman admin (Dashboard, Booking, Pembayaran, Laporan, Manage)

### 🔄 Sedang Dalam Pengembangan / Belum
- Integrasi Supabase (auth, RLS, client/server)
- Form booking publik
- Sistem verifikasi pembayaran
- Dashboard dengan data real
- Manajemen pengguna CRUD
- Sistem laporan PDF/Excel
- Gambar properti & unit
- Fitur customer authentication

### 📋 Future Work
- Payment Gateway integration
- Notification system (WhatsApp/Email)
- Reporting & analytics
- Automated expiration job
- Multi range booking
- Guest service module
- Loyalty/membership program

---

## 9. Struktur Proyek

```
GH/
├── src/                          # Source code aplikasi
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx            # Root layout (SEO metadata)
│   │   ├── page.tsx              # Halaman publik
│   │   ├── not-found.tsx         # 404 page
│   │   ├── (main)/               # Route group main
│   │   └── admin/                # Halaman admin
│   │       ├── layout.tsx        # Admin layout
│   │       ├── page.tsx          # /admin
│   │       ├── dashboard/
│   │       ├── booking/
│   │       ├── pembayaran/
│   │       ├── laporan/
│   │       └── manage/
│   │           └── [properti]/[unit]/
│   ├── components/               # UI Components
│   │   ├── *.tsx                 # Komponen publik
│   │   ├── admin/                # Komponen admin
│   │   └── ui/                   # Komponen UI reusable
│   │       ├── core/             # Button, Input, Table, dll
│   │       ├── feedback/         # Modal, Error pages
│   │       ├── inputs/           # Form inputs
│   │       ├── images/           # Logo components
│   │       └── navigation/       # BackButton
│   └── lib/supabase/             # Supabase client config
├── database_design/              # Desain database lengkap
│   ├── init/                     # SQL initialization scripts
│   ├── insert/                   # Seed data
│   ├── schema/                   # Table schemas
│   ├── policy/                   # RLS policies
│   ├── matrix.md                 # RLS matrix
│   └── roles.md                  # Role definitions & access scope
├── docker/                       # Docker configuration
├── public/                       # Static assets (gambar)
└── notes/                        # Dokumentasi & catatan pengembangan
```

---

## 10. Catatan Penting

1. **Next.js 16** — Ada perubahan breaking dibanding versi sebelumnya. Perhatikan AGENTS.md.
2. **MVP Scope** — Single organization dulu, multi-organization di fase 1.
3. **Pembayaran** — Manual via upload bukti transfer untuk MVP. Payment gateway di fase refactor.
4. **Harga** — Flat dengan diskon khusus untuk pelanggan tertentu (pengurus, mitra).
5. **WhatsApp** — Bergeser dari primary way menjadi alternate/emergency way.
6. **Batas Waktu Pembayaran** — ~20 menit sebelum pesanan expired.
7. **Foto Properti** — Tersedia untuk Andalusia 54 (GH54) dan Andalusia Dalam (GHDALAM).

