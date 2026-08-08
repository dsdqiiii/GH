"use server";

import { revalidatePath } from "next/cache";
import { toggleUnitActive, updateUnit } from "@/services/admin/units";
import { logActivity } from "@/helpers/log-activity";
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

  await logActivity({
    event: "unit.updated",
    entityType: "unit",
    entityId: unitId,
    metadata: { propertySlug, oldSlug: unitSlug, newSlug: res.data.slug },
  });

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
    await logActivity({
      event: isActive ? "unit.activated" : "unit.deactivated",
      entityType: "unit",
      entityId: unitId,
      metadata: { propertySlug, unitSlug },
    });

    revalidatePath(`/admin/manage/${propertySlug}/units`);
    revalidatePath(`/admin/manage/${propertySlug}/units/${unitSlug}`);
  }

  return res;
}