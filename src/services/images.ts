import { createSupabaseServer } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getMainImagesByPropertyId(propertyId: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("galleries")
    .select("url")
    .eq("reference_type", "property")
    .eq("reference_id", propertyId)
    .is("is_main", true);

  if (error || !data) return [];

  return data
    .map((row) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("GH").getPublicUrl(row.url);
      return publicUrl;
    })
    .filter((url): url is string => Boolean(url));
}


export async function getPropertyImagesByPropertyId(propertyId: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("galleries")
    .select("url")
    .eq("reference_type", "property")
    .eq("reference_id", propertyId);

  if (error || !data) return [];

  return data
    .map((row) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("GH").getPublicUrl(row.url);
      return publicUrl;
    })
    .filter((url): url is string => Boolean(url));
}

export async function getUnitImagesByUnitId(unitId: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("galleries")
    .select("url")
    .eq("reference_type", "unit")
    .eq("reference_id", unitId);

  if (error || !data) return [];

  return data
    .map((row) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("GH").getPublicUrl(row.url);
      return publicUrl;
    })
    .filter((url): url is string => Boolean(url));
}

export interface HeroImage {
  name: string;
  url: string;
}

export async function getHeroImages(): Promise<HeroImage[]> {
  const supabase = await createSupabaseServer();

  const { data: files, error } = await supabase.storage
    .from("GH")
    .list("public/HERO");

  if (error || !files) return [];

  return files
    .filter((file) => file.id) // skip placeholder/non-file entry
    .map((file) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("GH").getPublicUrl(`public/HERO/${file.name}`);

      return {
        name: file.name,
        url: publicUrl,
      };
    });
}