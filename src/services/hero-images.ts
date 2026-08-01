import { createSupabaseServer } from "@/lib/supabase/server";

export async function getHeroImages() {
  const supabase = await createSupabaseServer();
  const { data: folders } = await supabase.storage.from("GH").list("public");

  const images = [];

  for (const folder of folders ?? []) {
    const { data: files } = await supabase.storage
      .from("GH")
      .list(`public/${folder.name}`);

    for (const file of files ?? []) {
      const { data: signed } = await supabase.storage
        .from("GH")
        .createSignedUrl(`public/${folder.name}/${file.name}`, 60 * 60); // berlaku 1 jam

      if (signed?.signedUrl) {
        images.push({
          folder: folder.name,
          name: file.name,
          url: signed.signedUrl,
        });
      }
    }
  }

  return images;
}