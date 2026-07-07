# Business Requirement Discovery

## 1. Apa tujuan utama yang ingin dicapai penginapan Anda melalui website ini?

* Expansi promosi.
* Menyederhanakan implementasi bisnis di lapangan secara efektif dan efisien.

---

## 1.1. Dari seluruh proses manual yang ada saat ini (tanya ketersediaan, pemesanan lewat WhatsApp, dan pencatatan dokumen), proses manual mana yang paling mendesak untuk diotomatisasi oleh website agar operasional lapangan langsung terasa lebih efektif dan efisien?

* Pencatatan dokumen (sangat tinggi).
* Tanya ketersediaan (sangat tinggi).
* Pemesanan lewat WhatsApp (tinggi).

### 1.1.1. Ketika tamu berhasil melakukan pemesanan via website, apakah sistem pencatatan dokumen digital tersebut harus langsung terhubung ke internal pengelola (misal: otomatis masuk ke dasbor laporan keuangan/manajemen kamar), ATAU sistem cukup mengonversi data pemesanan menjadi dokumen digital siap cetak/unduh (seperti PDF/Excel) yang nantinya tetap Anda rekap kembali?

* Sistem cukup mengonversi data pemesanan menjadi dokumen digital siap cetak/unduh (seperti PDF/Excel) yang nantinya tetap Anda rekap kembali.

#### 1.1.1.1. Siapa saja pihak internal yang harus menerima dokumen digital (PDF/Excel) hasil konversi tersebut secara instan, dan melalui media apa dokumen itu paling efektif dikirimkan?

* Pimpinan yayasan, kepala divisi/departemen/biro/bagian, dan tim audit.
* Melalui laporan pertanggungjawaban (LPJ) format PDF sebagai lampiran atau data gambar/grafik/tabel pendukung.

##### 1.1.1.1.1. Komponen data atau metrik apa saja yang paling krusial yang wajib terekam otomatis oleh website dan tersaji dalam format PDF/tabel/grafik tersebut agar langsung memenuhi standar audit dan kebutuhan laporan pimpinan yayasan?

* **Data transaksi**

  * Jenis/tujuan transaksi.
  * Uang masuk.
  * Uang keluar.
  * Pengirim (bank, pemilik).
  * Penerima (bank, pemilik).
  * Bukti pembayaran berupa nota/struk/dsb.

* **Data aktivitas**

  * Sirkulasi transaksi.
  * Pemesanan.
  * Pesanan.
  * Aktor beserta identitas (minimal).
  * Perawatan.
  * Kejadian tak terduga.

* **Data inventaris**

  * Property.
  * Unit.
  * Komponen pendukung/fasilitas.
  * Ketersediaan.
  * Kondisi.

* **Catatan**

  * Seluruh data mencakup waktu kejadian.
  * Mayoritas data memerlukan bukti pendukung.

###### 1.1.1.1.1.1. Apakah website ini nantinya akan memiliki dua wajah—yaitu halaman depan yang bersih untuk tamu (hanya cek ketersediaan & booking), dan halaman dasbor belakang (Back-Office/Admin) tempat staf yayasan menginput data internal seperti uang keluar, perawatan, dan kondisi inventaris?

* Ya.

####### 1.1.1.1.1.1.1. Apakah staf yang menginput data internal di dasbor belakang akan dibagi menjadi beberapa peran dengan hak akses yang berbeda-beda (Multi-User Role), atau semua staf lapangan dan admin memiliki hak akses yang sama tinggi untuk melihat dan mengubah seluruh data?

* Ya, dibagi menjadi beberapa peran dengan hak akses yang berbeda-beda (Multi-User Role).

######## 1.1.1.1.1.1.1.1. Bagaimana sistem harus memverifikasi bahwa aktivitas input data (seperti pencatatan uang keluar, laporan kerusakan, atau kejadian tak terduga) benar-benar dilakukan oleh aktor yang berwenang, dan tidak bisa dimanipulasi di kemudian hari?

* Cukup memiliki akun dan login.
* Detail akan dibahas pada bagian teknis terkait akses kontrol.

######### 1.1.1.1.1.1.1.1.1. Ketika tamu menggunakan website untuk cek ketersediaan dan ingin memesan, bagaimana alur perpindahan tamu tersebut ke WhatsApp agar data pemesanan tetap bisa dikonversi menjadi dokumen digital secara otomatis?

* Harus langsung bisa pesan dari website.
* Akan langsung tercatat pada back-office.
* Peran WhatsApp bergeser dari primary way menjadi alternate & emergency way.

