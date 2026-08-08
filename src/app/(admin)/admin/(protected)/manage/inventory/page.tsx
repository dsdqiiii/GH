import { PropertyInventoryList } from "@/components/admin/PropertyInventoryList";
import { getAssignedProperties } from "@/services/admin/property-assignment";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const properties = await getAssignedProperties();

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">Inventaris</h1>
        <p className="text-sm text-neutral-500">
          Menampilkan {properties.length} properti yang menjadi tanggung
          jawab Anda.
        </p>
      </div>

      <PropertyInventoryList properties={properties} />
    </div>
  );
}