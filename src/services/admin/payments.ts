// /services/admin/payments.ts
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServer } from "@/lib/supabase/server";
import type { PaymentDetail, VerifyPaymentResult } from "@/lib/types/payment.types";

const PROOF_SIGNED_URL_EXPIRY_SECONDS = 60 * 60; // 1 jam

interface ServiceResult<T> {
  data: T | null;
  error: string | null;
}

/**
 * Mengambil ringkasan seluruh data pembayaran.
 */
export async function getPaymentSummaries() {
  const supabase = supabaseAdmin;

  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      id,
      order_id,
      amount,
      status,
      proof_url,
      destination_bank_name,
      destination_account_holder,
      destination_account_number,
      verified_by,
      verified_at,
      created_at,
      order:orders (
        booking_code
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching payment summaries:", error);
    return [];
  }

  // Meratakan (flatten) data agar booking_code mudah diakses di komponen
  return data.map((payment) => {
    const orderData = Array.isArray(payment.order)
      ? payment.order[0]
      : payment.order;

    return {
      ...payment,
      booking_code: orderData?.booking_code ?? null,
    };
  });
}

/**
 * Membuat Signed URL untuk melihat bukti transfer pada bucket private TRANSACTIONS.
 */
export async function getPaymentProofSignedUrl(proofPath: string) {
  const supabase = supabaseAdmin;

  const { data, error } = await supabase.storage
    .from("TRANSACTIONS")
    .createSignedUrl(proofPath, PROOF_SIGNED_URL_EXPIRY_SECONDS);

  if (error) {
    console.error("Error creating signed URL for payment proof:", error);
    return null;
  }

  return data.signedUrl;
}

/**
 * Mengambil ringkasan data pembayaran berdasarkan Order ID.
 */
export async function getPaymentByOrderId(ordersId: string) {
  const supabase = supabaseAdmin;

  const { data, error } = await supabase
    .from("payments")
    .select("id, verified_at, verified_by, status")
    .eq("order_id", ordersId)
    .single();

  if (error) {
    console.error("Error fetching payment by order ID:", error);
    return null;
  }

  return data;
}

/**
 * Mengambil detail pembayaran secara spesifik berdasarkan Payment ID.
 */
export async function getPaymentDetailById(
  paymentId: string
): Promise<PaymentDetail | null> {
  const supabase = supabaseAdmin;

  const { data, error } = await supabase
    .from("payments")
    .select(
      `
      id,
      order_id,
      amount,
      status,
      proof_url,
      destination_bank_name,
      destination_account_number,
      destination_account_holder,
      notes,
      created_at,
      updated_at,
      order:orders (
        id,
        booking_code,
        guest_name,
        total_amount,
        status
      )
    `
    )
    .eq("id", paymentId)
    .single();

  if (error) {
    console.error("Error fetching payment detail:", error);
    return null;
  }

  return data as unknown as PaymentDetail;
}

/**
 * Memanggil RPC verify_payment dengan konteks auth admin yang aktif.
 */
export async function verifyPayment(
  paymentId: string,
  notes?: string
): Promise<ServiceResult<VerifyPaymentResult>> {
  try {
    const supabase = await createSupabaseServer();
    if (!notes || notes.trim() === "") {
      notes = 'Pembayaran telah di verifikasi oleh admin'; // Jika notes kosong, set ke null agar RPC menerima nilai null
    }

    const { data, error } = await supabase.rpc("verify_payment", {
      p_payment_id: paymentId,
      p_notes: notes ?? null,
    });

    if (error) {
      console.error("[verifyPayment] RPC error:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error("[verifyPayment] Unexpected error:", err);
    return {
      data: null,
      error: err?.message || "Terjadi kesalahan sistem saat memverifikasi pembayaran.",
    };
  }
}

/**
 * Memanggil RPC reject_payment dengan konteks auth admin yang aktif.
 */
export async function rejectPayment(
  paymentId: string,
  notes: string
): Promise<ServiceResult<VerifyPaymentResult>> {
  if (!notes || notes.trim() === "") {
    return { data: null, error: "Alasan reject wajib diisi" };
  }

  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase.rpc("reject_payment", {
      p_payment_id: paymentId,
      p_notes: notes,
    });

    if (error) {
      console.error("[rejectPayment] RPC error:", error);
      return { data: null, error: error.message };
    }

    return { data, error: null };
  } catch (err: any) {
    console.error("[rejectPayment] Unexpected error:", err);
    return {
      data: null,
      error: err?.message || "Terjadi kesalahan sistem saat menolak pembayaran.",
    };
  }
}