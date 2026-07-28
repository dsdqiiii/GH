// services/availablility.ts
import { createSupabaseServer } from "@/lib/supabase/server";
import type { AvailableUnits } from "@/lib/types/unit"; // sesuaikan path sesuai lokasi kalian taruh

export type TypeBooking = "inap" | "transit";

interface GetAvailableUnitsParams {
  propertyId: string;
  checkIn: string;
  checkOut: string;
  typeBooking?: TypeBooking;
}

export async function getAvailableUnits({
  propertyId,
  checkIn,
  checkOut,
  typeBooking = "inap",
}: GetAvailableUnitsParams): Promise<AvailableUnits> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.rpc("get_available_units", {
    p_property_id: propertyId,
    p_check_in: checkIn,
    p_check_out: checkOut,
    p_type_booking: typeBooking,
  });

  if (error) {
    console.error("getAvailableUnits error:", error);
    return [];
  }

  return data ?? [];
}