import { notFound } from "next/navigation";

import { PageShell } from "@/components/ui/layout/PageShell";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Card } from "@/components/ui/core/card";
import { Badge } from "@/components/ui/core/badge";

import { getUnitsByPropertyId } from "@/services/unit";
import { getAvailableUnits } from "@/services/availablility";
import { getPropertyBySlug } from "@/services/property";
import { getPropertyImagesByPropertyId } from "@/services/images";
import { getPropertyFacilities } from "@/services/facility";

import PropertyGallery from "@/components/landing/PropertyGallery";
import PickRange from "@/components/booking/PickRange";
import UnitList from "@/components/booking/UnitList";

export default async function PropertiPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    checkin?: string;
    checkout?: string;
    adult?: string;
    floor?: string;
  }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const property = await getPropertyBySlug(slug);

  if (!property) {
    return notFound();
  }

  const hasDateFilter = Boolean(sp.checkin && sp.checkout);

  const [rawUnits, images, facilities] = await Promise.all([
    hasDateFilter
      ? getAvailableUnits({
          propertyId: property.id,
          checkIn: sp.checkin!,
          checkOut: sp.checkout!,
        })
      : getUnitsByPropertyId(property.id),
    getPropertyImagesByPropertyId(property.id),
    getPropertyFacilities(property.id),
  ]);

  // Filter lantai dilakukan di server (JS), bukan level RPC
  const units = sp.floor
    ? rawUnits.filter((unit) => unit.floor === sp.floor)
    : rawUnits;

  return (
    <PageShell>
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <PageHeader title={property.name} />
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <PropertyGallery images={images} alt={property.name} />
      </section>

      {/* Sticky Search */}
      <header className="sticky top-0 z-40 mt-8 border-y border-sand backdrop-blur bg-cream/95">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <PickRange />
        </div>
      </header>

      {/* About */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12">
          <div>
            {property.description && (
              <>
                <h2 className="text-2xl font-semibold mb-4 text-forest">
                  Tentang Properti
                </h2>
                <p className="leading-8 text-ink">{property.description}</p>
              </>
            )}

            {property.address && (
              <p className="mt-5 text-taupe">📍 {property.address}</p>
            )}

            {facilities.length > 0 && (
              <>
                <h2 className="text-2xl font-semibold mt-10 mb-4 text-forest">
                  Fasilitas
                </h2>
                <div className="flex flex-wrap gap-3">
                  {facilities.map((facility) => (
                    <Badge key={facility.id}>{facility.name}</Badge>
                  ))}
                </div>
              </>
            )}
          </div>

          <Card variant="elevated" className="h-fit">
            <p className="text-sm text-taupe">Total kamar</p>
            <p className="mt-1 text-3xl font-semibold text-forest">
              {units.length}
            </p>
            <p className="mt-6 text-sm text-taupe">
              {hasDateFilter
                ? "Kamar tersedia untuk tanggal yang dipilih."
                : "Pilih tanggal menginap untuk melihat kamar yang tersedia."}
            </p>
          </Card>
        </div>
      </section>

      {/* Units */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-semibold mb-8 text-forest">
          {hasDateFilter ? "Kamar Tersedia" : "Pilihan Kamar"}
        </h2>
        <UnitList propertySlug={property.slug} units={units} />
      </section>
    </PageShell>
  );
}