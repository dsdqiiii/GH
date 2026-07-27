import Image from "next/image";
import Link from "next/link";

import { BackButton } from "@/components/ui/navigation/BackButton";

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
    <section
      className="min-h-screen py-10"
      style={{
        backgroundColor: "#EDE6D6",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <BackButton />

          <h1
            className="text-4xl font-semibold"
            style={{
              color: "#1F3B36",
            }}
          >
            Guest House
          </h1>
        </div>


        {propertiesWithImages.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center"
            style={{
              backgroundColor: "#FBF9F4",
            }}
          >
            <p
              style={{
                color: "#6B5D4F",
              }}
            >
              Belum ada guest house yang tersedia.
            </p>
          </div>
        ) : (

          /*
            justify-center:
            membuat row card selalu berada di tengah.

            max-w-sm:
            menjaga ukuran card agar tidak terlalu melebar.

            auto-cols:
            membuat jumlah card fleksibel.
          */
          <div
            className="
              grid 
              gap-8
              justify-center
              sm:grid-cols-1
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {propertiesWithImages.map((property) => (
              <Link
                key={property.id}
                href={`/guesthouse/${property.slug}`}
                className="
                  w-full
                  max-w-sm
                  overflow-hidden
                  rounded-2xl
                  transition-all
                  duration-200
                  hover:-translate-y-1
                  hover:shadow-xl
                "
                style={{
                  backgroundColor: "#FBF9F4",
                }}
              >

                {/* Image */}
                <div className="relative aspect-video">
                  <Image
                    src={property.image}
                    alt={property.name}
                    fill
                    className="object-cover"
                    sizes="
                      (max-width:768px) 100vw,
                      (max-width:1280px) 50vw,
                      33vw
                    "
                  />
                </div>


                {/* Content */}
                <div className="p-6">

                  <h2
                    className="text-2xl font-semibold"
                    style={{
                      color: "#1F3B36",
                    }}
                  >
                    {property.name}
                  </h2>


                  {property.description && (
                    <p
                      className="mt-3 line-clamp-3 leading-relaxed"
                      style={{
                        color: "#6B5D4F",
                      }}
                    >
                      {property.description}
                    </p>
                  )}


                  {property.address && (
                    <p
                      className="mt-4 text-sm"
                      style={{
                        color: "#6B5D4F",
                      }}
                    >
                      📍 {property.address}
                    </p>
                  )}


                  {property.contact_wa && (
                    <p
                      className="mt-2 text-sm"
                      style={{
                        color: "#6B5D4F",
                      }}
                    >
                      📞 {property.contact_wa}
                    </p>
                  )}


                  <div className="mt-6">
                    <span
                      className="
                        inline-flex
                        rounded-lg
                        px-4
                        py-2
                        text-sm
                        font-medium
                      "
                      style={{
                        backgroundColor: "#B5654A",
                        color: "#FFFFFF",
                      }}
                    >
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