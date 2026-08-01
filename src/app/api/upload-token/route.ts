// app/api/upload-token/route.ts
//
// Gerbang untuk mendapatkan signed upload URL sebelum browser upload
// langsung ke Supabase Storage. File itu sendiri TIDAK lewat sini --
// route ini cuma mengeluarkan token sekali-pakai untuk 1 path spesifik.
//
// Alur:
//   1. Browser POST ke sini dengan { fileName, contentType }
//   2. Route ini validasi tipe file, generate path unik (uuid),
//      lalu minta signed upload URL ke Supabase (pakai service_role)
//   3. Browser upload file langsung ke signedUrl yang dikembalikan
//
// RATE LIMITING:
// Endpoint ini sengaja dibuat sebagai Route Handler (punya path HTTP
// tetap: /api/upload-token) supaya bisa ditarget oleh Vercel WAF custom
// rule (rate-limit per IP, mis. 5 request / 10 menit). Konfigurasi rule
// dilakukan di dashboard Vercel -> Firewall -> Custom Rules, BUKAN di
// kode ini. Kode ini tidak melakukan rate-limiting sendiri.
//
// Kenapa bukan Server Action: Server Action tidak punya path HTTP yang
// stabil untuk ditarget WAF custom rule, jadi tidak bisa di-rate-limit
// di level firewall.

import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  PAYMENT_PROOF_BUCKET,
  PAYMENT_PROOF_PATH_PREFIX,
  PAYMENT_PROOF_ALLOWED_MIME,
  PAYMENT_PROOF_MAX_SIZE_MB,
} from "@/lib/constants/upload";

interface UploadTokenRequestBody {
  contentType?: string;
  fileSize?: number;
}

export async function POST(request: Request) {
  let body: UploadTokenRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { contentType, fileSize } = body;

  // 1. Validasi tipe file -- harus salah satu MIME yang diizinkan.
  if (!contentType || !(contentType in PAYMENT_PROOF_ALLOWED_MIME)) {
    return NextResponse.json(
      {
        error: `Unsupported file type. Allowed: ${Object.keys(
          PAYMENT_PROOF_ALLOWED_MIME
        ).join(", ")}`,
      },
      { status: 400 }
    );
  }

  // 2. Validasi ukuran file (guard tambahan; source of truth tetap di
  //    setting bucket Supabase).
  if (
    typeof fileSize === "number" &&
    fileSize > PAYMENT_PROOF_MAX_SIZE_MB * 1024 * 1024
  ) {
    return NextResponse.json(
      { error: `File exceeds ${PAYMENT_PROOF_MAX_SIZE_MB}MB limit` },
      { status: 400 }
    );
  }

  // 3. Generate path unik. UUID mencegah collision & path traversal --
  //    nama file asli dari user TIDAK dipakai sama sekali.
  const extension = PAYMENT_PROOF_ALLOWED_MIME[contentType];
  const objectPath = `${PAYMENT_PROOF_PATH_PREFIX}/${randomUUID()}.${extension}`;

  // 4. Minta signed upload URL ke Supabase Storage (service_role,
  //    melewati RLS -- ini sah karena route ini sendiri yang jadi
  //    gerbang otorisasi).
  const { data, error } = await supabaseAdmin.storage
    .from(PAYMENT_PROOF_BUCKET)
    .createSignedUploadUrl(objectPath);

  if (error || !data) {
    console.error("[upload-token] failed to create signed upload url", error);
    return NextResponse.json(
      { error: "Failed to prepare upload" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    path: data.path,
    token: data.token,
    signedUrl: data.signedUrl,
  });
}