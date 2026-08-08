import { createSupabaseServer } from "@/lib/supabase/server";
import { getFacilitiesForReference } from "@/services/admin/facility-assignments";
import type {
  Galleries,
  MasterBankAccounts,
  MasterOrganizations,
  MasterProperties,
  PropertyDetail,
} from "@/lib/types/main.types";

/**
 * Mengambil detail lengkap satu property berdasarkan slug:
 * - data property itu sendiri
 * - organisasi induk (master_organizations)
 * - bank account milik organisasi yang sama
 * - facility yang di-assign ke property ini (reference_type = 'property')
 * - galleries milik property ini (reference_type = 'property') dengan url bertipe Supabase Public URL
 *
 * Mengembalikan null kalau property tidak ditemukan.
 */
export async function getPropertyDetailBySlug(
  slug: string
): Promise<PropertyDetail | null> {
  const supabase = await createSupabaseServer();

  const { data: property, error: propertyError } = await supabase
    .from("master_properties")
    .select("*")
    .eq("slug", slug)
    .single<MasterProperties>();

  if (propertyError || !property) {
    return null;
  }

  const [organizationRes, bankAccountsRes, facilities, galleriesRes] =
    await Promise.all([
      supabase
        .from("master_organizations")
        .select("*")
        .eq("id", property.master_organizations_id)
        .single<MasterOrganizations>(),
      supabase
        .from("master_bank_accounts")
        .select("*")
        .eq("master_organizations_id", property.master_organizations_id)
        .order("created_at", { ascending: true }),
      getFacilitiesForReference(supabase, "property", property.id),
      supabase
        .from("galleries")
        .select("*")
        .eq("reference_type", "property")
        .eq("reference_id", property.id)
        .order("is_main", { ascending: false })
        .order("created_at", { ascending: true }),
    ]);

  const organization = organizationRes.data ?? null;
  const bankAccounts: MasterBankAccounts[] = bankAccountsRes.data ?? [];
  const rawGalleries: Galleries[] = galleriesRes.data ?? [];

  // Map path path/to/file.jpg menjadi public URL penuh Supabase Storage
  const galleries: Galleries[] = rawGalleries.map((item) => {
    if (!item.url) return item;

    const {
      data: { publicUrl },
    } = supabase.storage.from("GH").getPublicUrl(item.url);

    return {
      ...item,
      url: publicUrl,
    };
  });

  return {
    property,
    organization,
    bankAccounts,
    facilities,
    galleries,
  };
}