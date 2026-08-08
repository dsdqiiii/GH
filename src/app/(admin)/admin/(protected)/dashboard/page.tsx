import { getDashboardSummary } from "@/services/admin/dashboard";
import { getRecentBookings } from "@/services/admin/recent-bookings";
import { SummaryCard } from "@/components/admin/dashboard/SummaryCard";
import { RecentBookingsTable } from "@/components/admin/booking/RecentBookingTables";

export default async function AdminDashboardPage() {
  const [summary, recentBookings] = await Promise.all([
    getDashboardSummary(),
    getRecentBookings(),
  ]);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-lg font-semibold text-forest">Dashboard</h1>
        <p className="mt-1 text-sm text-taupe">
          Ringkasan aktivitas booking Penginapan Darunnajah.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Booking Hari Ini" value={summary.bookingHariIni} />
        <SummaryCard
          label="Menunggu Pembayaran"
          value={summary.pendingOrders}
          hint="Order dengan status PENDING_PAYMENT"
        />
        <SummaryCard
          label="Pembayaran Perlu Verifikasi"
          value={summary.pendingPayments}
          hint="Bukti transfer menunggu diverifikasi"
        />
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-ink">Booking Terbaru</h2>
        <RecentBookingsTable bookings={recentBookings} />
      </div>
    </div>
  );
}