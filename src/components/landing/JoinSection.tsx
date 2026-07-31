import { Button } from "@/components/ui/core/button";

export default function JoinSection() {
  return (
    <section className="py-20 bg-surface">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-forest">
          Dapatkan Pengalaman Menginap Terbaik
        </h2>

        <p className="mt-4 text-base leading-relaxed max-w-2xl mx-auto text-taupe">
          Guest House Andalusia bukan sekadar tempat menginap, tetapi ruang
          nyaman untuk beristirahat dan menikmati perjalanan Anda.
        </p>

        <div className="mt-8">
          <Button href="/guesthouse" variant="brand">
            Lihat Guest House
          </Button>
        </div>
      </div>
    </section>
  );
}