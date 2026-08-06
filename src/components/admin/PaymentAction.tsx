"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  handleVerifyPaymentAction,
  handleRejectPaymentAction,
} from "@/actions/admin/payment"; // 👈 Import dari Actions
import { Button } from "@/components/ui/core/button";

interface PaymentActionsProps {
  paymentId: string;
  orderId?: string; // 👈 Opsi orderId untuk revalidasi
  currentStatus: string;
}

export default function PaymentActions({
  paymentId,
  orderId,
  currentStatus,
}: PaymentActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [rejectNotes, setRejectNotes] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canAct = currentStatus === "PENDING" || currentStatus === "SUBMITTED";
  if (!paymentId) return null;

  const notes = "Pembayaran diverifikasi oleh admin";

  function handleVerify() {
    if (!confirm("Yakin ingin memverifikasi pembayaran ini?")) return;

    setErrorMsg(null);
    startTransition(async () => {
      // Panggil via Server Action
      const { error } = await handleVerifyPaymentAction(paymentId, notes, orderId);
      if (error) {
        setErrorMsg(error);
        return;
      }
      router.refresh();
    });
  }

  function handleReject() {
    if (!rejectNotes.trim()) {
      setErrorMsg("Alasan reject wajib diisi");
      return;
    }
    if (!confirm("Yakin ingin menolak pembayaran ini?")) return;

    setErrorMsg(null);
    startTransition(async () => {
      // Panggil via Server Action
      const { error } = await handleRejectPaymentAction(
        paymentId,
        rejectNotes,
        orderId
      );
      if (error) {
        setErrorMsg(error);
        return;
      }
      router.refresh();
    });
  }

  if (!canAct) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-gray-500">
          Pembayaran ini sudah diproses (status: <strong>{currentStatus}</strong>).
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="border-b pb-2 text-base font-semibold text-gray-800">
        Aksi Verifikasi
      </h3>

      {errorMsg && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      {!showRejectForm ? (
        <div className="flex gap-3">
          <Button
            onClick={handleVerify}
            isLoading={isPending}
            className="flex-1 !bg-green-600 hover:!bg-green-700 text-white !py-2.5 text-sm !rounded-xl"
          >
            Verifikasi Pembayaran
          </Button>

          <Button
            variant="ghost"
            onClick={() => setShowRejectForm(true)}
            disabled={isPending}
            className="flex-1 border border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 !py-2.5 text-sm !rounded-xl"
          >
            Tolak Pembayaran
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          <textarea
            value={rejectNotes}
            onChange={(e) => setRejectNotes(e.target.value)}
            placeholder="Alasan penolakan (wajib diisi)..."
            className="w-full rounded-lg border border-gray-300 p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            rows={3}
          />
          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleReject}
              isLoading={isPending}
              className="flex-1 !py-2.5 text-sm !rounded-xl"
            >
              Konfirmasi Tolak
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setShowRejectForm(false);
                setRejectNotes("");
                setErrorMsg(null);
              }}
              disabled={isPending}
              className="flex-1 border border-gray-300 !bg-white hover:!bg-gray-50 text-gray-600 !py-2.5 text-sm !rounded-xl"
            >
              Batal
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}