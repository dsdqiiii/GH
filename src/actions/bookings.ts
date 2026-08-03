'use server'

import { createSupabaseServer } from "@/lib/supabase/server";
import type { BookingPayload } from "@/lib/types/booking.types";
import {
  validateCreateBookingInput,
  toCreateBookingRpcArgs,
} from "@/lib/validators/booking";

export async function createBooking(
  payload: BookingPayload,
  userId: string | null | undefined
) {
  // 1. Sanitasi & validasi shape/format di sisi Next.js sebelum menyentuh
  //    RPC (defense-in-depth; business rules tetap di-enforce di RPC).
  const checkIn = new Date(payload.checkIn);
  const checkOut = new Date(
    checkIn.getTime() +
      (payload.bookingType === "inap"
        ? payload.duration * 24 * 60 * 60 * 1000
        : payload.duration * 60 * 60 * 1000)
  );

  console.log(payload);

  const validation = validateCreateBookingInput({
    unitId: payload.unitId,
    bookingType: payload.bookingType,
    dateRange: { checkIn, checkOut },
    totalGuest: payload.totalGuest,
    proofUrl: payload.proofUrl,
    addons: payload.addons,
    userId: userId ?? null,
    guestName: payload.guestName ?? null,
    guestPhone: payload.guestPhone ?? null,
    guestEmail: payload.guestEmail ?? null,
  });

  if (!validation.success) {
    const firstError = Object.values(validation.errors.fieldErrors)
      .flat()
      .find(Boolean);
    throw new Error(firstError || "Data booking tidak valid.");
  }

  const supabase = await createSupabaseServer();

  const rpcArgs = toCreateBookingRpcArgs(validation.data);

  const { data, error } = await supabase.rpc("create_booking", {
    p_unit_id: rpcArgs.p_unit_id,
    p_booking_type: rpcArgs.p_booking_type,
    p_check_in: payload.checkIn,
    p_duration: payload.duration,
    p_total_guest: rpcArgs.p_total_guest,
    p_proof_url: rpcArgs.p_proof_url,
    p_user_id: rpcArgs.p_user_id ?? undefined,
    p_guest_name: rpcArgs.p_guest_name ?? undefined,
    p_guest_phone: rpcArgs.p_guest_phone ?? undefined,
    p_guest_email: rpcArgs.p_guest_email ?? undefined,
    p_addons: rpcArgs.p_addons,
  });

  if (error) {
    // Map error codes to user-friendly messages
    switch (error.code) {
      case "P0002":
        throw new Error("Unit tidak ditemukan atau sudah tidak aktif.");
      case "P0003":
        throw new Error("Unit sudah tidak tersedia pada tanggal/jam yang dipilih.");
      case "P0004":
        throw new Error("Salah satu addon tidak valid atau sudah tidak aktif.");
      default:
        throw new Error(error.message || "Gagal membuat booking.");
    }
  }

  // data is an array (Postgres RETURNS TABLE) — take the first row
  const result = data?.[0];
  return result as {
    order_id: string;
    booking_code: string;
    total_amount: number;
  };
}