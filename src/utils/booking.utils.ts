import type { PropertyMasterAddons } from "@/lib/types/main";
import type { FormState, FormErrors, BookingType } from "@/lib/types/booking.types";

export const initialBookingState: FormState = {
  totalGuest: 1,
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  selectedAddons: {},
};

// Hitung jumlah malam dari checkIn dan checkOut
export function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function calculateRoomSubtotal(
  bookingType: BookingType,
  nights: number,
  durationHours: number,
  pricePerNight: number,
  pricePerHour: number | null
): number {
  if (bookingType === "inap") {
    return nights * pricePerNight;
  }
  return durationHours * (pricePerHour ?? 0);
}

export function calculateAddonSubtotal(
  form: FormState,
  addons: PropertyMasterAddons[],
  nights: number
): number {
  return addons.reduce((total, addon) => {
    const qty = form.selectedAddons[addon.id];
    if (!qty) return total;

    switch (addon.pricing_unit) {
      case "per_guest":
        return total + addon.price * form.totalGuest;
      case "per_night":
        return total + addon.price * (nights || 1);
      case "per_guest_per_night":
        return total + addon.price * form.totalGuest * (nights || 1);
      case "flat":
      default:
        return total + addon.price * qty;
    }
  }, 0);
}

export function validateBookingForm(
  form: FormState,
  isLoggedIn: boolean
): FormErrors {
  const errors: FormErrors = {};

  if (form.totalGuest < 1) {
    errors.totalGuest = "Jumlah tamu minimal 1";
  }

  if (!isLoggedIn) {
    if (!form.guestName.trim()) {
      errors.guestName = "Nama wajib diisi";
    }

    if (!form.guestPhone.trim()) {
      errors.guestPhone = "Nomor WhatsApp wajib diisi";
    } else if (!/^[0-9+\-\s]{8,20}$/.test(form.guestPhone)) {
      errors.guestPhone = "Format nomor tidak valid";
    }

    if (form.guestEmail && !/^\S+@\S+\.\S+$/.test(form.guestEmail)) {
      errors.guestEmail = "Format email tidak valid";
    }
  }

  return errors;
}

// Format Date ke string "YYYY-MM-DD" — sudah tidak dipakai BookingForm,
// dipertahankan untuk kemungkinan reuse (mis. admin calendar)
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}