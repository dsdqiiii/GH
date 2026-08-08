import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { UnitPropertyInfoCard } from "@/components/admin/unit/UnitPropertyInfoCard";
import { UnitEditForm } from "@/components/admin/unit/UnitEditForm";
import { PropertyFacilitiesCard } from "@/components/admin/property/PropertyFacilitiesCard";
import { PropertyGalleriesCard } from "@/components/admin/property/PropertyGalleriesCard";
import { Button } from "@/components/ui/core/button";
import { getUnitDetailBySlug } from "@/services/admin/unit-detail";

export const dynamic = "force-dynamic";

export default async function UnitPage({
  params,
}: {
  params: Promise<{ properti: string; unit: string }>;
}) {
  const { properti, unit: unitSlug } = await params;
  const detail = await getUnitDetailBySlug(properti, unitSlug);

  if (!detail) {
    notFound();
  }

  const { unit, property, facilities, galleries } = detail;

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            href={`/admin/manage/${property.slug}/units`}
            variant="ghost"
            className="!inline-flex !w-auto !rounded-none !px-0 !py-0 mb-2 !justify-start text-sm text-neutral-500 hover:!bg-transparent hover:text-neutral-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Unit {property.name}
          </Button>
          <h1 className="text-xl font-semibold text-neutral-900">
            {unit.name}
          </h1>
          <p className="text-sm text-neutral-500">
            Kelola data, fasilitas, dan galeri untuk unit ini.
          </p>
        </div>
      </div>

      <UnitPropertyInfoCard property={property} />

      <UnitEditForm unit={unit} propertySlug={property.slug} />

      <PropertyFacilitiesCard facilities={facilities} />

      <PropertyGalleriesCard galleries={galleries} />
    </div>
  );
}