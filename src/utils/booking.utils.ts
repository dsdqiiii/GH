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

export interface ResolveBookingWindowInput {
  /** Tanggal check-in dalam format YYYY-MM-DD */
  checkInDate: string;
  /** Tanggal check-out dalam format YYYY-MM-DD */
  checkOutDate: string;
  /** Jam standar check-in property (misal: "14:00") */
  defaultCheckInTime?: string;
  /** Jam standar check-out property (misal: "12:00") */
  defaultCheckOutTime?: string;
  /** Cutoff jam pemesanan hari H (misal: "17:00" - lewat jam ini tidak bisa pesan untuk hari yang sama) */
  sameDayCutoffTime?: string;
  /** Waktu acuan saat ini (default: Date.now(), berguna untuk unit testing) */
  now?: Date;
}

export interface ResolveBookingWindowResult {
  isValid: boolean;
  /** ISO String lengkap dengan jam untuk DB / RPC query (contoh: "2026-07-30T14:00:00.000Z") */
  checkInISO: string;
  /** ISO String lengkap untuk check-out */
  checkOutISO: string;
  /** Total malam menginap */
  totalNights: number;
  /** Alasan jika validasi gagal */
  errorMessage?: string;
}

/**
 * Single source of truth untuk menghitung window check-in/check-out dan memvalidasi cutoff.
 */
export function resolveBookingWindow(
  input: ResolveBookingWindowInput
): ResolveBookingWindowResult {
  const {
    checkInDate,
    checkOutDate,
    defaultCheckInTime = "14:00",
    defaultCheckOutTime = "12:00",
    sameDayCutoffTime = "20:00",
    now = new Date(),
  } = input;

  // 1. Construct Full DateTime Objects
  const checkIn = new Date(`${checkInDate}T${defaultCheckInTime}:00`);
  const checkOut = new Date(`${checkOutDate}T${defaultCheckOutTime}:00`);

  // Helper untuk normalisasi tanggal tanpa jam (Midnight)
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const checkInMidnight = new Date(checkIn.getFullYear(), checkIn.getMonth(), checkIn.getDate());

  // 2. Validation Checks
  
  // A. Pastikan format date valid
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return createErrorResult("Format tanggal check-in atau check-out tidak valid.");
  }

  // B. Tanggal check-in tidak boleh di masa lalu
  if (checkInMidnight < todayMidnight) {
    return createErrorResult("Tanggal check-in tidak boleh berada di masa lalu.");
  }

  // C. Check-out harus setelah Check-in
  if (checkOut <= checkIn) {
    return createErrorResult("Tanggal check-out harus setelah tanggal check-in.");
  }

  // D. Same-Day Cutoff Validation (Jika booking untuk hari ini)
  const isSameDayBooking = checkInMidnight.getTime() === todayMidnight.getTime();
  if (isSameDayBooking && sameDayCutoffTime) {
    const [cutoffHour, cutoffMinute] = sameDayCutoffTime.split(":").map(Number);
    const cutoffDateTime = new Date(todayMidnight);
    cutoffDateTime.setHours(cutoffHour, cutoffMinute, 0, 0);

    if (now > cutoffDateTime) {
      return createErrorResult(
        `Batas waktu pemesanan untuk hari ini telah berakhir pada pukul ${sameDayCutoffTime}.`
      );
    }
  }

  // 3. Calculate Total Nights
  const diffMS = checkOutMidnight(checkOut).getTime() - checkInMidnight.getTime();
  const totalNights = Math.round(diffMS / (1000 * 60 * 60 * 24));

  return {
    isValid: true,
    checkInISO: checkIn.toISOString(),
    checkOutISO: checkOut.toISOString(),
    totalNights,
  };
}

// Internal Helpers
function checkOutMidnight(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function createErrorResult(errorMessage: string): ResolveBookingWindowResult {
  return {
    isValid: false,
    checkInISO: "",
    checkOutISO: "",
    totalNights: 0,
    errorMessage,
  };
}