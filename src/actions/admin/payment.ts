"use server";

import { revalidatePath } from "next/cache";
import { verifyPayment, rejectPayment } from "@/services/admin/payments";

export async function handleVerifyPaymentAction(
  paymentId: string,
  notes: string,
  orderId?: string
) {
  const res = await verifyPayment(paymentId, notes);

  if (!res.error) {
    // Revalidasi halaman daftar pembayaran & detail pembayaran
    revalidatePath("/admin/pembayaran");
    revalidatePath(`/admin/pembayaran/${paymentId}`);

    // Revalidasi juga halaman booking jika orderId dikirimkan
    if (orderId) {
      revalidatePath(`/admin/booking/${orderId}`);
      revalidatePath("/admin/booking");
    }
  }

  return res;
}

export async function handleRejectPaymentAction(
  paymentId: string,
  notes: string,
  orderId?: string
) {
  const res = await rejectPayment(paymentId, notes);

  if (!res.error) {
    revalidatePath("/admin/pembayaran");
    revalidatePath(`/admin/pembayaran/${paymentId}`);

    if (orderId) {
      revalidatePath(`/admin/booking/${orderId}`);
      revalidatePath("/admin/booking");
    }
  }

  return res;
}