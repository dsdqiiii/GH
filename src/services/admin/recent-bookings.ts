import { createSupabaseServer } from "@/lib/supabase/server";

export type RecentBooking = {
  orderId: string;
  bookingCode: string;
  guestName: string | null;
  status: string;
  totalAmount: number;
  createdAt: string;
  checkIn: string | null;
  checkOut: string | null;
  unitName: string | null;
};

/**
 * Ambil N booking terbaru, join ke order_items (untuk tanggal & unit)
 * dan units (untuk nama unit). Kalau satu order punya beberapa order_items,
 * cukup ambil item pertama untuk ringkasan tabel.
 */
export async function getRecentBookings(
  limit: number = 10
): Promise<RecentBooking[]> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      id,
      booking_code,
      guest_name,
      status,
      total_amount,
      created_at,
      order_items (
        check_in,
        check_out,
        units ( name )
      )
    `
    )
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((order) => {
    const firstItem = order.order_items?.[0];

    return {
      orderId: order.id,
      bookingCode: order.booking_code,
      guestName: order.guest_name,
      status: order.status,
      totalAmount: order.total_amount,
      createdAt: order.created_at,
      checkIn: firstItem?.check_in ?? null,
      checkOut: firstItem?.check_out ?? null,
      unitName: firstItem?.units?.name ?? null,
    };
  });
}