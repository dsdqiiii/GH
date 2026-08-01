import type { PropertyMasterAddons } from "@/lib/types/main";

export type BookingType = "inap" | "transit";

export interface BookingFormProps {
  unitId: string;
  unitName: string;
  pricePerNight: number;
  pricePerHour: number | null;
  isTransitEnabled: boolean;
  addons: PropertyMasterAddons[];
  isLoggedIn?: boolean;
  bookedDates?: string[];

  checkIn: string;
  checkOut: string;
  bookingType: BookingType;
}

export interface FormState {
  totalGuest: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  selectedAddons: Record<string, number>;
}

export interface FormErrors {
  totalGuest?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
}

export interface BookingPayloadAddon {
  propertyAddonId: string;
  quantity: number;
}

export interface BookingGuest {
  name: string;
  phone: string;
  email: string | null;
}

export interface BookingPayload {
  unitId: string;
  bookingType: BookingType;
  checkIn: string;
  duration: number;
  proofUrl: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
  totalGuest: number;
  addons: BookingPayloadAddon[];
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

export interface BuildBookingPayloadInput {
  unitId: string;
  bookingType: BookingType;
  checkIn: string;
  duration: number;
  proofUrl: string;
  form: FormState;
  isLoggedIn: boolean;
}