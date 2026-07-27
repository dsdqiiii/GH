import { getProperties } from "@/services/property";
import { getPropertyImagesByPropertyId } from "@/services/images";
import { BackButton } from "../ui/navigation/BackButton";

export default async function FeaturedGuesthouses() {
  const gh = await getProperties();
  if (!gh) return null;

  const ghWithImages = await Promise.all(
    gh.map(async (property) => {
      const images = await getPropertyImagesByPropertyId(property.id);
      return {
        ...property,
        imageUrl: images[0] ?? "/images/placeholder.jpg",
      };
    })
  );

  return (
    <section className="py-16 container mx-auto px-4">
      <BackButton/>
      <h2 className="text-3xl font-semibold mb-8 text-center">
        Featured Guesthouses
      </h2>
      <div className="grid md:grid-cols-2 gap-8">
        {ghWithImages.map((property) => (
          <a
            key={property.id}
            href={`/guesthouse/${property.slug}`}
            className="block border rounded-lg overflow-hidden shadow hover:shadow-lg transition-shadow"
          >
            <img
              src={property.imageUrl}
              alt={property.name}
              className="w-full h-90 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-bold">{property.name}</h3>
              <p className="mt-2 text-gray-600">{property.address}</p>
              <p className="mt-2 text-gray-600">{property.contact_wa}</p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}