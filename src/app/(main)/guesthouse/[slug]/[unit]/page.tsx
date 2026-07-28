import { notFound } from "next/navigation";

import { Button } from "@/components/ui/core/button";
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

import PropertyGallery from "@/components/landing/PropertyGallery";
import BookingForm from "@/components/booking/BookingForm";

export default async function UnitPage({
  params,
}: {
  params: Promise<{ slug: string; unit: string }>;
}) {
  const { slug, unit: unitSlug } = await params;

  const [property, unit] = await Promise.all([
    getPropertyBySlug(slug),
    getUnitBySlug(unitSlug),
  ]);

  if (!property || !unit) {
    return notFound();
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
        <BackButton />
      </div>

      <section className="max-w-5xl mx-auto px-6 pt-4">
        <PropertyGallery images={images} alt={unit.name} />
      </section>

      <section className="max-w-5xl mx-auto px-6 pt-10">
        <PageHeader
          eyebrow={property.name}
          title={unit.name}
          size="lg"
        />

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

      <section className="max-w-5xl mx-auto px-6 py-16">
        <Card
          variant="elevated"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm mb-1 text-taupe">Harga per malam</p>
            <p className="text-3xl font-semibold text-forest">
              Rp {pricePerNight.toLocaleString("id-ID")}
            </p>
          </div>

          <Button variant="brand" className="w-full sm:w-auto">
            Pesan Sekarang
          </Button>
        </Card>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-16 text-black">
        <BookingForm
          unitId={unit.id}
          unitName={unit.name}
          pricePerNight={pricePerNight}
          pricePerHour={null}
          isTransitEnabled={false}
          addons={addons}
          isLoggedIn={false}
        />
      </section>
    </PageShell>
  );
}