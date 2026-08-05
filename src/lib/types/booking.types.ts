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
  duration: number;
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
  /** Tanggal/waktu check-in. Untuk inap: YYYY-MM-DD. Untuk transit: ISO datetime lokal (YYYY-MM-DDTHH:mm). */
  checkIn: string;
  /** Durasi: malam untuk inap (1-100), jam untuk transit (1-5) */
  duration: number;
  bookingType: BookingType;
  /** Jam standar check-in property untuk inap (misal: "14:00") */
  defaultCheckInTime?: string;
  /** Waktu acuan saat ini (default: Date.now(), berguna untuk unit testing) */
  now?: Date;
}

export interface ResolveBookingWindowResult {
  isValid: boolean;
  /** ISO String lengkap dengan jam untuk DB / RPC query (contoh: "2026-07-30T14:00:00.000Z") */
  checkInISO: string;
  /** ISO String lengkap untuk check-out — dihitung, hanya untuk display/estimasi di FE, bukan dikirim ke RPC */
  checkOutISO: string;
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

export type BookingListItem = {
  orderId: string;
  bookingCode: string;
  guestName: string | null;
  guestPhone: string | null;
  guestEmail: string | null;
  status: string;
  totalAmount: number;
  totalGuest: number;
  createdAt: string;
  checkIn: string | null;
  checkOut: string | null;
  checkedIn?: string | null;
  checkedOut?: string | null;
  orderItemStatus?: string | null;
  unitName: string | null;
  propertyName: string | null;
  extraUnitsCount: number;
}


export type GetBookingsParams = {
  search?: string;
  limit?: number;
}