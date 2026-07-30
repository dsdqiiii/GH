import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import JoinSection from "@/components/landing/JoinSection";
import Footer from "@/components/landing/Footer";

import { getHeroImages } from "@/services/images";
import { getProperties } from "@/services/property"; // 1. Import service properti

export default async function HomePage() {
  const [heroImagesData, propertiesData] = await Promise.all([
    getHeroImages(),
    getProperties(), // 2. Fetch list guesthouse
  ]);

  const heroImages = heroImagesData.map((image) => image.url);

  // 3. Mapping data properti simpel
  const propertyOptions = propertiesData.map((prop) => ({
    id: prop.id,
    slug: prop.slug,
    name: prop.name,
  }));

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#EDE6D6",
      }}
    >
      <Navbar transparent />

      <main className="flex-1">
        {/* Hero */}
        <section className="mb-20">
          <Hero images={heroImages} />
        </section>

        {/* Join */}
        <section className="max-w-7xl mx-auto px-6 pb-20">
          <JoinSection properties={propertyOptions} />
        </section>
      </main>

      <Footer />
    </div>
  );
}