import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/ui/layout/PageHeader";
import { Card } from "@/components/ui/core/card";

import { getProperties } from "@/services/property";
import { getPropertyImagesByPropertyId } from "@/services/images";

export default async function FeaturedGuesthouses() {
  const properties = await getProperties();

  const propertiesWithImages = await Promise.all(
    properties.map(async (property) => {
      const images = await getPropertyImagesByPropertyId(property.id);

      return {
        ...property,
        image: images[0] ?? "/images/placeholder.jpg",
      };
    })
  );

  return (
    <section className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-10">
          <PageHeader title="Guest House" />
        </div>

        {propertiesWithImages.length === 0 ? (
          <Card variant="elevated" className="rounded-2xl p-10 text-center">
            <p className="text-taupe">Belum ada guest house yang tersedia.</p>
          </Card>
        ) : (
          <div className="grid gap-8 justify-center sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            {propertiesWithImages.map((property) => (
              <Link
                key={property.id}
                href={`/guesthouse/${property.slug}`}
                className="w-full max-w-sm overflow-hidden rounded-2xl transition-all duration-200 hover:-translate-y-1 hover:shadow-xl bg-surface"
              >
                <div className="relative aspect-video">
                  <Image
                    src={property.image}
                    alt={property.name}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, (max-width:1280px) 50vw, 33vw"
                  />
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-semibold text-forest">
                    {property.name}
                  </h2>

                  {property.description && (
                    <p className="mt-3 line-clamp-3 leading-relaxed text-taupe">
                      {property.description}
                    </p>
                  )}

                  {property.address && (
                    <p className="mt-4 text-sm text-taupe">
                      📍 {property.address}
                    </p>
                  )}

                  {property.contact_wa && (
                    <p className="mt-2 text-sm text-taupe">
                      📞 {property.contact_wa}
                    </p>
                  )}

                  <div className="mt-6">
                    <span className="inline-flex rounded-lg px-4 py-2 text-sm font-medium bg-terracotta text-white">
                      Lihat Detail
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}