<<<<<<< HEAD
import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import FeaturedGuesthouses from '@/components/landing/FeaturedGuestHouse';
import JoinSection from '@/components/landing/JoinSection';
import Footer from '@/components/landing/Footer';
import { getHeroImages } from '@/services/hero-images';
=======
import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import JoinSection from "@/components/landing/JoinSection";
import Footer from "@/components/landing/Footer";

import { getHeroImages } from "@/services/images";
>>>>>>> upstream/main

export default async function HomePage() {
  const heroImages = (await getHeroImages()).map(
    (image) => image.url
  );

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "#EDE6D6",
      }}
    >
      <Navbar transparent />

      <main className="flex-1">
<<<<<<< HEAD
        <Hero images={heroImages} />
        
        <JoinSection />
=======
        {/* Hero */}
        <section className="mb-20">
          <Hero images={heroImages} />
        </section>

        {/* Join */}
        <section
          className="max-w-7xl mx-auto px-6 pb-20"
        >
          <JoinSection />
        </section>
>>>>>>> upstream/main
      </main>

      <Footer />
    </div>
  );
}