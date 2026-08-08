"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/core/button";
import {
  handleCompleteBookingAction,
  handleCancelBookingAction,
} from "@/actions/admin/booking"; // 👈 Import Server Actions

interface BookingActionButtonsProps {
  orderId: string;
  paymentId?: string;
  status: string; // "CONFIRMED", "CHECKED_OUT", "COMPLETED", "CANCELLED", dll.
  orderItemStatuses: string[]; // 👈 Array status dari order_items (misal: ["CHECKED_OUT", "CHECKED_OUT"])
}

export function BookingActionButtons({
  orderId,
  paymentId,
  status,
  orderItemStatuses = [],
}: BookingActionButtonsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [cancelNotes, setCancelNotes] = useState("");
  const [showCancelForm, setShowCancelForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Tombol tidak aktif/disembunyikan jika order sudah CANCELLED/EXPIRED/COMPLETED
  const isTerminated =
    status === "CANCELLED" || status === "EXPIRED" || status === "COMPLETED";

  // Tombol Selesai hanya aktif jika array tidak kosong dan SEMUA item berstatus "CHECKED_OUT"
  const canComplete =
    orderItemStatuses.length > 0 &&
    orderItemStatuses.every((itemStatus) => itemStatus === "CHECKED_OUT");

  // Handler untuk menyelesaikan booking
  function handleComplete() {
    if (!confirm("Apakah Anda yakin ingin menyelesaikan pesanan ini?")) return;

    setErrorMsg(null);
    startTransition(async () => {
      const res = await handleCompleteBookingAction(orderId);
      if (!res.success) {
        setErrorMsg(res.error || "Gagal menyelesaikan booking.");
      }
    });
  }

  // Handler untuk membatalkan booking
  function handleCancel() {
    if (!cancelNotes.trim()) {
      setErrorMsg("Alasan pembatalan wajib diisi.");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin membatalkan pesanan ini?")) return;

    setErrorMsg(null);
    startTransition(async () => {
      const res = await handleCancelBookingAction(orderId, cancelNotes);
      if (!res.success) {
        setErrorMsg(res.error || "Gagal membatalkan booking.");
        return;
      }
      setShowCancelForm(false);
      setCancelNotes("");
    });
  }

  if (isTerminated) {
    return null;
  }

  return (
    <div className="space-y-2.5 pt-2 border-t border-neutral-100">
      {errorMsg && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-600">
          {errorMsg}
        </p>
      )}

      {!showCancelForm ? (
        <>
          {/* Tombol Selesai */}
          <Button
            variant="primary"
            disabled={!canComplete || isPending}
            isLoading={isPending}
            className="w-full text-sm py-2.5 rounded-xl !bg-emerald-600 hover:!bg-emerald-700 disabled:!bg-neutral-200"
            onClick={handleComplete}
          >
            Selesai
          </Button>

          {/* Tombol Buka Form Pembatalan */}
          <Button
            variant="danger"
            disabled={isPending}
            className="w-full text-sm py-2.5 rounded-xl"
            onClick={() => setShowCancelForm(true)}
          >
            Batalkan
          </Button>
        </>
      ) : (
        /* Form Textarea Alasan Pembatalan */
        <div className="space-y-2">
          <textarea
            value={cancelNotes}
            onChange={(e) => setCancelNotes(e.target.value)}
            placeholder="Alasan pembatalan (wajib diisi)..."
            className="w-full rounded-lg border border-neutral-300 p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-red-300"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              variant="danger"
              isLoading={isPending}
              className="flex-1 text-xs py-2 rounded-lg"
              onClick={handleCancel}
            >
              Konfirmasi Batal
            </Button>

            <Button
              variant="secondary"
              disabled={isPending}
              className="flex-1 text-xs py-2 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-600"
              onClick={() => {
                setShowCancelForm(false);
                setCancelNotes("");
                setErrorMsg(null);
              }}
            >
              Kembali
            </Button>
          </div>
        </div>
      )}

      {/* Tombol Cek Bukti Bayar */}
      {paymentId && !showCancelForm && (
        <Button
          variant="ghost"
          disabled={isPending}
          className="w-full text-sm py-2.5 rounded-xl border border-neutral-200"
          onClick={() => router.push(`/admin/pembayaran/${paymentId}`)}
        >
          Cek Bukti Bayar
        </Button>
      )}
    </div>
  );
}