########## 1.1.1.1.1.1.1.1.1.1. Bagaimana sistem di website memastikan bahwa pesanan tamu tersebut valid dan dibayar, sebelum sistem otomatis mengunci kamar dan mencatatkan uang masuk ke dalam dokumen digital?

* Implementasi awal menggunakan upload bukti pembayaran manual melalui website.
* Integrasi payment gateway masuk kategori **izin refactor**.

**Catatan fase pengembangan:**

* Awal
* Future Proof
* Refactor

########### 1.1.1.1.1.1.1.1.1.1.1. Berapa lama batas waktu (time limit) yang diberikan sistem kepada tamu untuk mengunggah bukti pembayaran sebelum pesanan tersebut otomatis dibatalkan (expired) dan kamarnya dilepas kembali ke publik?

* Range sekitar 20 menit.
* Saat ini masih disebut sebagai **N menit**.

############ 1.1.1.1.1.1.1.1.1.1.1.1. Ketika batas waktu N menit tersebut habis dan sistem otomatis membatalkan pesanan tamu, apakah website perlu mengirimkan notifikasi otomatis (misal via WhatsApp API/Template) ke tamu tersebut sebagai pemberitahuan bahwa pesanan mereka hangus, ATAU pembatalan cukup terjadi di sistem secara diam-diam dan tamu harus mengecek statusnya sendiri di website?

* Implementasi awal disampaikan secara langsung.
* Pertimbangan melalui API menuju frontend atau melalui email/OTP.

############# 1.1.1.1.1.1.1.1.1.1.1.1.1. Bagaimana kebijakan bisnis penginapan dalam menangani pengajuan pembatalan (cancellation) atau perubahan jadwal (reschedule) yang dilakukan oleh tamu setelah status pembayaran mereka dinyatakan valid?

* Pembatalan diizinkan dengan refund maksimal dilakukan 1x24 jam sebelum batas check-in.
* Batas check-in adalah pukul 14.00 WIB pada tanggal pemesanan.
* Reschedule cenderung mengikuti aturan pembatalan dan untuk saat ini dapat dianggap sama.

############## 1.1.1.1.1.1.1.1.1.1.1.1.1.1. Ketika tamu melakukan pembatalan yang sah (memenuhi syarat < 24 jam), apakah sistem di website harus langsung otomatis membuka kembali kalender ketersediaan unit tersebut untuk publik, dan bagaimana alur pencatatan dana pengembalian (refund) tersebut di sisi laporan keuangan back-office?

* Ya, unit langsung tersedia kembali untuk publik.
* Pembatalan sah otomatis tercatat sebagai uang keluar (refund) dengan status **Pending Payment** (bisnis → customer).
* Admin diasumsikan telah diberikan hak oleh bendahara/yayasan untuk membuat transaksi uang keluar khusus refund.

---

### 1.1.2. Apakah skema harga kamar/unit di website bersifat flat (sama setiap hari), atau sistem harus bisa menangani dinamika harga dan kuota khusus yayasan?

* Harga bersifat flat.
* Beberapa jenis pelanggan mendapatkan harga khusus.
* Harga khusus berlaku selama status pelanggan tersebut masih valid.
* Dapat dianggap sebagai diskon permanen yang hampir tidak berubah.

#### 1.1.2.1. Bagaimana alur validasi di website agar sistem mengetahui bahwa seorang tamu benar-benar termasuk dalam jenis pelanggan khusus tersebut dan berhak mendapatkan diskon patennya?

* Memiliki akun (login).

##### 1.1.2.1.1. Bagaimana proses pembuatan akun untuk jenis pelanggan khusus (pengurus, mitra, anggota cabang) ini pertama kali dilakukan agar status diskon paten mereka aktif di dalam sistem?

* Daftar akun sebagai customer biasa.
* Mengajukan klaim atau role khusus.
* Role khusus dicatat pada akun tersebut.
* Akun diberikan whitelist/mapping harga khusus yang sesuai.

---

## 1.2. Bagaimana strategi utama website ini agar bisa ditemukan dan mendatangkan calon tamu baru yang belum pernah mengetahui penginapan yayasan Anda sebelumnya?

* SEO.
* Dukungan konten:

  * Website utama.
  * Media sosial (Instagram, dll).
  * Konten milik pihak lain seperti yayasan cabang.
* Media fisik:

  * Banner.
  * Sticker.
  * Dan media promosi lainnya.

### 1.2.1. Untuk kebutuhan LPJ pimpinan yayasan dan tim audit, apakah website harus bisa melacak dan menampilkan data grafik/tabel mengenai "Dari mana asal tamu tahu tentang penginapan ini?"

* Tidak.
* Hal tersebut dianggap nilai tambah (nice to have), bukan kebutuhan wajib.
