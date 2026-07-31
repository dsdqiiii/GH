'use server'

import { createSupabaseServer } from "@/lib/supabase/server"; // sesuaikan dengan setup project
import type { BookingPayload } from "@/lib/types/booking.types"; // sesuaikan path

export async function createBooking(payload: BookingPayload, userId: string | null | undefined) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.rpc("create_booking", {
    p_unit_id: payload.unitId,
    p_booking_type: payload.bookingType,
    p_check_in: payload.checkIn,
    p_check_out: payload.checkOut,
    p_total_guest: payload.totalGuest,
    p_user_id: userId ?? undefined,
    p_guest_name: payload.guest?.name ?? undefined,
    p_guest_phone: payload.guest?.phone ?? undefined,
    p_guest_email: payload.guest?.email ?? undefined,
    p_addons: payload.addons.map((a) => ({
      property_addon_id: a.propertyAddonId,
      quantity: a.quantity,
    })),
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