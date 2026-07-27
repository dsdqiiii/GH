import Navbar from '@/components/landing/Navbar';
import Hero from '@/components/landing/Hero';
import FeaturedGuesthouses from '@/components/landing/FeaturedGuestHouse';
import JoinSection from '@/components/landing/JoinSection';
import Footer from '@/components/landing/Footer';
import { getHeroImages } from '@/services/hero-images';

export default async function HomePage() {
  const heroImages = (await getHeroImages()).map(
    (image) => image.url
  );

  return (
    <div className="flex flex-col min-h-screen text-black">
      <Navbar transparent />
      <main className="flex-1">
        <Hero images={heroImages} />
        
        <JoinSection />
      </main>
      <Footer />
    </div>
  );
}
