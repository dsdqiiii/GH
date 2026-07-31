<<<<<<< HEAD
export default function JoinSection() {
  return (
    <section className="bg-white text-black py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Dapatkan Guesthouse mu hari ini</h2>
        <p className="mb-8">Guest House Andalusia bukan sekadar tempat menginap biasa.</p>
        <a href="/login" className="px-8 py-3 bg-blue-300 text-black font-semibold rounded hover:bg-gray-100">Pesan Sekarang</a>
      </div>
    </section>
  );
}
=======
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
>>>>>>> upstream/main
