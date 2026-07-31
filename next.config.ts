import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zlkezypthaahtwnluabf.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
<<<<<<< HEAD
=======
      {
        protocol: "https",
        hostname: "zlkezypthaahtwnluabf.supabase.co",
        pathname: "/storage/v1/object/sign/**",
      },
>>>>>>> upstream/main
    ],
  },
};

export default nextConfig;