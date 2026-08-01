// helpers/upload.ts
//
// Helper client-side untuk alur upload bukti pembayaran:
//   1. Minta signed upload URL dari /api/upload-token
//   2. Upload file LANGSUNG ke Supabase Storage pakai token itu
//      (browser -> Supabase Storage, tidak lewat server Next.js)
//
// Server Next.js kita cuma dilewati untuk langkah 1 (payload kecil:
// contentType + fileSize), bukan untuk file besarnya sendiri.

"use client";

import { createSupabaseBrowser } from "@/lib/supabase/browser";
import {
  PAYMENT_PROOF_BUCKET,
  PAYMENT_PROOF_MAX_SIZE_MB,
} from "@/lib/constants/upload";

export class PaymentProofUploadError extends Error {}

interface UploadTokenResponse {
  path: string;
  token: string;
  signedUrl: string;
}

/**
 * Upload 1 file bukti pembayaran dan kembalikan path storage-nya
 * (path ini yang nanti dikirim sebagai proofUrl ke Server Action,
 * lalu dipetakan ke p_proof_url saat memanggil RPC create_booking).
 */
export async function uploadPaymentProof(file: File): Promise<string> {
  if (file.size > PAYMENT_PROOF_MAX_SIZE_MB * 1024 * 1024) {
    throw new PaymentProofUploadError(
      `Ukuran file maksimal ${PAYMENT_PROOF_MAX_SIZE_MB}MB`
    );
  }

  // 1. Minta signed upload URL dari route handler kita.
  const tokenRes = await fetch("/api/upload-token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contentType: file.type,
      fileSize: file.size,
    }),
  });

  if (!tokenRes.ok) {
    const body = await tokenRes.json().catch(() => ({}));
    throw new PaymentProofUploadError(
      body?.error || "Gagal menyiapkan sesi upload. Coba lagi."
    );
  }

  const { path, token }: UploadTokenResponse = await tokenRes.json();

  // 2. Upload file langsung ke Supabase Storage pakai token sekali-pakai.
  const supabaseBrowser = createSupabaseBrowser();
  const { error: uploadError } = await supabaseBrowser.storage
    .from(PAYMENT_PROOF_BUCKET)
    .uploadToSignedUrl(path, token, file);

  if (uploadError) {
    throw new PaymentProofUploadError(
      "Gagal mengunggah file. Periksa koneksi Anda dan coba lagi."
    );
  }

  // path inilah yang disimpan sebagai proofUrl / dikirim ke RPC.
  return path;
}