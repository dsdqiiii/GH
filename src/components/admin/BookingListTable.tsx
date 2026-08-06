import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/core/table";
import type { BookingListItem } from "@/lib/types/booking.types";
import { formatDate, formatDateTime } from "@/utils/formatter.utils";
import { statusLabel, statusClass } from "@/lib/constants/status";

export function BookingListTables({
  bookings,
}: {
  bookings: BookingListItem[];
}) {
  if (bookings.length === 0) {
    return (
      <div className="rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
        Belum ada booking.
      </div>
    );
  }

  return (
    /* Menggunakan max-h-[500px] & overflow-auto agar scroll terbatas di dalam kontainer ini saja */
    <div className="max-h-[600px] overflow-auto rounded-lg border border-neutral-200 bg-white">
      <Table className="text-sm">
        {/* sticky top-0 agar header tetap terlihat saat di-scroll vertikal */}
        <TableHead className="sticky top-0 z-10 bg-white ">
          <TableRow className="border-b border-neutral-200 text-left text-neutral-500">
            <TableHeader className="w-[140px] min-w-[120px] bg-white px-4 py-3 font-medium">
              Kode
            </TableHeader>
            <TableHeader className="w-[120px] min-w-[80px] bg-white px-4 py-3 font-medium">
              Tamu
            </TableHeader>
            <TableHeader className="w-[180px] min-w-[140px] bg-white px-4 py-3 font-medium">
              Guest House/Unit
            </TableHeader>
            <TableHeader className="bg-white px-4 py-3 font-medium">
              Check-in
            </TableHeader>
            <TableHeader className="bg-white px-4 py-3 font-medium">
              Check-out
            </TableHeader>
            <TableHeader className="bg-white px-4 py-3 font-medium">
              Status
            </TableHeader>
            <TableHeader className="w-[140px] min-w-[120px] bg-white px-4 py-3 font-medium">
              Dibuat
            </TableHeader>
            <TableHeader className="bg-white px-4 py-3 font-medium">
              Aksi
            </TableHeader>
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
                <div>{booking.guestName ?? "-"}</div>
                {booking.guestPhone && (
                  <div className="text-xs text-neutral-400">
                    {booking.guestPhone}
                  </div>
                )}
                {booking.guestEmail && (
                  <div className="text-xs text-neutral-400">
                    {booking.guestEmail}
                  </div>
                )}
              </TableCell>
              <TableCell className="px-4 py-3 text-neutral-700">
                <div>{booking.propertyName ?? "-"}</div>

                {/* Nama Unit & Extra Unit di bawahnya */}
                <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <span>{booking.unitName ?? "-"}</span>
                  {booking.extraUnitsCount > 0 && (
                    <span className="inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                      +{booking.extraUnitsCount} unit
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="px-4 py-3 text-neutral-700">
                {formatDate(booking.checkIn)}
              </TableCell>
              <TableCell className="px-4 py-3 text-neutral-700">
                {formatDate(booking.checkOut)}
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
              <TableCell className="px-4 py-3 text-neutral-500">
                {formatDateTime(booking.createdAt)}
              </TableCell>
              <TableCell className="px-4 py-3">
                <Link
                  href={`/admin/booking/${booking.orderId}`}
                  className="inline-flex rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Detail
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}