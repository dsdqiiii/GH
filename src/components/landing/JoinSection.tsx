import Link from "next/link";

export default function JoinSection() {
  return (
    <section
      className="py-20"
      style={{
        backgroundColor: "#FBF9F4",
      }}
    >
      <div
        className="
          max-w-4xl
          mx-auto
          px-6
          text-center
        "
      >

        <h2
          className="
            text-3xl
            md:text-4xl
            font-semibold
          "
          style={{
            color:"#1F3B36",
          }}
        >
          Dapatkan Pengalaman Menginap Terbaik
        </h2>


        <p
          className="
            mt-4
            text-base
            leading-relaxed
            max-w-2xl
            mx-auto
          "
          style={{
            color:"#6B5D4F",
          }}
        >
          Guest House Andalusia bukan sekadar tempat
          menginap, tetapi ruang nyaman untuk beristirahat
          dan menikmati perjalanan Anda.
        </p>


        <div className="mt-8">

          <Link
            href="/guesthouse"
            className="
              inline-flex
              items-center
              rounded-lg
              px-8
              py-3
              text-sm
              font-medium
              transition-all
              hover:opacity-90
            "
            style={{
              backgroundColor:"#B5654A",
              color:"#FFFFFF",
            }}
          >
            Lihat Guest House
          </Link>

        </div>

      </div>
    </section>
  );
}