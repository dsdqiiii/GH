import { createSupabaseServer } from "@/lib/supabase/server";

<<<<<<< HEAD
=======
export async function getMainImagesByPropertyId(propertyId: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("galleries")
    .select("url")
    .eq("reference_type", "property")
    .eq("reference_id", propertyId)
    .is("is_main", true);

  if (error || !data) return [];
  console.log(data)

  return data
    .map((row) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("GH").getPublicUrl(row.url);
      return publicUrl;
    })
    .filter((url): url is string => Boolean(url));
}


>>>>>>> upstream/main
export async function getPropertyImagesByPropertyId(propertyId: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("galleries")
<<<<<<< HEAD
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
=======
    .select("url")
    .eq("reference_type", "property")
    .eq("reference_id", propertyId);

  if (error || !data) return [];
  console.log(data)

  return data
    .map((row) => {
      const {
        data: { publicUrl },
      } = supabase.storage.from("GH").getPublicUrl(row.url);
      return publicUrl;
    })
    .filter((url): url is string => Boolean(url));
>>>>>>> upstream/main
}

export async function getUnitImagesByUnitId(unitId: string) {
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("galleries")
<<<<<<< HEAD
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
=======
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
>>>>>>> upstream/main
}