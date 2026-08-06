import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookingById } from "@/services/admin/bookings";
import { getPaymentByOrderId } from "@/services/admin/payments";
import { formatCurrency, formatDate, formatDateTime } from "@/utils/formatter.utils";
import { statusLabel, statusClass } from "@/lib/constants/status";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/core/card";
import { BookingActionButtons } from "@/components/admin/BookingActionButtons";
import { BookingTimeline } from "@/components/admin/BookingTimeline";
import { BookingStatusActions } from "@/components/admin/BookingStatusActions";

export const dynamic = "force-dynamic";

interface BookingDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminBookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params;
  const booking = await getBookingById(id);

  if (!booking || !booking.orderItemId) {
    notFound();
  }

  // Ambil data pembayaran (jika ada)
  const payment = await getPaymentByOrderId(booking.orderId);

  // Mengumpulkan array status item (jika ada beberapa item atau item tunggal)
  const orderItemStatuses = booking.orderItemStatus ? [booking.orderItemStatus] : [];

  return (
    <div className="space-y-6 p-6">
      {/* Header & Back Button */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link
            href="/admin/booking"
            className="inline-flex items-center text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            ← Kembali ke Daftar Booking
          </Link>
          <h1 className="text-xl font-semibold text-neutral-900">
            Detail Booking #{booking.bookingCode}
          </h1>
        </div>
        <div>
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
              statusClass[booking.status] ?? "bg-neutral-100 text-neutral-600"
            }`}
          >
            {statusLabel[booking.status] ?? booking.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Detail Utama (Kiri - 2 Kolom) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Informasi Properti & Unit */}
          <Card className="p-6 bg-white">
            <CardHeader className="mb-4">
              <CardTitle className="text-base font-semibold text-neutral-900">
                Informasi Properti
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-sm">
                <div>
                  <p className="text-xs font-medium text-neutral-500">Guest House</p>
                  <p className="font-medium text-neutral-800">
                    {booking.propertyName ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">Unit</p>
                  <p className="font-medium text-neutral-800">
                    {booking.unitName ?? "-"}
                    {booking.extraUnitsCount > 0 && (
                      <span className="ml-2 inline-flex rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                        +{booking.extraUnitsCount} unit
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detail Menginap, Alur Status, & Tombol Aksi */}
          <Card className="p-6 bg-white">
            <CardHeader className="mb-4 flex flex-row items-center justify-between pb-3 border-b border-neutral-100">
              <CardTitle className="text-base font-semibold text-neutral-900">
                Detail Menginap
              </CardTitle>
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-700 font-mono">
                {booking.orderItemStatus}
              </span>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Info Rencana & Realisasi Check-in/out */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-neutral-500">Check-in (Rencana)</p>
                  <p className="font-medium text-neutral-800">
                    {formatDate(booking.checkIn)}
                  </p>
                  {booking.checkedIn && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                      Aktual: {formatDateTime(booking.checkedIn)}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium text-neutral-500">Check-out (Rencana)</p>
                  <p className="font-medium text-neutral-800">
                    {formatDate(booking.checkOut)}
                  </p>
                  {booking.checkedOut && (
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                      Aktual: {formatDateTime(booking.checkedOut)}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs font-medium text-neutral-500">Jumlah Tamu</p>
                  <p className="font-medium text-neutral-800">
                    {booking.totalGuest} Orang
                  </p>
                </div>
              </div>

              {/* Component Alur / Stepper Timeline */}
              <div className="pt-2 border-t border-neutral-100">
                <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-4">
                  Alur Pesanan
                </p>
                <BookingTimeline
                  status={booking.status}
                  createdAt={booking.createdAt}
                  checkedIn={booking.checkedIn}
                  checkedOut={booking.checkedOut}
                  verifiedAt={payment?.verified_at ?? null}
                  verifiedBy={payment?.verified_by ?? null}
                />
              </div>

              {/* Tombol Aksi Check-in / Check-out Berdasarkan Status */}
              <BookingStatusActions
                orderItemId={booking.orderItemId}
                bookingId={booking.orderId}
                status={booking.status}
                checkedIn={booking.checkedIn}
                checkedOut={booking.checkedOut}
              />
            </CardContent>
          </Card>

          {/* Informasi Tamu */}
          <Card className="p-6 bg-white">
            <CardHeader className="mb-4">
              <CardTitle className="text-base font-semibold text-neutral-900">
                Informasi Tamu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
                <div>
                  <p className="text-xs font-medium text-neutral-500">Nama</p>
                  <p className="font-medium text-neutral-800">
                    {booking.guestName ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">No. Telepon</p>
                  <p className="font-medium text-neutral-800">
                    {booking.guestPhone ?? "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-500">Email</p>
                  <p className="font-medium text-neutral-800">
                    {booking.guestEmail ?? "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ringkasan Pembayaran & Action Buttons (Kanan - 1 Kolom) */}
        <div className="space-y-6">
          <Card className="p-6 bg-white">
            <CardHeader className="mb-4">
              <CardTitle className="text-base font-semibold text-neutral-900">
                Rincian Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3 text-sm border-b border-neutral-100 pb-4">
                <div className="flex justify-between text-neutral-600">
                  <span>Order ID</span>
                  <span className="font-mono text-xs text-neutral-800">{booking.orderId}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Dibuat Pada</span>
                  <span className="text-xs text-neutral-800">{formatDateTime(booking.createdAt)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-neutral-900">Total Pembayaran</span>
                <span className="text-lg font-semibold text-neutral-900">
                  {formatCurrency(booking.totalAmount)}
                </span>
              </div>

              {/* Komponen Client Interaktif (Selesai/Batalkan/Cek Bukti Bayar) */}
              <BookingActionButtons
                orderId={booking.orderId}
                paymentId={payment?.id}
                status={booking.status}
                orderItemStatuses={orderItemStatuses}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}