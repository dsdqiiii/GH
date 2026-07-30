"use client";

import { useState } from "react";

interface BookingStatusActionsProps {
  bookingId: string;
  status: string;
  checkedIn: string | null | undefined;
  checkedOut: string | null | undefined;
}

export function BookingStatusActions({
  bookingId,
  status,
  checkedIn,
  checkedOut,
}: BookingStatusActionsProps) {
  const [loading, setLoading] = useState(false);

  // Handler aksi (Hubungkan ke Server Action atau API Route kamu)
  const handleAction = async (actionType: "check_in" | "check_out" | "complete") => {
    try {
      setLoading(true);
      // Contoh call API:
      // await updateBookingStatus(bookingId, actionType);
      console.log(`Action ${actionType} triggered for booking:`, bookingId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Jika pesanan sudah CANCELED atau COMPLETED, tidak ada tombol aksi yang ditampilkan
  if (status === "CANCELED" || status === "COMPLETED") {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
      {/* 1. Tombol Check-in: Aktif jika status BOOKED dan belum checkedIn */}
      {status === "BOOKED" && !checkedIn && (
        <button
          onClick={() => handleAction("check_in")}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Proses Check-in"}
        </button>
      )}

      {/* 2. Tombol Check-out: Aktif jika sudah Checked In tapi belum Checked Out */}
      {(status === "CHECKED_IN" || checkedIn) && !checkedOut && (
        <button
          onClick={() => handleAction("check_out")}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 active:bg-amber-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Proses Check-out"}
        </button>
      )}

      {/* 3. Tombol Complete: Aktif jika sudah Checked Out */}
      {(status === "CHECKED_OUT" || checkedOut) && status !== "COMPLETED" && (
        <button
          onClick={() => handleAction("complete")}
          disabled={loading}
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg transition-colors shadow-sm disabled:opacity-50"
        >
          {loading ? "Memproses..." : "Tandai Selesai (Complete)"}
        </button>
      )}
    </div>
  );
}