"use server";

import { revalidatePath } from "next/cache";
import {
  checkInOrderItem,
  checkOutOrderItem,
  cancelBooking,
  completeBooking,
} from "@/services/admin/bookings";

export async function handleCheckInAction(orderItemId: string, bookingId: string) {
  const res = await checkInOrderItem(orderItemId);

  if (res.success) {
    // Revalidasi halaman detail booking dan daftar booking agar data langsung fresh
    revalidatePath(`/admin/booking/${bookingId}`);
    revalidatePath("/admin/booking");
  }

  return res;
}

export async function handleCheckOutAction(orderItemId: string, bookingId: string) {
  const res = await checkOutOrderItem(orderItemId);

  if (res.success) {
    revalidatePath(`/admin/booking/${bookingId}`);
    revalidatePath("/admin/booking");
  }

  return res;
}

export async function handleCancelBookingAction(
  orderId: string,
  notes: string
) {
  const res = await cancelBooking(orderId, notes);

  if (res.success) {
    revalidatePath(`/admin/booking/${orderId}`);
    revalidatePath("/admin/booking");
  }

  return res;
}


export async function handleCompleteBookingAction(
  orderId: string,
  notes?: string
) {
  const res = await completeBooking(orderId, notes);

  if (res.success) {
    revalidatePath(`/admin/booking/${orderId}`);
    revalidatePath("/admin/booking");
  }

  return res;
}