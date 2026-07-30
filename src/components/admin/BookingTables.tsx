import type { RecentBooking } from "@/services//admin/recent-bookings";

const statusLabel: Record<string, string> = {
  PENDING_PAYMENT: "Menunggu Pembayaran",
  PAID: "Lunas",
  CONFIRMED: "Terkonfirmasi",
  COMPLETED: "Selesai",
  EXPIRED: "Kedaluwarsa",
  CANCELLED: "Dibatalkan",
};

const statusClass: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-50 text-amber-700",
  PAID: "bg-emerald-50 text-emerald-700",
  CONFIRMED: "bg-emerald-50 text-emerald-700",
  COMPLETED: "bg-neutral-100 text-neutral-600",
  EXPIRED: "bg-red-50 text-red-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

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
    <div className="overflow-x-auto rounded-lg border border-neutral-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500">
            <th className="px-4 py-3 font-medium">Kode</th>
            <th className="px-4 py-3 font-medium">Tamu</th>
            <th className="px-4 py-3 font-medium">Unit</th>
            <th className="px-4 py-3 font-medium">Check-in</th>
            <th className="px-4 py-3 font-medium">Check-out</th>
            <th className="px-4 py-3 font-medium">Total</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr
              key={booking.orderId}
              className="border-b border-neutral-100 last:border-0"
            >
              <td className="px-4 py-3 font-medium text-neutral-900">
                {booking.bookingCode}
              </td>
              <td className="px-4 py-3 text-neutral-700">
                {booking.guestName ?? "-"}
              </td>
              <td className="px-4 py-3 text-neutral-700">
                {booking.unitName ?? "-"}
              </td>
              <td className="px-4 py-3 text-neutral-700">
                {formatDate(booking.checkIn)}
              </td>
              <td className="px-4 py-3 text-neutral-700">
                {formatDate(booking.checkOut)}
              </td>
              <td className="px-4 py-3 text-neutral-700">
                {formatCurrency(booking.totalAmount)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusClass[booking.status] ??
                    "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {statusLabel[booking.status] ?? booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}