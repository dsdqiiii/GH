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
  // Tanggal yang sudah di-book (Format: "YYYY-MM-DD")
  bookedDates?: string[];
}

export interface FormState {
  bookingType: BookingType;
  checkInDate: Date | null;
  checkOutDate: Date | null;
  transitDate: Date | null;
  hours: number;
  totalGuest: number;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  selectedAddons: Record<string, number>;
}

export interface FormErrors {
  dates?: string;
  totalGuest?: string;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
}