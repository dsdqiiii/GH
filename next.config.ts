import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zlkezypthaahtwnluabf.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "zlkezypthaahtwnluabf.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
    ],
    // Solusi untuk mengabaikan proteksi SSRF terhadap IP privat (opsional jika error masih muncul)
    dangerouslyAllowSVG: true,
  },
  // Opsi Tambahan jika masih melempar error "resolved to private ip":
  // Ekstensi ini memaksa Node.js/Next.js mengutamakan IPv4 daripada IPv6 saat fetch image
  experimental: {
    // dnsOrder: 'ipv4first', // Aktifkan jika versi Next.js kamu sudah mendukung
  }
};

export default nextConfig;