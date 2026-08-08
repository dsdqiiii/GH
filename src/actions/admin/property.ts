"use server";

import { revalidatePath } from "next/cache";
import {
  togglePropertyActive,
  updateProperty,
} from "@/services/admin/properties";
import type { MasterPropertiesUpdate } from "@/lib/types/main.types";

export async function updatePropertyAction(
  propertyId: string,
  slug: string,
  payload: MasterPropertiesUpdate
) {
  const res = await updateProperty(propertyId, payload);

  if (res.error || !res.data) {
    return res;
  }

  revalidatePath("/admin/manage/inventory");
  // slug bisa berubah setelah update; revalidate slug lama & baru
  revalidatePath(`/admin/manage/${slug}`);
  if (res.data.slug !== slug) {
    revalidatePath(`/admin/manage/${res.data.slug}`);
  }

  return res;
}

export async function togglePropertyActiveAction(
  propertyId: string,
  slug: string,
  isActive: boolean
) {
  const res = await togglePropertyActive(propertyId, isActive);

  if (!res.error) {
    revalidatePath("/admin/manage/inventory");
    revalidatePath(`/admin/manage/${slug}`);
  }

  return res;
}