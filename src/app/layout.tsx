import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * VIEWPORT (SEO + mobile performance)
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a",
};

/**
 * BASE SEO METADATA
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://darunnajah.com"),

  title: {
    default: "Penginapan Darunnajah",
    template: "%s | Penginapan Darunnajah",
  },

  description:
    "Sistem booking guest house modern, cepat, dan aman. Cari, pesan, dan kelola penginapan dengan mudah.",

  keywords: [
    "guest house",
    "booking hotel",
    "penginapan",
    "sewa kamar",
    "reservasi hotel",
    "akomodasi",
  ],

  authors: [{ name: "Darunnajah" }],

  creator: "Darunnajah",

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    siteName: "Penginapan Darunnajah",
    title: "Penginapan Darunnajah",
    description:
      "Booking penginapan modern, cepat, dan aman dengan sistem real-time.",
    url: "https://darunnajah.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Penginapan Darunnajah",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Penginapan Darunnajah",
    description:
      "Booking guest house modern, cepat, dan aman dengan sistem real-time.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-slate-900">
        {children}
      </body>
    </html>
  );
}