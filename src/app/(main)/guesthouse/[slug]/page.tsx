// route: host.com/guesthouse/[slug]/page.tsx

import { notFound } from "next/navigation";

import { BackButton } from "@/components/ui/navigation/BackButton";
import { getUnitsByPropertyId } from "@/services/unit";
import { getPropertyBySlug } from "@/services/property";
import { getPropertyImagesByPropertyId } from "@/services/images";
import { getPropertyFacilities } from "@/services/facility";

import PropertyGallery from "@/components/landing/PropertyGallery";
import PickRange from "@/components/booking/PickRange";
import UnitList from "@/components/booking/UnitList";

export default async function PropertiPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await params;

  const property = await getPropertyBySlug(slug);

  if (!property) {
    return notFound();
  }

  const [units, images, facilities] = await Promise.all([
    getUnitsByPropertyId(property.id),
    getPropertyImagesByPropertyId(property.id),
    getPropertyFacilities(property.id),
  ]);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "#EDE6D6",
      }}
    >
      {/* Header */}
      <section className="max-w-7xl mx-auto px-6 pt-6">
        <div className="flex items-center gap-5">
          <BackButton />

          <h1
            className="text-4xl lg:text-5xl font-semibold"
            style={{
              color: "#1F3B36",
            }}
          >
            {property.name}
          </h1>
        </div>
      </section>

      {/* Gallery */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <PropertyGallery images={images} alt={property.name} />
      </section>

      {/* Sticky Search */}
      <header
        className="sticky top-0 z-40 mt-8 border-y backdrop-blur"
        style={{
          background: "rgba(237,230,214,.94)",
          borderColor: "#DDD2C2",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <PickRange />
        </div>
      </header>

      {/* About */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12">
          {/* Description */}
          <div>
            {property.description && (
              <>
                <h2
                  className="text-2xl font-semibold mb-4"
                  style={{
                    color: "#1F3B36",
                  }}
                >
                  Tentang Properti
                </h2>

                <p
                  className="leading-8"
                  style={{
                    color: "#2C2420",
                  }}
                >
                  {property.description}
                </p>
              </>
            )}

            {property.address && (
              <p
                className="mt-5"
                style={{
                  color: "#6B5D4F",
                }}
              >
                📍 {property.address}
              </p>
            )}

            {facilities.length > 0 && (
              <>
                <h2
                  className="text-2xl font-semibold mt-10 mb-4"
                  style={{
                    color: "#1F3B36",
                  }}
                >
                  Fasilitas
                </h2>

                <div className="flex flex-wrap gap-3">
                  {facilities.map((facility) => (
                    <span
                      key={facility.id}
                      className="rounded-full border px-4 py-2 text-sm"
                      style={{
                        borderColor: "#CFC2B2",
                        backgroundColor: "#FBF9F4",
                        color: "#1F3B36",
                      }}
                    >
                      {facility.name}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Summary */}
          <aside
            className="rounded-2xl p-6 h-fit"
            style={{
              backgroundColor: "#FBF9F4",
              boxShadow: "0 4px 20px rgba(31,59,54,.08)",
            }}
          >
            <p
              className="text-sm"
              style={{
                color: "#6B5D4F",
              }}
            >
              Total kamar
            </p>

            <p
              className="mt-1 text-3xl font-semibold"
              style={{
                color: "#1F3B36",
              }}
            >
              {units.length}
            </p>

            <p
              className="mt-6 text-sm"
              style={{
                color: "#6B5D4F",
              }}
            >
              Pilih tanggal menginap untuk melihat kamar yang tersedia.
            </p>
          </aside>
        </div>
      </section>

      {/* Units */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <h2
          className="text-3xl font-semibold mb-8"
          style={{
            color: "#1F3B36",
          }}
        >
          Pilihan Kamar
        </h2>

        <UnitList propertySlug={property.slug} units={units} />
      </section>
    </div>
  );
}