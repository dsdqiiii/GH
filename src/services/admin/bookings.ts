import { supabaseAdmin } from "@/lib/supabase/admin";

export type BookingListItem = {
  orderId: string;
  bookingCode: string;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  status: string;
  totalAmount: number;
  totalGuest: number;
  createdAt: string;
  checkIn: string | null;
  checkOut: string | null;
  checkedIn?: string | null;
  checkedOut?: string | null;
  orderItemStatus?: string | null;
  unitName: string | null;
  propertyName: string | null;
  extraUnitsCount: number;
};

export type GetBookingsParams = {
  search?: string;
  limit?: number;
};

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
): Promise<BookingListItem | null> {
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