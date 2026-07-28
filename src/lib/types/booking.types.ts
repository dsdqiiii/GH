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