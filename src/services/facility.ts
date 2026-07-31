import { createSupabaseServer } from "@/lib/supabase/server";
import type { MasterFacility } from "@/lib/types/main";

export async function getPropertyFacilities(
  propertyId: string
): Promise<MasterFacility[]> {
  const supabase = await createSupabaseServer();
<<<<<<< HEAD
console.log('id', propertyId)
=======

>>>>>>> upstream/main
  const { data: assignments, error: assignmentError } = await supabase
    .from("facility_assignments")
    .select("facility_id")
    .eq("reference_type", "property")
    .eq("reference_id", propertyId);

<<<<<<< HEAD
console.log({
  assignments,
  assignmentError,
});
=======
>>>>>>> upstream/main
  if (assignmentError || !assignments || assignments.length === 0) return [];
    
  const facilityIds = assignments.map((row) => row.facility_id);

  const { data: facilities, error: facilityError } = await supabase
    .from("master_facilities")
    .select("*")
    .in("id", facilityIds);

  if (facilityError || !facilities) return [];

  return facilities;
}

export async function getUnitFacilities(
  unitId: string
): Promise<MasterFacility[]> {
  const supabase = await createSupabaseServer();

  const { data: assignments, error: assignmentError } = await supabase
    .from("facility_assignments")
    .select("facility_id")
    .eq("reference_type", "unit")
    .eq("reference_id", unitId);

  if (assignmentError || !assignments || assignments.length === 0) return [];

  const facilityIds = assignments.map((row) => row.facility_id);

  const { data: facilities, error: facilityError } = await supabase
    .from("master_facilities")
    .select("*")
    .in("id", facilityIds);

  if (facilityError || !facilities) return [];

  return facilities;
}