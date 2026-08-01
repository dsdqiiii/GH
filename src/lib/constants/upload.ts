// lib/constants/upload.ts
//
// Konfigurasi terpusat untuk upload bukti pembayaran.
// Ubah di sini saja kalau ada perubahan kebijakan bucket/tipe file.

export const PAYMENT_PROOF_BUCKET = "TRANSACTIONS";
export const PAYMENT_PROOF_PATH_PREFIX = "Payments";

// Harus selaras dengan file size limit yang di-set di Supabase Dashboard
// untuk bucket TRANSACTIONS. Ini hanya guard tambahan di sisi client/server,
// bukan sumber kebenaran (source of truth tetap di setting bucket).
export const PAYMENT_PROOF_MAX_SIZE_MB = 2;

// Map MIME type -> ekstensi yang diizinkan. Dipakai untuk:
// 1. Validasi di sisi server (route handler) sebelum generate signed URL.
// 2. Menentukan ekstensi file yang ditulis ke path storage.
export const PAYMENT_PROOF_ALLOWED_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

// Catatan: signed upload URL dari Supabase (createSignedUploadUrl) punya
// expirasi TETAP 2 jam dan tidak bisa dikonfigurasi -- beda dengan
// createSignedUrl (untuk download) yang durasinya bisa diatur. Jadi
// tidak ada constant expiry di sini untuk upload token.