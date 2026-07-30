import { supabaseAdmin } from "@/lib/supabase/admin";

export type DashboardSummary = {
  bookingHariIni: number;
  pendingOrders: number;
  pendingPayments: number;
};

/**
 * Ringkasan angka untuk dashboard:
 * - bookingHariIni: jumlah order_items dengan check_in = hari ini
 * - pendingOrders: jumlah orders dengan status PENDING_PAYMENT
 * - pendingPayments: jumlah payments dengan status pending (menunggu verifikasi admin)
 */
export async function getDashboardSummary(): Promise<DashboardSummary> {
  const supabase = supabaseAdmin;

  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  const [bookingHariIniRes, pendingOrdersRes, pendingPaymentsRes] =
    await Promise.all([
      supabase
        .from("order_items")
        .select("id", { count: "exact", head: true })
        .eq("check_in", today),

      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .eq("status", "PENDING_PAYMENT"),

      supabase
        .from("payments")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
    ]);

  if (bookingHariIniRes.error) throw bookingHariIniRes.error;
  if (pendingOrdersRes.error) throw pendingOrdersRes.error;
  if (pendingPaymentsRes.error) throw pendingPaymentsRes.error;

  console.log(pendingPaymentsRes)

  return {
    bookingHariIni: bookingHariIniRes.count ?? 0,
    pendingOrders: pendingOrdersRes.count ?? 0,
    pendingPayments: pendingPaymentsRes.count ?? 0,
  };
}