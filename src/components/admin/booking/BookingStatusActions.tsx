"use client";

import { useState } from "react";
import { Button } from "@/components/ui/core/button";
import {
  handleCheckInAction,
  handleCheckOutAction,
} from "@/actions/admin/booking"; // 👈 Import Server Actions

interface BookingStatusActionsProps {
  bookingId: string;
  orderItemId: string; // 👈 Tambahkan orderItemId untuk dikirim ke RPC
  status: string;
  checkedIn: string | null | undefined;
  checkedOut: string | null | undefined;
}

export function BookingStatusActions({
  bookingId,
  orderItemId,
  status,
  checkedIn,
  checkedOut,
}: BookingStatusActionsProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Handler aksi check-in & check-out
  const handleAction = async (actionType: "check_in" | "check_out") => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const res =
        actionType === "check_in"
          ? await handleCheckInAction(orderItemId, bookingId)
          : await handleCheckOutAction(orderItemId, bookingId);

      if (!res.success) {
        setErrorMsg(res.error || "Gagal memproses aksi");
      }
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error?.message || "Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  // Jika pesanan sudah CANCELLED, CHECKED_OUT, atau COMPLETED, tidak ada tombol aksi yang ditampilkan
  if (
    status === "CANCELLED" ||
    status === "CANCELED" ||
    status === "COMPLETED" ||
    status === "CHECKED_OUT" ||
    Boolean(checkedOut)
  ) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 pt-4 border-t border-neutral-100">
      {errorMsg && (
        <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
          {errorMsg}
        </p>
      )}

      <div className="flex items-center justify-end gap-3">
        {/* 1. Tombol Check-in: Aktif jika status CONFIRMED dan belum checkedIn */}
        {status === "CONFIRMED" && !checkedIn && (
          <Button
            onClick={() => handleAction("check_in")}
            disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs"
          >
            {loading ? "Memproses..." : "Proses Check-in"}
          </Button>
        )}

        {/* 2. Tombol Check-out: Aktif jika sudah Checked In tapi belum Checked Out */}
        {(status === "CHECKED_IN" || checkedIn) && !checkedOut && (
          <Button
            onClick={() => handleAction("check_out")}
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white text-xs"
          >
            {loading ? "Memproses..." : "Proses Check-out"}
          </Button>
        )}
      </div>
    </div>
  );
}