import { createSupabaseServer } from "@/lib/supabase/server";
import type { AssignedProperty, MasterProperties } from "@/lib/types/main.types";

type AssignedPropertyRow = {
  id: string;
  mapped_at: string;
  master_properties: MasterProperties | null;
};

/**
 * Mengambil daftar property (GH) yang di-assign ke user yang sedang login,
 * berdasarkan tabel property_assignments.
 *
 * Catatan: untuk saat ini SEMUA role diperlakukan sama — hanya menampilkan
 * property yang benar-benar ada mapping-nya di property_assignments.
 * Belum ada pengecualian khusus untuk administrator/superadmin (lihat semua).
 */
export async function getAssignedProperties(): Promise<AssignedProperty[]> {
  const supabase = await createSupabaseServer();

  const { data: claims, error: claimsError } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub;

  if (claimsError || !userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("property_assignments")
    .select(
      `
      id,
      mapped_at,
      master_properties (
        id,
        master_organizations_id,
        name,
        slug,
        address,
        contact_wa,
        description,
        is_active,
        created_at,
        updated_at
      )
    `
    )
    .eq("user_id", userId)
    .order("mapped_at", { ascending: false });

  if (error) {
    console.error("Error fetching assigned properties:", error);
    return [];
  }

  const rows = (data ?? []) as unknown as AssignedPropertyRow[];

  return rows
    .filter((row) => row.master_properties !== null)
    .map((row) => {
      const property = row.master_properties!;
      return {
        ...property,
        assignment_id: row.id,
        mapped_at: row.mapped_at,
      };
    });
}