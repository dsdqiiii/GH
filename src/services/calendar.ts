import { createSupabaseServer } from "@/lib/supabase/server";

export async function getCalendarAvailability(
  unitId: string,
  year: number,
  month: number
): Promise<string[]> {
  const supabase = await createSupabaseServer();

  // 1. Tentukan batas awal dan akhir bulan
  const startOfMonth = new Date(year, month - 1, 1).toISOString();
  // Tanggal 0 dari bulan berikutnya memberikan hari terakhir bulan ini
  const endOfMonth = new Date(year, month, 0, 23, 59, 59, 999).toISOString();

  // 2. Query booking aktif yang memotong/berada di rentang bulan ini
  const { data, error } = await supabase
    .from("order_items")
    .select(`
      check_in,
      check_out,
      status_item,
      orders!inner (
        status
      )
    `)
    .eq("unit_id", unitId)
    .neq("status_item", "CANCELLED")
    .in("orders.status", ["PENDING_PAYMENT", "BOOKED", "CHECKED_IN"])
    .lt("check_in", endOfMonth)
    .gt("check_out", startOfMonth);

  if (error || !data) {
    
    return [];
  }

  // 3. Extrak rentang check_in -> check_out menjadi daftar tanggal harian
  const bookedDatesSet = new Set<string>();

  data.forEach((item) => {
    const startDate = new Date(item.check_in);
    const endDate = new Date(item.check_out);

    let currentDate = new Date(startDate);

    // Loop sampai sebelum check_out (karena hari check_out siang sudah bisa di-book orang lain)
    while (currentDate < endDate) {
      const y = currentDate.getFullYear();
      const m = String(currentDate.getMonth() + 1).padStart(2, "0");
      const d = String(currentDate.getDate()).padStart(2, "0");

      bookedDatesSet.add(`${y}-${m}-${d}`);

      // Increment 1 hari
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return Array.from(bookedDatesSet);
}

// output:
/**
 * Contoh Hasil Return Value:
 * 
 * Array of string berisi tanggal-tanggal (YYYY-MM-DD) yang sudah terisi / ter-booking.
 * Tanggal check-out tidak dimasukkan karena siang hari tersebut kamar sudah available kembali.
 * 
 * [
 *   "2026-08-05",
 *   "2026-08-06",
 *   "2026-08-07", // Check-out tgl 8 -> tgl 8 tidak masuk list
 *   "2026-08-12",
 *   "2026-08-13",
 *   "2026-08-14"
 * ]
 */

// Output:
// [ "2026-08-05", "2026-08-06", "2026-08-07", "2026-08-12", "2026-08-13", "2026-08-14" ]