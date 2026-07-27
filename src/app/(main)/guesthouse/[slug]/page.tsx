// route: host.com/guesthouse/[slug]/page.tsx

import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/core/button";
import { BackButton } from "@/components/ui/navigation/BackButton";
import { getUnitsByPropertyId } from "@/services/unit";
import { getPropertyBySlug } from "@/services/property";
import { getPropertyImagesByPropertyId } from "@/services/images";
import { getPropertyFacilities } from "@/services/facility";
import PropertyGallery from "@/components/landing/PropertyGallery";

export default async function PropertiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property) return notFound();

  const [units, images, facilities] = await Promise.all([
    getUnitsByPropertyId(property.id),
    getPropertyImagesByPropertyId(property.id),
    getPropertyFacilities(property.id),
  ]);


  return (
    <div className="min-h-screen" style={{ backgroundColor: "#EDE6D6" }}>
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <BackButton />
      </div>

      {/* Hero gallery, dynamic */}
      <section className="max-w-5xl mx-auto px-6 pt-4">
        <PropertyGallery images={images} alt={property.name} />
      </section>

      {/* Property info */}
      <section className="max-w-5xl mx-auto px-6 pt-10">
        <h1
          className="text-4xl md:text-5xl mb-3 font-semibold"
          style={{ color: "#1F3B36" }}
        >
          {property.name}
        </h1>
        {property.address && (
          <p className="text-sm mb-4" style={{ color: "#6B5D4F" }}>
            {property.address}
          </p>
        )}
        {property.description && (
          <p
            className="text-base leading-relaxed max-w-2xl"
            style={{ color: "#2C2420" }}
          >
            {property.description}
          </p>
        )}
        {facilities.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
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

      {/* Units list */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2
          className="text-2xl md:text-3xl mb-6 font-semibold"
          style={{ color: "#1F3B36" }}
        >
          Pilihan Kamar
        </h2>

        {units.length === 0 ? (
          <p style={{ color: "#6B5D4F" }}>Belum ada kamar tersedia.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {units.map((unit) => (
              <div
                key={unit.id}
                className="flex flex-col sm:flex-row rounded-xl overflow-hidden"
                style={{
                  backgroundColor: "#FBF9F4",
                  boxShadow: "0 2px 12px rgba(31,59,54,0.08)",
                }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-1 p-5 gap-4">
                  <div>
                    <h3
                      className="text-lg mb-1 font-semibold"
                      style={{ color: "#1F3B36" }}
                    >
                      {unit.name}
                    </h3>
                  </div>

                  <div className="flex flex-col items-start sm:items-end gap-2">
                    <p
                      className="text-xl font-semibold"
                      style={{ color: "#1F3B36" }}
                    >
                      {unit.base_price_per_night ?? "-"}
                    </p>
                    <Link href={`/guesthouse/${property.slug}/${unit.slug}`}>
                      <Button
                        className="rounded-lg px-5 py-2 text-sm"
                        style={{ backgroundColor: "#B5654A" }}
                      >
                        Pesan Kamar
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}