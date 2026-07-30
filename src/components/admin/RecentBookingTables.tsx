import type { RecentBooking } from "@/services/admin/recent-bookings";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
} from "@/components/ui/core/table";
import { statusClass, statusLabel } from "@/lib/constants/status";
import { formatDate, formatCurrency } from "@/utils/formatter.utils";

export function RecentBookingsTable({
  bookings,
}: {
  bookings: RecentBooking[];
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
        Belum ada booking.
      </div>
    );
  }

  return (
    /* Menggunakan max-h-[400px] & overflow-auto agar area tabel saja yang di-scroll */
    <div className="max-h-[400px] overflow-auto rounded-lg border border-neutral-200 bg-white">
      <Table className="text-sm">
        {/* Tambahkan sticky top-0 dan bg-white agar header tidak ikut tertutup saat di-scroll */}
        <TableHead className="sticky top-0 z-10 bg-white">
          <TableRow className="border-b border-neutral-200 text-left text-neutral-500">
            <TableHeader className="px-4 py-3 font-medium bg-white">Kode</TableHeader>
            <TableHeader className="px-4 py-3 font-medium bg-white">Tamu</TableHeader>
            <TableHeader className="px-4 py-3 font-medium bg-white">Unit</TableHeader>
            <TableHeader className="px-4 py-3 font-medium bg-white">Check-in</TableHeader>
            <TableHeader className="px-4 py-3 font-medium bg-white">Check-out</TableHeader>
            <TableHeader className="px-4 py-3 font-medium bg-white">Total</TableHeader>
            <TableHeader className="px-4 py-3 font-medium bg-white">Status</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {bookings.map((booking) => (
            <TableRow
              key={booking.orderId}
              className="border-b border-neutral-100 last:border-0"
            >
              <TableCell className="px-4 py-3 font-medium text-neutral-900">
                {booking.bookingCode}
              </TableCell>
              <TableCell className="px-4 py-3 text-neutral-700">
                {booking.guestName ?? "-"}
              </TableCell>
              <TableCell className="px-4 py-3 text-neutral-700">
                {booking.unitName ?? "-"}
              </TableCell>
              <TableCell className="px-4 py-3 text-neutral-700">
                {formatDate(booking.checkIn)}
              </TableCell>
              <TableCell className="px-4 py-3 text-neutral-700">
                {formatDate(booking.checkOut)}
              </TableCell>
              <TableCell className="px-4 py-3 text-neutral-700">
                {formatCurrency(booking.totalAmount)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusClass[booking.status] ??
                    "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {statusLabel[booking.status] ?? booking.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}