import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { UnitListTable } from "@/components/admin/unit/UnitListTable";
import { Button } from "@/components/ui/core/button";
import { getPropertyBySlug } from "@/services/property";
import { getUnitsByPropertyIdForAdmin } from "@/services/admin/units";

export const dynamic = "force-dynamic";

export default async function UnitsPage({
  params,
}: {
  params: Promise<{ properti: string }>;
}) {
  const { properti } = await params;

  const property = await getPropertyBySlug(properti);

  if (!property) {
    notFound();
  }

  const units = await getUnitsByPropertyIdForAdmin(property.id);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Button
            href={`/admin/manage/${property.slug}`}
            variant="ghost"
            className="!inline-flex !w-auto !rounded-none !px-0 !py-0 mb-2 !justify-start text-sm text-neutral-500 hover:!bg-transparent hover:text-neutral-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke {property.name}
          </Button>
          <h1 className="text-xl font-semibold text-neutral-900">
            Unit &mdash; {property.name}
          </h1>
          <p className="text-sm text-neutral-500">
            Menampilkan {units.length} unit untuk properti ini.
          </p>
        </div>
      </div>

      <UnitListTable units={units} propertySlug={property.slug} />
    </div>
  );
}