"use server";

import { revalidatePath } from "next/cache";
import { toggleUnitActive, updateUnit } from "@/services/admin/units";
import type { UnitsUpdate } from "@/lib/types/main.types";

export async function updateUnitAction(
  unitId: string,
  propertySlug: string,
  unitSlug: string,
  payload: UnitsUpdate
) {
  const res = await updateUnit(unitId, payload);

  if (res.error || !res.data) {
    return res;
  }

  revalidatePath(`/admin/manage/${propertySlug}/units`);
  // slug bisa berubah setelah update; revalidate slug lama & baru
  revalidatePath(`/admin/manage/${propertySlug}/units/${unitSlug}`);
  if (res.data.slug !== unitSlug) {
    revalidatePath(`/admin/manage/${propertySlug}/units/${res.data.slug}`);
  }

  return res;
}

export async function toggleUnitActiveAction(
  unitId: string,
  propertySlug: string,
  unitSlug: string,
  isActive: boolean
) {
  const res = await toggleUnitActive(unitId, isActive);

  if (!res.error) {
    revalidatePath(`/admin/manage/${propertySlug}/units`);
    revalidatePath(`/admin/manage/${propertySlug}/units/${unitSlug}`);
  }

  return res;
}