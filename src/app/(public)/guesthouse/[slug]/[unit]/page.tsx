import { notFound, redirect } from "next/navigation";

import { Card } from "@/components/ui/core/card";
import { Badge } from "@/components/ui/core/badge";
import { BackButton } from "@/components/ui/navigation/BackButton";
import { PageShell } from "@/components/ui/layout/PageShell";
import { PageHeader } from "@/components/ui/layout/PageHeader";

import { getUnitBySlug } from "@/services/unit";
import { getPropertyBySlug } from "@/services/property";
import { getUnitImagesByUnitId } from "@/services/images";
import { getUnitFacilities } from "@/services/facility";
import { getPropertyAddons } from "@/services/addons";
import { getAvailableUnits, type TypeBooking } from "@/services/availablility";

import PropertyGallery from "@/components/landing/PropertyGallery";
import PickRange from "@/components/booking/PickRange";
import BookingForm from "@/components/booking/BookingForm";

export default async function UnitPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; unit: string }>;
  searchParams: Promise<{
    checkin?: string;
    checkout?: string;
    adult?: string;
    type?: TypeBooking;
  }>;
}) {
  const { slug, unit: unitSlug } = await params;
  const sp = await searchParams;

  const [property, unit] = await Promise.all([
    getPropertyBySlug(slug),
    getUnitBySlug(unitSlug),
  ]);

  if (!property || !unit) {
    return notFound();
  }

  const hasDateRange = Boolean(sp.checkin && sp.checkout);

  // Re-validasi: kalau ada filter tanggal, pastikan unit INI masih tersedia
  if (hasDateRange) {
    const availableUnits = await getAvailableUnits({
      propertyId: property.id,
      checkIn: sp.checkin!,
      checkOut: sp.checkout!,
      typeBooking: sp.type ?? "inap",
    });

    const stillAvailable = availableUnits.some((u) => u.id === unit.id);

    if (!stillAvailable) {
      const params = new URLSearchParams();
      params.set("checkin", sp.checkin!);
      params.set("checkout", sp.checkout!);
      if (sp.adult) params.set("adult", sp.adult);
      if (sp.type) params.set("type", sp.type);

      redirect(`/guesthouse/${slug}?${params.toString()}`);
    }
  }

  const [images, facilities, addons] = await Promise.all([
    getUnitImagesByUnitId(unit.id),
    getUnitFacilities(unit.id),
    getPropertyAddons(property.id),
  ]);

  const pricePerNight = Number(unit.base_price_per_night ?? 0);

  return (
    <PageShell>
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <PageHeader eyebrow={property.name} title={unit.name} />
      </div>

      <section className="max-w-5xl mx-auto px-6 pt-4">
        <PropertyGallery images={images} alt={unit.name} />
      </section>

      <section className="max-w-5xl mx-auto px-6 pt-10">

        {unit.descriptions && (
          <p className="text-base leading-relaxed max-w-2xl mb-4 mt-3 text-ink">
            {unit.descriptions}
          </p>
        )}

        {facilities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {facilities.map((facility) => (
              <Badge key={facility.id} size="sm">
                {facility.name}
              </Badge>
            ))}
          </div>
        )}
      </section>

      <section className="max-w-5xl mx-auto px-6 py-10">
        <Card variant="elevated" className="flex items-center justify-between">
          <div>
            <p className="text-sm mb-1 text-taupe">Harga per malam</p>
            <p className="text-3xl font-semibold text-forest">
              Rp {pricePerNight.toLocaleString("id-ID")}
            </p>
          </div>
        </Card>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16">
        {hasDateRange ? (
          <BookingForm
            unitId={unit.id}
            unitName={unit.name}
            pricePerNight={pricePerNight}
            pricePerHour={unit.price_per_hour}
            isTransitEnabled={unit.is_transit_enabled}
            addons={addons}
            isLoggedIn={false}
            checkIn={sp.checkin!}
            checkOut={sp.checkout!}
            bookingType={sp.type ?? "inap"}
          />
        ) : (
          <div>
            <p className="text-sm mb-3 text-taupe">
              Pilih tanggal untuk melanjutkan booking kamar ini.
            </p>
            <PickRange />
          </div>
        )}
      </section>
    </PageShell>
  );
}