import { createSupabaseServer } from "@/lib/supabase/server";

export async function getPropertyImagesByPropertyId(propertyId: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("galleries")
    .select("url, is_hero")
    .eq("reference_type", "property")
    .eq("reference_id", propertyId)
    .is('is_hero', false);

  if (error || !data) return [];

  const signedUrls = await Promise.all(
    data.map(async (row) => {
      const { data: signed, error: signError } = await supabase.storage
        .from("GH")
        .createSignedUrl(row.url, 60 * 60); // berlaku 1 jam

      if (signError || !signed) return null;
      return signed.signedUrl;
    })
  );

  return signedUrls.filter((url): url is string => url !== null);
}

export async function getUnitImagesByUnitId(unitId: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("galleries")
    .select("url, is_hero")
    .eq("reference_type", "unit")
    .eq("reference_id", unitId)
    .order("is_hero", { ascending: false });

  if (error || !data) return [];

  const signedUrls = await Promise.all(
    data.map(async (row) => {
      const { data: signed, error: signError } = await supabase.storage
        .from("GH")
        .createSignedUrl(row.url, 60 * 60);

      if (signError || !signed) return null;
      return signed.signedUrl;
    })
  );

  return signedUrls.filter((url): url is string => url !== null);
}