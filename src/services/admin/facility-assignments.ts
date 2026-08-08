import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/supabase";
import type { MasterFacility, PropertyFacility } from "@/lib/types/main.types";

type FacilityAssignmentRow = {
  id: string;
  reference_type: string;
  reference_id: string;
  facility_id: number;
  mapped_at: string;
  master_facilities: Pick<MasterFacility, "id" | "name" | "code" | "icon_url"> | null;
};

/**
 * Mengambil facility_assignments untuk sebuah entity polimorfik (property/unit),
 * sudah di-join dengan master_facilities dan dipetakan ke bentuk PropertyFacility.
 */
export async function getFacilitiesForReference(
  supabase: SupabaseClient<Database>,
  referenceType: "property" | "unit",
  referenceId: string
): Promise<PropertyFacility[]> {
  const { data } = await supabase
    .from("facility_assignments")
    .select(
      `
      id,
      reference_type,
      reference_id,
      facility_id,
      mapped_at,
      master_facilities (
        id,
        name,
        code,
        icon_url
      )
    `
    )
    .eq("reference_type", referenceType)
    .eq("reference_id", referenceId);

  const rows = (data ?? []) as unknown as FacilityAssignmentRow[];

  return rows
    .filter((row) => row.master_facilities !== null)
    .map((row) => ({
      id: row.id,
      reference_type: row.reference_type,
      reference_id: row.reference_id,
      mapped_at: row.mapped_at,
      facility_id: row.master_facilities!.id,
      facility_name: row.master_facilities!.name,
      facility_code: row.master_facilities!.code,
      icon_url: row.master_facilities!.icon_url,
    }));
}