import PickRange from "@/components/booking/PickRange";

interface PropertyOption {
  id: string;
  slug: string;
  name: string;
}

export default function JoinSection({
  properties = [],
}: {
  properties?: PropertyOption[];
}) {
  return (
    <section className="py-12 bg-surface rounded-2xl border border-sand/60 px-6 sm:px-10">
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-semibold text-forest">
          Dapatkan Pengalaman Menginap Terbaik
        </h2>
        <p className="text-base leading-relaxed max-w-2xl mx-auto text-taupe">
          Guest House Andalusia bukan sekadar tempat menginap, tetapi ruang
          nyaman untuk beristirahat dan menikmati perjalanan Anda.
        </p>
      </div>

      {/* Form PickRange menggantikan Button biasa */}
      <div className="max-w-xl mx-auto">
        <PickRange mode="global" properties={properties} />
      </div>
    </section>
  );
}