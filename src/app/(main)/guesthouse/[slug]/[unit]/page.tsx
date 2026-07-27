import { notFound } from "next/navigation";

import { Button } from "@/components/ui/core/button";
import { BackButton } from "@/components/ui/navigation/BackButton";

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
  params: Promise<{
    slug: string;
    unit: string;
  }>;
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
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#EDE6D6",
      }}
    >
      {/* Back */}
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <BackButton />
      </div>

      {/* Gallery */}
      <section className="max-w-5xl mx-auto px-6 pt-4">
        <PropertyGallery
          images={images}
          alt={unit.name}
        />
      </section>


      {/* Unit info */}
      <section className="max-w-5xl mx-auto px-6 pt-10">
        <p
          className="text-xs uppercase tracking-widest mb-2"
          style={{
            color: "#B5654A",
            letterSpacing: "0.12em",
          }}
        >
          {property.name}
        </p>

        <h1
          className="text-4xl md:text-5xl mb-3 font-semibold"
          style={{
            color: "#1F3B36",
          }}
        >
          {unit.name}
        </h1>


        {unit.descriptions && (
          <p
            className="text-base leading-relaxed max-w-2xl mb-4"
            style={{
              color: "#2C2420",
            }}
          >
            {unit.descriptions}
          </p>
        )}


        {facilities.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {facilities.map((facility) => (
              <span
                key={facility.id}
                className="rounded-full border px-3 py-1 text-sm"
                style={{
                  borderColor: "#CFC2B2",
                  color: "#1F3B36",
                  backgroundColor: "#F8F4EC",
                }}
              >
                {facility.name}
              </span>
            ))}
          </div>
        )}
      </section>


      {/* Price CTA */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl p-6 gap-4"
          style={{
            backgroundColor: "#FBF9F4",
            boxShadow:
              "0 2px 12px rgba(31,59,54,0.08)",
          }}
        >
          <div>
            <p
              className="text-sm mb-1"
              style={{
                color: "#6B5D4F",
              }}
            >
              Harga per malam
            </p>

            <p
              className="text-3xl font-semibold"
              style={{
                color: "#1F3B36",
              }}
            >
              Rp {pricePerNight.toLocaleString("id-ID")}
            </p>
          </div>


          <Button
            className="rounded-lg px-8 py-3 text-sm w-full sm:w-auto"
            style={{
              backgroundColor: "#B5654A",
            }}
          >
            Pesan Sekarang
          </Button>
        </div>
      </section>


      {/* Booking Form */}
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

    </div>
  );
}