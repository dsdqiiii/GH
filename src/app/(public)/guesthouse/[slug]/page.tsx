import { notFound } from "next/navigation";

import { PageShell } from "@/components/ui/layout/PageShell";
import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Card } from "@/components/ui/core/card";
import { Badge } from "@/components/ui/core/badge";

import { getUnitsByPropertyId } from "@/services/unit";
import { getAvailableUnits, type TypeBooking } from "@/services/availablility";
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
    duration?: string;
    adult?: string;
    floor?: string;
    type?: TypeBooking;
  }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;

  const property = await getPropertyBySlug(slug);

  if (!property) {
    return notFound();
  }

  // Flow baru menggunakan checkin + duration
  const hasDateFilter = Boolean(sp.checkin && sp.duration);

  const [rawUnits, images, facilities] = await Promise.all([
    hasDateFilter
      ? getAvailableUnits({
          propertyId: property.id,
          checkIn: sp.checkin!,
          duration: Number(sp.duration),
          typeBooking: sp.type ?? "inap",
          // aktifkan jika service sudah mendukung
          // adult: Number(sp.adult ?? 1),
          // floor: sp.floor,
        })
      : getUnitsByPropertyId(property.id),
    getPropertyImagesByPropertyId(property.id),
    getPropertyFacilities(property.id),
  ]);

  // Untuk sementara floor masih difilter di FE.
  // Nanti bisa dihapus jika filtering dipindahkan seluruhnya ke RPC.
  const units = sp.floor
    ? rawUnits.filter((unit) => unit.floor === sp.floor)
    : rawUnits;

  return (
    <PageShell>
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-8 sm:space-y-10">
        {/* Header */}
        <section>
          <PageHeader title={property.name} />
        </section>

        {/* Hero */}
        <section className="grid grid-cols-1 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_400px] gap-6 xl:gap-8 items-start">
          <div className="w-full min-w-0">
            <PropertyGallery images={images} alt={property.name} />
          </div>

          <aside className="w-full lg:sticky lg:top-6 space-y-4">
            <PickRange />

            <Card variant="elevated">
              <p className="text-xs sm:text-sm text-taupe font-medium">
                Total kamar
              </p>

              <p className="mt-1 text-2xl sm:text-3xl font-semibold text-forest">
                {units.length}
              </p>

              <p className="mt-4 text-xs sm:text-sm text-taupe leading-relaxed">
                {hasDateFilter
                  ? "Kamar tersedia untuk tanggal yang dipilih."
                  : "Pilih tanggal menginap untuk melihat kamar yang tersedia."}
              </p>
            </Card>
          </aside>
        </section>

        {/* Informasi Properti */}
        {(property.description ||
          property.address ||
          facilities.length > 0) && (
          <section className="border-t border-sand/60 pt-8 sm:pt-10">
            <div className="max-w-4xl space-y-8">
              {property.description && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-forest">
                    Tentang Properti
                  </h2>

                  <p className="leading-relaxed text-sm sm:text-base text-ink">
                    {property.description}
                  </p>
                </div>
              )}

              {property.address && (
                <div className="flex items-start gap-2 text-sm sm:text-base text-taupe">
                  <span>📍</span>
                  <span>{property.address}</span>
                </div>
              )}

              {facilities.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-forest">
                    Fasilitas Properti
                  </h2>

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {facilities.map((facility) => (
                      <Badge key={facility.id}>{facility.name}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Daftar Kamar */}
        <section className="border-t border-sand/60 pt-8 sm:pt-10 pb-12">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8 text-forest">
            {hasDateFilter ? "Kamar Tersedia" : "Pilihan Kamar"}
          </h2>

          <UnitList
            propertySlug={property.slug}
            units={units}
            searchQuery={
              hasDateFilter
                ? {
                    checkin: sp.checkin,
                    duration: sp.duration,
                    adult: sp.adult,
                    floor: sp.floor,
                    type: sp.type,
                  }
                : undefined
            }
          />
        </section>
      </div>
    </PageShell>
  );
}