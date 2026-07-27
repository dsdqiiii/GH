// components/AboutContent.tsx
export default function AboutContent() {
    return (
        <section className="min-h-screen bg-gray-50 py-16 px-2 text-black">
        <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
            <h1 className="text-4xl font-bold text-gray-800">About - Andalusia Darunnajah</h1>

            <p className="text-gray-700 leading-relaxed">
                Guest House Andalusia Pesantren Darunnajah Jakarta menawarkan pengalaman menginap 
                yang unik dengan memadukan kenyamanan modern dan nilai-nilai islami. Sebagai bagian 
                dari salah satu pesantren terkemuka di Jakarta, penginapan ini tidak hanya 
                menyediakan tempat beristirahat, tetapi juga atmosfer spiritual yang menenangkan 
                jiwa.
            </p>

            <p className="text-gray-700 leading-relaxed">
                Dengan lokasi strategis, fasilitas lengkap, tarif terjangkau, dan lingkungan 
                yang islami, Guest House Andalusia menjadi pilihan ideal bagi siapa saja 
                yang mencari penginapan berkualitas di Jakarta Selatan. Lebih dari sekadar 
                tempat menginap, ini adalah kesempatan untuk merasakan kedamaian dan keberkahan 
                di tengah hiruk pikuk ibu kota.
            </p>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Visi Kami</h2>
                <p className="text-gray-700 leading-relaxed">
                    Menjadi hunian singgah terbaik yang mengutamakan kenyamanan, keramahan, serta kebermanfaatan bagi masyarakat yang membutuhkan fasilitas akomodasi berkualitas.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Misi Kami</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Menyediakan fasilitas penginapan yang bersih, nyaman, dan terjaga.</li>
                    <li>Membangun lingkungan yang aman dan ramah bagi tamu.</li>
                    <li>Mendukung program sosial yayasan dengan menyediakan layanan berbasis kemasyarakatan.</li>
                    <li>Memberikan pengalaman menginap yang menyenangkan melalui pelayanan profesional dan penuh empati.</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Fasilitas Guest House</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Kamar bersih dan ber-AC</li>
                    <li>Kamar mandi dalam</li>
                    <li>Akses Wi-Fi gratis</li>
                    <li>Ruang tamu bersama</li>
                    <li>Area parkir aman</li>
                    <li>Pelayanan ramah dan responsif</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Mengapa Memilih Kami?</h2>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Lingkungan tenang dan nyaman</li>
                    <li>Harga terjangkau</li>
                    <li>Lokasi strategis</li>
                    <li>Dikelola yayasan dengan profesionalitas dan kepedulian</li>
                    <li>Cocok untuk tamu umum, keluarga, peserta kegiatan, maupun tamu internal yayasan</li>
                </ul>
            </section>

             <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-800">Ideal untuk Berbagai Keperluan</h2>
                <h3>Guest House Andalusia cocok untuk berbagai jenis tamu:</h3>
                <h4><strong>Orang Tua Santri:</strong></h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Tempat menginap nyaman saat mengunjungi putra/putri di pesantren</li>
                    <li>Suasana islami yang mendukung</li>
                </ul>
                <h4><strong>Wisatawan Muslim:</strong></h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Penginapan syariah di Jakarta</li>
                    <li>Lingkungan yang tenang dan spiritual</li>
                </ul>
                <h4><strong>Business Traveler:</strong></h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Lokasi strategis untuk aktivitas bisnis</li>
                    <li>Tarif terjangkau untuk perjalanan dinas</li>
                </ul>
                <h4><strong>Backpacker:</strong></h4>
                <ul className="list-disc pl-6 text-gray-700 space-y-1">
                    <li>Harga ekonomis</li>
                    <li>Fasilitas lengkap</li>
                </ul>
            </section>
        </div>
        </section>
    );
}