import { createSupabaseServer } from "@/lib/supabase/server";
import type { AvailableUnit } from "@/lib/types/unit";


export async function getAvailableUnits(
  propertyId: string,
  checkIn: string,
  checkOut: string
): Promise<AvailableUnit[]> {

  const supabase = await createSupabaseServer();

  const { data, error } = await supabase.rpc(
    "get_available_units",
    {
      p_property_id: propertyId,
      p_check_in: checkIn,
      p_check_out: checkOut,
    }
  );


  if (error) return [];


  return data;
}