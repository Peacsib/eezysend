import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    qualities: [100, 75],
  },
};

export default nextConfig;
