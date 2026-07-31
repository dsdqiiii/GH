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
  checkOut: string;
  totalGuest: number;
  guest: BookingGuest | null;
  addons: BookingPayloadAddon[];
}