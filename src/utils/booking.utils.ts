import type { PropertyMasterAddons } from "@/lib/types/main.types";
import type {
  FormState,
  FormErrors,
  BookingType,
  ResolveBookingWindowInput,
  ResolveBookingWindowResult,
  BuildBookingPayloadInput,
} from "@/lib/types/booking.types";

export const initialBookingState: FormState = {
  totalGuest: 1,
  guestName: "",
  guestPhone: "",
  guestEmail: "",
  selectedAddons: {},
};

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

// Format Date ke string "YYYY-MM-DD" — dipertahankan untuk kemungkinan reuse (mis. admin calendar)
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Menghitung checkInISO/checkOutISO untuk keperluan DISPLAY di FE saja.
 * Bukan sumber validasi — cutoff, lead-time, dan batas durasi
 * sepenuhnya divalidasi oleh RPC (get_available_units / create_booking).
 * duration = malam (inap) atau jam (transit), sesuai p_duration RPC.
 */
export function resolveBookingWindow(
  input: ResolveBookingWindowInput
): ResolveBookingWindowResult {
  const {
    checkIn: checkInRaw,
    duration,
    bookingType,
    defaultCheckInTime = "14:00",
  } = input;

  let checkIn: Date;
  let checkOut: Date;

  if (bookingType === "inap") {
    checkIn = new Date(`${checkInRaw}T${defaultCheckInTime}:00`);
    checkOut = new Date(checkIn);
    checkOut.setDate(checkOut.getDate() + duration);
    checkOut.setHours(12, 0, 0, 0);
  } else {
    // transit: checkInRaw sudah berupa "YYYY-MM-DDTHH:mm"
    checkIn = new Date(checkInRaw);
    checkOut = new Date(checkIn.getTime() + duration * 60 * 60 * 1000);
  }

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return createErrorResult("Format tanggal atau durasi tidak valid.");
  }

  return {
    isValid: true,
    checkInISO: checkIn.toISOString(),
    checkOutISO: checkOut.toISOString(),
  };
}

function createErrorResult(errorMessage: string): ResolveBookingWindowResult {
  return {
    isValid: false,
    checkInISO: "",
    checkOutISO: "",
    errorMessage,
  };
}

export function buildBookingPayload({
  unitId,
  bookingType,
  checkIn,
  duration,
  proofUrl,
  form,
  isLoggedIn,
}: BuildBookingPayloadInput) {
  return {
    unitId,
    bookingType,
    checkIn,
    duration,
    totalGuest: form.totalGuest,
    proofUrl,
    ...(isLoggedIn
      ? {}
      : {
          guestName: form.guestName,
          guestPhone: form.guestPhone,
          guestEmail: form.guestEmail || undefined,
        }),
    addons: Object.entries(form.selectedAddons).map(
      ([propertyAddonId, quantity]) => ({
        propertyAddonId,
        quantity,
      })
    ),
  };
}