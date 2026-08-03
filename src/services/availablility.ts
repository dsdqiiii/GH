// services/availablility.ts
import { createSupabaseServer } from "@/lib/supabase/server";
import type { AvailableUnits } from "@/lib/types/unit"; // sesuaikan path sesuai lokasi kalian taruh

export type TypeBooking = "inap" | "transit";

interface GetAvailableUnitsParams {
  propertyId: string;
  checkIn: string;
  duration: number;
  typeBooking?: TypeBooking;
  adult?: number;
}

export async function getAvailableUnits({
  propertyId,
  checkIn,
  duration,
  typeBooking = "inap",
  adult = 2,
}: GetAvailableUnitsParams): Promise<AvailableUnits> {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.rpc("get_available_units", {
    p_property_id: propertyId,
    p_check_in: checkIn,
    p_duration: duration,
    p_type_booking: typeBooking,
    p_adult: adult,
  });

  if (error) {
    console.error("getAvailableUnits RPC error:", error);
    return [];
  }

  return data ?? [];
}