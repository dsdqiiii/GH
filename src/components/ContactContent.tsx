export default function ContactContent() {
  return (
    <section className="min-h-screen bg-gray-50 py-16 px-4 text-black">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        
        {/* Header */}
        <h1 className="text-4xl font-bold text-center mb-6 text-gray-800">
          Hubungi kami
        </h1>
        <p className="text-center text-gray-600 mb-12">
          Punya pertanyaan atau butuh bantuan? Hubungi kami dan kami akan segera menghubungi Anda kembali.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">Temukan kami</h2>

            <div>
              <p className="font-medium text-gray-700">📍 Alamat:</p>
              <p className="text-gray-600">Jl. Ulujami Raya No. 86, Ulujami, Pesanggrahan, Jakarta Selatan 12250</p>
            </div>

            <div>
              <p className="font-medium text-gray-700">📞 Handphone:</p>
              <p className="text-gray-600">+6221-73883665</p>
            </div>

            <div>
              <p className="font-medium text-gray-700">📧 Website:</p>
              <p className="text-gray-600">darunnajah.com</p>
            </div>

            <div>
              <p className="font-medium text-gray-700">⏰ Business Hours:</p>
              <p className="text-gray-600">Mon - Sun: 09:00 - 17:00</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Hubungi kami</h2>

            <form className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Nama</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 focus:outline-blue-500"
                  placeholder="Masukan nama anda"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Alamat Eamil</label>
                <input
                  type="email"
                  className="w-full border rounded px-3 py-2 focus:outline-blue-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Pesan</label>
                <textarea
                  className="w-full border rounded px-3 py-2 h-28 focus:outline-blue-500"
                  placeholder="Tulis pesan mu..."
                />
              </div>

              <button
                type="button"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Kirim Pesan
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
