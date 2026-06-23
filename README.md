# Database Design

> Status: **Work in Progress** — schema masih dalam fase development dan dapat berubah seiring kebutuhan bisnis maupun implementasi teknis.

## Overview

Sistem booking properti (villa, guest house, dan sejenisnya) dengan dukungan:

* Booking **inap** (per malam)
* Booking **transit** (per jam)
* Multi-organisasi
* Multi-properti
* Guest checkout
* Manual payment verification
* Role-based access control

Sistem dirancang untuk skala kecil hingga menengah dengan fokus pada:

* Kesederhanaan implementasi
* Konsistensi data
* Kemudahan maintenance
* Kompatibilitas dengan Supabase Free Tier

---

## High-Level Architecture

```text
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

---

## Database Modules

### Master Data

Digunakan sebagai sumber data utama yang relatif jarang berubah.

#### Tables

* `master_roles`
* `master_facilities`
* `master_organizations`
* `master_properties`
* `master_bank_accounts`

---

### Access Control

Mengatur identitas pengguna dan hubungan pengguna dengan properti.

#### Tables

* `profiles`
* `property_assignments`

---

### Property & Unit

Menyimpan informasi properti dan unit yang dapat dibooking.

#### Tables

* `units`
* `unit_details`

---

### Booking

Mengelola proses pemesanan dan pembayaran.

#### Tables

* `orders`
* `order_items`
* `payments`

---

### Shared / Junction

Digunakan untuk relasi generik yang dapat digunakan oleh lebih dari satu entity.

#### Tables

* `facility_assignments`
* `galleries`

---

## Key Design Decisions

### Availability Source of Truth

Sistem **tidak menggunakan tabel inventory** sebagai sumber utama ketersediaan unit.

Ketersediaan unit dihitung berdasarkan data booking yang aktif pada:

* `orders`
* `order_items`

Pendekatan ini dipilih untuk mengurangi kompleksitas sinkronisasi data dan menghindari inkonsistensi antara inventory dan booking.

---

### Booking Lifecycle

```text
PENDING_PAYMENT
        │
        ▼
    SUBMITTED
        │
        ▼
     VERIFIED
        │
        ▼
      BOOKED
```

Atau:

```text
PENDING_PAYMENT
        │
        ├──► CANCELLED
        │
        └──► EXPIRED
```

---

### Manual Payment Verification

Pembayaran diverifikasi secara manual oleh admin atau property manager.

Alur pembayaran:

1. Customer membuat booking.
2. Sistem membuat order dengan status `PENDING_PAYMENT`.
3. Customer mengunggah bukti pembayaran.
4. Payment berubah menjadi `SUBMITTED`.
5. Admin melakukan verifikasi.
6. Order dikonfirmasi menjadi `BOOKED`.

---

### Guest Checkout

Booking dapat dilakukan tanpa akun pengguna.

Order wajib memiliki salah satu dari:

* `user_id`, atau
* kombinasi `guest_name` dan `guest_phone`

---

### Multi-Tenant Architecture

Sistem mendukung banyak organisasi dalam satu database.

Struktur tenant:

```text
Organization
 └─ Property
     └─ Unit
```

Hak akses property manager dibatasi pada properti yang dipetakan melalui tabel `property_assignments`.

---

### Transit Booking

Transit merupakan fitur unggulan sistem.

Unit dapat:

* hanya menerima booking inap,
* hanya menerima booking transit,
* atau menerima keduanya.

Jenis booking disimpan pada:

```text
order_items.type_booking
```

dengan nilai:

* `inap`
* `transit`

---

## Future Work

### Database

* Row Level Security (RLS)
* RPC Functions
* Booking overlap prevention
* Availability View
* Automated expiration job

### Application

* Customer authentication
* Customer booking history
* Notification system
* Payment gateway integration
* Reporting & analytics

---

## Documentation Structure

```text
docs/
└── database/
    ├── README.md
    ├── tables/
    │   ├── master_tables.md
    │   ├── access_control.md
    │   ├── booking_tables.md
    │   └── junction_tables.md
    ├── rls/
    └── rpc/
```

Detail schema masing-masing tabel didokumentasikan pada folder `tables/`.
