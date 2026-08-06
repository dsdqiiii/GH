import { supabaseAdmin } from "@/lib/supabase/admin";
import { createSupabaseServer } from "@/lib/supabase/server"; // 👈 Import ini untuk auth context RPC
import type { BookingListItem, GetBookingsParams } from "@/lib/types/booking.types";

/**
 * Ambil daftar booking (order) dengan filter pencarian sederhana.
 */
export async function getBookings({
  search = "",
  limit = 100,
}: GetBookingsParams = {}): Promise<BookingListItem[]> {
  const supabase = supabaseAdmin;

  let query = supabase
    .from("orders")
    .select(
      `
      id,
      booking_code,
      guest_name,
      guest_phone,
      guest_email,
      status,
      total_amount,
      total_guest,
      created_at,
      order_items (
        id,
        check_in,
        check_out,
        checked_in_at,
        checked_out_at,
        units (
          name,
          master_properties ( name )
        )
      )
    `
    );

  // Filter berdasarkan kata kunci jika ada
  if (search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(
      `booking_code.ilike.${term},guest_name.ilike.${term},guest_email.ilike.${term},guest_phone.ilike.${term}`
    );
  }

  const { data, error } = await query
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((order) => {
    const items = order.order_items ?? [];
    const firstItem = items[0];
    const firstUnit = firstItem?.units;

    return {
      orderId: order.id,
      orderItemId: firstItem?.id ?? null,
      bookingCode: order.booking_code,
      guestName: order.guest_name,
      guestPhone: order.guest_phone,
      guestEmail: order.guest_email,
      status: order.status,
      totalAmount: order.total_amount,
      totalGuest: order.total_guest,
      createdAt: order.created_at,
      checkIn: firstItem?.check_in ?? null,
      checkOut: firstItem?.check_out ?? null,
      checkedIn: firstItem?.checked_in_at ?? null,
      checkedOut: firstItem?.checked_out_at ?? null,
      unitName: firstUnit?.name ?? null,
      propertyName: firstUnit?.master_properties?.name ?? null,
      extraUnitsCount: items.length > 1 ? items.length - 1 : 0,
    };
  });
}

export async function getBookingById(
  orderId: string
): Promise<(BookingListItem & { orderItemId?: string | null }) | null> {
  const supabase = supabaseAdmin;

  const { data: order, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      booking_code,
      guest_name,
      guest_phone,
      guest_email,
      status,
      total_amount,
      total_guest,
      created_at,
      order_items (
        id,
        check_in,
        check_out,
        checked_in_at,
        checked_out_at,
        status_item,
        units (
          name,
          master_properties ( name )
        )
      )
    `
    )
    .eq("id", orderId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching booking by ID:", error);
    return null;
  }

  if (!order) return null;

  const items = order.order_items ?? [];
  const firstItem = items[0];
  const firstUnit = Array.isArray(firstItem?.units)
    ? firstItem.units[0]
    : firstItem?.units;

  const masterProp = Array.isArray(firstUnit?.master_properties)
    ? firstUnit.master_properties[0]
    : firstUnit?.master_properties;

  return {
    orderId: order.id,
    orderItemId: firstItem?.id ?? null, // 👈 Sertakan order_item.id untuk dikirim ke RPC check_in_order_item
    bookingCode: order.booking_code,
    guestName: order.guest_name,
    guestPhone: order.guest_phone,
    guestEmail: order.guest_email,
    status: order.status,
    totalAmount: order.total_amount,
    totalGuest: order.total_guest,
    createdAt: order.created_at,
    checkIn: firstItem?.check_in ?? null,
    checkOut: firstItem?.check_out ?? null,
    checkedIn: firstItem?.checked_in_at ?? null,
    checkedOut: firstItem?.checked_out_at ?? null,
    orderItemStatus: firstItem?.status_item ?? null,
    unitName: firstUnit?.name ?? null,
    propertyName: masterProp?.name ?? null,
    extraUnitsCount: items.length > 1 ? items.length - 1 : 0,
  };
}

/**
 * Service untuk melakukan Check-In Order Item via RPC Supabase.
 * Menggunakan createSupabaseServer() agar konteks auth admin diteruskan ke PostgreSQL.
 */
export async function checkInOrderItem(orderItemId: string) {
  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase.rpc("check_in_order_item", {
      p_order_item_id: orderItemId,
    });

    if (error) {
      console.error("Error executing RPC check_in_order_item:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error in checkInOrderItem:", err);
    return {
      success: false,
      error: err?.message || "Terjadi kesalahan sistem saat check-in.",
    };
  }
}

/**
 * Service untuk melakukan Check-Out Order Item via RPC Supabase.
 * Menggunakan createSupabaseServer() agar konteks auth admin diteruskan ke PostgreSQL.
 */
export async function checkOutOrderItem(orderItemId: string) {
  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase.rpc("check_out_order_item", {
      p_order_item_id: orderItemId,
    });

    if (error) {
      console.error("Error executing RPC check_out_order_item:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error in checkOutOrderItem:", err);
    return {
      success: false,
      error: err?.message || "Terjadi kesalahan sistem saat check-out.",
    };
  }
}

export async function cancelBooking(orderId: string, notes: string) {
  try {
    const supabase = await createSupabaseServer();

    const { data, error } = await supabase.rpc("cancel_order", {
      p_order_id: orderId,
      p_notes: notes,
    });

    if (error) {
      console.error("Error executing RPC cancel_order:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error in cancelBooking:", err);
    return {
      success: false,
      error: err?.message || "Terjadi kesalahan sistem saat membatalkan booking.",
    };
  }
}

export async function completeBooking(orderId: string, notes?: string) {
  try {
    const supabase = await createSupabaseServer();
    if (!notes || notes.trim() === "") {
      notes = "Booking selesai oleh admin.";
    }

    const { data, error } = await supabase.rpc("complete_order", {
      p_order_id: orderId,
      p_notes: notes ?? null,
    });

    if (error) {
      console.error("Error executing RPC complete_order:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.error("Unexpected error in completeBooking:", err);
    return {
      success: false,
      error: err?.message || "Terjadi kesalahan sistem saat menyelesaikan booking.",
    };
  }
}